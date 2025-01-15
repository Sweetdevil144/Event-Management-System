/**
 * 
 * Handles admin-specific functionalities.
 */

const adminService = require('../services/admin.service');
const eventService = require('../services/event.service');

/**
 * GET /admin/users
 * Retrieves a list of all users with pagination
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { users, total } = await adminService.getAllUsers(page, limit);

    return res.status(200).json({
      data: users,
      meta: {
        page,
        limit,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /admin/users/:id
 * Soft-delete a user by ID
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await adminService.deleteUser(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /admin/events
 * Retrieve all events with registration stats
 */
exports.getAllEventsWithStats = async (req, res, next) => {
  try {
    const eventsWithStats = await eventService.getAllEventsWithStats();
    return res.status(200).json({ data: eventsWithStats });
  } catch (error) {
    next(error);
  }
};
