import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  industry: string;
  location: string;
  description: string;
  website: string;
  email: string;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    industry: { type: String, required: [true, 'Industry is required'], trim: true },
    location: { type: String, required: [true, 'Location is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    website: { type: String, required: [true, 'Website is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], trim: true, match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] },
  },
  { timestamps: true }
);

export const Company = mongoose.model<ICompany>('Company', CompanySchema);
