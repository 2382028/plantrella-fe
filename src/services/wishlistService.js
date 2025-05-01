// src/services/wishlistService.js
import api from './axiosConfig';

export const getAllWishlistItems = () => api.get('/wishlist');
export const getWishlistItemById = (id) => api.get(`/wishlist/${id}`);
export const createWishlistItem = (data) => api.post('/wishlist', data); // data = { plantName, notes?, sourceIdea? }
export const updateWishlistItem = (id, data) => api.patch(`/wishlist/${id}`, data);
export const deleteWishlistItem = (id) => api.delete(`/wishlist/${id}`);