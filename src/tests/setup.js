/**
 *
 * Global test setup for Jest. 
 * 1. Connect to a test database.
 * 2. Optionally insert seed data.
 * 3. Teardown after tests.
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.test' }); // load a separate test .env if you wish

beforeAll(async () => {
  // Connect to a separate test DB or use a local memory server with something like 'mongodb-memory-server'.
  const testUri = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/event-management-test';
  await mongoose.connect(testUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Close DB connection
  await mongoose.connection.dropDatabase(); 
  await mongoose.connection.close();
});
