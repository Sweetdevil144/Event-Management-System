/**
 * Integration tests for Auth routes using SuperTest.
 */

const request = require('supertest');
const app = require('../../app');
const { User } = require('../../models');
const jwt = require('jsonwebtoken');
require('../setup');

afterAll(async () => {
  await User.deleteMany({});
});

describe('Auth Integration Tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

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
    expect(userInDb.password).not.toBe('abcdef'); // Password should be hashed
  });

  test('POST /api/auth/login - should login user', async () => {
    // 1) Register a user first
    const randomEmail = `login.user.${Date.now()}@example.com`;
    await request(app)
      .post('/api/auth/register')
      .send({ 
        name: 'Login User', 
        email: randomEmail, 
        password: '123456' 
      });

    // 2) Login with same credentials
    const res = await request(app)
      .post('/api/auth/login')
      .send({ 
        email: randomEmail, 
        password: '123456' 
      });

    // Expect success
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', randomEmail);

    // Verify token can be decoded
    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET || 'simplejwt');
    expect(decoded).toHaveProperty('userId');
    expect(decoded).toHaveProperty('role');
  });

  test('POST /api/auth/login - should fail with wrong password', async () => {
    const randomEmail = `wrong.pass.${Date.now()}@example.com`;
    
    // Register user
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Wrong Pass User',
        email: randomEmail,
        password: 'correct'
      });

    // Try login with wrong password
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: randomEmail,
        password: 'wrong'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});
