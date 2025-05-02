import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPlants } from "../services/plantService";
import { getAllLocations } from "../services/locationService";
import { getAllWishlistItems } from "../services/wishlistService";
import "../styles/global.css";

function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalLocations: 0,
    totalWishlists: 0,
    totalPlants: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [locationsResponse, wishlistsResponse, plantsResponse] =
        await Promise.all([
          getAllLocations(),
          getAllWishlistItems(),
          getAllPlants(),
        ]);

      const locations = Array.isArray(locationsResponse)
        ? locationsResponse
        : [];
      const wishlists = Array.isArray(wishlistsResponse)
        ? wishlistsResponse
        : [];
      const plants = Array.isArray(plantsResponse) ? plantsResponse : [];

      setStats({
        totalLocations: locations.length,
        totalWishlists: wishlists.length,
        totalPlants: plants.length,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(date);
  };

  if (loading) return <div className="loading">Memuat data...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h2>Total Lokasi</h2>
          <p className="stat-value">{stats.totalLocations}</p>
        </div>

        <div className="stat-card">
          <h2>Total Wishlist</h2>
          <p className="stat-value">{stats.totalWishlists}</p>
        </div>

        <div className="stat-card">
          <h2>Total Tanaman</h2>
          <p className="stat-value">{stats.totalPlants}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
