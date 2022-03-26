import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function initMongoServer() {
  const mongoServer = await MongoMemoryServer.create();
  return await mongoose.connect(mongoServer.getUri(), { dbName: 'cities' });
}
