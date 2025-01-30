import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://feedback-system-eight.vercel.app/api', // Make sure this is the correct URL to your backend API
});

export default instance;
