const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Registration Schema
 * Many-to-Many relationship (User ↔ Event) is represented
 * by embedding references in the Registration model.
 */
const registrationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Registration', registrationSchema);
