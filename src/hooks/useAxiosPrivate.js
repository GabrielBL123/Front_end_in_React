import { useMemo } from "react";
import axios from "axios";

// Helper function to get cookie value by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return null;
};

const useAxiosPrivate = () => {
  const axiosPrivate = useMemo(() => {
    const instance = axios.create({
      baseURL: "http://localhost:8080",
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    // Add request interceptor
    instance.interceptors.request.use(
      (config) => {
        // Get token from cookie
        const token = getCookie("jwt");

        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    return instance;
  }, []);

  return axiosPrivate;
};

export default useAxiosPrivate;
