/**
 * Unit tests for event.service.js
 */
const eventService = require('../../services/event.service');
const { Event } = require('../../models');

jest.mock('../../models', () => ({
  Event: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(), 
    findByIdAndUpdate: jest.fn(),
    findByIdAndRemove: jest.fn(),
    aggregate: jest.fn(),
  },
  Registration: {},
  User: {},
}));

describe('Event Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEvent', () => {
    it('should create a new event', async () => {
      const mockEvent = {
        name: 'New Event',
        description: 'Test Description',
        date: new Date('2025-01-01'),
        location: 'Test Location',
        capacity: 100,
        organizer: 'organizerId'
      };

      Event.create.mockResolvedValue(mockEvent);
      const result = await eventService.createEvent(mockEvent);

      expect(Event.create).toHaveBeenCalledWith(mockEvent);
      expect(result).toEqual(mockEvent);
    });
  });

  describe('getEvents', () => {
    it('should return a list of events', async () => {
      const mockEvents = [
        {
          name: 'Event 1',
          description: 'Description 1',
          date: new Date('2025-01-01'),
          location: 'Location 1',
          capacity: 100,
          organizer: 'organizerId1'
        },
        {
          name: 'Event 2',
          description: 'Description 2', 
          date: new Date('2025-02-01'),
          location: 'Location 2',
          capacity: 200,
          organizer: 'organizerId2'
        }
      ];

      Event.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockEvents),
      });

      const result = await eventService.getEvents();
      expect(Event.find).toHaveBeenCalled();
      expect(result).toEqual(mockEvents);
    });
  });

  describe('getEventById', () => {
    it('should return an event by ID', async () => {
      const mockEvent = {
        _id: '123',
        name: 'Sample Event',
        description: 'Sample Description',
        date: new Date('2025-01-01'),
        location: 'Sample Location',
        capacity: 100,
        organizer: 'organizerId'
      };

      Event.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockEvent),
      });

      const result = await eventService.getEventById('123');
      expect(Event.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockEvent);
    });

    it('should return null if event not found', async () => {
      Event.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      const result = await eventService.getEventById('notfound');
      expect(result).toBeNull();
    });
  });

  describe('updateEvent', () => {
    it('should update an event by ID', async () => {
      const updatedEvent = {
        _id: '123',
        name: 'Updated Event',
        description: 'Updated Description',
        location: 'Updated Location'
      };

      Event.findByIdAndUpdate.mockResolvedValue(updatedEvent);

      const result = await eventService.updateEvent('123', updatedEvent);
      expect(Event.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        updatedEvent,
        { new: true, runValidators: true }
      );
      expect(result).toEqual(updatedEvent);
    });

    it('should return null if event not found', async () => {
      Event.findByIdAndUpdate.mockResolvedValue(null);
      const result = await eventService.updateEvent('notfound', {});
      expect(result).toBeNull();
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event by ID', async () => {
      const mockEvent = {
        _id: '123',
        name: 'Event to Delete',
        description: 'To be deleted',
        date: new Date('2025-01-01'),
        location: 'Delete Location',
        capacity: 100,
        organizer: 'organizerId'
      };

      Event.findByIdAndRemove.mockResolvedValue(mockEvent);

      const result = await eventService.deleteEvent('123');
      expect(Event.findByIdAndRemove).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockEvent);
    });

    it('should throw an error if event not found', async () => {
      Event.findByIdAndRemove.mockResolvedValue(null);

      await expect(eventService.deleteEvent('notfound')).rejects.toThrow(
        'Event not found'
      );
    });
  });

  describe('getAllEventsWithStats', () => {
    it('should return events with stats', async () => {
      const mockAggregation = [
        {
          _id: 'event1',
          name: 'Event 1',
          description: 'Description 1',
          date: new Date('2025-01-01'),
          location: 'Location 1',
          capacity: 100,
          organizer: 'organizerId',
          registrationCount: 5
        }
      ];

      Event.aggregate.mockResolvedValue(mockAggregation);

      const result = await eventService.getAllEventsWithStats();
      expect(Event.aggregate).toHaveBeenCalledWith([
        {
          $lookup: {
            from: 'registrations',
            localField: '_id',
            foreignField: 'event',
            as: 'registrations',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            date: 1,
            location: 1,
            capacity: 1,
            organizer: 1,
            registrationCount: { $size: '$registrations' },
          },
        },
      ]);
      expect(result).toEqual(mockAggregation);
    });
  });
});
