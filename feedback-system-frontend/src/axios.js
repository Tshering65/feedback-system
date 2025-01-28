import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Admin API base URL
});

export default instance;
