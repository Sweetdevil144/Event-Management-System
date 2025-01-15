/**
 *
 * Integration tests for event routes using SuperTest.
 */

const request = require('supertest');
const app = require('../../../app'); // Express app
const { Event, User } = require('../../../models');
const mongoose = require('mongoose');

describe('Event Routes Integration', () => {
  let server;
  let organizerToken;
  let organizerId;
  let eventId;

  beforeAll(async () => {
    // Start server on a random port
    server = app.listen(5001);

    const testUri = process.env.MONGODB_URI;
    if (!mongoose.connection.readyState) {
      await mongoose.connect(testUri, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    // Create an organizer user
    const organizer = await User.create({
      name: 'Organizer One',
      email: 'organizer1@example.com',
      password: 'hashedpassword', // In real tests, you might hash it or just mock
      role: 'organizer',
    });
    organizerId = organizer._id.toString();

    // Simulate a login process or just sign a JWT manually for the organizer
    // For simplicity, let's just sign a token with the same payload
    const jwt = require('jsonwebtoken');
    organizerToken = jwt.sign({ userId: organizerId, role: 'organizer' }, process.env.JWT_SECRET || 'simplejwt');

    // Create an event in DB
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
    await Event.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
    await server.close();
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
      // We expect an array of events with registrationCount
      expect(Array.isArray(res.body)).toBe(true);
      // The "Stats Event" should appear in the array
      const foundEvent = res.body.find((ev) => ev._id === event2._id.toString());
      expect(foundEvent).toBeTruthy();
      expect(foundEvent).toHaveProperty('registrationCount', 0); // no registrations yet
    });
  });
});
