const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jobportal';
  const isPlaceholder = primaryUri.includes('<') || primaryUri.includes('dummy') || primaryUri.includes('your_');

  if (!isPlaceholder) {
    try {
      const conn = await mongoose.connect(primaryUri, { 
        serverSelectionTimeoutMS: primaryUri.startsWith('mongodb+srv') ? 8000 : 3000 
      });
      console.log('MongoDB Connected (' + (primaryUri.startsWith('mongodb+srv') ? 'Atlas Cloud Cluster' : 'Live Instance') + '): ' + conn.connection.host);
      return;
    } catch (error) {
      console.warn('MongoDB connection failed for ' + primaryUri.split('@').pop() + ': ' + error.message);
    }
  } else {
    console.info('Placeholder or dummy MONGODB_URI detected. Using in-memory fallback for local development...');
  }

  console.log('Spawning standalone MongoMemoryServer for instant development...');
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create({ instance: { launchTimeout: 60000 } });
    const memoryUri = mongod.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log('MongoDB Connected (In-Memory Fallback): ' + conn.connection.host);

    const autoSeed = require('../seedFunction');
    await autoSeed();
  } catch (memError) {
    console.error('In-memory database initialization failed:', memError.message);
  }
};

module.exports = connectDB;
