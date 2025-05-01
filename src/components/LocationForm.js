import React, { useState, useEffect } from 'react';

function LocationForm({ location, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    notes: ''
  });

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name || '',
        notes: location.notes || ''
      });
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="location-form">
      <div className="form-group">
        <label htmlFor="name">Nama Lokasi</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="notes">Catatan</label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary">Simpan</button>
        <button type="button" onClick={onCancel} className="btn-secondary">Batal</button>
      </div>
    </form>
  );
}

export default LocationForm;