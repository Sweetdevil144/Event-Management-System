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
      process.env.JWT_SECRET || 'simplejwt',
      { expiresIn: '1h' }
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
          organizer: organizerId
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe('New Year Gala');
      expect(res.body.organizer).toBe(organizerId);
    });

    it('should fail without auth token', async () => {
      const res = await request(app)
        .post('/api/events')
        .send({
          name: 'New Year Gala',
          description: 'Celebrate 2026!',
          date: '2026-12-31T23:00:00.000Z',
          location: 'NYC',
          capacity: 500,
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/events', () => {
    it('should list all events (public)', async () => {
      const res = await request(app).get('/api/events');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0]).toHaveProperty('organizer');
    });
  });

  describe('GET /api/events/:id', () => {
    it('should get a single event by ID', async () => {
      const res = await request(app).get(`/api/events/${eventId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(eventId);
      expect(res.body.name).toBe('Test Event');
      expect(res.body.organizer).toBeTruthy();
    });

    it('should return 404 for non-existent event', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/events/${fakeId}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/events/:id', () => {
    it('should update an event (organizer only)', async () => {
      const res = await request(app)
        .put(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({ 
          name: 'Updated Test Event',
          description: 'Updated description',
          location: 'Updated location'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Updated Test Event');
      expect(res.body.description).toBe('Updated description');
      expect(res.body.location).toBe('Updated location');
    });

    it('should fail without auth token', async () => {
      const res = await request(app)
        .put(`/api/events/${eventId}`)
        .send({ name: 'Updated Test Event' });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should delete an event (organizer only)', async () => {
      const res = await request(app)
        .delete(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${organizerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Event deleted successfully');

      // Verify event is actually deleted
      const deletedEvent = await Event.findById(eventId);
      expect(deletedEvent).toBeNull();
    });

    it('should return 404 if event not found', async () => {
      const randomId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/events/${randomId}`)
        .set('Authorization', `Bearer ${organizerToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Event not found');
    });

    it('should fail without auth token', async () => {
      const res = await request(app)
        .delete(`/api/events/${eventId}`);

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/events/stats', () => {
    beforeEach(async () => {
      // Re-create test event since previous tests may have deleted it
      const event = await Event.create({
        name: 'Stats Event',
        description: 'Stats Desc',
        date: new Date('2026-01-01'),
        location: 'Test Stats Location',
        capacity: 200,
        organizer: organizerId,
      });
      eventId = event._id;
    });

    it('should retrieve events with stats (organizer/admin)', async () => {
      const res = await request(app)
        .get('/api/events/stats')
        .set('Authorization', `Bearer ${organizerToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('registrationCount');
      expect(res.body[0]).toHaveProperty('capacity');
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('location');
    });

    it('should fail without auth token', async () => {
      const res = await request(app).get('/api/events/stats');
      expect(res.statusCode).toBe(401);
    });
  });
});
