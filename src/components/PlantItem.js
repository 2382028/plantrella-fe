import React from 'react';
import { Link } from 'react-router-dom';
import './PlantItem.css';

function PlantItem({ plant, onEdit, onDelete }) {
    return (
        <div className="plant-item">
            <div className="plant-image-placeholder">
                (Image Placeholder)
            </div>
            <h3>{plant.name}</h3>
            <p className="plant-species">{plant.species || 'Spesies tidak diketahui'}</p>
            <p className="plant-location">
                Lokasi: {plant.locationId ? `ID ${plant.locationId}` : 'Belum ditentukan'}
            </p>
            <div className="plant-actions">
                <Link to={`/plants/${plant.id}`} className="action-link">
                    Lihat Detail
                </Link>
                <button onClick={() => onEdit(plant)} className="action-button edit">
                    Edit
                </button>
                <button onClick={() => onDelete(plant.id)} className="action-button delete">
                    Hapus
                </button>
            </div>
        </div>
    );
}

export default PlantItem;