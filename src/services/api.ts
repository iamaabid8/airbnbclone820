
import axios from "axios";

// Create axios instance with your backend URL
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Change this to your backend URL when deployed
  headers: {
    "Content-Type": "application/json",
  },
});

// Add authentication interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post("/auth/login", credentials),
  register: (userData: { email: string; password: string; name: string }) =>
    api.post("/auth/register", userData),
};

export const propertyAPI = {
  getAll: () => api.get("/properties"),
  getById: (id: string) => api.get(`/properties/${id}`),
  create: (propertyData: any) => api.post("/properties", propertyData),
  update: (id: string, propertyData: any) => api.put(`/properties/${id}`, propertyData),
  delete: (id: string) => api.delete(`/properties/${id}`),
};

export const bookingAPI = {
  getAll: () => api.get("/bookings"),
  getById: (id: string) => api.get(`/bookings/${id}`),
  create: (bookingData: any) => api.post("/bookings", bookingData),
  update: (id: string, bookingData: any) => api.put(`/bookings/${id}`, bookingData),
  delete: (id: string) => api.delete(`/bookings/${id}`),
};

export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (userData: any) => api.put("/users/profile", userData),
  getAllUsers: () => api.get("/users"), // Admin only
  updateUser: (id: string, userData: any) => api.put(`/users/${id}`, userData), // Admin only
  deleteUser: (id: string) => api.delete(`/users/${id}`), // Admin only
};

export default api;
