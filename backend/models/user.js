const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  rank: {
    type: String,
    default: 'Beginner' // Default rank
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
