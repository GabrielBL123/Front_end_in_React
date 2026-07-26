// interceptors/requestInterceptor.js
import api from "../api/axios";
import { getAccessToken } from "../tokenStore";

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
