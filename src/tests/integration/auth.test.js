/**
 *
 * Integration tests for Auth routes using SuperTest.
 */
const request = require('supertest');
const app = require('../../app'); // Express app
const { User } = require('../../models');
require('../setup'); // Ensure global setup runs

describe('Auth Integration Tests', () => {
  let server;

  beforeAll(() => {
    server = app.listen(4001); // or use supertest directly on app
  });

  afterAll(async () => {
    await server.close();
  });

  test('POST /api/auth/register - should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test.user@example.com',
        password: 'abcdef',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email', 'test.user@example.com');

    // Check if user was saved to the DB
    const userInDb = await User.findOne({ email: 'test.user@example.com' });
    expect(userInDb).toBeTruthy();
  });

  test('POST /api/auth/login - should login user', async () => {
    // Create a user manually
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Login User', email: 'login@example.com', password: '123456' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: '123456' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
