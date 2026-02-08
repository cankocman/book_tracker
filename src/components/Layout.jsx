import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: '250px', width: '100%', padding: '2rem', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
