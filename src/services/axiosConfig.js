// src/services/axiosConfig.js
import axios from "axios";
import { getToken, removeToken } from "../utils/auth";

const api = axios.create({
  baseURL: "https://simple-social-media-app-be-a1dw.vercel.app/api", // Base URL backend
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani response error (misal 401 Unauthorized)
api.interceptors.response.use(
  (response) => response, // Jika sukses, langsung teruskan response
  (error) => {
    // Jika error 401 (Unauthorized), token mungkin expired/invalid
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Logging out.");
      removeToken(); // Hapus token invalid
      // Redirect ke login (cara redirect di luar komponen agak tricky,
      // mungkin lebih baik ditangani di komponen yang memanggil API)
      window.location.href = "/login"; // Cara paksa redirect
    }
    return Promise.reject(error); // Teruskan error ke pemanggil API
  }
);

export default api; // Ekspor instance axios yang sudah dikonfigurasi
