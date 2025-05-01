import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPlants } from '../services/plantService';
import { getAllLocations } from '../services/locationService';
import { getAllWishlistItems } from '../services/wishlistService';
import { getAllCareLogs } from '../services/careLogService';
import './DashboardPage.css';

function DashboardPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    totalPlants: 0,
    totalLocations: 0,
    totalWishlist: 0,
    recentActivities: [],
    weeklyActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Memulai fetch data dashboard');
        const [plants, locations, wishlists] = await Promise.all([
          getAllPlants(),
          getAllLocations(),
          getAllWishlistItems()
        ]);

        // Coba ambil care logs, jika gagal gunakan array kosong
        let careLogs = [];
        try {
          careLogs = await getAllCareLogs();
        } catch (error) {
          console.log('Care logs belum tersedia:', error);
        }

        // Format aktivitas terkini dari care logs
        const recentActivities = careLogs
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 5)
          .map(log => ({
            id: log.id,
            plantName: plants.find(p => p.id === log.plantId)?.name || 'Tanaman',
            activity: log.activityType,
            timestamp: new Date(log.timestamp),
            notes: log.notes
          }));

        // Hitung aktivitas mingguan
        const today = new Date();
        const weeklyActivities = Array(7).fill(0).map((_, index) => {
          const date = new Date(today);
          date.setDate(date.getDate() - index);
          const count = careLogs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate.toDateString() === date.toDateString();
          }).length;
          return { date, count };
        }).reverse();

        setSummary({
          totalPlants: plants.length,
          totalLocations: locations.length,
          totalWishlist: wishlists.length,
          recentActivities,
          weeklyActivities  // Use the calculated weeklyActivities
        });
      } catch (err) {
        console.error('Error detail:', err);
        setError('Gagal memuat data dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(date);
  };

  if (loading) return <div className="dashboard-loading">Memuat data...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="page-container">
      <header className="main-header">
        <div className="header-left">
          <h1 className="app-title">PlanTrella</h1>
        </div>
        <div className="header-right">
          <div className="user-profile">
            <img src="/default-avatar.png" alt="User" className="avatar" />
            <span className="username">User</span>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <div className="action-buttons">
            <button 
              className="action-button add-location"
              onClick={() => navigate('/locations/add')}
            >
              + Tambah Lokasi
            </button>
            <button 
              className="action-button add-plant"
              onClick={() => navigate('/plants/add')}
            >
              + Tambah Tanaman
            </button>
          </div>
        </div>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">{summary.totalPlants}</div>
            <h3>Total Tanaman</h3>
          </div>
          <div className="stat-card">
            <div className="stat-number">{summary.totalLocations}</div>
            <h3>Total Lokasi</h3>
          </div>
          <div className="stat-card">
            <div className="stat-number">{summary.totalWishlist}</div>
            <h3>Item Wishlist</h3>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="dashboard-section">
            <h2>Aktivitas Terkini</h2>
            <div className="activity-list">
              {summary.recentActivities.length === 0 ? (
                <p className="no-activity">Belum ada aktivitas</p>
              ) : (
                summary.recentActivities.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-time">
                      {formatTime(activity.timestamp)}
                    </div>
                    <div className="activity-content">
                      <h4>{activity.plantName}</h4>
                      <p>{activity.activity} - {activity.notes}</p>
                      <small>{formatDate(activity.timestamp)}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <h2>Aktivitas Perawatan Mingguan</h2>
            <div className="chart-container">
              <div className="weekly-chart">
                {summary.weeklyActivities.map((day, index) => (
                  <div key={index} className="chart-bar">
                    <div 
                      className="bar" 
                      style={{ height: `${day.count * 20}px` }}
                    />
                    <div className="bar-label">
                      {new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(day.date)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;