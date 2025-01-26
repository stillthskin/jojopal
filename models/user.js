const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN', 'MODERATOR'], // Adjust roles as needed
    default: 'USER', // Default role for new users
  },
  createdDate: {
    type: Date,
    default: Date.now, // Automatically sets the creation date when the document is created
  },
});

// Hash the password before saving the user document
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare input password with stored hashed password
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
