import axios from "axios";

// Get the base URL depending on the environment
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://nppf-feedback-system.vercel.app/api" // Vercel URL for production
    : "http://localhost:5000/api"; // Localhost URL for development

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

