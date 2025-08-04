// lib/axiosInstance.ts

import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const { accessToken } = JSON.parse(userString);
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (error) {
        console.error("Invalid user JSON in localStorage", error);
      }
    }
  }
  return config;
});

export default instance;
