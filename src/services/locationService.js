import api from './axiosConfig';

export const getAllLocations = () => {
  return api.get('/locations');
};

export const createLocation = (locationData) => {
  return api.post('/locations', locationData);
};

export const updateLocation = (id, locationData) => {
  return api.put(`/locations/${id}`, locationData);
};

export const deleteLocation = (id) => {
  return api.delete(`/locations/${id}`);
};