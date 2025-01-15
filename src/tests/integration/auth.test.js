/**
 * Integration tests for Auth routes using SuperTest.
 */

const request = require('supertest');
const app = require('../../app');
const { User } = require('../../models');
require('../setup');

describe('Auth Integration Tests', () => {

  test('POST /api/auth/register - should register a new user', async () => {
    const randomEmail = `test.user.${Date.now()}@example.com`;

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: randomEmail,
        password: 'abcdef',
      });

    // Expect success
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email', randomEmail);

    // Check DB
    const userInDb = await User.findOne({ email: randomEmail });
    expect(userInDb).toBeTruthy();
  });

  test('POST /api/auth/login - should login user', async () => {
    // 1) Register a user
    const randomEmail = `login.user.${Date.now()}@example.com`;
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Login User', email: randomEmail, password: '123456' });

    // 2) Login with same credentials
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: randomEmail, password: '123456' });

    // Expect success
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
