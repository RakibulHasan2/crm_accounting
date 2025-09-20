import mongoose, { Document, Schema } from 'mongoose';
import Decimal from 'decimal.js';

export enum JournalEntryStatus {
  DRAFT = 'draft',
  POSTED = 'posted',
  REVERSED = 'reversed'
}

export interface IJournalEntryLine {
  accountId: string;
  accountCode: string;
  accountName: string;
  description?: string;
  debitAmount: string;
  creditAmount: string;
}

export interface IJournalEntry extends Document {
  _id: string;
  journalNumber: string;
  date: Date;
  reference?: string;
  narration: string;
  status: JournalEntryStatus;
  lines: IJournalEntryLine[];
  totalDebit: string;
  totalCredit: string;
  attachments?: string[];
  isRecurring?: boolean;
  recurringPattern?: {
    frequency: 'monthly' | 'quarterly' | 'yearly';
    nextDate?: Date;
    endDate?: Date;
  };
  reversalEntryId?: string;
  originalEntryId?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
  postedBy?: string;
  postedAt?: Date;
}

const journalEntryLineSchema = new Schema<IJournalEntryLine>({
  accountId: {
    type: String,
    required: true,
    ref: 'ChartOfAccounts'
  },
  accountCode: {
    type: String,
    required: true,
    trim: true
  },
  accountName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Line description cannot exceed 200 characters']
  },
  debitAmount: {
    type: String,
    required: true,
    default: '0.00'
  },
  creditAmount: {
    type: String,
    required: true,
    default: '0.00'
  }
}, { _id: false });

const journalEntrySchema = new Schema<IJournalEntry>({
  journalNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Journal entry date is required']
  },
  reference: {
    type: String,
    trim: true,
    maxlength: [100, 'Reference cannot exceed 100 characters']
  },
  narration: {
    type: String,
    required: [true, 'Narration is required'],
    trim: true,
    maxlength: [500, 'Narration cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: Object.values(JournalEntryStatus),
    required: true,
    default: JournalEntryStatus.DRAFT
  },
  lines: {
    type: [journalEntryLineSchema],
    required: true,
    validate: {
      validator: function(lines: IJournalEntryLine[]) {
        return lines.length >= 2;
      },
      message: 'Journal entry must have at least 2 lines'
    }
  },
  totalDebit: {
    type: String,
    required: true,
    default: '0.00'
  },
  totalCredit: {
    type: String,
    required: true,
    default: '0.00'
  },
  attachments: [{
    type: String,
    trim: true
  }],
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly']
    },
    nextDate: Date,
    endDate: Date
  },
  reversalEntryId: {
    type: String,
    ref: 'JournalEntry'
  },
  originalEntryId: {
    type: String,
    ref: 'JournalEntry'
  },
  createdBy: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String
  },
  postedBy: {
    type: String
  },
  postedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if entry is balanced
journalEntrySchema.virtual('isBalanced').get(function() {
  const totalDebit = new Decimal(this.totalDebit);
  const totalCredit = new Decimal(this.totalCredit);
  return totalDebit.equals(totalCredit);
});

// Pre-save middleware to calculate totals
journalEntrySchema.pre('save', function() {
  let totalDebit = new Decimal(0);
  let totalCredit = new Decimal(0);

  this.lines.forEach(line => {
    totalDebit = totalDebit.plus(line.debitAmount);
    totalCredit = totalCredit.plus(line.creditAmount);
  });

  this.totalDebit = totalDebit.toString();
  this.totalCredit = totalCredit.toString();

  // Validate balanced entry before saving
  if (!totalDebit.equals(totalCredit)) {
    throw new Error('Journal entry must be balanced (total debits must equal total credits)');
  }
});

// Method to post the journal entry
journalEntrySchema.methods.post = function(userId: string) {
  if (this.status !== JournalEntryStatus.DRAFT) {
    throw new Error('Only draft entries can be posted');
  }
  
  this.status = JournalEntryStatus.POSTED;
  this.postedBy = userId;
  this.postedAt = new Date();
  
  return this.save();
};

// Method to reverse the journal entry
journalEntrySchema.methods.reverse = function(userId: string, narration: string) {
  if (this.status !== JournalEntryStatus.POSTED) {
    throw new Error('Only posted entries can be reversed');
  }
  
  // Create reversal lines
  const reversalLines = this.lines.map((line: IJournalEntryLine) => ({
    ...line,
    debitAmount: line.creditAmount,
    creditAmount: line.debitAmount,
    description: `Reversal: ${line.description || ''}`
  }));
  
  const JournalEntryModel = this.constructor as mongoose.Model<IJournalEntry>;
  const reversalEntry = new JournalEntryModel({
    journalNumber: `REV-${this.journalNumber}`,
    date: new Date(),
    narration: `Reversal: ${narration}`,
    lines: reversalLines,
    originalEntryId: this._id,
    createdBy: userId,
    status: JournalEntryStatus.POSTED,
    postedBy: userId,
    postedAt: new Date()
  });
  
  // Update original entry
  this.status = JournalEntryStatus.REVERSED;
  this.reversalEntryId = reversalEntry._id;
  
  return Promise.all([this.save(), reversalEntry.save()]);
};

// Static method to generate next journal number
journalEntrySchema.statics.generateJournalNumber = async function() {
  const currentYear = new Date().getFullYear();
  const prefix = `JE${currentYear}`;
  
  const lastEntry = await this.findOne({
    journalNumber: { $regex: `^${prefix}` }
  }).sort({ journalNumber: -1 });
  
  let nextNumber = 1;
  if (lastEntry) {
    const lastNumber = parseInt(lastEntry.journalNumber.substring(prefix.length));
    nextNumber = lastNumber + 1;
  }
  
  return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
};

// Indexes for better performance
journalEntrySchema.index({ journalNumber: 1 });
journalEntrySchema.index({ date: -1 });
journalEntrySchema.index({ status: 1 });
journalEntrySchema.index({ 'lines.accountId': 1 });
journalEntrySchema.index({ createdBy: 1 });

const JournalEntry = (mongoose.models && mongoose.models.JournalEntry) || 
  mongoose.model<IJournalEntry>('JournalEntry', journalEntrySchema);

export default JournalEntry;