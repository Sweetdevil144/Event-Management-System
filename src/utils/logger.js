/**
 * 
 * Central logger using a library like Winston or Pino. 
 * Here’s a simple example with Winston.
 */

const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    // Optionally write logs to a file:
    // new transports.File({ filename: 'app.log' }),
  ],
});

module.exports = logger;
