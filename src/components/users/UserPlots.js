import React, { useState, useEffect } from 'react';
import { FiX, FiCreditCard, FiCalendar, FiFileText, FiDollarSign, FiBank, FiUpload, 
  FiUser, FiPhone, FiHome, FiLayers, FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi';
import { FaNairaSign } from 'react-icons/fa6';
import Swal from 'sweetalert2'; 
import 'animate.css';

const UserPlots = ({ user }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]); 
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amountSent: '',
    paymentMethod: 'bank_transfer',
    transactionDate: new Date().toISOString().split('T')[0],
    notes: '',
    receiptFile: null,
    confirmed: false
  });
  
  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(Number(value));
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(`https://musabaha-homes.onrender.com/api/subscriptions?email=${user.email}`);
        const result = await response.json();
        console.log('Subscriptions fetch result:', result);
        if (result.success) {
          setSubscriptions(result.data);
          
          const paymentsResponse = await fetch(
            `https://musabaha-homes.onrender.com/api/user-payments/user/${user.id}`
          );
          const paymentsData = await paymentsResponse.json();
          
          if (paymentsData.success) {
            setPayments(paymentsData.payments);
            
            const subscriptionsWithPaymentStatus = result.data.map(subscription => {
              const paymentForSubscription = paymentsData.payments.find(
                payment => payment.subscription_id === subscription.id
              );
              
              return {
                ...subscription,
                payment: paymentForSubscription || null
              };
            });
            
            setSubscriptions(subscriptionsWithPaymentStatus);
          }
        } else {
          setError('Failed to fetch subscriptions');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error loading subscription data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email && user?.id) {
      fetchSubscriptions();
    }
  }, [user]);

  const getStatusStyle = (status) => {
    const baseStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    };

    switch (status?.toLowerCase()) {
      case 'approved':
        return { 
          ...baseStyle, 
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          border: '1px solid #10b981'
        };
      case 'rejected':
        return { 
          ...baseStyle, 
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          border: '1px solid #ef4444'
        };
      default:
        return { 
          ...baseStyle, 
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          border: '1px solid #f59e0b'
        };
    }
  };
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

