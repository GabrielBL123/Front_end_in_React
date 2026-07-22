// interceptors/requestInterceptor.js
import api from "../api";
import useAuth from "../hooks/useAuth";

api.interceptors.request.use((config) => {
  const { auth } = useAuth();
  const token = auth?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
