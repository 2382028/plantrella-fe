import React, { useState, useEffect } from "react";
import "./LocationForm.css";

function LocationForm({
  onSubmit,
  onCancel,
  initialData = {},
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    notes: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        notes: initialData.notes || "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="location-form" onSubmit={handleSubmit}>
      <h2>{initialData.id ? "Edit Lokasi" : "Tambah Lokasi Baru"}</h2>

      <div className="form-group">
        <label htmlFor="name">Nama Lokasi *</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Catatan</label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          disabled={isLoading}
          rows="3"
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn-cancel"
          disabled={isLoading}
        >
          Batal
        </button>
        <button type="submit" className="btn-submit" disabled={isLoading}>
          {isLoading
            ? "Menyimpan..."
            : initialData.id
            ? "Simpan Perubahan"
            : "Tambah Lokasi"}
        </button>
      </div>
    </form>
  );
}

export default LocationForm;
