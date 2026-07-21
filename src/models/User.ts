import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  githubUsername: string;
  oauthId: string;
  role: string;
  joinedDate: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] },
    githubUsername: { type: String, required: [true, 'GitHub username is required'], trim: true },
    oauthId: { type: String, required: [true, 'OAuth ID is required'], unique: true },
    role: { type: String, required: true, enum: ['employer', 'jobseeker'], default: 'jobseeker' },
    joinedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
