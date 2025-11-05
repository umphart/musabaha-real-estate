import React, { useState, useEffect } from 'react';  
import { 
  FiUser, FiUpload, FiDownload, FiFileText, FiPlus, FiSearch,
  FiDollarSign, FiHome, FiCreditCard, FiMapPin 
} from 'react-icons/fi';
import UserTable from './UserTable'; // ✅ Changed to default import
import UserModal from './UserModal';
import ImportModal from './ImportModal';
import { 
  showAlert, 
  getAuthToken, 
  formatCurrency, 
  calculateTotalPrice, 
  exportToExcel, 
  exportToPDF 
} from './adminUtils';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [plots, setPlots] = useState([]);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
     
      if (data.success) {
        setUsers(data.data);
      } else {
        showAlert('error', data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showAlert('error', 'Failed to fetch users. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch plots
  const fetchPlots = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/plots");
      const data = await res.json();
      console.log('plots',data)
      if (data.success) {
        setPlots(data.data.filter(plot => plot.status === "available"));
      }
    } catch (err) {
      console.error("Error fetching plots:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPlots();
  }, []);

  // Calculate totals
  const totalBalance = users.reduce((total, user) => {
    return total + parseFloat(user.total_balance || 0);
  }, 0);

  const totalPlotValue = users.reduce((total, user) => {
    return total + calculateTotalPrice(user.price_per_plot);
  }, 0);

  const totalDeposits = users.reduce((total, user) => {
    return total + parseFloat(user.initial_deposit || 0);
  }, 0);

  const totalPlotsSold = users.reduce((total, user) => {
    return total + parseInt(user.number_of_plots || 1);
  }, 0);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.plot_taken.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Excel export
  const handleExportToExcel = () => {
    exportToExcel(users);
  };

  // Handle PDF export
  const handleExportToPDF = () => {
    const totals = {
      totalBalance,
      totalPlotValue,
      totalDeposits,
      totalPlotsSold
    };
    exportToPDF(users, totals);
  };

  if (loading) return (
    <div className="loading">
      <div className="spinner"></div>
      <p>Loading users...</p>
    </div>
  );

  return (
    <div className="admin-content">
      <div className="content-header"> 
        <h2><FiUser className="icon" /> Client Management</h2>
        
        <div className="header-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="  ...Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="action-buttons">
            <div className="action-item import" onClick={() => setShowImportModal(true)}>
              <FiUpload className="icon" /> Import CSV
            </div>
            <div className="action-item excel" onClick={handleExportToExcel}>
              <FiDownload className="icon" /> Excel
            </div>
            <div className="action-item pdf" onClick={handleExportToPDF}>
              <FiFileText className="icon" /> PDF
            </div>
            <div className="action-item add-user" onClick={() => setShowCreateModal(true)}>
              <FiPlus className="icon" /> Add Client
            </div>
          </div>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon total-balance">
            <FiDollarSign />
          </div>
          <div className="summary-content">
            <h3>{formatCurrency(totalBalance)}</h3>
            <p>Total Outstanding Balance</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon total-value">
            <FiHome />
          </div>
          <div className="summary-content">
            <h3>{formatCurrency(totalPlotValue)}</h3>
            <p>Total Plot Value</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon deposits">
            <FiCreditCard />
          </div>
          <div className="summary-content">
            <h3>{formatCurrency(totalDeposits)}</h3>
            <p>Total Deposits Received</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon plots">
            <FiMapPin />
          </div>
          <div className="summary-content">
            <h3>{totalPlotsSold}</h3>
            <p>Total Plots Sold</p>
          </div>
        </div>
      </div>

      <UserTable 
        users={filteredUsers}
        onRefresh={fetchUsers}
        onFetchPlots={fetchPlots}
      />

      {showCreateModal && (
        <UserModal
          type="create"
          plots={plots}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchUsers();
            fetchPlots();
          }}
        />
      )}

      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
};

export default AdminUsers;