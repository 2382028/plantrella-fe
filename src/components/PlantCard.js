import React from "react";
import { useNavigate } from "react-router-dom";
import "./PlantCard.css";

const PlantCard = ({ plant, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="plant-card">
      <div className="plant-image">
        {plant.photo_url ? (
          <img src={plant.photo_url} alt={plant.name} />
        ) : (
          <div className="plant-icon">🌿</div>
        )}
      </div>
      <div className="plant-info">
        <h3 className="plant-name">{plant.name}</h3>
        <p className="plant-species">
          {plant.species || "Spesies tidak diketahui"}
        </p>
        <p className="plant-location">
          Lokasi: {plant.location?.name || "Belum ditentukan"}
        </p>
      </div>
      <div className="plant-actions">
        <button
          className="btn-detail"
          onClick={() => navigate(`/plants/${plant.id}`)}
        >
          Lihat Detail
        </button>
        <button className="btn-edit" onClick={() => onEdit(plant)}>
          Edit
        </button>
        <button className="btn-delete" onClick={() => onDelete(plant.id)}>
          Hapus
        </button>
      </div>
    </div>
  );
};

export default PlantCard;
