import api from './axiosConfig';

export const getAllPlants = async () => {
  try {
    const response = await api.get('/plants');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPlant = async (plantData) => {
  try {
    const response = await api.post('/plants', plantData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePlant = async (id, plantData) => {
  try {
    const response = await api.put(`/plants/${id}`, plantData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePlant = async (id) => {
  try {
    const response = await api.delete(`/plants/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};