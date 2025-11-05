import React, { useState } from 'react';
import { 
  FiUser, FiX, FiDollarSign, FiPlus, FiClock, FiFileText,
  FiCheckCircle, FiCreditCard, FiCalendar, FiMapPin, FiPieChart,
  FiEdit, FiTrash2
} from 'react-icons/fi';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { getAuthToken, showAlert, formatCurrency, calculateTotalPrice, convertAmountToWords, generateReceipt } from './adminUtils';

const ViewModal = ({ user, onClose, onRefresh }) => {
  const [paymentData, setPaymentData] = useState({ 
    amount: '', 
    date: new Date().toISOString().slice(0, 16), 
    note: '',
    admin: ''
  });
  const [editingPayment, setEditingPayment] = useState(null); // State for edit modal
  const [editFormData, setEditFormData] = useState({ // State for edit form
    amount: '',
    date: '',
    note: '',
    admin: ''
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://musabaha-homes.onrender.com/api';

const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setEditFormData({
        amount: payment.amount.toString(),
        date: new Date(payment.date).toISOString().slice(0, 16),
        note: payment.note || '',
        admin: payment.admin || payment.recorded_by || ''
    });
    // Log payment ID being edited
    console.log('Editing Payment ID:', payment.id);
};

// Update Payment Function
const handleUpdatePayment = async () => {
    if (!editFormData.amount) {
        showAlert('error', 'Please enter a payment amount.');
        return;
    }

    try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/admin/payments/${editingPayment.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: parseFloat(editFormData.amount),
                date: editFormData.date,
                note: editFormData.note,
                admin: editFormData.admin
            })
        });

        const data = await response.json();
        console.log('Update Response:', data); // Log response from update

        if (data.success) {
            setEditingPayment(null);
            setEditFormData({ amount: '', date: '', note: '', admin: '' });
            showAlert('success', 'Payment updated successfully.');
            onRefresh();
        } else {
            showAlert('error', data.message || 'Failed to update payment.');
        }
    } catch (error) {
        console.error('Error updating payment:', error);
        showAlert('error', 'Failed to update payment. Please try again.');
    }
};

