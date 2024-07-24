const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// Get tasks for a user
router.get('/tasks/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');
    res.json(user.tasks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add task
router.post('/:userId', async (req, res) => {
  try {
    console.log("its coming to add task")
    const { column, task } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');
    
    user.tasks[column].push(task);
    await user.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update task column
router.put('/tasks/:userId/:taskId', async (req, res) => {
  try {
    const { column } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');

    const task = Object.values(user.tasks).flat().find(t => t.id === req.params.taskId);
    if (!task) return res.status(404).send('Task not found');

    // Remove from old column and add to new column
    Object.keys(user.tasks).forEach(col => {
      user.tasks[col] = user.tasks[col].filter(t => t.id !== req.params.taskId);
    });
    user.tasks[column].push(task);
    await user.save();
    res.json(task);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete task
router.post('/:userId', async (req, res) => {
    try {
      const { column, task } = req.body;
      const user = await User.findById(req.params.userId);
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      if (!user.tasks[column]) {
        return res.status(400).send('Invalid column');
      }
  
      user.tasks[column].push(task);
      await user.save();
      console.log("success");
      res.status(201).json(task);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  

module.exports = router;
