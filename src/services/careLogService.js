import api from '../utils/axiosConfig';

export const getAllCareLogs = async () => {
  const response = await api.get('/care-logs');
  return response.data;
};

export const getPlantCareLogs = async (plantId) => {
  const response = await api.get(`/plants/${plantId}/care-logs`);
  return response.data;
};

// Membuat log perawatan baru
export const createCareLog = (plantId, data) => {
    return api.post(`/plants/${plantId}/care-logs`, data);
};

// Mengupdate log perawatan yang ada
export const updateCareLog = (plantId, logId, data) => {
    return api.patch(`/plants/${plantId}/care-logs/${logId}`, data);
};

// Menghapus log perawatan
export const deleteCareLog = (plantId, logId) => {
    return api.delete(`/plants/${plantId}/care-logs/${logId}`);
};