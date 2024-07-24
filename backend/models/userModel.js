const mongoose = require('mongoose');

// Define the task schema
const taskSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Define the user schema
const userSchema = new mongoose.Schema({
  name: String,
  secondName: String,
  email: String,
  password: String,
  tasks: {
    TODO: [taskSchema],
    INPROGRESS: [taskSchema],
    DONE: [taskSchema],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
