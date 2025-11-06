import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ 
  sidebarCollapsed, 
  setSidebarCollapsed,
  isMobile, 
  sidebarOpen, 
  getSidebarClass, 
  closeSidebar, 
  handleLogout, 
  location 
}) => {
  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { path: '/dashboard/profile', name: 'Profile', icon: 'fas fa-user' },
    { path: '/dashboard/plots', name: 'My Plots', icon: 'fas fa-map-marked' },
    { path: '/dashboard/payments', name: 'Payments', icon: 'fas fa-credit-card' },
    { path: '/dashboard/documents', name: 'Subsequent Payments', icon: 'fas fa-file' },
    { path: '/dashboard/subscribe', name: 'Apply for Plot', icon: 'fas fa-file-signature' },
  ];

  const handleMouseEnter = () => {
    if (!isMobile) {
      setSidebarCollapsed(false);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setSidebarCollapsed(true);
    }
  };

  return (
    <div
      className={`sidebar ${getSidebarClass()}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="sidebar-header">
        <h3>{!sidebarCollapsed || isMobile ? 'User Dashboard' : '👤'}</h3>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={active ? 'active' : ''}
                title={sidebarCollapsed && !isMobile ? item.name : ''}
                onClick={closeSidebar}
              >
                <i className={item.icon}></i>
                {(!sidebarCollapsed || isMobile) && <span>{item.name}</span>}
              </Link>
            </li>
          );
        })}

        <li>
          <button onClick={handleLogout} className="logout-btn" aria-label="Logout">
            <i className="fas fa-sign-out-alt"></i>
            {(!sidebarCollapsed || isMobile) && <span>Logout</span>}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;