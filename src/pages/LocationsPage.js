// src/pages/LocationsPage.js
import React, { useState, useEffect, useCallback } from 'react'; // <<< Tambahkan useCallback
// --- Impor semua fungsi service yang akan dipakai ---
import { getAllLocations, createLocation, updateLocation, deleteLocation } from '../services/locationsService';
import LocationForm from '../components/LocationForm'; // Asumsi path benar
// import './LocationsPage.css'; // Aktifkan jika ada styling

function LocationsPage() {
  // --- State ---
  const [locations, setLocations] = useState([]); // Menyimpan daftar lokasi
  const [loading, setLoading] = useState(true);   // Status loading data awal
  const [error, setError] = useState(null);       // Pesan error fetch/simpan
  const [isFormVisible, setIsFormVisible] = useState(false); // Kontrol tampil form
  const [editingLocation, setEditingLocation] = useState(null); // Data lokasi yg diedit
  const [isSubmitting, setIsSubmitting] = useState(false); // Status loading saat simpan

  // --- Fungsi Fetch Data (gunakan useCallback) ---
  const fetchLocations = useCallback(async () => {
    setLoading(true); // <<< Gunakan setLoading
    setError(null);
    try {
      // Panggil fungsi dari service
      const response = await getAllLocations();
      // Pastikan response.data ada dan berupa array
      setLocations(response?.data || []); // <<< Gunakan setLocations
    } catch (err) {
      setError('Gagal memuat data lokasi');
      console.error("Error fetching locations:", err.response?.data || err.message);
    } finally {
      setLoading(false); // <<< Gunakan setLoading
    }
  }, []); // Array dependensi kosong, hanya jalan sekali

  // --- useEffect untuk memanggil fetch data saat komponen mount ---
  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]); // Masukkan fetchLocations ke dependensi

  // --- Handler Form ---
  const handleOpenAddForm = () => {
    setEditingLocation(null);
    setIsFormVisible(true);
    setError(null);
  };

  const handleOpenEditForm = (location) => {
    setEditingLocation(location);
    setIsFormVisible(true);
    setError(null);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEditingLocation(null);
  };

  const handleSaveLocation = async (locationData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingLocation) {
        // Panggil fungsi update dari service
        await updateLocation(editingLocation.id, locationData);
        alert('Lokasi berhasil diperbarui!');
      } else {
        // Panggil fungsi create dari service
        await createLocation(locationData);
        alert('Lokasi baru berhasil ditambahkan!');
      }
      handleCloseForm();
      fetchLocations(); // Panggil fungsi fetch lagi untuk refresh
    } catch (err) {
      // Tampilkan pesan error spesifik dari backend jika ada
      setError(err.response?.data?.message || 'Gagal menyimpan lokasi');
      console.error("Error saving location:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Handler Delete ---
  const handleDelete = async (id) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus lokasi ini (ID: ${id})?`)) {
      setError(null);
      try {
        // Panggil fungsi delete dari service
        await deleteLocation(id);
        alert('Lokasi berhasil dihapus.');
        fetchLocations(); // Panggil fungsi fetch lagi untuk refresh
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menghapus lokasi');
        console.error("Error deleting location:", err.response?.data || err.message);
      }
    }
  };

  // --- Render ---
  return (
    <div className="locations-page">
      <div className="page-header">
        <h1>Lokasi Penyimpanan</h1>
        <button onClick={handleOpenAddForm} className="btn-add" disabled={isFormVisible || loading}>
          Tambah Lokasi
        </button>
      </div>

      {/* Form Tambah/Edit */}
      {isFormVisible && (
        <div style={{ border: '1px solid #eee', padding: '20px', marginBottom: '20px', backgroundColor:'#f9f9f9' }}>
          <LocationForm
            initialData={editingLocation || {}}
            onSubmit={handleSaveLocation}
            onCancel={handleCloseForm}
            isLoading={isSubmitting} // Kirim state loading ke form
          />
          {/* Tampilkan error spesifik saat simpan */}
          {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
        </div>
      )}

      {/* Tampilan Loading atau Error Fetch Awal */}
      {loading && <p>Memuat data lokasi...</p>}
      {!loading && error && !isFormVisible && <p className="error" style={{ color: 'red' }}>Error: {error}</p>}

      {/* Daftar Lokasi */}
      {!loading && !error && !isFormVisible && (
        <div className="locations-list">
          {locations.length === 0 ? (
            <p>Belum ada lokasi tersimpan.</p>
          ) : (
            <table className="locations-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Nama Lokasi</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Catatan</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((location) => (
                  <tr key={location.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>{location.name}</td>
                    <td style={{ padding: '8px' }}>{location.notes || '-'}</td>
                    <td className="actions" style={{ padding: '8px' }}>
                      <button
                        onClick={() => handleOpenEditForm(location)}
                        className="btn-edit"
                        disabled={isSubmitting}
                        style={{ marginRight: '5px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(location.id)} // Panggil handleDelete
                        className="btn-delete"
                        disabled={isSubmitting}
                        style={{ color: 'red' }}
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

export default LocationsPage;