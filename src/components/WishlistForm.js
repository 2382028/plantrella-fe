import React, { useState, useEffect } from 'react';

function WishlistForm({ onSubmit, initialData = {}, onCancel, isLoading = false }) {
    const [formData, setFormData] = useState({
        plantName: '',
        notes: '',
        sourceIdea: ''
    });

    useEffect(() => {
        if (initialData.id) {
            setFormData({
                plantName: initialData.plantName || '',
                notes: initialData.notes || '',
                sourceIdea: initialData.sourceIdea || ''
            });
        } else {
            setFormData({
                plantName: '',
                notes: '',
                sourceIdea: ''
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>{initialData.id ? 'Edit Wishlist' : 'Tambah Wishlist Baru'}</h3>
            <div>
                <label htmlFor="plantName">Nama Tanaman *</label>
                <input
                    type="text"
                    id="plantName"
                    value={formData.plantName}
                    onChange={(e) => setFormData({ ...formData, plantName: e.target.value })}
                    required
                    disabled={isLoading}
                />
            </div>
            <div>
                <label htmlFor="sourceIdea">Sumber Ide</label>
                <input
                    type="text"
                    id="sourceIdea"
                    value={formData.sourceIdea}
                    onChange={(e) => setFormData({ ...formData, sourceIdea: e.target.value })}
                    disabled={isLoading}
                />
            </div>
            <div>
                <label htmlFor="notes">Catatan</label>
                <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    disabled={isLoading}
                    rows="3"
                />
            </div>
            <div style={{ marginTop: '15px' }}>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button type="button" onClick={onCancel} disabled={isLoading} style={{ marginLeft: '10px' }}>
                    Batal
                </button>
            </div>
        </form>
    );
}

export default WishlistForm;