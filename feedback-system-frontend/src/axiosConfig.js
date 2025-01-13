import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Make sure this is the correct URL to your backend API
});

export default instance;
