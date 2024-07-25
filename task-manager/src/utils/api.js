import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';
//use for connecting deployment server https://todobackend-2610.onrender.com  instead of http://localhost:5000

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    console.log("respose data",response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Login failed');
  }
};

export const register = async (name,secondName,email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { name,secondName,email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Registration failed');
  }
};

export const saveTask = async (userId, column, task) => {
  try {
    const response = await axios.post(`${API_URL}/${userId}`, { column, task });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error saving task');
  }
};

export const fetchTasks = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/tasks`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Failed to fetch tasks');
  }
};


export const updateTasks = async (userId, tasks, taskId) => {
  try {
    console.log("tasks in updateTask",tasks);
    const response = await axios.put(`${API_URL}/${userId}/update`, { tasks ,taskId});
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Failed to update tasks');
  }
};

export const deleteTask = async (userId, taskId) => {
  try {
    console.log("its coming here");
    const response = await axios.delete(`${API_URL}/${userId}/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const puttsask = async (userId, column, task) => {
  try {
    await axios.put(`${API_URL}/${userId}/tasks/${task.id}`, {
      column,
      task,
    });
  } catch (error) {
    console.error('Error saving task:', error);
    throw error;
  }
};

export const googleLogin = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/google`, { token });
    return response.data;
  } catch (error) {
    throw new Error('Failed to login with Google');
  }
};

export const edittask = async (taskId, userId, title, description) => {
  try {
    console.log("edit task");
    await axios.put(`${API_URL}/${userId}/edit`, {
      title,
      description,
      taskId
    });
  } catch (error) {
    console.error('Error saving task:', error);
    throw error;
  }
};