const handleProceedToPayment = (subscription) => {
  // Set selected subscription
  setSelectedSubscription(subscription);

  // Define payment data defaults
  const initialAmount = calculateInitialPaymentAmount(subscription);
  setPaymentData({
    amountSent: initialAmount,
    paymentMethod: 'bank_transfer',
    transactionDate: new Date().toISOString().split('T')[0],
    notes: '',
    receiptFile: null,
    confirmed: false
  });

  // Show the payment modal directly (no Swal)
  setShowPaymentModal(true);
};



  const calculateInitialPaymentAmount = (subscription) => {
    return (subscription.number_of_plots * 500000).toFixed(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
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
    
    try {
      const formData = new FormData();
      formData.append('name', selectedSubscription.name);
      formData.append('contact', selectedSubscription.phone_number); 
      formData.append('subscriptionId', selectedSubscription.id);
      formData.append('userId', user.id);
      formData.append('plotId', selectedSubscription.plot_id);
      formData.append('paymentMethod', paymentData.paymentMethod);
      formData.append('transactionDate', paymentData.transactionDate);
      formData.append('notes', paymentData.notes);
      formData.append('confirmed', paymentData.confirmed);
      formData.append('plotSize', selectedSubscription.plot_size);
      formData.append('numberOfPlots', selectedSubscription.number_of_plots);
      formData.append('totalPrice', selectedSubscription.price);
      
      const initialPaymentAmount = calculateInitialPaymentAmount(selectedSubscription);
      const outstandingBalance = selectedSubscription.price - initialPaymentAmount;
      
      formData.append('outstandingBalance', outstandingBalance);
      formData.append('amount', initialPaymentAmount);
      
      if (paymentData.receiptFile) {
        formData.append('receipt', paymentData.receiptFile);
      }

      const response = await fetch('https://musabaha-homes.onrender.com/api/user-payments', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
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
        
        setShowPaymentModal(false);
        setPaymentData({
          paymentMethod: 'bank_transfer',
          transactionDate: new Date().toISOString().split('T')[0],
          notes: '',
          confirmed: false,
          receiptFile: null
        });
        
        const subscriptionsResponse = await fetch(`https://musabaha-homes.onrender.com/api/subscriptions?email=${user.email}`);
        const subscriptionsResult = await subscriptionsResponse.json();
        if (subscriptionsResult.success) {
          setSubscriptions(subscriptionsResult.data);
        }
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Payment submission failed: ' + result.message,
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

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your plots...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>My Plots</h1>
          <p style={styles.subtitle}>Manage your plot subscriptions and payments</p>
        </div>
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>{subscriptions.length}</span>
            <span style={styles.statLabel}>Total Plots</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>
              {subscriptions.filter(s => s.status?.toLowerCase() === 'approved').length}
            </span>
            <span style={styles.statLabel}>Approved</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorAlert}>
          <FiAlertCircle style={styles.errorIcon} />
          <span>{error}</span>
        </div>
      )}

      {/* Plots Grid */}
      <div style={styles.plotsGrid}>
        {subscriptions.map((subscription) => (
          <div key={subscription.id} style={styles.plotCard}>
            {/* Card Header */}
            <div style={styles.cardHeader}>
              <div style={styles.estateInfo}>
                <h3 style={styles.estateName}>{subscription.estate_name}</h3>
                <p style={styles.plotId}>Plot #{subscription.id}</p>
              </div>
              <div style={getStatusStyle(subscription.status)}>
                {subscription.status === 'approved' && <FiCheck size={14} />}
                {subscription.status === 'pending' && <FiClock size={14} />}
                {subscription.status === 'rejected' && <FiAlertCircle size={14} />}
                {subscription.status || 'Pending'}
              </div>
            </div>

            {/* Plot Details */}
            <div style={styles.plotDetails}>
              <div style={styles.detailGrid}>
                <div style={styles.detailItem}>
                  <FiLayers style={styles.detailIcon} />
                  <div>
                    <span style={styles.detailLabel}>Plots</span>
                    <span style={styles.detailValue}>{subscription.number_of_plots}</span>
                  </div>
                </div>
                <div style={styles.detailItem}>
                  <FiHome style={styles.detailIcon} />
                  <div>
                    <span style={styles.detailLabel}>Plot Size</span>
                    <span style={styles.detailValue}>{subscription.plot_size}</span>
                  </div>
                </div>
                <div style={styles.detailItem}>
                  <FaNairaSign style={styles.detailIcon} />
                  <div>
                    <span style={styles.detailLabel}>Total Price</span>
                    <span style={styles.detailValue}>{formatCurrency(subscription.price)}</span>
                  </div>
                </div>
                <div style={styles.detailItem}>
                  <FiCalendar style={styles.detailIcon} />
                  <div>
                    <span style={styles.detailLabel}>Submitted</span>
                    <span style={styles.detailValue}>
                      {new Date(subscription.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              {subscription.payment && (
                <div style={styles.paymentStatus}>
                  <div style={styles.paymentInfo}>
                    <span style={styles.paymentLabel}>Payment Status:</span>
                    <span style={getStatusStyle(subscription.payment.status)}>
                      {subscription.payment.status || 'Pending'}
                    </span>
                  </div>
                  {subscription.payment.amount && (
                    <div style={styles.paymentInfo}>
                      <span style={styles.paymentLabel}>Amount Paid:</span>
                      <span style={styles.paymentAmount}>
                        {formatCurrency(subscription.payment.amount)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={styles.actionButtons}>
              {subscription.status?.toLowerCase() === "approved" && !subscription.payment && (
                <button
                  style={styles.primaryButton}
                  onClick={() => handleProceedToPayment(subscription)}
                >
                  <FiCreditCard style={styles.buttonIcon} />
                  Proceed to Payment
                </button>
              )}

              {subscription.payment && 
              (subscription.payment.status?.toLowerCase() === "approved" || 
                subscription.payment.status?.toLowerCase() === "completed") && (
                <button style={styles.successButton} disabled>
                  <FiCheck style={styles.buttonIcon} />
                  Payment Approved
                </button>
              )}

              {subscription.status?.toLowerCase() === "approved" && 
              subscription.payment && 
              subscription.payment.status?.toLowerCase() === "pending" && (
                <button style={styles.pendingButton} disabled>
                  <FiClock style={styles.buttonIcon} />
                  Waiting Approval
                </button>
              )}
              
              {subscription.status?.toLowerCase() === "approved" && 
              subscription.payment && 
              subscription.payment.status?.toLowerCase() === "rejected" && (
                <button style={styles.dangerButton} disabled>
                  <FiAlertCircle style={styles.buttonIcon} />
                  Payment Rejected
                </button>
              )}

              {(!subscription.status || subscription.status.toLowerCase() !== "approved") && 
              !subscription.payment && (
                <button style={styles.secondaryButton}>
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {subscriptions.length === 0 && !loading && (
        <div style={styles.emptyState}>
          <FiHome size={64} style={styles.emptyIcon} />
          <h3 style={styles.emptyTitle}>No Plots Found</h3>
          <p style={styles.emptyText}>You haven't subscribed to any plots yet.</p>
        </div>
      )}

      {/* Payment Modal */}
{showPaymentModal && selectedSubscription && ( 
  <div style={styles.modalOverlay} onClick={() => setShowPaymentModal(false)}>
    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      
      {/* 🔹 Modal Header with Account Info */}
      <div style={styles.modalHeader}>
        <div style={styles.modalTitle}>

        </div>

        <button 
          style={styles.modalClose}
          onClick={() => setShowPaymentModal(false)}
        >
          <FiX />
        </button>
      </div>

      {/* 🔹 Account Numbers Section inside header */}
<div style={{ 
  background: '#f8f9fa',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  padding: '14px 16px',
  marginBottom: 15,
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
                      value={selectedSubscription.name || ""} 
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
                      value={selectedSubscription.phone_number} 
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
                      value={selectedSubscription.number_of_plots || ""} 
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
                      value={selectedSubscription.plot_size || ""} 
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
                      value={formatCurrency(selectedSubscription.price) || ""} 
                      disabled 
                      style={styles.disabledInput}
                    />
                  </div>

                  <div style={styles.infoGroup}>
                    <label style={styles.inputLabel}>
                      <FaNairaSign /> Initial Deposit
                    </label>
                    <input 
                      type="text" 
                      value={formatCurrency(calculateInitialPaymentAmount(selectedSubscription))} 
                      disabled 
                      style={styles.disabledInput}
                    />
                  </div>

                  <div style={{...styles.infoGroup, gridColumn: 'span 2'}}>
                    <label style={styles.inputLabel}>
                      <FaNairaSign /> Outstanding Balance
                    </label>
                    <input 
                      type="text" 
                      value={formatCurrency(selectedSubscription.price - calculateInitialPaymentAmount(selectedSubscription))} 
                      disabled 
                      style={styles.disabledInput}
                    />
                  </div>
                </div>

                {/* Payment Details */}
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

                {/* Action Buttons */}
                <div style={styles.modalActions}>
                  <button 
                    type="button" 
                    style={styles.cancelButton}
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </button>
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
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

// Enhanced Styles
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    minHeight: '100vh'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    gap: '16px'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    fontSize: '16px',
    color: '#64748b',
    fontWeight: '500'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    gap: '24px',
    flexWrap: 'wrap'
  },
  headerContent: {
    flex: '1'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    margin: '0'
  },
  stats: {
    display: 'flex',
    gap: '16px'
  },
  statItem: {
    background: 'white',
    padding: '16px 20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    textAlign: 'center',
    minWidth: '100px'
  },
  statNumber: {
    display: 'block',
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b'
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500'
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%)',
    color: '#c53030',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '24px',
    border: '1px solid #fc8181'
  },
  errorIcon: {
    flexShrink: '0'
  },
  plotsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '24px'
  },
  plotCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #f1f5f9',
    transition: 'all 0.3s ease',
    animation: 'fadeIn 0.5s ease-out',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
    }
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px'
  },
  estateInfo: {
    flex: '1'
  },
  estateName: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 4px 0'
  },
  plotId: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0'
  },
  plotDetails: {
    flex: '1',
    marginBottom: '20px'
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: '#f8fafc',
    borderRadius: '8px'
  },
  detailIcon: {
    color: '#667eea',
    flexShrink: '0'
  },
  detailLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  detailValue: {
    display: 'block',
    fontSize: '14px',
    color: '#1e293b',
    fontWeight: '600'
  },
  paymentStatus: {
    padding: '16px',
    background: '#f0f9ff',
    borderRadius: '8px',
    border: '1px solid #bae6fd'
  },
  paymentInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  paymentLabel: {
    fontSize: '14px',
    color: '#0369a1',
    fontWeight: '500'
  },
  paymentAmount: {
    fontSize: '14px',
    color: '#059669',
    fontWeight: '600'
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: 'auto'
  },
  primaryButton: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
    }
  },
  successButton: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'not-allowed',
    opacity: '0.8'
  },
  pendingButton: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'not-allowed',
    opacity: '0.8'
  },
  dangerButton: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'not-allowed',
    opacity: '0.8'
  },
  secondaryButton: {
    flex: '1',
    padding: '12px 20px',
    background: 'transparent',
    color: '#64748b',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: '#f8fafc',
      borderColor: '#94a3b8'
    }
  },
  buttonIcon: {
    fontSize: '16px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 40px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  emptyIcon: {
    color: '#cbd5e1',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#475569',
    margin: '0 0 8px 0'
  },
  emptyText: {
    fontSize: '16px',
    color: '#64748b',
    margin: '0'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
    backdropFilter: 'blur(4px)',
    animation: 'fadeIn 0.3s ease-out'
  },
modalContent: {
  background: 'white',
  borderRadius: '20px',
  width: '100%',
  maxWidth: '700px',
  height: 'auto',
  maxHeight: '85vh', // slightly smaller than full height
  display: 'flex',
  flexDirection: 'column', // ✅ make body scrollable, footer fixed
  overflow: 'hidden',
  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
  animation: 'slideUp 0.4s ease-out'
},



  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #f1f5f9',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
  },
  modalTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: 0
  },
  modalTitleIcon: {
    color: '#667eea',
    fontSize: '24px'
  },
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#64748b',
    padding: '8px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    ':hover': {
      background: '#f1f5f9',
      color: '#374151'
    }
  },
