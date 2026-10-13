import axios from "axios";
import { tokenStore } from "./session.js";

const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || "http://localhost:8000",
  timeout: 15000,
});

const isPublicAuth = (url = "") =>
  /^\/?auth\/(login|registrar)\/?(?:\?|$)/.test(url);
api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (!isPublicAuth(config.url) && token) {
    config.headers.set("Authorization", `Bearer ${token}`);
    config.sessionToken = token;
  }
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const rejected = error.config?.sessionToken;
    if (
      error.response?.status === 401 &&
      rejected &&
      rejected === tokenStore.get()
    ) {
      tokenStore.clear("expired");
    }
    return Promise.reject(error);
  },
);

export default api;
