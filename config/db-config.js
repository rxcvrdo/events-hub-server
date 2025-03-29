import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  const mongoUri = process.env.MONGO_URL;

  if (!mongoUri) {
    console.error(' MONGO_URL is missing from environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.log(' Error connecting to MongoDB:', error);
  }
};
