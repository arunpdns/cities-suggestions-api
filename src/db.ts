import mongoose from "mongoose";
import logger from './shared/Logger';

export async function intializeDB(): Promise<void> {
    mongoose.connect('mongodb://127.0.0.1:27017/cities', {}).then(() => {
      logger.info('mongodb://127.0.0.1:27017/cities', 'Connected to MongoDB',);
    });
  


}

