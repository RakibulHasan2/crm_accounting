import mongoose, { Document, Schema } from 'mongoose';
import Decimal from 'decimal.js';

export enum AccountType {
  ASSET = 'asset',
  LIABILITY = 'liability',
  EQUITY = 'equity',
  INCOME = 'income',
  EXPENSE = 'expense'
}

export enum AccountSubType {
  // Assets
  CURRENT_ASSET = 'current_asset',
  FIXED_ASSET = 'fixed_asset',
  OTHER_ASSET = 'other_asset',
  
  // Liabilities
  CURRENT_LIABILITY = 'current_liability',
  LONG_TERM_LIABILITY = 'long_term_liability',
  OTHER_LIABILITY = 'other_liability',
  
  // Equity
  OWNER_EQUITY = 'owner_equity',
  RETAINED_EARNINGS = 'retained_earnings',
  
  // Income
  REVENUE = 'revenue',
  OTHER_INCOME = 'other_income',
  
  // Expenses
  COST_OF_GOODS_SOLD = 'cost_of_goods_sold',
  OPERATING_EXPENSE = 'operating_expense',
  OTHER_EXPENSE = 'other_expense'
}

export interface IChartOfAccounts extends Document {
  _id: string;
  code: string;
  name: string;
  type: AccountType;
  subType: AccountSubType;
  parentId?: string;
  level: number;
  isActive: boolean;
  description?: string;
  balance: string; // Using string to store Decimal values
  openingBalance: string;
  currency: string;
  taxInfo?: {
    isTaxable: boolean;
    taxRate?: number;
    taxCode?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}

const chartOfAccountsSchema = new Schema<IChartOfAccounts>({
  code: {
    type: String,
    required: [true, 'Account code is required'],
    unique: true,
    trim: true,
    maxlength: [20, 'Account code cannot exceed 20 characters']
  },
  name: {
    type: String,
    required: [true, 'Account name is required'],
    trim: true,
    maxlength: [200, 'Account name cannot exceed 200 characters']
  },
  type: {
    type: String,
    enum: Object.values(AccountType),
    required: [true, 'Account type is required']
  },
  subType: {
    type: String,
    enum: Object.values(AccountSubType),
    required: [true, 'Account sub-type is required']
  },
  parentId: {
    type: String,
    ref: 'ChartOfAccounts'
  },
  level: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
    default: 0
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  balance: {
    type: String,
    required: true,
    default: '0.00'
  },
  openingBalance: {
    type: String,
    required: true,
    default: '0.00'
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
    maxlength: 3
  },
  taxInfo: {
    isTaxable: { type: Boolean, default: false },
    taxRate: { type: Number, min: 0, max: 1 },
    taxCode: { type: String, trim: true }
  },
  createdBy: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for decimal balance
chartOfAccountsSchema.virtual('balanceDecimal').get(function() {
  return new Decimal(this.balance);
});

// Virtual for decimal opening balance
chartOfAccountsSchema.virtual('openingBalanceDecimal').get(function() {
  return new Decimal(this.openingBalance);
});

// Virtual for full account path
chartOfAccountsSchema.virtual('fullPath').get(function() {
  return `${this.code} - ${this.name}`;
});

// Method to update balance
chartOfAccountsSchema.methods.updateBalance = function(amount: string | number) {
  const currentBalance = new Decimal(this.balance);
  const newBalance = currentBalance.plus(amount);
  this.balance = newBalance.toString();
  return this.save();
};

// Static method to get account hierarchy
chartOfAccountsSchema.statics.getHierarchy = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    { $sort: { code: 1 } },
    {
      $group: {
        _id: '$type',
        accounts: { $push: '$$ROOT' }
      }
    }
  ]);
};

// Indexes for better performance
chartOfAccountsSchema.index({ code: 1 });
chartOfAccountsSchema.index({ type: 1, subType: 1 });
chartOfAccountsSchema.index({ parentId: 1 });
chartOfAccountsSchema.index({ isActive: 1 });

const ChartOfAccounts = (mongoose.models && mongoose.models.ChartOfAccounts) || 
  mongoose.model<IChartOfAccounts>('ChartOfAccounts', chartOfAccountsSchema);

export default ChartOfAccounts;