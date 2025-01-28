import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Admin API base URL
  withCredentials: true, // This ensures credentials (cookies) are included in requests
});

export default instance;
