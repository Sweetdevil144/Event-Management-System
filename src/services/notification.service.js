/**
 * 
 * Logic for notifying attendees (via email, push, etc.).
 */

const { Registration, User } = require('../models');
const { sendEmail } = require('../utils/email');

exports.sendNotificationToAttendees = async (eventId, message) => {
  // 1. Find all registrations for this event
  const registrations = await Registration.find({ event: eventId });

  // 2. Fetch user emails from those registrations
  const userIds = registrations.map((reg) => reg.user);
  const users = await User.find({ _id: { $in: userIds } });

  // 3. Send emails (could be done in parallel)
  for (const user of users) {
    await sendEmail(user.email, `Notification for Event ${eventId}`, message, `<p>${message}</p>`);
  }

  return { count: users.length };
};
