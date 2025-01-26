const express = require('express');
const { registerUser, loginUser, protectRoute } = require('../controllers/authController');
const router = express.Router();

// Route for registering a new user
router.post('/register', registerUser);

// Route for logging in an existing user
router.post('/login', loginUser);


// Example of a protected route (requires a valid JWT)
router.get('/profile', protectRoute, (req, res) => {
  res.json({
    message: 'Welcome to your profile!',
    user: req.user,
  });
});

module.exports = router;
