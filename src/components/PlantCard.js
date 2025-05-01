import React from 'react';
import { Link } from 'react-router-dom';
import './PlantCard.css';

function PlantCard({ plant, onEdit, onDelete }) {
  return (
    <div className="plant-card">
      <div className="plant-image">
        {plant.imageUrl ? (
          <img src={plant.imageUrl} alt={plant.name} />
        ) : (
          <div className="plant-icon">🌿</div>
        )}
      </div>
      <h3 className="plant-name">{plant.name}</h3>
      <p className="plant-species">{plant.species}</p>
      <p className="plant-location">Lokasi: {plant.location}</p>
      <div className="plant-actions">
        <Link to={`/plants/${plant.id}`} className="action-link">
          Lihat Detail
        </Link>
        <button 
          className="action-edit"
          onClick={() => onEdit(plant)}
        >
          Edit
        </button>
        <button 
          className="action-delete"
          onClick={() => {
            if (window.confirm('Apakah Anda yakin ingin menghapus tanaman ini?')) {
              onDelete(plant.id);
            }
          }}
        >
          Hapus
        </button>
      </div>
    </div>
  );
}

export default PlantCard;