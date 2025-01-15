/**
 * 
 * - Register (POST /auth/register)
 * - Login (POST /auth/login)
 */

const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await authService.registerUser(name, email, password);

    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    // e.g. "Email already in use"
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
