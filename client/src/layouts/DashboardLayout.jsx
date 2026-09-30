import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';

const DashboardLayout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="dashboard-layout">
          <Sidebar />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
