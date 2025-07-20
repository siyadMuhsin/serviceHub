import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();
const mongoURL = process.env.MONGO_URL;
if (!mongoURL) {
    logger.error('MongoDB connection failed: MONGO_URL not defined');
    throw new Error('MongoDB connection failed: MONGO_URL not defined');
}
const connectDB = async (): Promise<void> => {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(mongoURL);
        logger.info('MongoDB connected successfully');
    } catch (err) {
        logger.error('MongoDB connection error');
        process.exit(1);
    }
};

export default connectDB;