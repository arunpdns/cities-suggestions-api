import mongoose from 'mongoose';
import logger from './shared/Logger';

export async function intializeDB(): Promise<void> {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cities';
  mongoose.connect(MONGO_URI, {}).then(() => {
    logger.info(`Connected to MongoDB ${MONGO_URI}`);
  });
}
