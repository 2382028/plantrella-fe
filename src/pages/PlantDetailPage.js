// src/pages/PlantDetailPage.js
import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPlantById, updatePlant } from "../services/plantService";
import { getAllLocations } from "../services/locationsService";
import {
  getPlantCareLogs,
  createCareLog,
  updateCareLog,
  deleteCareLog,
  getAllCareLogs,
} from "../services/careLogService";
import CareLogForm from "../components/CareLogForm";
import PlantForm from "../components/PlantForm";
import "../styles/global.css";

function PlantDetailPage() {
  const { id: plantId } = useParams();
  const navigate = useNavigate();

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

  // --- State untuk Lokasi ---
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [errorLocations, setErrorLocations] = useState(null);

  // --- Fungsi Format Tanggal ---
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // --- Fungsi Fetch Detail Tanaman ---
  const fetchPlantDetail = useCallback(async () => {
    if (!plantId) return;
    setLoadingPlant(true);
    setErrorPlant(null);
    try {
      const [plantResponse, careLogsResponse] = await Promise.all([
        getPlantById(plantId),
        getAllCareLogs(plantId),
      ]);
      setPlant(plantResponse);
      setCareLogs(Array.isArray(careLogsResponse) ? careLogsResponse : []);
    } catch (err) {
      setErrorPlant(
        `Gagal memuat detail tanaman (ID: ${plantId}). Cek ID atau token.`
      );
      console.error(
        "Error fetching plant detail:",
        err.response?.data || err.message
      );
      setPlant(null); // Reset plant jika error
    } finally {
      setLoadingPlant(false);
    }
  }, [plantId]); // Dependensi: plantId

  // --- Fungsi Fetch Lokasi ---
  const fetchLocations = useCallback(async () => {
    setLoadingLocations(true);
    setErrorLocations(null);
    try {
      const response = await getAllLocations();
      const locationsData = response.data || [];
      setLocations(Array.isArray(locationsData) ? locationsData : []);
    } catch (err) {
      setErrorLocations("Gagal memuat data lokasi");
      console.error(
        "Error fetching locations:",
        err.response?.data || err.message
      );
    } finally {
      setLoadingLocations(false);
    }
  }, []);

  // --- useEffect untuk Fetch Data Awal ---
  useEffect(() => {
    fetchPlantDetail(); // Panggil fetch detail plant
    fetchLocations();
  }, [fetchPlantDetail, fetchLocations]); // Panggil ulang jika fungsi fetch berubah (karena plantId berubah)

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
      alert("Detail tanaman berhasil diperbarui!");
      handleCloseEditPlantForm();
      fetchPlantDetail(); // Ambil ulang data plant terbaru
    } catch (err) {
      setErrorPlant(
        err.response?.data?.message || "Gagal menyimpan perubahan tanaman."
      );
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
        alert("Catatan perawatan berhasil diperbarui!");
      } else {
        await createCareLog(plantId, formData);
        alert("Catatan perawatan baru berhasil ditambahkan!");
      }
      handleCloseLogForm();
      fetchPlantDetail(); // Ambil ulang data log terbaru
    } catch (err) {
      setErrorLogs(
        err.response?.data?.message || "Gagal menyimpan catatan perawatan."
      );
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
        alert("Catatan perawatan berhasil dihapus.");
        fetchPlantDetail(); // Ambil ulang data log terbaru
      } catch (err) {
        setErrorLogs(err.response?.data?.message || "Gagal menghapus log");
        console.error(err);
      }
    }
  };

  // --- Render Kondisional ---
  if (loadingPlant) return <div className="loading">Memuat data...</div>;
  if (errorPlant) return <div className="error-message">{errorPlant}</div>;
  if (!plant)
    return (
      <div className="error-message">
        Tanaman tidak ditemukan atau Anda tidak memiliki akses.
      </div>
    );

  // --- Render Utama ---
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Detail Tanaman</h1>
        <button
          className="btn btn-primary"
          onClick={() => setIsPlantFormVisible(true)}
        >
          Edit Tanaman
        </button>
      </div>

      {/* --- Form Edit Plant (Muncul jika isPlantFormVisible true) --- */}
      {isPlantFormVisible && (
        <div className="card">
          <PlantForm
            onSubmit={handleSavePlant}
            initialData={plant}
            onCancel={handleCloseEditPlantForm}
            isLoading={isSubmittingPlant}
            locations={locations}
          />
          {errorLocations && <p className="error-message">{errorLocations}</p>}
        </div>
      )}

      {/* --- Tampilkan Detail jika form edit TIDAK visible --- */}
      {!isPlantFormVisible && (
        <div className="card">
          <h2>Informasi Tanaman</h2>
          <p>
            <strong>Nama:</strong> {plant.name}
          </p>
          <p>
            <strong>Spesies:</strong> {plant.species || "-"}
          </p>
          <p>
            <strong>Lokasi:</strong>{" "}
            {plant.locationId
              ? locations.find((loc) => loc.id === plant.locationId)?.name ||
                `ID Lokasi ${plant.locationId}`
              : "Belum ditentukan"}
          </p>
          <p>
            <strong>Tanggal Ditambahkan:</strong> {formatDate(plant.date_added)}
          </p>
          <p>
            <strong>Catatan:</strong>
          </p>
          <p style={{ whiteSpace: "pre-wrap" }}>{plant.notes || "-"}</p>
          <button
            onClick={handleOpenEditPlantForm}
            style={{ marginTop: "10px" }}
          >
            Edit Detail
          </button>
        </div>
      )}

      <div className="card">
        <h2>Riwayat Perawatan</h2>
        <button
          onClick={handleOpenAddLogForm}
          disabled={isLogFormVisible}
          style={{
            marginBottom: "15px",
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          + Tambah Catatan Perawatan
        </button>

        {/* Form Care Log (Muncul jika isLogFormVisible true) */}
        {isLogFormVisible && (
          <div className="card">
            <CareLogForm
              onSubmit={handleSaveLog}
              initialData={editingLog || {}} // Kirim data log jika edit
              onCancel={handleCloseLogForm}
              isLoading={isSubmittingLog}
            />
            {errorLogs && <p className="error-message">{errorLogs}</p>}
          </div>
        )}

        {/* Tabel/List Care Logs */}
        {loadingLogs && <p>Memuat riwayat perawatan...</p>}
        {!loadingLogs && errorLogs && (
          <p className="error-message">{errorLogs}</p>
        )}
        {!loadingLogs && !errorLogs && careLogs.length === 0 && (
          <p>Belum ada riwayat perawatan.</p>
        )}
        {!loadingLogs && !errorLogs && careLogs.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jenis Perawatan</th>
                <th>Catatan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {careLogs.map((log) => (
                <tr key={log.id}>
                  <td>{formatDate(log.logDate)}</td>
                  <td>{log.careType}</td>
                  <td>{log.note || "-"}</td>
                  <td>
                    <button
                      onClick={() => handleOpenEditLogForm(log)}
                      style={{ marginRight: "5px", fontSize: "0.9em" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      style={{ color: "red", fontSize: "0.9em" }}
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
    </div>
  );
}

export default PlantDetailPage;
