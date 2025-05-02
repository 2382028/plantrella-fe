import React, { useState, useEffect } from "react";
import "./PlantForm.css";

function PlantForm({
  onSubmit,
  onCancel,
  initialData = {},
  isLoading = false,
  locations = [],
}) {
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    locationId: "",
    notes: "",
    photo_url: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        species: initialData.species || "",
        locationId: initialData.locationId
          ? Number(initialData.locationId)
          : "",
        notes: initialData.notes || "",
        photo_url: initialData.photo_url || "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSubmit = {
      ...formData,
      locationId: formData.locationId ? Number(formData.locationId) : null,
    };
    onSubmit(formDataToSubmit);
  };

  return (
    <form className="plant-form" onSubmit={handleSubmit}>
      <h2>{initialData.id ? "Edit Tanaman" : "Tambah Tanaman Baru"}</h2>

      <div className="form-group">
        <label htmlFor="name">Nama Tanaman *</label>
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
        <label htmlFor="species">Spesies</label>
        <input
          type="text"
          id="species"
          value={formData.species}
          onChange={(e) =>
            setFormData({ ...formData, species: e.target.value })
          }
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="photo_url">URL Foto</label>
        <input
          type="text"
          id="photo_url"
          value={formData.photo_url}
          onChange={(e) =>
            setFormData({ ...formData, photo_url: e.target.value })
          }
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="locationId">Lokasi *</label>
        <select
          id="locationId"
          value={formData.locationId}
          onChange={(e) =>
            setFormData({
              ...formData,
              locationId: e.target.value ? Number(e.target.value) : "",
            })
          }
          required
          disabled={isLoading}
        >
          <option value="">Pilih Lokasi</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
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
            : "Tambah Tanaman"}
        </button>
      </div>
    </form>
  );
}

export default PlantForm;
