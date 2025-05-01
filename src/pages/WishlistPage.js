import React, { useState, useEffect } from 'react';
import { getAllWishlistItems, createWishlistItem, updateWishlistItem, deleteWishlistItem } from '../services/wishlistService';
import WishlistForm from '../components/WishlistForm';

function WishlistPage() {
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
            setError('Gagal memuat daftar wishlist.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Yakin ingin menghapus item ini dari wishlist?')) {
            try {
                await deleteWishlistItem(id);
                await fetchWishlist();
            } catch (err) {
                setError('Gagal menghapus item.');
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
            setError('Gagal menyimpan item wishlist.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Wishlist Tanaman</h1>
            <button onClick={handleOpenAddForm} disabled={isFormVisible}>
                + Tambah Wishlist Baru
            </button>

            {isFormVisible && (
                <div style={{ marginTop: '20px', marginBottom: '20px', padding: '20px', border: '1px solid #ddd' }}>
                    <WishlistForm
                        onSubmit={handleSaveItem}
                        initialData={editingItem || {}}
                        onCancel={handleCloseForm}
                        isLoading={isSubmitting}
                    />
                </div>
            )}

            {loading && <p>Memuat wishlist...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <div style={{ marginTop: '20px' }}>
                    {wishlistItems.length === 0 ? (
                        <p>Belum ada item dalam wishlist.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th>Nama Tanaman</th>
                                    <th>Sumber Ide</th>
                                    <th>Catatan</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wishlistItems.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.plantName}</td>
                                        <td>{item.sourceIdea || '-'}</td>
                                        <td>{item.notes || '-'}</td>
                                        <td>
                                            <button onClick={() => handleOpenEditForm(item)}>
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                style={{ marginLeft: '10px', color: 'red' }}
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

export default WishlistPage;