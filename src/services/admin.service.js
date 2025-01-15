/**
 * 
 * Contains logic for admin-related tasks
 * like user management and event stats.
 */

const { User, Event, Registration } = require('../models');

exports.getAllUsers = async (page, limit) => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find().skip(skip).limit(limit),
    User.countDocuments(),
  ]);
  return { users, total };
};

exports.deleteUser = async (userId) => {
  // Soft-delete or remove the user
  return await User.findByIdAndRemove(userId);
};

exports.getAllEventsWithStats = async () => {
  // Possibly aggregate data from Event & Registration
  return await Event.find(); // TODO : Implement this logic
};
