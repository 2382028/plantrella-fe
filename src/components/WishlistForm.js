import React, { useState, useEffect } from "react";
import "./WishlistForm.css";

function WishlistForm({
  onSubmit,
  onCancel,
  initialData = {},
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    plantName: "",
    notes: "",
    sourceIdea: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        plantName: initialData.plantName || "",
        notes: initialData.notes || "",
        sourceIdea: initialData.sourceIdea || "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="wishlist-form" onSubmit={handleSubmit}>
      <h2>{initialData.id ? "Edit Wishlist" : "Tambah Wishlist Baru"}</h2>

      <div className="form-group">
        <label htmlFor="plantName">Nama Tanaman *</label>
        <input
          type="text"
          id="plantName"
          value={formData.plantName}
          onChange={(e) =>
            setFormData({ ...formData, plantName: e.target.value })
          }
          required
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="sourceIdea">Sumber Ide</label>
        <input
          type="text"
          id="sourceIdea"
          value={formData.sourceIdea}
          onChange={(e) =>
            setFormData({ ...formData, sourceIdea: e.target.value })
          }
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
            : "Tambah Wishlist"}
        </button>
      </div>
    </form>
  );
}

export default WishlistForm;
