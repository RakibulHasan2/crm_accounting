import mongoose, { Document, Schema } from 'mongoose';

export enum ContactType {
  LEAD = 'lead',
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  EMPLOYEE = 'employee'
}

export enum ContactStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PROSPECT = 'prospect'
}

export interface IContact extends Document {
  _id: string;
  companyId?: string;
  type: ContactType;
  status: ContactStatus;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  notes?: string;
  tags: string[];
  customFields: { [key: string]: unknown };
  leadSource?: string;
  assignedTo?: string;
  lastContactDate?: Date;
  nextFollowUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}

const contactSchema = new Schema<IContact>({
  companyId: {
    type: String,
    ref: 'Company'
  },
  type: {
    type: String,
    enum: Object.values(ContactType),
    required: true,
    default: ContactType.LEAD
  },
  status: {
    type: String,
    enum: Object.values(ContactStatus),
    required: true,
    default: ContactStatus.PROSPECT
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  jobTitle: {
    type: String,
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  department: {
    type: String,
    trim: true,
    maxlength: [100, 'Department cannot exceed 100 characters']
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true }
  },
  socialMedia: {
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    facebook: { type: String, trim: true }
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  tags: [{
    type: String,
    trim: true
  }],
  customFields: {
    type: Schema.Types.Mixed,
    default: {}
  },
  leadSource: {
    type: String,
    trim: true
  },
  assignedTo: {
    type: String,
    ref: 'User'
  },
  lastContactDate: {
    type: Date
  },
  nextFollowUpDate: {
    type: Date
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

// Virtual for full name
contactSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for display name
contactSchema.virtual('displayName').get(function() {
  const fullName = `${this.firstName} ${this.lastName}`;
  return fullName + (this.jobTitle ? ` (${this.jobTitle})` : '');
});

// Indexes for better performance
contactSchema.index({ email: 1 });
contactSchema.index({ type: 1, status: 1 });
contactSchema.index({ assignedTo: 1 });
contactSchema.index({ companyId: 1 });
contactSchema.index({ firstName: 1, lastName: 1 });

const Contact = (mongoose.models && mongoose.models.Contact) || mongoose.model<IContact>('Contact', contactSchema);

export default Contact;