const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: String,
  title:String,
  description: String,
});

const userSchema = new mongoose.Schema({
  name: String,
  secondName: String,
  email: String,
  password: String,
  tasks: {
    TODO: [taskSchema],
    INPROGRESS: [taskSchema],
    DONE: [taskSchema],
    createdAt: { type: Date, default: Date.now },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
