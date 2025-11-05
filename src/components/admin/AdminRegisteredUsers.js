// src/components/admi12345679dminRegisteredUsers.js
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const AdminRegisteredUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null); // "docs" | "details"


  const API_BASE_URL = "https://musabaha-homes.onrender.com/api";

  const getAuthToken = () => localStorage.getItem("adminToken");

  // Container styles
  const containerStyles = {
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#f5f6fa"
  };

  // Loading styles
  const loadingStyles = {
    textAlign: "center",
    padding: "40px",
    fontSize: "18px",
    color: "#555",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px"
  };

  const spinnerStyles = {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite"
  };

  // Alert styles
  const alertErrorStyles = {
    background: "#fee",
    border: "1px solid #f5c6cb",
    color: "#721c24",
    padding: "12px 16px",
    borderRadius: "6px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  };

  // Table styles
  const tableStyles = {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  };

  const thStyles = {
    background: "linear-gradient(135deg, #2c3e50, #34495e)",
    color: "white",
    padding: "16px 12px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  };

  const tdStyles = {
    padding: "14px 12px",
    borderBottom: "1px solid #eaeaea",
    color: "#555",
    fontSize: "14px"
  };

  const trStyles = {
    transition: "background-color 0.2s ease"
  };

  // Status badge styles
  const statusBadgeBase = {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "capitalize",
    display: "inline-block",
    textAlign: "center",
    minWidth: "80px"
  };

  const statusBadgeStyles = {
    approved: {
      ...statusBadgeBase,
      background: "#d4edda",
      color: "#155724"
    },
    rejected: {
      ...statusBadgeBase,
      background: "#f8d7da",
      color: "#721c24"
    },
    pending: {
      ...statusBadgeBase,
      background: "#fff3cd",
      color: "#856404"
    }
  };

  // Action buttons styles
  const actionButtonsStyles = {
    display: "flex",
    gap: "6px",
    justifyContent: "center",
    flexWrap: "wrap"
  };

  const iconButtonStyles = {
    padding: "8px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px"
  };

  const iconButtonVariants = {
    default: {
      ...iconButtonStyles,
      background: "#f8f9fa",
      color: "#6c757d"
    },
    approve: {
      ...iconButtonStyles,
      background: "rgba(40, 167, 69, 0.1)",
      color: "#28a745"
    },
    reject: {
      ...iconButtonStyles,
      background: "rgba(220, 53, 69, 0.1)",
      color: "#dc3545"
    }
  };

  // Modal styles
  const modalOverlayStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px"
  };

  const modalCardStyles = {
    background: "white",
    borderRadius: "12px",
    padding: "24px",
    maxWidth: "600px",
    width: "100%",
    maxHeight: "80vh",
    overflowY: "auto",
    position: "relative",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
  };

  const modalCloseStyles = {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#6c757d",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "all 0.3s ease"
  };

  // Docs modal styles
  const docsModalStyles = {
    padding: "10px 0"
  };

  const docListStyles = {
    listStyle: "none",
    padding: 0,
    margin: "20px 0 0 0"
  };

  const docListItemStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    border: "1px solid #eaeaea",
    borderRadius: "6px",
    marginBottom: "8px",
    background: "#f8f9fa",
    transition: "all 0.3s ease"
  };

  const docLinkStyles = {
    color: "#007bff",
    textDecoration: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    background: "white",
    border: "1px solid #007bff",
    fontSize: "12px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px"
  };

  // Details modal styles
  const detailsGridStyles = {
    display: "grid",
    gap: "12px",
    marginTop: "20px",
    maxHeight: "400px",
    overflowY: "auto",
    padding: "10px"
  };

  const detailRowStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    background: "#f8f9fa",
    borderRadius: "6px",
    border: "1px solid #eaeaea"
  };

  // Title styles
  const titleStyles = {
    color: "#2c3e50",
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "24px",
    borderBottom: "2px solid #3498db",
    paddingBottom: "8px"
  };

  const modalTitleStyles = {
    color: "#2c3e50",
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  };

  // Fetch all registered users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/subscriptions/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      console.log(data)
      if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Approve user
  const approveUser = async (id) => {
    try {
      const token = getAuthToken();
      
      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You are about to approve this user's subscription!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, approve it!',
        cancelButtonText: 'Cancel',
        reverseButtons: true
      });

      if (!result.isConfirmed) {
        return; // User cancelled the action
      }

      const response = await fetch(
        `${API_BASE_URL}/subscriptions/${id}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to approve user");

      const data = await response.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, status: "approved" } : u))
        );
        
        // Show success message with plot count
        await Swal.fire({
          title: 'Approved!',
          html: `User approved successfully for <strong>${data.data.plotIds.length} plot(s)</strong>!`,
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      }
    } catch (err) {
      console.error("Error approving user:", err);
      
      // Show error message
      await Swal.fire({
        title: 'Error!',
        text: 'Could not approve user. Please try again.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
    }
  };

  // Reject user
  const rejectUser = async (id) => {
    try {
      const token = getAuthToken();
      
      // Show confirmation dialog for reject
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You are about to reject this user's subscription!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, reject it!',
        cancelButtonText: 'Cancel',
        reverseButtons: true
      });

      if (!result.isConfirmed) {
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/subscriptions/${id}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to reject user");

      const data = await response.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, status: "rejected" } : u))
        );
        
        await Swal.fire({
          title: 'Rejected!',
          text: 'User subscription has been rejected.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      }
    } catch (err) {
      console.error("Error rejecting user:", err);
      
      await Swal.fire({
        title: 'Error!',
        text: 'Could not reject user. Please try again.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add CSS animation for spinner
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Modal close
  const closeModal = () => {
    setSelectedUser(null);
    setModalType(null);
  };

  if (loading) {
    return (
      <div style={containerStyles}>
        <div style={loadingStyles}>
          <div style={spinnerStyles}></div>
          <p>Loading registered Client...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <h2 style={titleStyles}>Registered Client</h2>

      {error && (
        <div style={alertErrorStyles}>
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      <table style={tableStyles}>
        <thead>
          <tr>
            <th style={thStyles}>#</th>
            <th style={thStyles}>Name</th>
            <th style={thStyles}>Email</th>
            <th style={thStyles}>Phone Number</th>
            <th style={thStyles}>Layout</th>
            <th style={thStyles}>Total Price</th>
            <th style={thStyles}>Plots</th>
            <th style={thStyles}>Status</th>
            <th style={{...thStyles, textAlign: "center"}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="9" style={{...tdStyles, textAlign: "center"}}>
                No registered users found.
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user.id} style={trStyles}>
                <td style={tdStyles}>{index + 1}</td>
                <td style={tdStyles}>{user.name || "-"}</td>
                <td style={tdStyles}>{user.email || "-"}</td>
                <td style={tdStyles}>{user.phone_number || "-"}</td>
                <td style={tdStyles}>{user.layout_name || "-"}</td>
                <td style={tdStyles}>{user.price || "-"}</td>
                <td style={tdStyles}>{user.number_of_plots || 0}</td>
                <td style={tdStyles}>
                  <span
                    style={statusBadgeStyles[user.status] || statusBadgeStyles.pending}
                  >
                    {user.status || "pending"}
                  </span>
                </td>
                <td style={tdStyles}>
                  <div style={actionButtonsStyles}>
                    <button
                      style={iconButtonVariants.default}
                      title="View Documents"
                      onClick={() => {
                        setSelectedUser(user);
                        setModalType("docs");
                      }}
                    >
                      <i className="fas fa-file-alt"></i>
                    </button>
                    <button
                      style={iconButtonVariants.default}
                      title="View Details"
                      onClick={() => {
                        setSelectedUser(user);
                        setModalType("details");
                      }}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    {user.status !== "approved" && (
                      <button
                        style={iconButtonVariants.approve}
                        title="Approve User"
                        onClick={() => approveUser(user.id)}
                      >
                        <i className="fas fa-user-check"></i>
                      </button>
                    )}
                    {user.status !== "rejected" && (
                      <button
                        style={iconButtonVariants.reject}
                        title="Reject User"
                        onClick={() => rejectUser(user.id)}
                      >
                        <i className="fas fa-user-times"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* MODAL */}
      {selectedUser && (
        <div style={modalOverlayStyles} onClick={closeModal}>
          <div style={modalCardStyles} onClick={(e) => e.stopPropagation()}>
            <button style={modalCloseStyles} onClick={closeModal}>
              ×
            </button>

            {modalType === "docs" && (
              <div style={docsModalStyles}>
                <h3 style={modalTitleStyles}>
                  <i className="fas fa-file-alt"></i> Uploaded Documents
                </h3>
                <ul style={docListStyles}>
                  {selectedUser.passport_photo && (
                    <li style={docListItemStyles}>
                      <span>📸 Passport Photo</span>
                      <a
                        href={`https://musabaha-homes.onrender.com/uploads/${selectedUser.passport_photo}`}

                        target="_blank"
                        rel="noopener noreferrer"
                        style={docLinkStyles}
                      >
                        <i className="fas fa-eye"></i> View
                      </a>
                    </li>
                  )}

                  {selectedUser.identification_file && (
                    <li style={docListItemStyles}>
                      <span>🪪 Identification</span>
                      <a

                        href={`https://musabaha-homes.onrender.com/uploads/${selectedUser.identification_file}`}

                        target="_blank"
                        rel="noopener noreferrer"
                        style={docLinkStyles}
                      >
                        <i className="fas fa-eye"></i> View
                      </a>
                    </li>
                  )}

                  {selectedUser.utility_bill_file && (
                    <li style={docListItemStyles}>
                      <span>💡 Utility Bill</span>
                      <a

                        href={`https://musabaha-homes.onrender.com/uploads/${selectedUser.utility_bill_file}`}

                        target="_blank"
                        rel="noopener noreferrer"
                        style={docLinkStyles}
                      >
                        <i className="fas fa-eye"></i> View
                      </a>
                    </li>
                  )}

                  {selectedUser.signature_file && (
                    <li style={docListItemStyles}>
                      <span>✍️ Signature</span>
                      <a
                        href={`https://musabaha-homes.onrender.com/uploads/${selectedUser.signature_file}`}

                        target="_blank"
                        rel="noopener noreferrer"
                        style={docLinkStyles}
                      >
                        <i className="fas fa-eye"></i> View
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {modalType === "details" && (
              <>
                <h3 style={modalTitleStyles}>
                  <i className="fas fa-user"></i> User Details
                </h3>
                <div style={detailsGridStyles}>
                  {Object.entries(selectedUser).map(([key, value]) => (
                    <div key={key} style={detailRowStyles}>
                      <strong>{key}:</strong> <span>{value || "-"}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRegisteredUsers;