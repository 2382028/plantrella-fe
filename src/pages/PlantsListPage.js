import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPlants, createPlant, updatePlant, deletePlant } from '../services/plantService';
import PlantForm from '../components/PlantForm';
import Modal from '../components/Modal';
import './PlantsListPage.css';

const PlantCard = ({ plant, onEdit, onDelete }) => {
  const navigate = useNavigate();
  
  return (
    <div className="plant-card">
      <div className="plant-image">
        {plant.imageUrl ? (
          <img src={plant.imageUrl} alt={plant.name} />
        ) : (
          <div className="image-placeholder">🌿</div>
        )}
      </div>
      <div className="plant-info">
        <h3>{plant.name}</h3>
        <p className="species">{plant.species || 'Spesies tidak diketahui'}</p>
        <p className="location">Lokasi: {plant.location?.name || 'Belum ditentukan'}</p>
      </div>
      <div className="plant-actions">
        <button 
          className="btn-detail"
          onClick={() => navigate(`/plants/${plant.id}`)}
        >
          Lihat Detail
        </button>
        <button 
          className="btn-edit"
          onClick={() => onEdit(plant)}
        >
          Edit
        </button>
        <button 
          className="btn-delete"
          onClick={() => onDelete(plant.id)}
        >
          Hapus
        </button>
      </div>
    </div>
  );
};

function PlantsListPage() {
  const [plants, setPlants] = useState([]);  // Inisialisasi dengan array kosong
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
      const data = await getAllPlants();
      setPlants(data || []); // Pastikan selalu array, bahkan jika data null/undefined
    } catch (err) {
      setError('Gagal memuat data tanaman');
      console.error(err);
      setPlants([]); // Set plants ke array kosong jika terjadi error
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
  };

  const handleSavePlant = async (formData) => {
    try {
      if (editingPlant) {
        await updatePlant(editingPlant.id, formData);
      } else {
        await createPlant(formData);
      }
      handleCloseForm();
      fetchPlants();
    } catch (err) {
      setError('Gagal menyimpan tanaman');
      console.error(err);
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
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="plants-list-page">
      <div className="page-header">
        <h1>Koleksi Tanaman Saya</h1>
        <button 
          className="btn-add"
          onClick={handleOpenAddForm}
        >
          + Tambah Tanaman Baru
        </button>
      </div>

      <div className="plants-grid">
        {plants && plants.length === 0 ? (  // Tambahkan pengecekan plants
          <p className="no-plants">Belum ada tanaman. Mulai tambahkan tanaman pertama Anda!</p>
        ) : (
          plants && plants.map(plant => (  // Tambahkan pengecekan plants
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
        <Modal
          isOpen={isFormVisible}
          onClose={handleCloseForm}
          title={editingPlant ? 'Edit Tanaman' : 'Tambah Tanaman Baru'}
        >
          <PlantForm
            initialData={editingPlant}
            onSubmit={handleSavePlant}
            onCancel={handleCloseForm}
          />
        </Modal>
      )}
    </div>
  );
}

export default PlantsListPage;