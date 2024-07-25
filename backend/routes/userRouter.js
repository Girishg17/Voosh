require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_API);

// User registration
router.post('/register', async (req, res) => {
    
  const { name,secondName, email, password } = req.body;
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
    const token = jwt.sign({ id: user._id }, 'WJDLQWELWQOWI', { expiresIn: '1h' });
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
//save task
router.post('/:userId', async (req, res) => {
  try {
    const { column, task } = req.body;
    
    if (!column || !task) {
      return res.status(400).send('Column and task data must be provided');
    }

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');
    
    if (!user.tasks[column]) {
      user.tasks[column] = [];
    }

   
    const { _id, ...taskWithoutId } = task; 
    user.tasks[column].push(taskWithoutId);

    await user.save();

    res.status(201).json(taskWithoutId);
  } catch (err) {
    console.error('Error saving task:', err);
    res.status(500).send(err.message);
  }
});

//get all tasks
router.get('/:userId/tasks', async (req, res) => {
  try {
    
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');
   
    res.status(200).json(user.tasks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
//update task draggging
router.put('/:userId/update', async (req, res) => {
  try {
    const { taskId, updatedTask, column } = req.body;

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');

    if (!user.tasks[column]) {
      return res.status(400).send('Invalid column');
    }

    const taskIndex = user.tasks[column].findIndex(task => task.id === taskId);
    if (taskIndex === -1) return res.status(404).send('Task not found');

    user.tasks[column][taskIndex] = { ...user.tasks[column][taskIndex], ...updatedTask };

    await user.save();
    res.status(200).json(user.tasks);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).send(err.message);
  }
});

//delete task
router.delete('/:userId/tasks/:taskId', async (req, res) => {
  const { userId, taskId } = req.params;
  console.log("Deleting task:", { userId, taskId });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

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
//update edited task
router.put('/:userId/tasks/:taskId', async (req, res) => {
  const { userId, taskId } = req.params;
  let { column, task } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

   
    if (!user.tasks) {
      user.tasks = {
        'TODO': [],
        'INPROGRESS': [],
        'DONE': [],
      };
    } else {
      Object.keys(user.tasks).forEach(key => {
        if (!Array.isArray(user.tasks[key])) {
          user.tasks[key] = [];
        }
      });
    }

    // Remove the task from its old column
    Object.keys(user.tasks).forEach(key => {
      if (Array.isArray(user.tasks[key])) {
        user.tasks[key] = user.tasks[key].filter(t => t.id !== taskId);
      }
    });

  
    if (!user.tasks[column]) {
      user.tasks[column] = [];
    }
    user.tasks[column].push(task);

    await user.save();
    res.status(200).json({ message: 'Task updated successfully' });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).send(err.message);
  }
});
//google
router.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_API,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email } = payload;

    let user = await User.findOne({ googleId });
    if (!user) {
      user = new User({
        googleId,
        email,
        name: payload.name,
      });
      await user.save();
    }

    const jwtToken = generateToken(user); 
    res.json({ token: jwtToken, id: user._id });
  } catch (error) {
    res.status(400).send('Invalid Google token');
  }
});
//update edit tasks
router.put('/:userId/edit', async (req, res) => {
  const { userId } = req.params;
  const { title, description,taskId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    
    if (!user.tasks) {
      user.tasks = {
        'TODO': [],
        'INPROGRESS': [],
        'DONE': [],
      };
    } else {
      Object.keys(user.tasks).forEach(key => {
        if (!Array.isArray(user.tasks[key])) {
          user.tasks[key] = [];
        }
      });
    }

    
    let taskUpdated = false;
    Object.keys(user.tasks).forEach(key => {
      user.tasks[key] = user.tasks[key].map(task => {
        if (task.id === taskId) {
          taskUpdated = true;
          return { ...task, title, description };
        }
        return task;
      });
    });

    if (!taskUpdated) {
      return res.status(404).send('Task not found');
    }

    await user.save();
    res.status(200).json({ message: 'Task updated successfully' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});


module.exports = router;
