import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  jobTitle: string;
  applicantName: string;
  email: string;
  coverLetter: string;
  status: string;
  appliedDate: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    jobTitle: { type: String, required: [true, 'Job title is required'], trim: true },
    applicantName: { type: String, required: [true, 'Applicant name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], trim: true, match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] },
    coverLetter: { type: String, required: [true, 'Cover letter is required'] },
    status: { type: String, required: true, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    appliedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);
