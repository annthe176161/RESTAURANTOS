import axios, { AxiosError } from 'axios';

// The Web Client communicates EXCLUSIVELY with the API Gateway (Port 5000)
// It NEVER calls internal service ports directly (5001, 5002, 5003, 5004)
const baseURL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Standardized global error logging or token refresh handling
    console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);
