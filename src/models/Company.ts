import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  _id: string;
  name: string;
  legalName?: string;
  registrationNumber?: string;
  vatNumber?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  financialSettings: {
    currency: string;
    financialYearStart: Date;
    financialYearEnd: Date;
    vatRate: number;
    defaultPaymentTerms: number; // days
  };
  logo?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}

const companySchema = new Schema<ICompany>({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [200, 'Company name cannot exceed 200 characters']
  },
  legalName: {
    type: String,
    trim: true,
    maxlength: [200, 'Legal name cannot exceed 200 characters']
  },
  registrationNumber: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  vatNumber: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  address: {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: 'USA' }
  },
  contact: {
    phone: { type: String, trim: true },
    email: { 
      type: String, 
      trim: true, 
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    website: { type: String, trim: true }
  },
  financialSettings: {
    currency: { type: String, required: true, default: 'USD', maxlength: 3 },
    financialYearStart: { type: Date, required: true },
    financialYearEnd: { type: Date, required: true },
    vatRate: { type: Number, required: true, min: 0, max: 1, default: 0.15 },
    defaultPaymentTerms: { type: Number, required: true, min: 0, default: 30 }
  },
  logo: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
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

// Indexes for better performance
companySchema.index({ name: 1 });
companySchema.index({ status: 1 });

const Company = (mongoose.models && mongoose.models.Company) || mongoose.model<ICompany>('Company', companySchema);

export default Company;