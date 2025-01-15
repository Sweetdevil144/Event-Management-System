/**
 * 
 * Handles sending notifications to event attendees.
 */

const notificationService = require('../services/notification.service');

exports.sendNotification = async (req, res, next) => {
  try {
    const { event_id, message } = req.body;

    const result = await notificationService.sendNotificationToAttendees(event_id, message);

    res.status(200).json({
      message: `Notification sent to ${result.count} attendee(s) of Event ID: ${event_id}`,
      details: message,
    });
  } catch (error) {
    next(error);
  }
};
