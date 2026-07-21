import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Application } from '../models/Application';

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
  await Application.deleteMany({});
});

describe('Application Model', () => {
  it('should create an application successfully', async () => {
    const application = new Application({
      jobTitle: 'Software Engineer',
      applicantName: 'John Doe',
      email: 'john@example.com',
      coverLetter: 'I am very interested in this position.',
    });
    const saved = await application.save();
    expect(saved._id).toBeDefined();
    expect(saved.status).toBe('pending');
    expect(saved.applicantName).toBe('John Doe');
  });

  it('should fail without required fields', async () => {
    const application = new Application({ jobTitle: 'Developer' });
    await expect(application.save()).rejects.toThrow();
  });

  it('should fail with invalid status', async () => {
    const application = new Application({
      jobTitle: 'Software Engineer',
      applicantName: 'John Doe',
      email: 'john@example.com',
      coverLetter: 'I am interested.',
      status: 'maybe',
    });
    await expect(application.save()).rejects.toThrow();
  });

  it('should fail with invalid email', async () => {
    const application = new Application({
      jobTitle: 'Software Engineer',
      applicantName: 'John Doe',
      email: 'not-an-email',
      coverLetter: 'I am interested.',
    });
    await expect(application.save()).rejects.toThrow();
  });

  it('should update application status', async () => {
    const application = await Application.create({
      jobTitle: 'Developer',
      applicantName: 'Jane Doe',
      email: 'jane@example.com',
      coverLetter: 'I would love to join.',
    });
    const updated = await Application.findByIdAndUpdate(
      application._id,
      { status: 'accepted' },
      { new: true }
    );
    expect(updated?.status).toBe('accepted');
  });

  it('should delete an application', async () => {
    const application = await Application.create({
      jobTitle: 'Developer',
      applicantName: 'Jane Doe',
      email: 'jane@example.com',
      coverLetter: 'I would love to join.',
    });
    await Application.findByIdAndDelete(application._id);
    const found = await Application.findById(application._id);
    expect(found).toBeNull();
  });
});