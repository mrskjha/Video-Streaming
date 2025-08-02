import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, 
});

// Add access token from localStorage
instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    if (user) {
      const { accessToken } = JSON.parse(user);
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});


export default instance;
