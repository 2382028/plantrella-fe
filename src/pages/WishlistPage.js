import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllWishlistItems,
  createWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
} from "../services/wishlistService";
import WishlistForm from "../components/WishlistForm";
import "../styles/global.css";

function WishlistPage() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllWishlistItems();
      setWishlistItems(response.data);
    } catch (err) {
      setError("Gagal memuat daftar wishlist.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus item ini dari wishlist?")) {
      try {
        await deleteWishlistItem(id);
        await fetchWishlist();
      } catch (err) {
        setError("Gagal menghapus item.");
        console.error(err);
      }
    }
  };

  const handleOpenAddForm = () => {
    setEditingItem(null);
    setIsFormVisible(true);
  };

  const handleOpenEditForm = (item) => {
    setEditingItem(item);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEditingItem(null);
  };

  const handleSaveItem = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingItem?.id) {
        await updateWishlistItem(editingItem.id, formData);
      } else {
        await createWishlistItem(formData);
      }
      handleCloseForm();
      await fetchWishlist();
    } catch (err) {
      setError("Gagal menyimpan item wishlist.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Memuat data...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Daftar Wishlist</h1>
        <button
          className="btn btn-primary"
          onClick={handleOpenAddForm}
          disabled={isFormVisible}
        >
          Tambah Wishlist
        </button>
      </div>

      {isFormVisible && (
        <div className="card">
          <WishlistForm
            onSubmit={handleSaveItem}
            initialData={editingItem || {}}
            onCancel={handleCloseForm}
            isLoading={isSubmitting}
          />
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Nama Tanaman</th>
            <th>Sumber Ide</th>
            <th>Catatan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {wishlistItems.length === 0 ? (
            <tr>
              <td colSpan="4">Belum ada item dalam wishlist.</td>
            </tr>
          ) : (
            wishlistItems.map((item) => (
              <tr key={item.id}>
                <td>{item.plantName}</td>
                <td>{item.sourceIdea || "-"}</td>
                <td>{item.notes || "-"}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleOpenEditForm(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default WishlistPage;
