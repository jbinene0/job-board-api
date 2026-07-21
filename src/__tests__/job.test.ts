import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Job } from '../models/Job';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Job.deleteMany({});
});

describe('Job Model', () => {
  it('should create a job successfully', async () => {
    const job = new Job({
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'Remote',
      salary: '$100,000',
      jobType: 'full-time',
      experienceLevel: 'mid',
      description: 'A great job opportunity.',
      requirements: 'Node.js, MongoDB',
      postedBy: 'testuser',
    });
    const saved = await job.save();
    expect(saved._id).toBeDefined();
    expect(saved.title).toBe('Software Engineer');
    expect(saved.isActive).toBe(true);
  });

  it('should fail without required fields', async () => {
    const job = new Job({ title: 'Incomplete Job' });
    await expect(job.save()).rejects.toThrow();
  });

  it('should fail with invalid jobType', async () => {
    const job = new Job({
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'Remote',
      salary: '$100,000',
      jobType: 'invalid-type',
      experienceLevel: 'mid',
      description: 'A great job.',
      requirements: 'Node.js',
      postedBy: 'testuser',
    });
    await expect(job.save()).rejects.toThrow();
  });

  it('should fail with invalid experienceLevel', async () => {
    const job = new Job({
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'Remote',
      salary: '$100,000',
      jobType: 'full-time',
      experienceLevel: 'expert',
      description: 'A great job.',
      requirements: 'Node.js',
      postedBy: 'testuser',
    });
    await expect(job.save()).rejects.toThrow();
  });

  it('should retrieve all jobs', async () => {
    await Job.create({
      title: 'Developer',
      company: 'Corp A',
      location: 'NYC',
      salary: '$80,000',
      jobType: 'full-time',
      experienceLevel: 'entry',
      description: 'Dev role.',
      requirements: 'JavaScript',
      postedBy: 'user1',
    });
    const jobs = await Job.find();
    expect(jobs.length).toBe(1);
  });
});