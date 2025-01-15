const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler } = require('./middlewares/error.middleware');
const routes = require('./routes');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Load the openapi.yaml file
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/openapi.yaml'));

const app = express();

// Global Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to Event Management API. Please refer to \'/api-docs\' for Swagger Documentations');
});

// Mount all routes under /api
app.use('/api', routes);

// Served Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// At the end: use our error handling middleware
app.use(errorHandler);

module.exports = app;
