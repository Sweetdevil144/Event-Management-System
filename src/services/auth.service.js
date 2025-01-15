/**
 * 
 * Handles user registration and login logic
 * (Hashing passwords, verifying credentials, generating tokens, etc.)
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config');

exports.registerUser = async (name, email, password) => {
  // Check if email is taken
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  return await User.create({
    name,
    email,
    password: hashedPassword,
  });
};

exports.loginUser = async (email, password) => {
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  return { user, token };
};
