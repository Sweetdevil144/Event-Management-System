/**
 * 
 * Global error handler. Catch any errors thrown or passed to `next(error)` 
 * and respond with the appropriate status and message.
 */

// A simple error-handling middleware
exports.errorHandler = (err, req, res, next) => {
    console.error('Error Middleware:', err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
      success: false,
      message,
    });
  };
  