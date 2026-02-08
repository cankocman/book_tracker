import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Library, BarChart2,  BookOpen } from 'lucide-react';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <BookOpen className="logo-icon" size={28} />
        <span className="logo-text">Tracker</span>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/library" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Library size={20} />
          <span>Library</span>
        </NavLink>
        
        <NavLink to="/stats" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BarChart2 size={20} />
          <span>Statistics</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
