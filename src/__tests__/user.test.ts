import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../models/User';

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
  await User.deleteMany({});
});

describe('User Model', () => {
  it('should create a user successfully', async () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      githubUsername: 'johndoe',
      oauthId: '12345678',
      role: 'jobseeker',
    });
    const saved = await user.save();
    expect(saved._id).toBeDefined();
    expect(saved.name).toBe('John Doe');
    expect(saved.role).toBe('jobseeker');
  });

  it('should fail without required fields', async () => {
    const user = new User({ name: 'Incomplete User' });
    await expect(user.save()).rejects.toThrow();
  });

  it('should fail with invalid role', async () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      githubUsername: 'johndoe',
      oauthId: '12345678',
      role: 'admin',
    });
    await expect(user.save()).rejects.toThrow();
  });

  it('should fail with duplicate email', async () => {
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      githubUsername: 'johndoe',
      oauthId: '12345678',
      role: 'jobseeker',
    });
    const duplicate = new User({
      name: 'Jane Doe',
      email: 'john@example.com',
      githubUsername: 'janedoe',
      oauthId: '87654321',
      role: 'employer',
    });
    await expect(duplicate.save()).rejects.toThrow();
  });

  it('should update a user role', async () => {
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      githubUsername: 'johndoe',
      oauthId: '12345678',
      role: 'jobseeker',
    });
    const updated = await User.findByIdAndUpdate(
      user._id,
      { role: 'employer' },
      { new: true }
    );
    expect(updated?.role).toBe('employer');
  });

  it('should delete a user', async () => {
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      githubUsername: 'johndoe',
      oauthId: '12345678',
      role: 'jobseeker',
    });
    await User.findByIdAndDelete(user._id);
    const found = await User.findById(user._id);
    expect(found).toBeNull();
  });
});