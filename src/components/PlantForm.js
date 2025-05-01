import React, { useState, useEffect } from 'react';
import './PlantForm.css';

function PlantForm({ onSubmit, onCancel, initialData = {} }) {
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    location: '',
    imageUrl: '',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        species: initialData.species || '',
        location: initialData.location || '',
        imageUrl: initialData.imageUrl || '',
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="plant-form" onSubmit={handleSubmit}>
      <h2>{initialData.id ? 'Edit Tanaman' : 'Tambah Tanaman Baru'}</h2>
      
      <div className="form-group">
        <label htmlFor="name">Nama Tanaman *</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="species">Spesies</label>
        <input
          type="text"
          id="species"
          value={formData.species}
          onChange={(e) => setFormData({...formData, species: e.target.value})}
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">Lokasi</label>
        <input
          type="text"
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
        />
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">URL Gambar</label>
        <input
          type="url"
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Catatan</label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Batal
        </button>
        <button type="submit" className="btn-submit">
          {initialData.id ? 'Simpan Perubahan' : 'Tambah Tanaman'}
        </button>
      </div>
    </form>
  );
}

export default PlantForm;