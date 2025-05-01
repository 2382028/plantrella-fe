import React, { useState, useEffect } from 'react';
// Hapus baris ini: import { useNavigate } from 'react-router-dom';
import { getAllPlants, createPlant, updatePlant, deletePlant } from '../services/plantService';
import PlantCard from '../components/PlantCard';
import PlantForm from '../components/PlantForm';
import Modal from '../components/Modal';
import './PlantsPage.css';

function PlantsPage() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const response = await getAllPlants();
      setPlants(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Gagal memuat data tanaman');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddForm = () => {
    setEditingPlant(null);
    setIsFormVisible(true);
  };

  const handleOpenEditForm = (plant) => {
    setEditingPlant(plant);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEditingPlant(null);
    setError(null);
  };

  const handleSavePlant = async (plantData) => {
    setError(null); // Reset error sebelum mencoba
    try {
      let response;
      if (editingPlant) {
        response = await updatePlant(editingPlant.id, plantData);
        console.log('Tanaman berhasil diperbarui:', response); // Log sukses update
      } else {
        response = await createPlant(plantData);
        console.log('Tanaman berhasil dibuat:', response); // Log sukses create
      }
      handleCloseForm();
      fetchPlants(); // Refresh daftar tanaman
    } catch (err) {
      console.error('Terjadi error saat menyimpan tanaman:', err); // Log error lengkap
      let errorMessage = 'Gagal menyimpan tanaman.';
      if (err.response) {
        // Server merespons dengan status error (misal: 4xx, 5xx)
        // Modifikasi log ini untuk menampilkan detail data respons
        console.error('Data Respons Backend:', JSON.stringify(err.response.data, null, 2)); // Tampilkan isi objek respons
        console.error('Status Respons Backend:', err.response.status);
        // Coba tampilkan pesan error dari backend jika tersedia
        errorMessage = err.response.data?.message || `Gagal menyimpan: Terjadi error di server (Status ${err.response.status})`;
      } else if (err.request) {
        // Request terkirim tapi tidak ada respons diterima
        console.error('Tidak ada respons diterima:', err.request);
        errorMessage = 'Gagal menyimpan: Tidak ada respons dari server. Periksa koneksi atau status server.';
      } else {
        // Error terjadi saat menyiapkan request
        console.error('Error saat menyiapkan request:', err.message);
        errorMessage = `Gagal menyimpan: Terjadi masalah pada request (${err.message})`;
      }
      setError(errorMessage); // Tampilkan pesan error yang lebih spesifik
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tanaman ini?')) {
      try {
        await deletePlant(id);
        fetchPlants();
      } catch (err) {
        setError('Gagal menghapus tanaman');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="loading">Memuat data...</div>;

  return (
    <div className="plants-page">
      <div className="page-header">
        <h1>Koleksi Tanaman Saya</h1>
        <button onClick={handleOpenAddForm} className="btn-add">
          + Tambah Tanaman
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="plants-grid">
        {plants.length === 0 ? (
          <p className="no-plants">Belum ada tanaman. Mulai tambahkan tanaman pertama Anda!</p>
        ) : (
          plants.map(plant => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onEdit={handleOpenEditForm}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {isFormVisible && (
        <Modal onClose={handleCloseForm}>
          <PlantForm
            initialData={editingPlant || {}}
            onSubmit={handleSavePlant}
            onCancel={handleCloseForm}
          />
        </Modal>
      )}
    </div>
  );
}

export default PlantsPage;