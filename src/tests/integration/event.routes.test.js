/**
 * Integration tests for event routes using SuperTest.
 */

const request = require('supertest');
const app = require('../../app');
const { Event, User } = require('../../models');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('../setup');

describe('Event Routes Integration', () => {
  let organizerToken;
  let organizerId;
  let eventId;

  // Create test data once before tests
  beforeAll(async () => {
    // 1) Create an organizer user
    const organizer = await User.create({
      name: 'Organizer One',
      email: `organizer.${Date.now()}@example.com`,
      password: 'hashedpassword',
      role: 'organizer',
    });
    organizerId = organizer._id.toString();

    // 2) Manually sign a JWT for the organizer
    organizerToken = jwt.sign(
      { userId: organizerId, role: 'organizer' },
      process.env.JWT_SECRET || 'simplejwt'
    );

    // 3) Create an event
    const createdEvent = await Event.create({
      name: 'Test Event',
      description: 'Test Description',
      date: new Date('2025-01-01'),
      location: 'Test Location',
      capacity: 100,
      organizer: organizerId,
    });
    eventId = createdEvent._id.toString();
  });

  afterAll(async () => {
    // Cleanup test data
    await Event.deleteMany({});
    await User.deleteMany({});
  });

  describe('POST /api/events', () => {
    it('should create a new event (organizer only)', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({
          name: 'New Year Gala',
          description: 'Celebrate 2026!',
          date: '2026-12-31T23:00:00.000Z',
          location: 'NYC',
          capacity: 500,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe('New Year Gala');
    });
  });

  describe('GET /api/events', () => {
    it('should list all events (public)', async () => {
      const res = await request(app).get('/api/events');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      // At least 1 event (the "Test Event")
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /api/events/:id', () => {
    it('should get a single event by ID', async () => {
      const res = await request(app).get(`/api/events/${eventId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(eventId);
      expect(res.body.name).toBe('Test Event');
    });
  });

  describe('PUT /api/events/:id', () => {
    it('should update an event (organizer only)', async () => {
      const res = await request(app)
        .put(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({ name: 'Updated Test Event' });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Updated Test Event');
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should delete an event (organizer only)', async () => {
      const res = await request(app)
        .delete(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${organizerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Event deleted successfully');
    });

    it('should return 404 if event not found', async () => {
      const randomId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/events/${randomId}`)
        .set('Authorization', `Bearer ${organizerToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Event not found');
    });
  });

  describe('GET /api/events/stats', () => {
    it('should retrieve events with stats (organizer/admin)', async () => {
      // Re-create an event for stats testing
      const event2 = await Event.create({
        name: 'Stats Event',
        description: 'Stats Desc',
        date: new Date('2026-01-01'),
        location: 'Test Stats Location',
        capacity: 200,
        organizer: organizerId,
      });

      const res = await request(app)
        .get('/api/events/stats')
        .set('Authorization', `Bearer ${organizerToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      const foundEvent = res.body.find((ev) => ev._id === event2._id.toString());
      expect(foundEvent).toBeTruthy();
      expect(foundEvent).toHaveProperty('registrationCount', 0);
    });
  });
});
