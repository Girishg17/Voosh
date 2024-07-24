const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User registration
router.post('/register', async (req, res) => {
    console.log("request is coming");
    
  const { name,secondName, email, password } = req.body;
  console.log("NAME",name);
  try {
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({
      name,
      secondName,
      email,
      password: hashedPassword,
    });
    
    await user.save();
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token,id: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token,id: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:userId', async (req, res) => {
  try {
    
    
    const { column, task } = req.body;
   
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');
    console.log("user",user);
    user.tasks[column].push(task);
    await user.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/:userId/tasks', async (req, res) => {
  try {
    
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');
   
    res.status(200).json(user.tasks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put('/:userId/update', async (req, res) => {
  try {
    const { tasks } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');
    user.tasks = tasks;
    await user.save();
    res.status(200).json(user.tasks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete('/:userId/tasks/:taskId', async (req, res) => {
  const { userId, taskId } = req.params;
  console.log("Deleting task:", { userId, taskId });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    // Debugging: Check user.tasks structure
    console.log("Current tasks:", user.tasks);

    // Ensure each column is an array
    for (let column of Object.keys(user.tasks)) {
      if (Array.isArray(user.tasks[column])) {
        user.tasks[column] = user.tasks[column].filter(task => task.id !== taskId);
      } else {
        console.log(`Column ${column} is not an array`);
      }
    }

    await user.save();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
