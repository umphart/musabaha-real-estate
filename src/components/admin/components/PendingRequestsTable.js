import { FiUser, FiCheck, FiEye, FiX, FiClock } from "react-icons/fi";
import Swal from 'sweetalert2';
import { contentTableStyles, tableHeaderStyles, tableTitleStyles, tableStyles, thStyles, tdStyles, trStyles } from "../styles/componentStyles";

const API_BASE_URL = 'https://musabaha-homes.onrender.com/api';

const PendingRequestsTable = ({ 
  pendingRequests, 
  formatCurrency, 
  setSelectedRequest, 
  setShowModal,
  setPendingRequests,
  fetchUsers, // Add this prop to refresh users data
  fetchPendingRequests // Add this prop to refresh pending requests properly
}) => {
  
  // Handle approve action - UPDATED to use user_id
  const handleApprove = async (request) => {
    try {
      const response = await fetch(`https://musabaha-homes.onrender.com/api/approve-payment/payment-requests/${request.id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: request.user_id // Send user_id in the request body
        })
      });
      
      console.log('Approve response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        
        // Refresh both users and pending requests
        if (fetchUsers) {
          await fetchUsers();
        }
        if (fetchPendingRequests) {
          await fetchPendingRequests();
        } else {
          // Fallback: remove from local state
          setPendingRequests(prev => prev.filter(req => req.id !== request.id));
        }
        
        return result;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve payment');
      }
    } catch (error) {
      console.error('Approval failed:', error);
      throw error;
    }
  };

  // Handle reject action
  const handleReject = async (request) => {
    try {
      const response = await fetch(`https://musabaha-homes.onrender.com/api/approve-payment/payment-requests/${request.id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Reject response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        
        // Refresh both users and pending requests
        if (fetchUsers) {
          await fetchUsers();
        }
        if (fetchPendingRequests) {
          await fetchPendingRequests();
        } else {
          // Fallback: remove from local state
          setPendingRequests(prev => prev.filter(req => req.id !== request.id));
        }
        
        return result;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject payment');
      }
    } catch (error) {
      console.error('Rejection failed:', error);
      throw error;
    }
  };

  const viewReceipt = (receiptFile) => {
    if (receiptFile) {
      const receiptUrl = `${API_BASE_URL}/uploads/receipts/${receiptFile}`;
      window.open(receiptUrl, '_blank');
    } else {
      Swal.fire({
        icon: 'info',
        title: 'No Receipt',
        text: 'No receipt file available for this payment request.',
        confirmButtonColor: '#3498db'
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: '#f39c12', bgColor: 'rgba(243, 156, 18, 0.1)', label: 'Pending' },
      approved: { color: '#27ae60', bgColor: 'rgba(39, 174, 96, 0.1)', label: 'Approved' },
      rejected: { color: '#e74c3c', bgColor: 'rgba(231, 76, 60, 0.1)', label: 'Rejected' },
      completed: { color: '#3498db', bgColor: 'rgba(52, 152, 219, 0.1)', label: 'Completed' }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
        color: config.color,
        backgroundColor: config.bgColor,
        border: `1px solid ${config.color}20`
      }}>
        <FiClock size={12} />
        {config.label}
      </div>
    );
  };

  const handleApproveClick = async (request) => {
    try {
      await handleApprove(request);
      Swal.fire({
        icon: 'success',
        title: 'Approved!',
        text: 'Payment request has been approved successfully.',
        confirmButtonColor: '#27ae60'
      });
    } catch (error) {
      console.error('Approval error details:', error);
      
      let errorMessage = 'Failed to approve payment request. Please try again.';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.message.includes('404')) {
        errorMessage = 'API endpoint not found. Please check the server.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Approval Failed',
        text: errorMessage,
        confirmButtonColor: '#e74c3c'
      });
    }
  };

  const handleRejectClick = async (request) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Confirm Rejection',
      text: 'Are you sure you want to reject this payment request?',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reject',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#95a5a6'
    });

    if (result.isConfirmed) {
      try {
        await handleReject(request);
        Swal.fire({
          icon: 'success',
          title: 'Rejected!',
          text: 'Payment request has been rejected successfully.',
          confirmButtonColor: '#27ae60'
        });
      } catch (error) {
        console.error('Rejection error details:', error);
        
        let errorMessage = 'Failed to reject payment request. Please try again.';
        
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Cannot connect to server. Please check your internet connection.';
        } else if (error.message.includes('401')) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (error.message.includes('404')) {
          errorMessage = 'API endpoint not found. Please check the server.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Rejection Failed',
          text: errorMessage,
          confirmButtonColor: '#e74c3c'
        });
      }
    }
  };

  return (
    <div style={contentTableStyles}>
      <div style={tableHeaderStyles}>
        <span style={tableTitleStyles}>
          Pending Payment Requests ({pendingRequests.length})
        </span>
      </div>
      
      <table style={tableStyles}>
        <thead>
          <tr>
            <th style={thStyles}>S.No</th>
            <th style={thStyles}>User</th>
            <th style={thStyles}>Plot</th>
            <th style={thStyles}>Amount</th>
            <th style={thStyles}>Payment Method</th>
            <th style={thStyles}>Date</th>
            <th style={thStyles}>Status</th>
            <th style={thStyles}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request, index) => (
              <tr key={request.id} style={trStyles}>
                <td style={tdStyles}>{index + 1}</td>
                <td style={tdStyles}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiUser style={{ color: '#3498db' }} />
                    {request.user_name || `User ${request.user_id}`}
                  </div>
                </td>
                <td style={tdStyles}>{request.user_plot_taken || 'N/A'}</td>
                <td style={{...tdStyles, fontWeight: '600', color: '#27ae60'}}>
                  {formatCurrency(request.amount)}
                </td>
                <td style={tdStyles}>
                  {request.payment_method ? 
                    request.payment_method.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ') 
                    : 'Bank Transfer'
                  }
                </td>
                <td style={tdStyles}>
                  {request.transaction_date ? formatDate(request.transaction_date) : 'N/A'}
                </td>
                <td style={tdStyles}>
                  {getStatusBadge(request.status)}
                </td>
                <td style={tdStyles}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button 
                      style={{
                        padding: "6px 10px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        background: "rgba(52, 152, 219, 0.1)",
                        color: "#3498db",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px"
                      }}
                      onClick={() => viewReceipt(request.receipt_file)}
                      title="View Receipt"
                    >
                      <FiEye size={14} />
                    </button>

                    <button 
                      style={{
                        padding: "6px 10px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        background: "rgba(39, 174, 96, 0.1)",
                        color: "#27ae60",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px"
                      }}
                      onClick={() => handleApproveClick(request)}
                      title="Approve Payment"
                    >
                      <FiCheck size={14} /> 
                    </button>

                    <button 
                      style={{
                        padding: "6px 10px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        background: "rgba(231, 76, 60, 0.1)",
                        color: "#e74c3c",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px"
                      }}
                      onClick={() => handleRejectClick(request)}
                      title="Reject Payment"
                    >
                      <FiX size={14} /> 
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{...tdStyles, textAlign: 'center', padding: '40px'}}>
                <FiCheck style={{ fontSize: '48px', marginBottom: '16px', opacity: '0.5', color: '#27ae60' }} />
                <p>No pending payment requests</p>
                <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                  All payment requests have been processed.
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PendingRequestsTable;