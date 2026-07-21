import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Company } from '../models/Company';

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
  await Company.deleteMany({});
});

describe('Company Model', () => {
  it('should create a company successfully', async () => {
    const company = new Company({
      name: 'Tech Corp',
      industry: 'Technology',
      location: 'San Francisco, CA',
      description: 'A leading tech company.',
      website: 'https://techcorp.com',
      email: 'info@techcorp.com',
    });
    const saved = await company.save();
    expect(saved._id).toBeDefined();
    expect(saved.name).toBe('Tech Corp');
    expect(saved.industry).toBe('Technology');
  });

  it('should fail without required fields', async () => {
    const company = new Company({ name: 'Incomplete Corp' });
    await expect(company.save()).rejects.toThrow();
  });

  it('should fail with invalid email', async () => {
    const company = new Company({
      name: 'Tech Corp',
      industry: 'Technology',
      location: 'San Francisco, CA',
      description: 'A leading tech company.',
      website: 'https://techcorp.com',
      email: 'not-an-email',
    });
    await expect(company.save()).rejects.toThrow();
  });

  it('should retrieve all companies', async () => {
    await Company.create({
      name: 'Corp A',
      industry: 'Finance',
      location: 'NYC',
      description: 'Finance company.',
      website: 'https://corpa.com',
      email: 'info@corpa.com',
    });
    const companies = await Company.find();
    expect(companies.length).toBe(1);
  });

  it('should update a company', async () => {
    const company = await Company.create({
      name: 'Old Name',
      industry: 'Tech',
      location: 'LA',
      description: 'Old description.',
      website: 'https://old.com',
      email: 'old@old.com',
    });
    const updated = await Company.findByIdAndUpdate(
      company._id,
      { name: 'New Name' },
      { new: true }
    );
    expect(updated?.name).toBe('New Name');
  });
});