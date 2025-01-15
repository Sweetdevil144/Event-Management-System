/**
 * 
 * Contains logic for analytics computations, e.g.
 * top events, top users, event stats, etc.
 */

const { Event, Registration, User } = require('../models');

exports.getPopularEvents = async (limit = 5) => {
  // Example using MongoDB aggregation to count registrations per event
  return Registration.aggregate([
    { $group: { _id: '$event', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'events',
        localField: '_id',
        foreignField: '_id',
        as: 'eventDetails',
      },
    },
  ]);
};

exports.getActiveUsers = async (limit = 5) => {
  // Example using MongoDB aggregation to count registrations per user
  return Registration.aggregate([
    { $group: { _id: '$user', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
  ]);
};

exports.getEventStats = async (eventId) => {
  // Example: return total registrations, user demographics, etc.
  const registrations = await Registration.countDocuments({ event: eventId });
  // Fetch additional data as needed...
  return { registrations };
};
