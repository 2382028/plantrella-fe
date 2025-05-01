// src/services/authService.js
import api from './axiosConfig'; // Impor instance Axios

// const API_URL = ''; // <<< HAPUS BARIS INI

export const loginUser = async (credentials) => {
  try {
    // Gunakan instance 'api' yang sudah punya baseURL
    const response = await api.post('/auth/login', credentials);
    return response; // Kembalikan seluruh response agar bisa ambil data token
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error; // Lempar error agar komponen bisa tangani
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response; // Kembalikan response
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};

// Fungsi logout di sini tidak terlalu berguna karena token disimpan di localStorage
// dan interceptor/komponen yang handle redirect. Bisa dihapus jika mau.
// export const logoutUser = () => {
//   localStorage.removeItem('token');
// };