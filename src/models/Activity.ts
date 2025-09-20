import mongoose, { Document, Schema } from 'mongoose';

export enum ActivityType {
  CALL = 'call',
  EMAIL = 'email',
  MEETING = 'meeting',
  TASK = 'task',
  NOTE = 'note',
  DEMO = 'demo',
  PROPOSAL = 'proposal'
}

export enum ActivityStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  OVERDUE = 'overdue'
}

export enum ActivityPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface IActivity extends Document {
  _id: string;
  type: ActivityType;
  status: ActivityStatus;
  priority: ActivityPriority;
  subject: string;
  description?: string;
  dueDate?: Date;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // minutes
  location?: string;
  assignedTo: string;
  createdBy: string;
  linkedTo: {
    type: 'contact' | 'company' | 'opportunity' | 'invoice';
    id: string;
  }[];
  participants?: string[]; // User IDs
  reminderTime?: Date;
  isReminderSent: boolean;
  outcome?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  attachments?: string[];
  tags: string[];
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>({
  type: {
    type: String,
    enum: Object.values(ActivityType),
    required: [true, 'Activity type is required']
  },
  status: {
    type: String,
    enum: Object.values(ActivityStatus),
    required: true,
    default: ActivityStatus.PENDING
  },
  priority: {
    type: String,
    enum: Object.values(ActivityPriority),
    required: true,
    default: ActivityPriority.MEDIUM
  },
  subject: {
    type: String,
    required: [true, 'Activity subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  dueDate: {
    type: Date
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number,
    min: 0,
    max: 1440 // max 24 hours in minutes
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  assignedTo: {
    type: String,
    required: [true, 'Activity must be assigned to a user'],
    ref: 'User'
  },
  createdBy: {
    type: String,
    required: true,
    ref: 'User'
  },
  linkedTo: [{
    type: {
      type: String,
      enum: ['contact', 'company', 'opportunity', 'invoice'],
      required: true
    },
    id: {
      type: String,
      required: true
    }
  }],
  participants: [{
    type: String,
    ref: 'User'
  }],
  reminderTime: {
    type: Date
  },
  isReminderSent: {
    type: Boolean,
    default: false
  },
  outcome: {
    type: String,
    maxlength: [500, 'Outcome cannot exceed 500 characters']
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
  },
  attachments: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  completedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if activity is overdue
activitySchema.virtual('isOverdue').get(function() {
  if (this.status === ActivityStatus.COMPLETED || this.status === ActivityStatus.CANCELLED) {
    return false;
  }
  
  if (this.dueDate) {
    return new Date() > new Date(this.dueDate);
  }
  
  return false;
});

// Virtual for formatted duration
activitySchema.virtual('formattedDuration').get(function() {
  if (!this.duration) return null;
  
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
});

// Method to mark as completed
activitySchema.methods.markCompleted = function(outcome?: string, followUpRequired?: boolean, followUpDate?: Date) {
  this.status = ActivityStatus.COMPLETED;
  this.completedAt = new Date();
  
  if (outcome) {
    this.outcome = outcome;
  }
  
  if (followUpRequired !== undefined) {
    this.followUpRequired = followUpRequired;
  }
  
  if (followUpDate) {
    this.followUpDate = followUpDate;
  }
  
  return this.save();
};

// Method to reschedule activity
activitySchema.methods.reschedule = function(newDueDate: Date, reason?: string) {
  this.dueDate = newDueDate;
  
  if (reason) {
    this.description = (this.description || '') + `\n\nRescheduled: ${reason}`;
  }
  
  // Reset reminder
  this.isReminderSent = false;
  if (this.reminderTime) {
    const timeDiff = this.reminderTime.getTime() - (this.dueDate?.getTime() || 0);
    this.reminderTime = new Date(newDueDate.getTime() - timeDiff);
  }
  
  return this.save();
};

// Static method to get upcoming activities
activitySchema.statics.getUpcoming = function(userId: string, days: number = 7) {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);
  
  return this.find({
    assignedTo: userId,
    status: { $in: [ActivityStatus.PENDING, ActivityStatus.IN_PROGRESS] },
    dueDate: { $lte: endDate }
  }).sort({ dueDate: 1 });
};

// Static method to get overdue activities
activitySchema.statics.getOverdue = function(userId?: string) {
  const query: Record<string, unknown> = {
    status: { $in: [ActivityStatus.PENDING, ActivityStatus.IN_PROGRESS] },
    dueDate: { $lt: new Date() }
  };
  
  if (userId) {
    query.assignedTo = userId;
  }
  
  return this.find(query).sort({ dueDate: 1 });
};

// Pre-save middleware to update status based on due date
activitySchema.pre('save', function() {
  if (this.dueDate && this.status === ActivityStatus.PENDING && new Date() > this.dueDate) {
    this.status = ActivityStatus.OVERDUE;
  }
});

// Indexes for better performance
activitySchema.index({ assignedTo: 1, status: 1 });
activitySchema.index({ dueDate: 1, status: 1 });
activitySchema.index({ type: 1, status: 1 });
activitySchema.index({ 'linkedTo.type': 1, 'linkedTo.id': 1 });
activitySchema.index({ createdBy: 1 });

const Activity = (mongoose.models && mongoose.models.Activity) || 
  mongoose.model<IActivity>('Activity', activitySchema);

export default Activity;