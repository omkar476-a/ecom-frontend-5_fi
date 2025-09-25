// src/api/AuthAPI.jsx
import axios from "axios";

// Create an Axios instance for authentication API
const AuthAPI = axios.create({
  baseURL: "https://spring-boot-project-2.onrender.com/auth", // your backend base URL
});

// Remove default Authorization header (in case set globally elsewhere)
delete AuthAPI.defaults.headers.common["Authorization"];

// ----------------- API Calls -----------------

// Register user
export const registerUser = (userData) => {
  return AuthAPI.post("/register", userData);
};

// Login user
export const loginUser = (credentials) => {
  return AuthAPI.post("/login", credentials);
};

// ----------------- Export -----------------
export default AuthAPI;
