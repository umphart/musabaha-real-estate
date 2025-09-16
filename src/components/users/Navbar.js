import React from 'react';

const Navbar = ({ isAuthenticated, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <i className="fas fa-home"></i>
        MUSABAHA HOMES LTD.
      </div>
      <div className="navbar-menu">
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        {isAuthenticated && (
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;