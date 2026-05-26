const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the connection string from environment variables.
 * Reuses an existing connection in serverless environments.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      'Missing MONGODB_URI. Add it to Railway/ Vercel Environment Variables or your local .env file.'
    );
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (mongoose.connection.readyState === 2) {
    await new Promise((resolve, reject) => {
      mongoose.connection.once('connected', resolve);
      mongoose.connection.once('error', reject);
    });
    return;
  }

  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
