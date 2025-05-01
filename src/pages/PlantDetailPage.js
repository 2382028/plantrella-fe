// src/pages/PlantDetailPage.js
import React, { useState, useEffect, useCallback } from 'react';
// --- Hapus useNavigate jika tidak dipakai ---
import { useParams, Link } from 'react-router-dom';
// --- ----------------------------------- ---
import { getPlantById, updatePlant } from '../services/plantService';
import { getAllCareLogs, createCareLog, updateCareLog, deleteCareLog } from '../services/careLogService';
import CareLogForm from '../components/CareLogForm';
import PlantForm from '../components/PlantForm';

function PlantDetailPage() {
  const { id: plantId } = useParams();

  // --- State untuk Detail Tanaman ---
  const [plant, setPlant] = useState(null);
  const [loadingPlant, setLoadingPlant] = useState(true);
  const [errorPlant, setErrorPlant] = useState(null);

  // --- State untuk Care Logs ---
  const [careLogs, setCareLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false); // Loading terpisah untuk logs
  const [errorLogs, setErrorLogs] = useState(null); // Error terpisah untuk logs

  // --- State untuk Form Care Log ---
  const [isLogFormVisible, setIsLogFormVisible] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);

  // --- State untuk Form Edit Plant ---
  const [isPlantFormVisible, setIsPlantFormVisible] = useState(false);
  const [isSubmittingPlant, setIsSubmittingPlant] = useState(false);


  // --- Fungsi Format Tanggal ---
   const formatDate = (dateString) => {
     if (!dateString) return '-';
     try {
       const date = new Date(dateString);
       if (isNaN(date.getTime())) return dateString;
       return date.toLocaleDateString('id-ID', {
         year: 'numeric', month: 'long', day: 'numeric'
       });
     } catch (e) {
       return dateString;
     }
   }

  // --- Fungsi Fetch Detail Tanaman ---
  const fetchPlantDetail = useCallback(async () => {
    if (!plantId) return;
    setLoadingPlant(true);
    setErrorPlant(null);
    try {
      const plantData = await getPlantById(plantId);
      setPlant(plantData);
    } catch (err) {
      setErrorPlant(`Gagal memuat detail tanaman (ID: ${plantId}). Cek ID atau token.`);
      console.error("Error fetching plant detail:", err.response?.data || err.message);
      setPlant(null); // Reset plant jika error
    } finally {
      setLoadingPlant(false);
    }
  }, [plantId]); // Dependensi: plantId

  // --- Fungsi Fetch Care Logs ---
  const fetchCareLogs = useCallback(async () => {
    if (!plantId) return;
    setLoadingLogs(true);
    setErrorLogs(null);
    try {
      const logsData = await getAllCareLogs(plantId); // Panggil API service care log
      setCareLogs(logsData || []); // Set ke array kosong jika null/undefined
    } catch (err) {
      setErrorLogs('Gagal memuat riwayat perawatan.');
      console.error("Error fetching care logs:", err.response?.data || err.message);
    } finally {
      setLoadingLogs(false);
    }
  }, [plantId]); // Dependensi: plantId

  // --- useEffect untuk Fetch Data Awal ---
  useEffect(() => {
    fetchPlantDetail(); // Panggil fetch detail plant
    fetchCareLogs();    // Panggil fetch care logs
  }, [fetchPlantDetail, fetchCareLogs]); // Panggil ulang jika fungsi fetch berubah (karena plantId berubah)

  // --- Handler untuk Form Edit Plant ---
  const handleOpenEditPlantForm = () => {
    setErrorPlant(null); // Reset error plant saat buka form
    setIsPlantFormVisible(true);
  };
  const handleCloseEditPlantForm = () => {
    setIsPlantFormVisible(false);
  };
  const handleSavePlant = async (formData) => {
    if (!plant) return;
    setIsSubmittingPlant(true);
    setErrorPlant(null);
    try {
      await updatePlant(plant.id, formData);
      alert('Detail tanaman berhasil diperbarui!');
      handleCloseEditPlantForm();
      fetchPlantDetail(); // Ambil ulang data plant terbaru
    } catch (err) {
      setErrorPlant(err.response?.data?.message || 'Gagal menyimpan perubahan tanaman.');
      console.error(err);
    } finally {
      setIsSubmittingPlant(false);
    }
  };

  // --- Handler untuk Form Care Log ---
  const handleOpenAddLogForm = () => {
    setEditingLog(null);
    setIsLogFormVisible(true);
    setErrorLogs(null);
  };
  const handleOpenEditLogForm = (log) => {
    setEditingLog(log);
    setIsLogFormVisible(true);
    setErrorLogs(null);
  };
  const handleCloseLogForm = () => {
    setIsLogFormVisible(false);
    setEditingLog(null);
  };
  const handleSaveLog = async (formData) => {
    if (!plantId) return;
    setIsSubmittingLog(true);
    setErrorLogs(null);
    try {
      if (editingLog) {
        await updateCareLog(plantId, editingLog.id, formData);
        alert('Catatan perawatan berhasil diperbarui!');
      } else {
        await createCareLog(plantId, formData);
        alert('Catatan perawatan baru berhasil ditambahkan!');
      }
      handleCloseLogForm();
      fetchCareLogs(); // Ambil ulang data log terbaru
    } catch (err) {
      setErrorLogs(err.response?.data?.message || 'Gagal menyimpan catatan perawatan.');
      console.error(err);
    } finally {
      setIsSubmittingLog(false);
    }
  };
  const handleDeleteLog = async (logId) => {
      if (!plantId) return;
      if (window.confirm(`Yakin hapus log perawatan ini (ID: ${logId})?`)) {
          setErrorLogs(null);
          try {
              await deleteCareLog(plantId, logId);
              alert('Catatan perawatan berhasil dihapus.');
              fetchCareLogs(); // Ambil ulang data log terbaru
          } catch (err) {
              setErrorLogs(err.response?.data?.message || 'Gagal menghapus log');
              console.error(err);
          }
      }
   };


  // --- Render Kondisional ---
  if (loadingPlant) return <p>Memuat detail tanaman...</p>;
  if (errorPlant) return <p style={{ color: 'red' }}>Error: {errorPlant}</p>;
  if (!plant) return <p>Tanaman tidak ditemukan atau Anda tidak memiliki akses.</p>;


  // --- Render Utama ---
  return (
    <div>
      <Link to="/plants" style={{ marginBottom: '20px', display: 'inline-block' }}>
        ← Kembali ke Koleksi
      </Link>

      <h1>{plant.name}</h1>

      {/* --- Form Edit Plant (Muncul jika isPlantFormVisible true) --- */}
      {isPlantFormVisible && (
          <div className="plant-form-container" style={{ border: '1px solid #eee', padding: '20px', marginBottom: '20px', backgroundColor:'#f9f9f9' }}>
              <PlantForm
                  onSubmit={handleSavePlant}
                  initialData={plant} // Kirim data plant saat ini
                  onCancel={handleCloseEditPlantForm}
                  isLoading={isSubmittingPlant}
              />
              {/* Error untuk form plant bisa ditampilkan di sini jika perlu */}
          </div>
      )}

      {/* --- Tampilkan Detail jika form edit TIDAK visible --- */}
      {!isPlantFormVisible && (
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
              <div style={{ flexBasis: '200px', height: '200px', backgroundColor: '#e0e0e0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  (Image Placeholder)
              </div>
              <div style={{ flexGrow: 1 }}>
                  <p><strong>Spesies:</strong> {plant.species || '-'}</p>
                  {/* Idealnya fetch nama lokasi, untuk sementara tampilkan ID */}
                  <p><strong>Lokasi:</strong> {plant.locationId ? `ID Lokasi ${plant.locationId}` : 'Belum ditentukan'}</p>
                  <p><strong>Tanggal Ditambahkan:</strong> {formatDate(plant.date_added)}</p>
                  <p><strong>Catatan:</strong></p>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{plant.notes || '-'}</p>
                  <button onClick={handleOpenEditPlantForm} style={{marginTop: '10px'}}>
                      Edit Detail
                  </button>
              </div>
          </div>
      )}

      <hr />

      <h2>Riwayat Perawatan</h2>
      <button onClick={handleOpenAddLogForm} disabled={isLogFormVisible} style={{ marginBottom: '15px' }}>
        + Tambah Catatan Perawatan
      </button>

      {/* Form Care Log (Muncul jika isLogFormVisible true) */}
      {isLogFormVisible && (
        <div className="log-form-container" style={{ border: '1px solid #eee', padding: '15px', marginBottom: '15px', backgroundColor:'#f9f9f9' }}>
          <CareLogForm
            onSubmit={handleSaveLog}
            initialData={editingLog || {}} // Kirim data log jika edit
            onCancel={handleCloseLogForm}
            isLoading={isSubmittingLog}
          />
          {errorLogs && <p style={{ color: 'red', marginTop: '10px' }}>Error: {errorLogs}</p>}
        </div>
      )}

      {/* Tabel/List Care Logs */}
      {loadingLogs && <p>Memuat riwayat perawatan...</p>}
      {!loadingLogs && errorLogs && <p style={{ color: 'red' }}>Error: {errorLogs}</p>}
      {!loadingLogs && !errorLogs && careLogs.length === 0 && (
          <p>Belum ada riwayat perawatan.</p>
      )}
      {!loadingLogs && !errorLogs && careLogs.length > 0 && (
        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{borderBottom: '1px solid #ddd'}}>
              <th style={{textAlign: 'left', padding: '8px'}}>Tanggal</th>
              <th style={{textAlign: 'left', padding: '8px'}}>Jenis Perawatan</th>
              <th style={{textAlign: 'left', padding: '8px'}}>Catatan</th>
              <th style={{textAlign: 'left', padding: '8px'}}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {careLogs.map(log => (
              <tr key={log.id} style={{borderBottom: '1px solid #eee'}}>
                <td style={{padding: '8px'}}>{formatDate(log.logDate)}</td>
                <td style={{padding: '8px'}}>{log.careType}</td>
                <td style={{padding: '8px'}}>{log.note || '-'}</td>
                <td style={{padding: '8px'}}>
                  <button onClick={() => handleOpenEditLogForm(log)} style={{ marginRight: '5px', fontSize: '0.9em' }}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    style={{ color: 'red', fontSize: '0.9em' }}
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
  );
}

export default PlantDetailPage;