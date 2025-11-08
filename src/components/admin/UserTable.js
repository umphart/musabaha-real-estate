import React, { useState } from 'react';
import { 
  FiEye, FiEdit, FiTrash2, FiCalendar, FiCheckCircle
} from 'react-icons/fi';
import UserModal from './UserModal';
import ViewModal from './ViewModal';
import DeleteModal from './DeleteModal';
import { formatCurrency, calculateTotalPrice, getAuthToken, showAlert } from './adminUtils';

const UserTable = ({ users, onRefresh, onFetchPlots }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://musabaha-homes.onrender.com/api';

  const handleViewUser = async (user) => {
    try {
      const payments = await fetchUserPayments(user.id);
      setSelectedUser({ ...user, payments });
      setShowViewModal(true);
    } catch (error) {
      console.error('Error fetching user payments:', error);
      showAlert('error', 'Failed to load user details.');
    }
  };

  const handleEditUser = (user) => {
    setEditUser({ ...user });
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const fetchUserPayments = async (userId) => {
    try {
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/admin/payments/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return data.data;
        }
      }
      return [];
    } catch (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
  };

  // Enhanced modal handlers to prevent re-render issues
  const handleViewModalClose = () => {
    setShowViewModal(false);
    // Don't clear selectedUser immediately to avoid flickering
    setTimeout(() => setSelectedUser(null), 300);
  };

  const handleViewModalRefresh = () => {
    onRefresh();
    // Refresh the selected user data
    if (selectedUser) {
      fetchUserPayments(selectedUser.id).then(payments => {
        setSelectedUser(prev => ({ ...prev, payments }));
      });
    }
  };

  const formatDateForDisplay = (dateString) => { 
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  return (
    <>
      <div className="content-table">
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Date Taken</th>
                <th>Total Money</th>
                <th>Deposit</th>
                <th>Price/Plot</th>
                <th>Schedule</th>
                <th>Balance</th>
                <th>Plots</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const priceArray = user.price_per_plot ? 
                  user.price_per_plot.split(",").map(price => price.trim()) : [];
                
                const plotCount = user.number_of_plots || 
                  (user.plot_taken ? user.plot_taken.split(",").length : 1);

                return (
                  <tr key={user.id}>
                    <td>
                      <div className="user-qinfo">
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.contact}</td>
                    <td>{formatDateForDisplay(user.date_taken)}</td>
                    <td>{formatCurrency(calculateTotalPrice(user.price_per_plot))}</td>
                    <td>{formatCurrency(user.initial_deposit)}</td>
                    <td>
                      {priceArray.length > 0 ? (
                        priceArray.map((price, idx) => (
                          <span key={idx}>
                            {formatCurrency(price)}
                            {idx < priceArray.length - 1 && ", "}
                          </span>
                        ))
                      ) : (
                        <span></span>
                      )}
                    </td>
                    <td>
                      <div className="payment-schedule">
                        <FiCalendar className="icon" />
                        <span>{user.payment_schedule || 'N/A'}</span>
                      </div>
                    </td>
                    <td>
                      <div
                        className={`balance ${
                          parseFloat(user.total_balance || 0) === 0 ? "paid" : ""
                        }`}
                      >
                        {formatCurrency(user.total_balance || 0)}
                      </div>
                    </td>
                    <td>
                      <div className="plots-count-badge">
                        {plotCount}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${(user.status || 'active').toLowerCase()}`}>
                        {user.status === "Completed" && (
                          <FiCheckCircle className="icon" />
                        )}
                        {user.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <FiEye
                          className="action-icon view"
                          onClick={() => handleViewUser(user)}
                        />
                        <FiEdit
                          className="action-icon edit"
                          onClick={() => handleEditUser(user)}
                        />
                        <FiTrash2
                          className="action-icon delete"
                          onClick={() => handleDeleteUser(user)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showEditModal && editUser && (
        <UserModal
          type="edit"
          user={editUser}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            onRefresh();
          }}
        />
      )}

      {/* Fixed ViewModal with proper overlay and state management */}
      {showViewModal && selectedUser && (
        <div 
          className="modal-overlay" 
          onClick={(e) => {
            // Only close if clicking directly on the overlay
            if (e.target === e.currentTarget) {
              handleViewModalClose();
            }
          }}
        >
          <ViewModal
            user={selectedUser}
            onClose={handleViewModalClose}
            onRefresh={handleViewModalRefresh}
          />
        </div>
      )}

      {showDeleteModal && selectedUser && (
        <DeleteModal
          user={selectedUser}
          onClose={() => setShowDeleteModal(false)}
          onSuccess={() => {
            setShowDeleteModal(false);
            onRefresh();
          }}
        />
      )}
    </>
  );
};

export default UserTable;