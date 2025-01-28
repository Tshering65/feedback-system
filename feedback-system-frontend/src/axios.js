import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://nppf-feedback-system.vercel.app/api' // Production backend URL
    : 'http://localhost:5000/api'; // Local development backend URL

const instance = axios.create({
  baseURL: baseURL, // Dynamically set base URL
});

export default instance;
