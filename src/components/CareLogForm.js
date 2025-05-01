import React, { useState, useEffect } from 'react';
import './CareLogForm.css';

function CareLogForm({ onSubmit, initialData = {}, onCancel, isLoading = false }) {
    const [formData, setFormData] = useState({
        careType: '',
        logDate: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
        note: ''
    });

    useEffect(() => {
        if (initialData.id) {
            setFormData({
                careType: initialData.careType || '',
                logDate: initialData.logDate ? new Date(initialData.logDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                note: initialData.note || ''
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="care-log-form-container">
            <form onSubmit={handleSubmit} className="care-log-form">
                <h3>{initialData.id ? 'Edit Catatan Perawatan' : 'Tambah Catatan Perawatan'}</h3>
                
                <div className="form-group">
                    <label htmlFor="careType">Jenis Perawatan *</label>
                    <input
                        type="text"
                        id="careType"
                        value={formData.careType}
                        onChange={(e) => setFormData({ ...formData, careType: e.target.value })}
                        placeholder="Contoh: Penyiraman, Pemupukan"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="logDate">Tanggal Perawatan *</label>
                    <input
                        type="date"
                        id="logDate"
                        value={formData.logDate}
                        onChange={(e) => setFormData({ ...formData, logDate: e.target.value })}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="note">Catatan</label>
                    <textarea
                        id="note"
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        placeholder="Tambahkan catatan detail perawatan (opsional)"
                        disabled={isLoading}
                        rows="3"
                    />
                </div>

                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="btn-submit" 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button 
                        type="button" 
                        className="btn-cancel" 
                        onClick={onCancel} 
                        disabled={isLoading}
                    >
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CareLogForm;