import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import AdminUsers from './AdminUsers';
import AdminPlots from './AdminPlots';
import AdminPayments from './AdminPayments';
import AdminNotifications from './AdminNotifications';
import './adminDashboard.css';
import AdminRegisteredUsers from './AdminRegisteredUsers';
import AdminUserPayments from './AdminUserPayments';
import AdminPaymentApproval from './AdminPaymentApproval';
import { DollarSign, TrendingUp, Users, Clock, Map, CheckCircle, AlertCircle, CreditCard, UserCheck, Bell, Menu, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { Currency } from 'lucide-react';

import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [adminCreatedUsers, setAdminCreatedUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [subsequentPayments, setSubsequentPayments] = useState([]);
  const [adminCreatedPayments, setAdminCreatedPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lastNotificationTime, setLastNotificationTime] = useState(null);
  const location = useLocation();

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    
    if (onLogout && typeof onLogout === 'function') {
      onLogout();
    } else {
      navigate('/');
    }
  };

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const menuItems = [
    { path: '/admin', name: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { path: '/admin/users', name: 'Client', icon: 'fas fa-users' },
    { path: '/admin/plots', name: 'Plots', icon: 'fas fa-map-marked' },
    { path: '/admin/payments', name: 'Payments', icon: 'fas fa-money-check' },
    { path: '/admin/registered', name: 'Register', icon: 'fas fa-user-check' },
    { path: '/admin/payment-approval', name: 'Payment Approval', icon: 'fas fa-check-circle' },
    { path: '/admin/user-payment', name: 'Client Payments', icon: 'fas fa-money-check' },
    { path: '/admin/notifications', name: 'Notifications', icon: 'fas fa-bell' },
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simplified sidebar state management
  const toggleMobileSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleSidebarEnter = () => {
    if (!isMobile) {
      setSidebarCollapsed(false);
    }
  };

  const handleSidebarLeave = () => {
    if (!isMobile) {
      setSidebarCollapsed(true);
    }
  };

  // Get sidebar class based on state
  const getSidebarClass = () => {
    if (isMobile) {
      return sidebarOpen ? 'sidebar-mobile-open' : 'sidebar-mobile-closed';
    }
    return sidebarCollapsed ? 'sidebar-desktop-collapsed' : 'sidebar-desktop-expanded';
  };

  // Get main content class based on state
  const getMainContentClass = () => {
    if (isMobile) {
      return sidebarOpen ? 'main-content-mobile-sidebar-open' : '';
    }
    return sidebarCollapsed ? 'main-content-desktop-sidebar-collapsed' : 'main-content-desktop-sidebar-expanded';
  };

  // Rest of your existing methods (getAuthToken, fetchDashboardData, calculatePendingRequests, etc.)
  const getAuthToken = () => localStorage.getItem('adminToken');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      const usersResponse = await fetch(`${API_BASE_URL}/api/subscriptions/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!usersResponse.ok) throw new Error('Failed to fetch users');
      const usersData = await usersResponse.json();

      const adminUsersResponse = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      let adminUsersData = { success: false, data: [] };
      if (adminUsersResponse.ok) {
        adminUsersData = await adminUsersResponse.json();
      }

      const paymentsResponse = await fetch(`${API_BASE_URL}/api/user-payments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const paymentsData = await paymentsResponse.json();

      const subsequentPaymentsResponse = await fetch(`${API_BASE_URL}/api/user-subsequent-payments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const subsequentPaymentsData = await subsequentPaymentsResponse.json();

      const adminPaymentsResponse = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      let adminPaymentsData = { success: false, data: [] };
      if (adminPaymentsResponse.ok) {
        adminPaymentsData = await adminPaymentsResponse.json();
      }

      if (usersData.success) {
        setUsers(usersData.data || []);
      } else {
        console.error('Failed to fetch users:', usersData.message);
      }

      if (adminUsersData.success) {
        setAdminCreatedUsers(adminUsersData.data || []);
      } else {
        console.error('Failed to fetch admin-created users:', adminUsersData.message);
      }

      if (paymentsData.success) {
        setPayments(paymentsData.payments || []);
      } else {
        console.error('Failed to fetch payments:', paymentsData.message);
      }

      if (subsequentPaymentsData.success) {
        setSubsequentPayments(subsequentPaymentsData.payments || []);
      } else {
        console.error('Failed to fetch subsequent payments:', subsequentPaymentsData.message);
      }

      if (adminPaymentsData.success) {
        setAdminCreatedPayments(adminPaymentsData.data || []);
      } else {
        console.error('Failed to fetch admin-created payments:', adminPaymentsData.message);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const calculatePendingRequests = () => {
    const allUsers = [...users, ...adminCreatedUsers];
    const pendingUsers = allUsers.filter(u => u.status?.toLowerCase() === "pending").length;
    
    const allPayments = [
      ...payments,
      ...subsequentPayments,
      ...adminCreatedPayments
    ];
    
    const pendingPayments = allPayments.filter(p => p.status === "pending").length;
    
    return pendingUsers + pendingPayments;
  };

  const showPendingNotifications = (currentPending, stats) => {
    if (currentPending > 0) {
      if (!lastNotificationTime || currentPending > pendingRequests) {
        const content = (
          <div className="toast-notification">
            <div className="toast-header">
              <AlertCircle size={22} className="toast-icon" />
              <strong>Pending Requests</strong>
            </div>
            <p>
              You have <strong>{currentPending}</strong> pending requests needing your attention!
            </p>
            <div className="toast-actions">
              <Link to="/admin/registered" className="btn-link">
                New Registrations ({stats.pendingUsers})
              </Link>
              <Link to="/admin/payment-approval" className="btn-link">
                New Payments ({stats.pendingAllPayments})
              </Link>
            </div>
          </div>
        );

        toast.info(content, {
          position: "top-right",
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          className: "custom-toast",
        });

        setLastNotificationTime(new Date());
      }
    }
    setPendingRequests(currentPending);
  };

  useEffect(() => {
    fetchDashboardData();
    
    const intervalId = setInterval(fetchDashboardData, 120000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Calculate statistics (your existing calculateStatistics function)
  const calculateStatistics = () => {
    // ... your existing calculateStatistics implementation ...
    const allUsers = [...users, ...adminCreatedUsers];
    
    const totalUsers = allUsers.length;
    const pendingUsers = allUsers.filter(u => u.status?.toLowerCase() === "pending").length;
    const approvedUsers = allUsers.filter(u => 
      u.status?.toLowerCase() === "approved" || 
      u.status?.toLowerCase() === "completed" || 
      u.status?.toLowerCase() === "active"
    ).length;

    const totalPlots = allUsers.reduce((sum, u) => sum + (u.plot_taken?.split(",").length || 0), 0);
    const potentialPlotRevenue = allUsers.reduce((sum, u) => {
      if (!u.price_per_plot) return sum;
      return sum + u.price_per_plot
        .split(",")
        .map(p => parseFloat(p.trim()) || 0)
        .reduce((a, b) => a + b, 0);
    }, 0);

    const totalInitialPayments = payments.length;
    const pendingInitialPayments = payments.filter(p => p.status === "pending").length;
    const approvedInitialPayments = payments.filter(p => p.status === "approved").length;
    
    const totalSubsequentPayments = subsequentPayments.length;
    const pendingSubsequentPayments = subsequentPayments.filter(p => p.status === "pending").length;
    const approvedSubsequentPayments = subsequentPayments.filter(p => p.status === "approved").length;
    
    const totalAdminPayments = adminCreatedPayments.length;
    const pendingAdminPayments = adminCreatedPayments.filter(p => p.status === "pending").length;
    const approvedAdminPayments = adminCreatedPayments.filter(p => p.status === "approved").length;

    const approvedInitialAmount = payments
      .filter(p => p.status === "approved")
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const approvedSubsequentAmount = subsequentPayments
      .filter(p => p.status === "approved")
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const actualAdminPayments = adminCreatedPayments
      .filter(p => p.status === "approved")
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const pendingInitialAmount = payments
      .filter(p => p.status === "pending")
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const pendingSubsequentAmount = subsequentPayments
      .filter(p => p.status === "pending")
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const totalPaidByUsers = allUsers.reduce((sum, user) => {
      return sum + (Number(user.total_paid) || 0);
    }, 0);

    const totalAllPayments = totalInitialPayments + totalSubsequentPayments + totalAdminPayments;
    const pendingAllPayments = pendingInitialPayments + pendingSubsequentPayments + pendingAdminPayments;
    
    const totalActualBalance = approvedInitialAmount + approvedSubsequentAmount + actualAdminPayments + totalPaidByUsers;
    
    const totalPendingAmount = pendingInitialAmount + pendingSubsequentAmount;
    
    const totalReceivable = totalActualBalance + totalPendingAmount;

    return {
      totalUsers, pendingUsers, approvedUsers,
      totalPlots, potentialPlotRevenue,
      totalInitialPayments, pendingInitialPayments, approvedInitialPayments,
      totalSubsequentPayments, pendingSubsequentPayments, approvedSubsequentPayments,
      totalAdminPayments, pendingAdminPayments, approvedAdminPayments,
      totalAllPayments, pendingAllPayments,
      approvedInitialAmount,
      approvedSubsequentAmount,
      actualAdminPayments,
      totalPaidByUsers,
      totalActualBalance,
      pendingInitialAmount,
      pendingSubsequentAmount,
      totalPendingAmount,
      totalReceivable
    };
  };

  const stats = calculateStatistics();
  
  useEffect(() => {
    const currentPending = calculatePendingRequests();
    showPendingNotifications(currentPending, stats);
  }, [users, payments, subsequentPayments, adminCreatedUsers, adminCreatedPayments]);

  const displayStats = [
    {
      title: 'Total Client',
      value: stats.totalUsers,
      change: `${stats.approvedUsers} approved, ${stats.pendingUsers} pending`,
      icon: <Users size={24} />,
      color: '#4e73df'
    },
    {
      title: 'Actual Account Balance',
      value: `₦${stats.totalActualBalance.toLocaleString()}`,
      change: `Confirmed money from approved payments`,
      icon: <CreditCard size={24} />,
      color: '#10b981'
    },
    {
      title: 'Pending Approval Amount',
      value: `₦${stats.totalPendingAmount.toLocaleString()}`,
      change: `Awaiting approval: ${stats.pendingAllPayments} payments`,
      icon: <Clock size={24} />,
      color: '#f6c23e'
    },
    {
      title: 'Total Receivable',
      value: `₦${stats.totalReceivable.toLocaleString()}`,
      change: `Actual + Pending amounts`,
      icon: <i className="fas fa-naira-sign"></i>,
      color: '#36b9cc'
    },
    {
      title: 'Initial Payments',
      value: stats.totalInitialPayments,
      change: `Approved: ${stats.approvedInitialPayments}, Pending: ${stats.pendingInitialPayments}`,
      icon: <CheckCircle size={24} />,
      color: '#10b981'
    },
    {
      title: 'Subsequent Payments',
      value: stats.totalSubsequentPayments,
      change: `Approved: ${stats.approvedSubsequentPayments}, Pending: ${stats.pendingSubsequentPayments}`,
      icon: <TrendingUp size={24} />,
      color: '#8b5cf6'
    },
    {
      title: 'Admin Payments',
      value: stats.totalAdminPayments,
      change: `Approved: ${stats.approvedAdminPayments}, Pending: ${stats.pendingAdminPayments}`,
      icon: <UserCheck size={24} />,
      color: '#8b5cf6'
    },
    {
      title: 'Plots Allocated',
      value: stats.totalPlots,
      change: `Potential value: ₦${stats.potentialPlotRevenue.toLocaleString()}`,
      icon: <Map size={24} />,
      color: '#1cc88a'
    }
  ];

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(Number(value));
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button className="mobile-menu-btn" onClick={toggleMobileSidebar}>
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeMobileSidebar}></div>
      )}

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {/* Sidebar */}
      <div
        className={`sidebar ${getSidebarClass()}`}
        onMouseEnter={handleSidebarEnter}
        onMouseLeave={handleSidebarLeave}
      >
        <div className="sidebar-header">
          <h3>
            {isMobile 
              ? 'Admin Panel' 
              : (sidebarCollapsed ? 'AP' : 'Admin Panel')
            }
          </h3>
          {/* Notification bell with badge */}
          <div className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            {pendingRequests > 0 && <span className="notification-badge">{pendingRequests}</span>}
          </div>
        </div>
        
        {/* Notification dropdown */}
        {showNotifications && (
          <div className="notification-dropdown">
            <div className="notification-header">
              <h4>Pending Requests</h4>
              <span>{pendingRequests} items need attention</span>
            </div>
            <div className="notification-list">
              {stats.pendingUsers > 0 && (
                <div className="notification-item">
                  <Users size={16} />
                  <div className="notification-content">
                    <span className="notification-title">{stats.pendingUsers} User Registrations</span>
                    <span className="notification-desc">Pending approval</span>
                  </div>
                  <Link to="/admin/registered" className="notification-action" onClick={closeMobileSidebar}>Review</Link>
                </div>
              )}
              
              {stats.pendingAllPayments > 0 && (
                <div className="notification-item">
                  <CreditCard size={16} />
                  <div className="notification-content">
                    <span className="notification-title">{stats.pendingAllPayments} Payments</span>
                    <span className="notification-desc">Awaiting approval</span>
                  </div>
                  <Link to="/admin/payment-approval" className="notification-action" onClick={closeMobileSidebar}>Review</Link>
                </div>
              )}
              
              {pendingRequests === 0 && (
                <div className="notification-item">
                  <CheckCircle size={16} />
                  <div className="notification-content">
                    <span className="notification-title">All caught up!</span>
                    <span className="notification-desc">No pending requests</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <ul className="sidebar-menu">
          {menuItems.map(item => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
                title={!isMobile && sidebarCollapsed ? item.name : ''}
                onClick={closeMobileSidebar}
              >
                <i className={item.icon}></i>
                {(isMobile || !sidebarCollapsed) && <span>{item.name}</span>}
                
                {/* Notification badges */}
                {item.path === '/admin/registered' && stats.pendingUsers > 0 && (
                  <span className="menu-badge">{stats.pendingUsers}</span>
                )}
                {item.path === '/admin/payment-approval' && stats.pendingAllPayments > 0 && (
                  <span className="menu-badge">{stats.pendingAllPayments}</span>
                )}
              </Link>
            </li>
          ))}

          {/* Logout Button */}
          <li>
            <button 
              onClick={handleAdminLogout} 
              className="logout-btn" 
              aria-label="Logout"
              title={!isMobile && sidebarCollapsed ? 'Logout' : ''}
              style={{
                background: 'none',
                border: 'none',
                color: '#bba9a7ff',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '10px 15px',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              <i className="fas fa-sign-out-alt"></i>
              {(isMobile || !sidebarCollapsed) && <span style={{ marginLeft: '10px' }}>Logout</span>}
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={`main-content ${getMainContentClass()}`}>
        <Routes>
          <Route path="/" element={
            <div className="dashboard-content">
              <h2>Dashboard Overview</h2>

              {loading && (
                <div className="loading">Loading dashboard data...</div>
              )}

              {error && (
                <div className="alert alert-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                </div>
              )}

              {/* Stats Cards */}
              <div className="stats-grid">
                {displayStats.map((stat, index) => (
                  <div key={index} className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
                    <div className="stat-content">
                      <div className="stat-title">{stat.title}</div>
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-change">
                        {stat.change}
                      </div>
                    </div>
                    <div className="stat-icon" style={{ color: stat.color }}>
                      {stat.icon}
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Charts and detailed overview */}
              <div className="dashboard-charts">
                {/* Financial Overview */}
                <div className="chart-container enhanced-card">
                  <div className="chart-header">
                    <h3><i className="fas fa-money-bill-wave"></i> Financial Overview</h3>
                    <div className="header-actions">
                      <span className="total-amount">Actual Balance: {formatCurrency(stats.totalActualBalance)}</span>
                    </div>
                  </div>
                  <div className="financial-overview-grid">
                    <div className="financial-category actual-balance">
                      <div className="financial-header">
                        <CheckCircle size={20} color="#10b981" />
                        <h4>Actual Account Balance</h4>
                      </div>
                      <div className="financial-stats">
                        <div className="stat-row">
                          <span className="label">Approved Initial Payments</span>
                          <span className="value">{formatCurrency(stats.approvedInitialAmount)}</span>
                        </div>
                        <div className="stat-row">
                          <span className="label">Approved Subsequent Payments</span>
                          <span className="value">{formatCurrency(stats.approvedSubsequentAmount)}</span>
                        </div>
                        <div className="stat-row">
                          <span className="label">Admin Payments</span>
                          <span className="value">{formatCurrency(stats.actualAdminPayments)}</span>
                        </div>
                        <div className="stat-row">
                          <span className="label">User Total Paid</span>
                          <span className="value">{formatCurrency(stats.totalPaidByUsers)}</span>
                        </div>
                        <div className="stat-row total-row">
                          <span className="label">Total Actual Balance</span>
                          <span className="value amount highlight">{formatCurrency(stats.totalActualBalance)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="financial-category pending-amount">
                      <div className="financial-header">
                        <Clock size={20} color="#f6c23e" />
                        <h4>Pending Approval</h4>
                      </div>
                      <div className="financial-stats">
                        <div className="stat-row">
                          <span className="label">Pending Initial Payments</span>
                          <span className="value">{formatCurrency(stats.pendingInitialAmount)}</span>
                        </div>
                        <div className="stat-row">
                          <span className="label">Pending Subsequent Payments</span>
                          <span className="value">{formatCurrency(stats.pendingSubsequentAmount)}</span>
                        </div>
                        <div className="stat-row total-row">
                          <span className="label">Total Pending</span>
                          <span className="value amount">{formatCurrency(stats.totalPendingAmount)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="financial-summary" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      <div className="summary-header">
                        <CreditCard size={24} color="#fff" />
                        <h4>Total Receivable</h4>
                      </div>
                      <div className="summary-stats">
                        <div className="summary-row">
                          <span className="label">Actual Balance</span>
                          <span className="value">{formatCurrency(stats.totalActualBalance)}</span>
                        </div>
                        <div className="summary-row">
                          <span className="label">+ Pending Amount</span>
                          <span className="value">{formatCurrency(stats.totalPendingAmount)}</span>
                        </div>
                        <div className="summary-row highlight grand-total">
                          <span className="label">Total Receivable</span>
                          <span className="value">{formatCurrency(stats.totalReceivable)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Breakdown & Quick Actions */}
                <div className="chart-container enhanced-card">
                  <div className="chart-header">
                    <h3><i className="fas fa-chart-pie"></i> Payment Breakdown & Quick Actions</h3>
                  </div>
                  
                  <div className="payment-breakdown-container">
                    {/* Payment Statistics */}
                    <div className="payment-statistics-section">
                      <h4 className="section-title">
                        <CreditCard size={18} color="#4e73df" />
                        Payment Statistics
                      </h4>
                      <div className="payment-stats-grid">
                        <div className="payment-stat-card">
                          <div className="payment-stat-header">
                            <CheckCircle size={16} color="#10b981" />
                            <span>Initial Payments</span>
                          </div>
                          <div className="payment-stat-details">
                            <div className="payment-stat-row">
                              <span>Total:</span>
                              <span>{stats.totalInitialPayments}</span>
                            </div>
                            <div className="payment-stat-row">
                              <span>Approved:</span>
                              <span className="approved">{stats.approvedInitialPayments}</span>
                            </div>
                            <div className="payment-stat-row">
                              <span>Pending:</span>
                              <span className="pending">{stats.pendingInitialPayments}</span>
                            </div>
                          </div>
                        </div>

                        <div className="payment-stat-card">
                          <div className="payment-stat-header">
                            <TrendingUp size={16} color="#8b5cf6" />
                            <span>Subsequent Payments</span>
                          </div>
                          <div className="payment-stat-details">
                            <div className="payment-stat-row">
                              <span>Total:</span>
                              <span>{stats.totalSubsequentPayments}</span>
                            </div>
                            <div className="payment-stat-row">
                              <span>Approved:</span>
                              <span className="approved">{stats.approvedSubsequentPayments}</span>
                            </div>
                            <div className="payment-stat-row">
                              <span>Pending:</span>
                              <span className="pending">{stats.pendingSubsequentPayments}</span>
                            </div>
                          </div>
                        </div>

                        <div className="payment-stat-card">
                          <div className="payment-stat-header">
                            <UserCheck size={16} color="#8b5cf6" />
                            <span>Admin Payments</span>
                          </div>
                          <div className="payment-stat-details">
                            <div className="payment-stat-row">
                              <span>Total:</span>
                              <span>{stats.totalAdminPayments}</span>
                            </div>
                            <div className="payment-stat-row">
                              <span>Approved:</span>
                              <span className="approved">{stats.approvedAdminPayments}</span>
                            </div>
                            <div className="payment-stat-row">
                              <span>Pending:</span>
                              <span className="pending">{stats.pendingAdminPayments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions Section */}
                    <div className="quick-actions-section">
                      <h4 className="section-title">
                        <i className="fas fa-bolt"></i>
                        Quick Actions
                      </h4>
                      <div className="quick-actions-grid">
                        <Link to="/admin/payment-approval" className="quick-action-btn">
                          <AlertCircle size={16} />
                          <span>Review Payments ({stats.pendingAllPayments})</span>
                          <small>₦{stats.totalPendingAmount.toLocaleString()} pending</small>
                        </Link>
                        <Link to="/admin/users" className="quick-action-btn">
                          <Users size={16} />
                          <span>Manage Client ({stats.totalUsers})</span>
                          <small>{stats.pendingUsers} pending approval</small>
                        </Link>
                        <Link to="/admin/user-payment" className="quick-action-btn">
                          <i className="fas fa-naira-sign"></i>
                          <span>Payment History</span>
                          <small>View all transactions</small>
                        </Link>
                        <Link to="/admin/registered" className="quick-action-btn">
                          <CheckCircle size={16} />
                          <span>Approve Registrations ({stats.pendingUsers})</span>
                          <small>New user requests</small>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/plots" element={<AdminPlots />} />
          <Route path="/payments" element={<AdminPayments />} />
          <Route path="/registered" element={<AdminRegisteredUsers />} />
          <Route path="/user-payment" element={<AdminUserPayments />} />
          <Route path="/payment-approval" element={<AdminPaymentApproval />} />
          <Route path="/notifications" element={<AdminNotifications />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;