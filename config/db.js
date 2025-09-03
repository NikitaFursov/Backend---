import mongoose from 'mongoose';
import log from '../utils/logger.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    log.logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    log.logger.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;