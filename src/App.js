import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import PlantsPage from './pages/PlantsPage';
import LocationsPage from './pages/LocationsPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="plants" element={<PlantsPage />} />
          <Route path="locations" element={<LocationsPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
