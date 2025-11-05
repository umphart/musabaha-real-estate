import React, { useState, useEffect } from 'react';
import { FiX, FiCreditCard, FiCalendar, FiFileText, FiUser, FiPhone, FiLayers, FiHome, FiUpload, FiCheck, FiCheckCircle } from 'react-icons/fi';
import { FaNairaSign } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import 'animate.css';
import SubsequentPaymentModal from './SubsequentPaymentModal';
import { styles } from './styles';

const PaymentModal = ({ plot, user, onClose, onSuccess }) => {
  const [paymentData, setPaymentData] = useState({
    amount: calculateInitialAmount(plot),
    paymentMethod: 'bank_transfer',
    transactionDate: new Date().toISOString().split('T')[0],
    notes: '',
    receiptFile: null,
    confirmed: false
  });

  const [isAlreadyApproved, setIsAlreadyApproved] = useState(false);
  const [showSubsequentModal, setShowSubsequentModal] = useState(false);
const [showPaymentModal, setShowPaymentModal] = useState(false);
  const fetchPaymentsAgain = () => onSuccess && onSuccess();

  // Check if plot is already approved (usersTable plots are pre-approved)
  useEffect(() => {
    if (plot.source === 'usersTable') {
      setIsAlreadyApproved(true);
    }
  }, [plot.source]);

  // Function to get auth token from localStorage - UPDATED
  const getAuthToken = () => {
    return localStorage.getItem('userToken') || localStorage.getItem('token') || localStorage.getItem('authToken');
  };

  function calculateInitialAmount(plot) {
    if (plot.source === 'usersTable') {
      return '0'; // No payment needed for usersTable plots
    }
    return (plot.number_of_plots * 500000).toFixed(2);
  }

  function formatCurrency(value) {
    if (!value || isNaN(value)) return "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(Number(value));
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      Swal.fire({
        toast: true,
        icon: 'success',
        title: 'Account number copied!',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1200
      });
    });
  };

  // Function to handle usersTable payments using createPayment function
  const createUsersTablePayment = async (paymentData) => {
    // This should not be called for usersTable plots as they're already approved
    return {
      success: false,
      message: 'This plot is already approved and does not require payment.'
    };
  };

  // Function to handle subscription payments (existing endpoint)
  const createSubscriptionPayment = async (paymentData) => {
    const token = getAuthToken();
    const formData = new FormData();
    
    formData.append('name', plot.name);
    formData.append('contact', plot.contact); 
    formData.append('subscriptionId', plot.id);
    formData.append('userId', user.id);
    formData.append('plotId', plot.plot_id || plot.id);
    formData.append('paymentMethod', paymentData.paymentMethod);
    formData.append('transactionDate', paymentData.transactionDate);
    formData.append('notes', paymentData.notes);
    formData.append('confirmed', paymentData.confirmed);
    formData.append('plotSize', plot.plot_size);
    formData.append('numberOfPlots', plot.number_of_plots);
    formData.append('totalPrice', plot.total_price);
    formData.append('amount', paymentData.amount);
    formData.append('source', plot.source);
    
    if (paymentData.receiptFile) {
      formData.append('receipt', paymentData.receiptFile);
    }

    // Add authorization header if token exists
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {

      const response = await fetch('https://musabaha-homes.onrender.com/api/user-payments', {
        method: 'POST',
        headers: headers,
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating subscription payment:', error);
      return {
        success: false,
        message: error.message || 'Failed to create payment'
      };
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent payment for already approved usersTable plots
    if (isAlreadyApproved || plot.source === 'usersTable') {
      Swal.fire({
        title: 'Plot Already Approved!',
        text: 'This plot is already approved and does not require payment.',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#667eea'
      });
      return;
    }
    
    // Check if user is authenticated for subscription payments
    if (!getAuthToken()) {
      Swal.fire({
        title: 'Authentication Required!',
        text: 'Please log in to make payments.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#667eea'
      });
      return;
    }
    
    if (!paymentData.receiptFile) {
      Swal.fire({
        title: 'Receipt Required!',
        text: 'Please upload your payment receipt to proceed.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    // Validate amount
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      Swal.fire({
        title: 'Invalid Amount!',
        text: 'Please enter a valid payment amount.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#667eea'
      });
      return;
    }
    
    try {
      let result;

      // Only subscription payments are processed
      console.log('Creating subscription payment for subscription:', plot.id);
      result = await createSubscriptionPayment(paymentData);
      
      if (result.success) {
        Swal.fire({
          title: 'Success! 🎉',
          text: 'Payment submitted successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#667eea',
          timer: 3000,
          timerProgressBar: true,
          showClass: {
            popup: 'animate__animated animate__bounceIn'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });
        
        onSuccess();
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Payment submission failed: ' + (result.message || 'Unknown error'),
          icon: 'error',
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Error submitting payment. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header with Account Info */}
        <div style={styles.modalHeader}>
          <div style={styles.modalTitle}>
            <FiCreditCard style={styles.modalTitleIcon} />
            <div>
              <h3 style={{ margin: 0, fontSize: '20px' }}>
                {plot.source === 'usersTable' ? 'Plot Details - Already Approved' : 'Make Payment - Subscription'}
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                {plot.plot_name || plot.layout_name}
              </p>
            </div>
          </div>
          <button 
            style={styles.modalClose}
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>

        {/* Show different message for usersTable plots */}
{plot.source === "usersTable" ? (
  <>
    <p style={{ color: "green", fontWeight: 600 }}>
      ✅ Plot Approved — Make Subsequent Payment Below
    </p>

<button
  onClick={() => setShowSubsequentModal(true)}
  style={{
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '12px',
    fontSize: '14px',
    fontWeight: 600,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  }}
>
  <FiCreditCard size={16} />
  Make Subsequent Payment
</button>


    {showSubsequentModal && (
      <SubsequentPaymentModal
        plot={plot}
        user={user}
        onClose={() => setShowSubsequentModal(false)}
        onSuccess={fetchPaymentsAgain}
      />
    )}
  </>
) : (
  <button onClick={() => setShowPaymentModal(true)}>
    Make Initial Payment
  </button>
)}


        {/* Account Numbers Section - Only show for non-usersTable plots */}
        {plot.source !== 'usersTable' && (
          <div style={{ 
            background: '#f8f9fa',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '14px 16px',
            margin: '0 24px 15px 24px',
            fontSize: 14,
            color: '#1a202c'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              flexWrap: 'wrap',
              gap: '10px',
              alignItems: 'center'
            }}>
              {/* Moniepoint MFB */}
              <div style={{display:'flex', alignItems:'center', gap:6}}>
                <strong>🏦 Moniepoint MFB:</strong>
                <span style={{fontFamily:'monospace'}}>4957926955</span>
                <button 
                  onClick={() => copyToClipboard('4957926955')}
                  style={{
                    background: '#4f46e5', color: 'white', border: 'none',
                    borderRadius: 5, padding: '4px 8px', fontSize: 12, cursor: 'pointer'
                  }}
                >
                  📋 Copy
                </button>
              </div>

              {/* Stanbic IBTC */}
              <div style={{display:'flex', alignItems:'center', gap:6}}>
                <strong>🏦 Stanbic IBTC:</strong>
                <span style={{fontFamily:'monospace'}}>0069055648</span>
                <button 
                  onClick={() => copyToClipboard('0069055648')}
                  style={{
                    background: '#2563eb', color: 'white', border: 'none',
                    borderRadius: 5, padding: '4px 8px', fontSize: 12, cursor: 'pointer'
                  }}
                >
                  📋 Copy
                </button>
              </div>
            </div>

            {/* Shared Account Name */}
            <p style={{
              marginTop: 10,
              fontStyle: 'italic',
              color: '#555',
              textAlign: 'center'
            }}>
              Account Name: <strong>Musabaha Homes and Related Services</strong>
            </p>

            <small style={{
              color:'#555', 
              fontStyle:'italic', 
              display:'block',
              textAlign: 'center',
              marginTop: 4
            }}>
              💡 After payment, upload your receipt below to confirm your transaction.
            </small>
          </div>
        )}

        {/* Modal Body */}
        <div style={styles.modalBody}>
          <form onSubmit={handlePaymentSubmit} style={styles.paymentForm}>
            
            {/* User Information Grid */}
            <div style={styles.infoGrid}>
              <div style={styles.infoGroup}>
                <label style={styles.inputLabel}>
                  <FiUser /> Customer Name
                </label>
                <input 
                  type="text" 
                  value={plot.name || ""} 
                  disabled 
                  style={styles.disabledInput}
                />
              </div>

              <div style={styles.infoGroup}>
                <label style={styles.inputLabel}>
                  <FiPhone /> Contact Number
                </label>
                <input 
                  type="text" 
                  value={plot.contact} 
                  disabled 
                  style={styles.disabledInput}
                />
              </div>

              <div style={styles.infoGroup}>
                <label style={styles.inputLabel}>
                  <FiLayers /> Number of Plots
                </label>
                <input 
                  type="text" 
                  value={plot.number_of_plots || ""} 
                  disabled 
                  style={styles.disabledInput}
                />
              </div>

              <div style={styles.infoGroup}>
                <label style={styles.inputLabel}>
                  <FiHome /> Plot Size
                </label>
                <input 
                  type="text" 
                  value={plot.plot_size || ""} 
                  disabled 
                  style={styles.disabledInput}
                />
              </div>

              <div style={styles.infoGroup}>
                <label style={styles.inputLabel}>
                  <FaNairaSign /> Total Price
                </label>
                <input 
                  type="text" 
                  value={formatCurrency(plot.total_price) || ""} 
                  disabled 
                  style={styles.disabledInput}
                />
              </div>

              <div style={styles.infoGroup}>
                <label style={styles.inputLabel}>
                  <FaNairaSign /> Amount to Pay
                </label>
                <input 
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                  required
                  disabled={plot.source === 'usersTable'}
                  style={{
                    ...styles.input,
                    ...(plot.source === 'usersTable' ? styles.disabledInput : {})
                  }}
                  placeholder="Enter payment amount"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Payment Details - Only show for non-usersTable plots */}
            {plot.source !== 'usersTable' && (
              <>
                <div style={styles.paymentGrid}>
                  <div style={styles.infoGroup}>
                    <label style={styles.inputLabel}>
                      <FiCreditCard /> Payment Method
                    </label>
                    <select
                      value={paymentData.paymentMethod}
                      onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                      required
                      style={styles.selectInput}
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="card">Credit/Debit Card</option>
                      <option value="ussd">USSD</option>
                      <option value="bank_deposit">Bank Deposit</option>
                      <option value="cash">Cash Deposit</option>
                    </select>
                  </div>

                  <div style={styles.infoGroup}>
                    <label style={styles.inputLabel}>
                      <FiCalendar /> Transaction Date
                    </label>
                    <input
                      type="date"
                      value={paymentData.transactionDate}
                      onChange={(e) => setPaymentData({...paymentData, transactionDate: e.target.value})}
                      required
                      style={styles.input}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div style={styles.infoGroup}>
                  <label style={styles.inputLabel}>
                    <FiUpload /> Upload Payment Receipt *
                  </label>
                  <div style={styles.fileUploadArea}>
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // Validate file size (5MB max)
                          if (file.size > 5 * 1024 * 1024) {
                            Swal.fire({
                              title: 'File Too Large!',
                              text: 'Please upload a file smaller than 5MB.',
                              icon: 'warning',
                              confirmButtonText: 'OK'
                            });
                            return;
                          }
                          setPaymentData({...paymentData, receiptFile: file});
                        }
                      }}
                      accept=".jpg,.jpeg,.png,.pdf"
                      required
                      style={styles.fileInput}
                    />
                    <div style={styles.uploadPlaceholder}>
                      <FiUpload size={24} />
                      <p>Click to upload receipt</p>
                      <small>JPG, PNG, PDF (Max 5MB)</small>
                    </div>
                  </div>
                  {paymentData.receiptFile && (
                    <div style={styles.filePreview}>
                      <FiFileText />
                      <span>{paymentData.receiptFile.name}</span>
                      <button 
                        type="button"
                        onClick={() => setPaymentData({...paymentData, receiptFile: null})}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          marginLeft: '8px',
                          fontSize: '12px'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div style={styles.infoGroup}>
                  <label style={styles.inputLabel}>
                    Additional Notes
                  </label>
                  <textarea
                    value={paymentData.notes}
                    onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
                    placeholder="Any additional information about this payment..."
                    rows="3"
                    style={styles.textarea}
                  />
                </div>

                {/* Confirmation */}
                <div style={styles.confirmationBox}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={paymentData.confirmed}
                      onChange={(e) => setPaymentData({...paymentData, confirmed: e.target.checked})}
                      required
                      style={styles.checkbox}
                    />
                    <span>I confirm that I have made the payment with the details provided above</span>
                  </label>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div style={styles.modalActions}>
              <button 
                type="button" 
                style={styles.cancelButton}
                onClick={onClose}
              >
                Close
              </button>
              
              {/* Only show Submit Payment button for non-usersTable plots */}
              {plot.source !== 'usersTable' && (
                <button 
                  type="submit" 
                  style={{
                    ...styles.submitButton,
                    ...(!paymentData.confirmed || !paymentData.receiptFile ? styles.submitButtonDisabled : {})
                  }}
                  disabled={!paymentData.confirmed || !paymentData.receiptFile}
                >
                  <FiCheck style={styles.buttonIcon} />
                  Submit Payment Proof
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;