// Delete Payment with SweetAlert Confirmation
const handleDeletePayment = async (paymentId) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_BASE_URL}/admin/payments/${paymentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            console.log('Delete Response:', data); // Log response from delete

            if (data.success) {
                Swal.fire(
                    'Deleted!',
                    'Payment has been deleted successfully.',
                    'success'
                );
                onRefresh();
            } else {
                Swal.fire(
                    'Error!',
                    data.message || 'Failed to delete payment.',
                    'error'
                );
            }
        } catch (error) {
            console.error('Error deleting payment:', error);
            Swal.fire(
                'Error!',
                'Failed to delete payment. Please try again.',
                'error'
            );
        }
    }
};

  const handleAddPayment = async (userId) => {
    if (!paymentData.amount) {
      showAlert('error', 'Please enter a payment amount.');
      return;
    }

    try {
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/admin/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          amount: parseFloat(paymentData.amount),
          date: paymentData.date,
          note: paymentData.note,
          admin: paymentData.admin
        })
      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        setPaymentData({
          amount: '',
          date: new Date().toISOString().slice(0, 16),
          note: '',
          admin: paymentData.admin
        });
        showAlert('success', 'Payment added successfully.');
        onRefresh();
      } else {
        showAlert('error', data.message || 'Failed to add payment.');
      }
    } catch (error) {
      console.error('Error adding payment:', error);
      showAlert('error', 'Failed to add payment. Please try again.');
    }
  };

  const calculateRemainingBalance = (user) => {
    const totalPlotPrice = calculateTotalPrice(user.price_per_plot);
    const totalSubsequentPayments = (user.payments || []).reduce(
      (sum, p) => sum + parseFloat(p.amount || 0),
      0
    );
    const initialDeposit = parseFloat(user.initial_deposit || 0);
    const totalPaid = initialDeposit + totalSubsequentPayments;
    
    return Math.max(0, totalPlotPrice - totalPaid);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3><FiUser className="icon" /> User Details: {user.name}</h3>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="modal-body">
          <div className="user-details">
            {/* User details section remains the same */}
            <div className="detail-row">
              <div className="detail-item">
                <label>Contact:</label>
                <span>{user.contact}</span>
              </div>
              <div className="detail-item">
                <label>Plot Taken:</label>
                <span>{user.plot_taken}</span>
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-item">
                <label>Date Taken:</label>
                <span>{user.date_taken}</span>
              </div>
              <div className="detail-item">
                <label>Payment Schedule:</label>
                <span>{user.payment_schedule}</span>
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-item">
                <label>Total Price:</label>
                <span className="total-price">{formatCurrency(calculateTotalPrice(user.price_per_plot))}</span>
              </div>
              <div className="detail-item">
                <label>Initial Deposit:</label>
                <span className="deposit">{formatCurrency(user.initial_deposit)}</span>
              </div>
            </div>
           
            
            {user.payments && (
              <div className="payment-summary">
                <div className="summary-row">
                  <label>Total Subsequent Payments:</label>
                  <span>{formatCurrency(user.payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0))}</span>
                </div>
                <div className="summary-row">
                  <label>Total Paid (Deposit + Payments):</label>
                  <span className="total-paid">
                    {formatCurrency(parseFloat(user.initial_deposit || 0) + user.payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0))}
                  </span>
                </div>
                <div className="summary-row outstanding">
                  <label>Outstanding Balance:</label>
                  <span className={calculateRemainingBalance(user) === 0 ? 'paid' : 'pending'}>
                    {formatCurrency(calculateRemainingBalance(user))}
                  </span>
                </div>
              </div>
            )}
            
            <div className="detail-row">
              <div className="detail-item">
                <label>Status:</label>
                <span className={`status-badge ${user.status.toLowerCase()}`}>
                  {user.status === 'Completed' && <FiCheckCircle className="icon" />}
                  {user.status}
                </span>
              </div>
            </div>
          </div>

          {/* Payment History Section */}
          <div className="payment-section">
            <h4><FiDollarSign className="icon" /> Payment History</h4>
            {user.payments && user.payments.map(payment => (
              <div key={payment.id} className="payment-item">
                <div className="payment-info">
                  <div className="payment-date">
                    <FiClock className="icon" /> 
                    {formatDateTime(payment.date)}
                  </div>
                  <div className="payment-note">{payment.note}</div>
                  <div className="payment-admin">Recorded by: {payment.admin || payment.recorded_by || "Admin"}</div>
                </div>
                <div className="payment-actions">
                  <div className="payment-amount">{formatCurrency(payment.amount)}</div>
                  <div style={{ display: 'flex', gap: '2px' }}> {/* Reduced gap */}
                    <button 
                      onClick={() => generateReceipt(payment, user)}
                      title="Download Receipt"
                      style={{ backgroundColor: 'transparent', border: 'none', color: '#28a745', padding: '4px' }}
                    >
                      <FiFileText />
                    </button>
                    <button 
                      onClick={() => handleEditPayment(payment)}
                      title="Edit Payment"
                      style={{ backgroundColor: 'transparent', border: 'none', color: '#007bff', padding: '4px' }}
                    >
                      <FiEdit />
                    </button>
                    <button 
                      onClick={() => handleDeletePayment(payment.id)}
                      title="Delete Payment"
                      style={{ backgroundColor: 'transparent', border: 'none', color: '#dc3545', padding: '4px' }}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Payment Section */}
          <div className="add-payment-section">
            <h4><FiPlus className="icon" /> Add New Payment</h4>
            <div className="payment-form">
              <div className="form-group">
                <label>Amount (₦) *</label>
                <input
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                  required
                  placeholder="Enter payment amount"
                />
              </div>
              <div className="form-group">
                <label>Date & Time</label>
                <input
                  type="datetime-local"
                  value={paymentData.date}
                  onChange={(e) => setPaymentData({...paymentData, date: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Note</label>
                <input
                  type="text"
                  value={paymentData.note}
                  onChange={(e) => setPaymentData({...paymentData, note: e.target.value})}
                  placeholder="Payment note (e.g., Monthly installment)"
                />
              </div>
              <div className="form-group">
                <label>Recorded By</label>
                <input
                  type="text"
                  value={paymentData.admin}
                  onChange={(e) => setPaymentData({...paymentData, admin: e.target.value})}
                  placeholder="Admin name"
                />
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => handleAddPayment(user.id)}
                disabled={!paymentData.amount}
              >
                Add Payment
              </button>
            </div>
          </div>
        </div>
      </div>

{/* Edit Payment Modal */}
{editingPayment && (
  <div 
    className="modal-overlay" 
    onClick={() => setEditingPayment(null)}
    style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(15, 23, 42, 0.7)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
      padding: '20px'
    }}
  >
    <div 
      className="modal-content" 
      onClick={(e) => e.stopPropagation()}
      style={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '16px',
        padding: 0,
        width: '420px',
        maxWidth: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}
    >
      {/* Header */}
      <div style={{
        padding: '20px 24px 16px',
        borderBottom: '1px solid #e2e8f0',
        background: 'transparent'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiEdit style={{ color: 'white', fontSize: '16px' }} />
            </div>
            <h3 style={{ 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1e293b'
            }}>
              Edit Payment
            </h3>
          </div>
          <button 
            onClick={() => setEditingPayment(null)}
            style={{ 
              width: '32px',
              height: '32px',
              background: 'rgba(100, 116, 139, 0.1)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FiX />
          </button>
        </div>
      </div>
      
      {/* Form Body */}
      <div style={{ 
        padding: '20px 24px',
        maxHeight: 'calc(90vh - 120px)',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Compact Amount Field */}
          <div>
            <label style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: '#475569',
              marginBottom: '6px',
              display: 'block'
            }}>
              Amount (₦) *
            </label>
            <input
              type="number"
              value={editFormData.amount}
              onChange={(e) => setEditFormData({...editFormData, amount: e.target.value})}
              required
              placeholder="0.00"
              style={{
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                width: '100%',
                outline: 'none',
                background: 'white'
              }}
            />
          </div>

          {/* Compact Date Field */}
          <div>
            <label style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: '#475569',
              marginBottom: '6px',
              display: 'block'
            }}>
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={editFormData.date}
              onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
              style={{
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                width: '100%',
                outline: 'none',
                background: 'white'
              }}
            />
          </div>

          {/* Compact Note Field */}
          <div>
            <label style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: '#475569',
              marginBottom: '6px',
              display: 'block'
            }}>
              Note
            </label>
            <input
              type="text"
              value={editFormData.note}
              onChange={(e) => setEditFormData({...editFormData, note: e.target.value})}
              placeholder="Payment note"
              style={{
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                width: '100%',
                outline: 'none',
                background: 'white'
              }}
            />
          </div>

          {/* Compact Admin Field */}
          <div>
            <label style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: '#475569',
              marginBottom: '6px',
              display: 'block'
            }}>
              Recorded By
            </label>
            <input
              type="text"
              value={editFormData.admin}
              onChange={(e) => setEditFormData({...editFormData, admin: e.target.value})}
              placeholder="Admin name"
              style={{
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                width: '100%',
                outline: 'none',
                background: 'white'
              }}
            />
          </div>

          {/* Compact Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            justifyContent: 'flex-end', 
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <button 
              onClick={() => setEditingPayment(null)}
              style={{
                padding: '8px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                color: '#64748b',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button 
              onClick={handleUpdatePayment}
              disabled={!editFormData.amount}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: !editFormData.amount ? '#9ca3af' : '#3b82f6',
                color: 'white',
                fontSize: '13px',
                fontWeight: '500',
                cursor: !editFormData.amount ? 'not-allowed' : 'pointer'
              }}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ViewModal;