import axios from "axios";

// Automatically switch between local and deployed URLs
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "" // same-origin when backend serves frontend
    : "http://localhost:8000");

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

export default api;
