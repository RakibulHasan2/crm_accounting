import mongoose, { Document, Schema } from 'mongoose';

export enum OpportunityStage {
  PROSPECTING = 'prospecting',
  QUALIFICATION = 'qualification',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost'
}

export enum OpportunityPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface IOpportunity extends Document {
  _id: string;
  name: string;
  contactId: string;
  companyId?: string;
  stage: OpportunityStage;
  priority: OpportunityPriority;
  value: string; // Using string for Decimal precision
  currency: string;
  probability: number; // 0-100
  expectedCloseDate: Date;
  actualCloseDate?: Date;
  description?: string;
  source: string;
  assignedTo: string;
  tags: string[];
  customFields: { [key: string]: unknown };
  activities: string[]; // References to Activity documents
  notes?: string;
  lostReason?: string;
  competitorInfo?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}

const opportunitySchema = new Schema<IOpportunity>({
  name: {
    type: String,
    required: [true, 'Opportunity name is required'],
    trim: true,
    maxlength: [200, 'Opportunity name cannot exceed 200 characters']
  },
  contactId: {
    type: String,
    required: [true, 'Contact is required'],
    ref: 'Contact'
  },
  companyId: {
    type: String,
    ref: 'Company'
  },
  stage: {
    type: String,
    enum: Object.values(OpportunityStage),
    required: true,
    default: OpportunityStage.PROSPECTING
  },
  priority: {
    type: String,
    enum: Object.values(OpportunityPriority),
    required: true,
    default: OpportunityPriority.MEDIUM
  },
  value: {
    type: String,
    required: [true, 'Opportunity value is required'],
    default: '0.00'
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
    maxlength: 3
  },
  probability: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0
  },
  expectedCloseDate: {
    type: Date,
    required: [true, 'Expected close date is required']
  },
  actualCloseDate: {
    type: Date
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  source: {
    type: String,
    required: [true, 'Opportunity source is required'],
    trim: true
  },
  assignedTo: {
    type: String,
    required: [true, 'Opportunity must be assigned to a user'],
    ref: 'User'
  },
  tags: [{
    type: String,
    trim: true
  }],
  customFields: {
    type: Schema.Types.Mixed,
    default: {}
  },
  activities: [{
    type: String,
    ref: 'Activity'
  }],
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
  },
  lostReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Lost reason cannot exceed 500 characters']
  },
  competitorInfo: {
    type: String,
    trim: true,
    maxlength: [500, 'Competitor info cannot exceed 500 characters']
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

// Virtual for weighted value (value * probability)
opportunitySchema.virtual('weightedValue').get(function() {
  const value = parseFloat(this.value);
  return (value * this.probability / 100).toFixed(2);
});

// Virtual for days until close
opportunitySchema.virtual('daysUntilClose').get(function() {
  const today = new Date();
  const closeDate = new Date(this.expectedCloseDate);
  const diffTime = closeDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for is overdue
opportunitySchema.virtual('isOverdue').get(function() {
  if (this.stage === OpportunityStage.CLOSED_WON || this.stage === OpportunityStage.CLOSED_LOST) {
    return false;
  }
  return new Date() > new Date(this.expectedCloseDate);
});

// Method to move to next stage
opportunitySchema.methods.moveToStage = function(newStage: OpportunityStage, userId: string) {
  this.stage = newStage;
  this.updatedBy = userId;
  
  // Update probability based on stage
  const stageProbs = {
    [OpportunityStage.PROSPECTING]: 10,
    [OpportunityStage.QUALIFICATION]: 25,
    [OpportunityStage.PROPOSAL]: 50,
    [OpportunityStage.NEGOTIATION]: 75,
    [OpportunityStage.CLOSED_WON]: 100,
    [OpportunityStage.CLOSED_LOST]: 0
  };
  
  this.probability = stageProbs[newStage];
  
  // Set actual close date if closed
  if (newStage === OpportunityStage.CLOSED_WON || newStage === OpportunityStage.CLOSED_LOST) {
    this.actualCloseDate = new Date();
  }
  
  return this.save();
};

// Static method to get pipeline summary
opportunitySchema.statics.getPipelineSummary = function(assignedTo?: string) {
  const matchConditions: Record<string, unknown> = {
    stage: { $nin: [OpportunityStage.CLOSED_WON, OpportunityStage.CLOSED_LOST] }
  };
  
  if (assignedTo) {
    matchConditions.assignedTo = assignedTo;
  }
  
  return this.aggregate([
    { $match: matchConditions },
    {
      $group: {
        _id: '$stage',
        count: { $sum: 1 },
        totalValue: { $sum: { $toDouble: '$value' } },
        avgProbability: { $avg: '$probability' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Indexes for better performance
opportunitySchema.index({ assignedTo: 1, stage: 1 });
opportunitySchema.index({ contactId: 1 });
opportunitySchema.index({ expectedCloseDate: 1 });
opportunitySchema.index({ stage: 1, priority: 1 });

const Opportunity = (mongoose.models && mongoose.models.Opportunity) || 
  mongoose.model<IOpportunity>('Opportunity', opportunitySchema);

export default Opportunity;