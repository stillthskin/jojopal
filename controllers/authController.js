const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Secret key for JWT (You should store this in an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

// Register a new user
const registerUser = async (req, res) => {
  const { email, username, firstname, lastname, password, role } = req.body;

  try {
    // Check if the email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or Username already exists' });
    }

    // Create a new user
    const user = new User({
      email,
      username,
      firstname,
      lastname,
      password,
      role,
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({
      message: 'User registered successfully!',
      user: { email, username, firstname, lastname, role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login an existing user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '1h' } // Set token expiration time (e.g., 1 hour)
    );

    res.json({
      message: 'Login successful!',
      token, // Send the token to the client
      user: { email: user.email, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Helper function to protect routes
const protectRoute = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    // Verify the token and get the user info from it
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.username = decoded.username; // Add the decoded user info to the request object
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  protectRoute,
};
