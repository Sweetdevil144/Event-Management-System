/**
 *
 * This file can be used to import and export all models at once.
 * Also useful for any model-related initialization logic.
 */

const User = require("./user.model");
const Event = require("./event.model");
const Registration = require("./registration.model");

module.exports = {
  User,
  Event,
  Registration,
};
