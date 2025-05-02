import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllPlants,
  createPlant,
  updatePlant,
  deletePlant,
} from "../services/plantService";
import { getAllLocations } from "../services/locationService";
import PlantCard from "../components/PlantCard";
import PlantForm from "../components/PlantForm";
import Modal from "../components/Modal";
import "../styles/global.css";

function PlantsPage() {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPlants();
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const locationsData = await getAllLocations();
      setLocations(Array.isArray(locationsData.data) ? locationsData.data : []);
      console.log("locationsData ==>", locationsData.data.data);
    } catch (err) {
      console.error("Gagal memuat data lokasi:", err);
    }
  };

  const fetchPlants = async () => {
    setLoading(true);
    setError(null);
    try {
      const plantsData = await getAllPlants();
      setPlants(Array.isArray(plantsData) ? plantsData : []);
    } catch (err) {
      console.error("Error fetching plants:", err);
      setError("Gagal memuat data tanaman");
      setPlants([]);
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
    setError(null);
    setIsSubmitting(true);
    try {
      const dataToSend = {
        name: plantData.name,
        species: plantData.species,
        notes: plantData.notes,
        locationId: Number(plantData.locationId)
          ? parseInt(plantData.locationId)
          : null,
      };

      let response;
      if (editingPlant) {
        response = await updatePlant(editingPlant.id, dataToSend);
        console.log("Tanaman berhasil diperbarui:", response);
      } else {
        response = await createPlant(dataToSend);
        console.log("Tanaman berhasil dibuat:", response);
      }

      handleCloseForm();
      fetchPlants();
    } catch (err) {
      console.error("Terjadi error saat menyimpan tanaman:", err);
      let errorMessage = "Gagal menyimpan tanaman.";
      if (err.response && err.response.data && err.response.data.message) {
        if (Array.isArray(err.response.data.message)) {
          errorMessage = err.response.data.message.join(", ");
        } else {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus tanaman ini?")) {
      setError(null);
      try {
        await deletePlant(id);
        fetchPlants();
      } catch (err) {
        console.error("Gagal menghapus tanaman:", err);
        let errorMessage = "Gagal menghapus tanaman.";
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      }
    }
  };

  if (loading) return <div className="loading">Memuat data...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Daftar Tanaman</h1>
        <button className="btn btn-primary" onClick={handleOpenAddForm}>
          Tambah Tanaman
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="plants-grid">
        {plants.length === 0 ? (
          <p className="no-plants">
            Belum ada tanaman. Mulai tambahkan tanaman pertama Anda!
          </p>
        ) : (
          plants.map((plant) => (
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
            isLoading={isSubmitting}
            apiError={error}
            locations={locations}
          />
          {error && !isSubmitting && (
            <p
              style={{
                color: "red",
                marginTop: "10px",
                whiteSpace: "pre-wrap",
              }}
            >
              Error: {error}
            </p>
          )}
        </Modal>
      )}
    </div>
  );
}

export default PlantsPage;
