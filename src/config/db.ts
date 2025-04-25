import mongoose from 'mongoose';
import config from './config';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongo_connection_preference == "local" ? config.mongo_local_db : config.mongo_db);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

export default connectDB;
