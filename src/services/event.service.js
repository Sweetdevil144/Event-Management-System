/**
 * 
 * Contains the business logic for creating, retrieving,
 * updating, and deleting events.
 */

const { Event } = require('../models');

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
  return await Event.findByIdAndRemove(id);
};
