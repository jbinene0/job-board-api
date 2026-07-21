import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  experienceLevel: string;
  description: string;
  requirements: string;
  postedBy: string;
  datePosted: Date;
  isActive: boolean;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    company: { type: String, required: [true, 'Company is required'], trim: true },
    location: { type: String, required: [true, 'Location is required'], trim: true },
    salary: { type: String, required: [true, 'Salary is required'], trim: true },
    jobType: { type: String, required: [true, 'Job type is required'], enum: ['full-time', 'part-time', 'remote', 'contract'] },
    experienceLevel: { type: String, required: [true, 'Experience level is required'], enum: ['entry', 'mid', 'senior'] },
    description: { type: String, required: [true, 'Description is required'] },
    requirements: { type: String, required: [true, 'Requirements is required'] },
    postedBy: { type: String, required: [true, 'PostedBy is required'] },
    datePosted: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Job = mongoose.model<IJob>('Job', JobSchema);
