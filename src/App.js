import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import PlantsPage from './pages/PlantsPage';
import LocationsPage from './pages/LocationsPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
// --- TAMBAHKAN IMPORT INI ---
import PlantDetailPage from './pages/PlantDetailPage'; 
// --------------------------
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Rute di dalam Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="plants" element={<PlantsPage />} />
          {/* --- TAMBAHKAN RUTE INI --- */}
          <Route path="plants/:id" element={<PlantDetailPage />} /> 
          {/* -------------------------- */}
          <Route path="locations" element={<LocationsPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          {/* Tambahkan rute lain di dalam Layout jika perlu */}
        </Route>
        {/* Anda bisa menambahkan rute lain di luar Layout di sini jika perlu */}
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
