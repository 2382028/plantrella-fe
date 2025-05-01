import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="logo">
        <h1>PlanTrella</h1>
      </div>
      <nav>
        <Link 
          to="/dashboard" 
          className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/plants" 
          className={`nav-item ${location.pathname === '/plants' ? 'active' : ''}`}
        >
          Koleksi Tanaman
        </Link>
        <Link 
          to="/locations" 
          className={`nav-item ${location.pathname === '/locations' ? 'active' : ''}`}
        >
          Lokasi Penyimpanan
        </Link>
        <Link 
          to="/wishlist" 
          className={`nav-item ${location.pathname === '/wishlist' ? 'active' : ''}`}
        >
          Wishlist Tanaman
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;