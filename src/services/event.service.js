/**
 *
 * Contains logic for creating, retrieving, updating, and deleting events.
 */

const { Event, Registration } = require('../models');

exports.createEvent = async (eventData) => {
  return await Event.create(eventData);
};

exports.getEvents = async () => {
  return await Event.find().populate('organizer', 'name email');
};

exports.getEventById = async (id) => {
  return await Event.findById(id).populate('organizer', 'name email');
};

exports.updateEvent = async (id, updateData) => {
  return await Event.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

exports.deleteEvent = async (id) => {
  const event = await Event.findByIdAndRemove(id);
  if (!event) {
    throw new Error('Event not found');
  }
  return event;
}

exports.getAllEventsWithStats = async () => {
  try {
    const eventsWithStats = await Event.aggregate([
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
          registrationCount: { $size: '$registrations' }, // Count attendees
        },
      },
    ]);

    return eventsWithStats;
  } catch (error) {
    console.error('Error fetching events with stats:', error);
    throw new Error('Failed to fetch events with statistics');
  }
};
