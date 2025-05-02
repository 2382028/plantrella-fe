import api from "./axiosConfig"; // <-- Hanya satu impor ini

export const getAllPlants = async () => {
  try {
    const response = await api.get("/plants");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching all plants:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// --- TAMBAHKAN FUNGSI INI ---
export const getPlantById = async (id) => {
  try {
    const response = await api.get(`/plants/${id}`); // Sesuaikan endpoint API Anda
    return response.data; // Kembalikan data tanaman
  } catch (error) {
    console.error(
      `Error fetching plant with id ${id}:`,
      error.response?.data || error.message
    );
    throw error; // Lempar error agar bisa ditangkap di komponen
  }
};
// --------------------------

export const createPlant = async (plantData) => {
  try {
    const formattedData = {
      name: plantData.name,
      species: plantData.species,
      notes: plantData.notes,
      locationId: plantData.locationId,
      photo_url: plantData.photo_url,
    };
    const response = await api.post("/plants", formattedData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating plant:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updatePlant = async (id, plantData) => {
  try {
    const formattedData = {
      name: plantData.name,
      species: plantData.species,
      notes: plantData.notes,
      locationId: plantData.locationId,
      photo_url: plantData.photo_url,
    };
    const response = await api.patch(`/plants/${id}`, formattedData);
    return response.data;
  } catch (error) {
    console.error(
      `Error updating plant with id ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deletePlant = async (id) => {
  try {
    const response = await api.delete(`/plants/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting plant with id ${id}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};
