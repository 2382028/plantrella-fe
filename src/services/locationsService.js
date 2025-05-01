// src/services/locationsService.js
import api from './axiosConfig';

export const getAllLocations = () => api.get('/locations');
export const getLocationById = (id) => api.get(`/locations/${id}`);
export const createLocation = (data) => api.post('/locations', data); // data = { name, notes? }
export const updateLocation = (id, data) => api.patch(`/locations/${id}`, data); // data = { name?, notes? }
export const deleteLocation = (id) => api.delete(`/locations/${id}`);