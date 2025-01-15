/**
 * 
 * Analytics endpoints such as:
 * - Most popular events
 * - Most active users
 * - Detailed event stats
 */

const analyticsService = require('../services/analytics.service');

exports.getPopularEvents = async (req, res, next) => {
  try {
    // e.g. /analytics/events/popular?limit=5
    const limit = parseInt(req.query.limit) || 5;
    const popularEvents = await analyticsService.getPopularEvents(limit);
    res.status(200).json({ data: popularEvents });
  } catch (error) {
    next(error);
  }
};

exports.getActiveUsers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const activeUsers = await analyticsService.getActiveUsers(limit);
    res.status(200).json({ data: activeUsers });
  } catch (error) {
    next(error);
  }
};

exports.getEventStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stats = await analyticsService.getEventStats(id);
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};
