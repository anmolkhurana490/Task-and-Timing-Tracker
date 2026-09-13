// Axios Configuration for API Communication
// Configures HTTP client with base URL, authentication, and error handling

import axios from "axios";
import { API_BASE_URL } from "@/config/constants/apis";
import { getAuthToken } from "./authSession";

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL, // Base URL for all API requests
  headers: {
    // Default content type (overridden for file uploads)
    'Content-Type': 'application/json',
  },
});

// Attach the current session token at request time because sessions can change without recreating this client.
api.interceptors.request.use(
  async (config) => {
    // JWT token from session for authenticated requests
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Cookies are intentionally disabled; authentication uses the bearer token above.
    // config.withCredentials = true;

    return config;
  },
  (error) => Promise.reject(error)
);

// Convert Axios failures into the backend's small error shape for view-models.
api.interceptors.response.use(
  response => response, // Pass through successful responses
  error => {
    // Handle API errors consistently across the app
    if (error.response) {
      // Server responded with error status
      return Promise.reject(error.response.data || { message: 'An error occurred. Please try again.' });
    } else {
      // Network error or request timeout
      console.error('Network Error:', error);
      return Promise.reject({
        message: error.message || 'Network error. Please try again later.',
        data: error.data || null,
      });
    }
  }
);

export default api;