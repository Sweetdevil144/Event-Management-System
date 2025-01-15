/**
 *
 * Starts the server and connects to the database.
 */

require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');

const port = process.env.PORT || 4000;

connectDB()
  .then(() => {
    const server = http.createServer(app);
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });
