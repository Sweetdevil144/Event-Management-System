/**
 *
 * Example unit test for analytics service.
 */
const analyticsService = require('../../services/analytics.service');
const { Registration } = require('../../models');
require('../setup'); // DB connection, if needed

jest.mock('../../models', () => ({
  Registration: {
    aggregate: jest.fn(),
  },
  Event: {},
  User: {},
}));

describe('AnalyticsService - getPopularEvents', () => {
  it('should return array of top events', async () => {
    Registration.aggregate.mockResolvedValue([
      { _id: 'event1', count: 10, eventDetails: [{ name: 'Event 1' }] },
      { _id: 'event2', count: 8, eventDetails: [{ name: 'Event 2' }] },
    ]);

    const result = await analyticsService.getPopularEvents(5);
    expect(Registration.aggregate).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0].eventDetails[0].name).toBe('Event 1');
  });
});
