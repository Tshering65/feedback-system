import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://feedback-system-eight.vercel.app/api', // Admin API base URL
});

export default instance;
