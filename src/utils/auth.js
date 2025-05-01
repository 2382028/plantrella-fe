// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // URL Backend

export const registerUser = (userData) => {
  // userData = { username, email, password }
  return axios.post(`${API_URL}/auth/register`, userData);
};

export const loginUser = (credentials) => {
  // credentials = { email, password }
  return axios.post(`${API_URL}/auth/login`, credentials);
};

// Fungsi untuk menyimpan token
export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

// Fungsi untuk mendapatkan token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Fungsi untuk mengecek apakah user sudah login
export const isAuthenticated = () => {
  const token = getToken();
  return !!token; // Returns true if token exists
};

// Fungsi untuk menghapus token (logout)
export const removeToken = () => {
  localStorage.removeItem('token');
};