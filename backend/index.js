require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRouter');
// const taskRoutes = require('./routes/taskRouter');
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Use routes
app.use('/api/users', userRoutes);
// server.js or app.js

// app.use('/api/tasks', taskRoutes);


// Start the server
const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});
