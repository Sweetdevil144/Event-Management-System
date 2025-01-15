/**
 *
 * This file configures the Express application, setting up middleware and routes.
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler } = require('./middlewares/error.middleware'); // Import our global error handler
const routes = require('./routes'); // Import the central router

const app = express();

// Global Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Mount all routes under /api
app.use('/api', routes);

// At the end: use our error handling middleware
app.use(errorHandler);

module.exports = app;
