// interceptors/responseInterceptor.js
import api from "../api";
import useAuth from "../hooks/useAuth";

let isRefreshing = false;
let pendingQueue = []; // requests waiting on the in-flight refresh

const processQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401s, and never retry the refresh call itself or login
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh") &&
      !originalRequest.url.includes("/auth/login")
    ) {
      if (isRefreshing) {
        // A refresh is already in flight — queue this request until it resolves
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post("/auth/refresh"); // refreshToken cookie sent automatically
        const newAccessToken = data.data.accessToken; // matches your ResponseDTO shape

        const { setAuth } = useAuth();
        setAuth((prev) => ({ ...prev, accessToken: newAccessToken }));
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        const { setAuth } = useAuth();
        setAuth(null); // clear auth state on refresh failure
        // refresh token itself invalid/expired -> force logout
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
