import React from 'react';
import { FiTrash2, FiX } from 'react-icons/fi';
import { getAuthToken, showAlert } from './adminUtils';

const DeleteModal = ({ user, onClose, onSuccess }) => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://musabaha-homes.onrender.com/api';


  const confirmDeleteUser = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/users/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        showAlert("success", "User deleted successfully.");
        onSuccess();
      } else {
        showAlert("error", data.message || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showAlert("error", "Failed to delete user. Please try again.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header danger">
          <h3><FiTrash2 className="icon" /> Confirm Delete...</h3>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete user <strong>{user.name}</strong>? <strong>This action cannot be undone.</strong></p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-danger" onClick={confirmDeleteUser}>
            <FiTrash2 className="icon" /> Yes, Delete
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;