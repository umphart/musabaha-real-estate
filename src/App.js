import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import MHL from './images/MHL.jpg'; 
import Swal from "sweetalert2";

// Components
import AuthForm from './components/AuthForm';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import LandingPage from './components/LandingPage';

// Simple Navbar component with navigation links
const Navbar = ({ isAuthenticated, user, onLogout }) => {
  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="navbar-left">
        <img src={MHL} alt="MUSABAHA Logo" className="navbar-logo" />
      </div>

      {/* Center: Title */}
      <div className="navbar-center">
        <span>MUSABAHA HOMES LTD.</span>
      </div>

      {/* Right: Menu */}
      <div className="navbar-menu">
        <a href="/">Home</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        {isAuthenticated ? (
          <>
            <a href="/dashboard">Dashboard</a>
            {user && user.role === 'admin' && (
              <a href="/admin">Admin</a>
            )}
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="/login">Login</a>
            <a href="/admin-login">Admin</a>
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait while we check your session',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      const userDataObj = JSON.parse(userData);
      setUser(userDataObj);
      setIsAuthenticated(true);
    }

    // Close Swal after check
    setTimeout(() => {
      Swal.close();
      setLoading(false);
    }, 1000); // simulate short delay
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('userToken', 'your-auth-token-here'); 
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const handleAdminLogin = () => {
    const adminUser = { username: 'admin', role: 'admin' };
    setUser(adminUser);
    setIsAuthenticated(true);
    localStorage.setItem('userToken', 'admin-auth-token-here'); 
    localStorage.setItem('userData', JSON.stringify(adminUser));
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return null; // we already show Swal instead of a div
  }

  return (
    <Router>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
              (user && user.role === 'admin' ? 
                <Navigate to="/admin" replace /> : 
                <Navigate to="/dashboard" replace />
              ) : 
              <LandingPage />
            } 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              (user && user.role === 'admin' ? 
                <Navigate to="/admin" replace /> : 
                <Navigate to="/dashboard" replace />
              ) : 
              <AuthForm onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/admin-login" 
            element={
              isAuthenticated && user && user.role === 'admin' ? 
              <Navigate to="/admin" replace /> : 
              <AdminLogin onAdminLogin={handleAdminLogin} />
            } 
          />
          <Route 
            path="/dashboard/*" 
            element={
              isAuthenticated ? 
              <UserDashboard user={user} onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              isAuthenticated && user && user.role === 'admin' ? 
              <AdminDashboard user={user} onLogout={handleLogout} /> : 
              <Navigate to="/admin-login" replace />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
