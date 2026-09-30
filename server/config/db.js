const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jobportal';
  try {
    const conn = await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 3000 });
    console.log('MongoDB Connected (Live Instance): ' + conn.connection.host);
  } catch (error) {
    console.warn('Local MongoDB daemon not detected at ' + primaryUri);
    console.log('Spawning standalone MongoMemoryServer for instant out-of-the-box development...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log('MongoDB Connected (In-Memory Fallback): ' + conn.connection.host);

      const autoSeed = require('../seedFunction');
      await autoSeed();
    } catch (memError) {
      console.error('In-memory database initialization failed:', memError.message);
    }
  }
};

module.exports = connectDB;
