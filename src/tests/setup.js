/**
 * Global test setup for Jest.
 * 1. Connect to a test database.
 * 2. Load environment variables (JWT_SECRET, MONGODB_URI).
 * 3. Increase the default Jest timeout to 30 seconds.
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

// Increase Jest test timeout (default is 5s)
jest.setTimeout(30000);

beforeAll(async () => {
  const testUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/event-management-test';
  if (!testUri) {
    throw new Error('MONGODB_URI is not defined in .env');
  }
  await mongoose.connect(testUri, {});
});

afterAll(async () => {
  // Clean up all data (optional)
  // await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});