modalBody: {
  padding: '20px 24px',
  flex: 1, // ✅ take remaining space
  overflowY: 'auto',
  minHeight: 0 // ✅ prevents layout overflow
},

  paymentForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  paymentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  infoGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  inputLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  disabledInput: {
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    background: '#f8fafc',
    color: '#64748b'
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    ':focus': {
      outline: 'none',
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    }
  },
  selectInput: {
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    background: 'white',
    transition: 'all 0.2s ease',
    ':focus': {
      outline: 'none',
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    }
  },
  fileUploadArea: {
    position: 'relative',
    border: '2px dashed #cbd5e1',
    borderRadius: '8px',
    padding: '32px 16px',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    ':hover': {
      borderColor: '#667eea',
      background: '#f8fafc'
    }
  },
  fileInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer'
  },
  uploadPlaceholder: {
    color: '#64748b',
    pointerEvents: 'none'
  },
  filePreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    marginTop: '8px',
    fontSize: '14px',
    color: '#0369a1'
  },
  textarea: {
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    resize: 'vertical',
    minHeight: '80px',
    transition: 'all 0.2s ease',
    ':focus': {
      outline: 'none',
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    }
  },
  confirmationBox: {
    padding: '16px',
    background: '#f0f9ff',
    borderRadius: '8px',
    border: '1px solid #bae6fd'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    color: '#0369a1',
    fontWeight: '500',
    cursor: 'pointer'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
modalActions: {
  display: 'flex',
  gap: '12px',
  justifyContent: 'flex-end',
  padding: '16px 24px',
  borderTop: '1px solid #f1f5f9',
  background: '#fff', // ✅ ensure footer visible
  position: 'sticky',
  bottom: 0
},

  cancelButton: {
    padding: '12px 24px',
    background: 'transparent',
    color: '#64748b',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: '#f8fafc',
      borderColor: '#94a3b8'
    }
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
    }
  },
  submitButtonDisabled: {
    background: '#cbd5e1',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
    ':hover': {
      transform: 'none',
      boxShadow: 'none'
    }
  }
};

export default UserPlots;