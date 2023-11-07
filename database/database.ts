import mongoose from 'mongoose';

const MONGO_URI: string = process.env.MONGO_URI as string;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error: Error) => {
    console.error('Error connecting to the database:', error);
  });
