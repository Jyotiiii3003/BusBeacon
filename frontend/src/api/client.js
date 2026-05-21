import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export const API_URL = rawApiUrl
  .replace(/^VITE_API_URL=/, "")
  .replace(/\/$/, "");

export const api = axios.create({
  baseURL: `${API_URL}/api`
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("busbeacon_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
