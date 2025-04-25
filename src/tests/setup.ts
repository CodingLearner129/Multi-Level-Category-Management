import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: MongoMemoryServer | null = null;

// beforeAll(async () => {});
export const dbConnect = async () => {
  try {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
    console.log('Successfully connected to in-memory MongoDB for testing. URI:', uri); // Include URI for debugging
  } catch (error) {
    console.error('Error connecting to in-memory MongoDB:', error);
    // It might be useful to throw the error to prevent tests from running
    throw error;
  }
}

// afterEach(async () => {});
export const deleteCollectionData = async () => {
  try {
    const collections = await mongoose.connection.db!.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
    // console.log('Successfully cleared all collections after each test.');
  } catch (error) {
    console.error('Error clearing collections:', error);
  }
}

// afterAll(async () => {});
export const dbDisconnect = async () => {
  try {
    await mongoose.connection.close();
    if (mongo) {
      await mongo.stop();
      mongo = null;
    }
    console.log('Successfully closed MongoDB connection and stopped the in-memory server.');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

// // ADD THIS TEST CASE:
// test('Database connection should be successful', async () => {
//   expect(mongoose.connection.readyState).toBe(1); // 1 means connected
// });