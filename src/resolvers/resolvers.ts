import { Job, IJob } from '../models/Job';
import { Company, ICompany } from '../models/Company';
import { Application, IApplication } from '../models/Application';
import { User, IUser } from '../models/User';
import { GraphQLError } from 'graphql';
import mongoose from 'mongoose';

export interface Context {
  user?: IUser & { id?: string };
}

const requireAuth = (context: Context): void => {
  if (!context.user) {
    throw new GraphQLError('You must be logged in to perform this action', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
};

const isValidId = (id: string): boolean => mongoose.Types.ObjectId.isValid(id);

const notFound = (type: string, id: string): GraphQLError =>
  new GraphQLError(`${type} with id "${id}" not found`, { extensions: { code: 'NOT_FOUND' } });

export const resolvers = {
  Query: {
    jobs: async (): Promise<IJob[]> => await Job.find().sort({ datePosted: -1 }),
    job: async (_: unknown, { id }: { id: string }): Promise<IJob | null> => {
      if (!isValidId(id)) throw new GraphQLError('Invalid ID format');
      const job = await Job.findById(id);
      if (!job) throw notFound('Job', id);
      return job;
    },
    companies: async (): Promise<ICompany[]> => await Company.find(),
    company: async (_: unknown, { id }: { id: string }): Promise<ICompany | null> => {
      if (!isValidId(id)) throw new GraphQLError('Invalid ID format');
      const company = await Company.findById(id);
      if (!company) throw notFound('Company', id);
      return company;
    },
    applications: async (): Promise<IApplication[]> => await Application.find().sort({ appliedDate: -1 }),
    application: async (_: unknown, { id }: { id: string }): Promise<IApplication | null> => {
      if (!isValidId(id)) throw new GraphQLError('Invalid ID format');
      const application = await Application.findById(id);
      if (!application) throw notFound('Application', id);
      return application;
    },
    users: async (): Promise<IUser[]> => await User.find(),
    user: async (_: unknown, { id }: { id: string }): Promise<IUser | null> => {
      if (!isValidId(id)) throw new GraphQLError('Invalid ID format');
      const user = await User.findById(id);
      if (!user) throw notFound('User', id);
      return user;
    },
    me: async (_: unknown, __: unknown, context: Context): Promise<IUser | null> => {
      requireAuth(context);
      return await User.findOne({ oauthId: (context.user as any)?.oauthId });
    },
  },

  Mutation: {
    addJob: async (_: unknown, { input }: { input: any }, context: Context): Promise<IJob> => {
      requireAuth(context);
      const job = new Job({ ...input, postedBy: (context.user as any)?.githubUsername ?? 'unknown' });
      return await job.save();
    },
    updateJob: async (_: unknown, { id, input }: { id: string; input: any }, context: Context): Promise<IJob | null> => {
      requireAuth(context);
      if (!isValidId(id)) throw new GraphQLError('Invalid ID format');
      const job = await Job.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true });
      if (!job) throw notFound('Job', id);
      return job;
    },
    deleteJob: async (_: unknown, { id }: { id: string }, context: Context): Promise<boolean> => {
      requireAuth(context);
      if (!isValidId(id)) throw new GraphQLError('Invalid ID format');
      const result = await Job.findByIdAndDelete(id);
      if (!result) throw notFound('Job', id);
      return true;
    },
    addCompany: async (_: unknown, { input }: { input: any }, context: Context): Promise<ICompany> => {
      requireAuth(context);
      const company = new Company(input);
      return await company.save();
    },
    updateCompany: async (_: unknown, { id, input }: { id: string; input: any }, context: Context): Promise<ICompany | null> => {
      requireAuth(context);
      if (!isValidId(id)) throw new GraphQLError('Invalid ID format');
      const company = await Company.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true });
      if (!company) throw notFound('Company', id);
      return company;
    },
    deleteCompany: async (_: unknown, { id }: { id: string }, context: Context): Promise<boolean> => {
      requireAuth(context);
      if (!isValidId(id)) throw new GraphQLError('Invalid ID format');
      const result = await Company.findByIdAndDelete(id);
      if (!result) throw notFound('Company', id);
      return true;
    },
    addApplication: async (_: unknown, { input }: { input: any }, context: Context): Promise<IApplication> => {
      requireAuth(context);
      const application = new Application({ ...input, status: 'pending' });
      return await application.save();
    },
    updateApplication: async (_: unknown, { id, input }: { id: string; input: any }, context: Context): Promise<IApplication | null> => {
      requireAuth(context);
      if (!isValidId(id)) throw new GraphQLError('Invalid ID format');
      if (input.status && !['pending', 'accepted', 'rejected'].includes(input.status)) {
        throw new GraphQLError('Status must be pending, accepted, or rejected');
      }
      const application = await Application.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true });
      if (!application) throw notFound('Application', id);
      return application;
    },
    deleteApplication: async (_: unknown, { id }: { id: string }, context: Context): Promise<boolean> => {
      requireAuth(context);
      if (!isValidId(id)) throw new GraphQLError('Invalid ID format');
      const result = await Application.findByIdAndDelete(id);
      if (!result) throw notFound('Application', id);
      return true;
    },
    updateUser: async (_: unknown, { id, input }: { id: string; input: any }, context: Context): Promise<IUser | null> => {
      requireAuth(context);
      if (!isValidId(id)) throw new GraphQLError('Invalid ID format');
      const user = await User.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true });
      if (!user) throw notFound('User', id);
      return user;
    },
    deleteUser: async (_: unknown, { id }: { id: string }, context: Context): Promise<boolean> => {
      requireAuth(context);
      if (!isValidId(id)) throw new GraphQLError('Invalid ID format');
      const result = await User.findByIdAndDelete(id);
      if (!result) throw notFound('User', id);
      return true;
    },
  },
};