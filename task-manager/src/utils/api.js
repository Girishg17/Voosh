import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';
const API_TASK= 'http://localhost:5000/api/tasks';

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
    console.log("its calling save task with ",task)
    const response = await axios.post(`${API_URL}/${userId}`, { column, task });
    console.log(response);
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


export const updateTasks = async (userId, tasks) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}/tasks`, { tasks });
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
