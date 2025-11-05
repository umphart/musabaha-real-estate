import React, { useEffect, useState, useCallback } from "react";
import { FiCalendar, FiUser, FiPhone, FiCreditCard, FiFileText } from "react-icons/fi";
import { FaNairaSign } from "react-icons/fa6";
import Swal from "sweetalert2";
import ReceiptGenerator from "./ReceiptGenerator";

const UserSubsequentPayments = ({ user }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState('pending');
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [dataSource, setDataSource] = useState(null);

  // Use useCallback to prevent infinite re-renders
  const determineDataSource = useCallback(async () => {
    if (!user?.email) {
      setDataSource('userstable');
      return 'userstable';
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/subscriptions?email=${user.email}`);
      const result = await response.json();
      console.log("Subscription data for source determination:", result);

      if (result.success && result.data) {
        const subscription = Array.isArray(result.data) ? result.data[0] : result.data;
        if (subscription) {
          const newStatus = subscription.status || 'pending';
          const source = subscription.source === 'subscriptions' ? 'subscriptions' : 'userstable';
          const newSubscriptionId = subscription.id;
          
          setSubscriptionStatus(newStatus);
          setDataSource(source);
          setSubscriptionId(newSubscriptionId);
          return { source, subscriptionId: newSubscriptionId };
        }
      }
    } catch (err) {
      console.error("Error determining data source:", err);
    }
    
    setDataSource('userstable');
    return { source: 'userstable', subscriptionId: null };
  }, [user?.email]);

  // Fixed fetchPayments function
  const fetchPayments = useCallback(async (source, currentSubscriptionId) => {
    try {
      let url;
      console.log("Fetching payments with source:", source, "subscriptionId:", currentSubscriptionId);

      const baseUrl = "http://localhost:5000/api";
      
      if (source === 'subscriptions') {
        url = `${baseUrl}/user-subsequent-payments/user/${user.id}`;
      } else {
        if (!currentSubscriptionId) {
          console.log("No subscriptionId available, skipping payment fetch");
          return;
        }
        url = `${baseUrl}/user-payment-requests/user/${currentSubscriptionId}`;
      }

      console.log("✅ Fetch URL:", url);
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("✅ Returned Data:", data);

      if (data.success) {
        const paymentData = data.payments || data.requests || [];
        setPayments(paymentData);
      } else {
        console.error("API returned success: false", data);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to fetch your payment data.",
        });
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while fetching payment data.",
      });
    }
  }, [user?.id]);

  // Simplified useEffect - only one effect to rule them all
  useEffect(() => {
    if (!user?.id) return;

    const initializeData = async () => {
      setLoading(true);
      try {
        console.log("🔄 Initializing payment data...");
        
        // Step 1: Determine data source
        const sourceInfo = await determineDataSource();
        console.log("📊 Source determined:", sourceInfo);
        
        // Step 2: Fetch payments based on source
        if (sourceInfo.source === 'userstable' && !sourceInfo.subscriptionId) {
          console.log("⏳ Waiting for subscription data...");
          setPayments([]);
        } else {
          await fetchPayments(sourceInfo.source, sourceInfo.subscriptionId);
        }
      } catch (error) {
        console.error("Error initializing payment data:", error);
        Swal.fire({
          icon: "error",
          title: "Initialization Error",
          text: "Failed to load payment information.",
        });
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [user?.id, determineDataSource, fetchPayments]);

  // Formatting functions
  const formatCurrency = (amount) => {
    if (!amount) return "₦0";
    return `₦${Number(amount).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper functions
  const getPaymentStatus = (payment) => payment.status || 'pending';
  const getPaymentAmount = (payment) => payment.amount;
  const getPaymentMethod = (payment) => payment.payment_method || "N/A";
  const getUserName = (payment) => payment.user_name || "N/A";
  const getUserContact = (payment) => payment.user_contact || "N/A";
  const getNote = (payment) => payment.note || payment.notes || "-";
  const getDate = (payment) => payment.created_at || payment.transaction_date;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading payments...</p>
      </div>
    );
  }

  return (
    <div className="payments-container">
      {/* Subscription Status Banner */}
      <div className={`subscription-banner status-${subscriptionStatus}`}>
        <div className="banner-content">
          <div className="banner-text">
            <h3>Plot Application Status</h3>
            <p>
              {subscriptionStatus === 'approved' && 'Your plot application has been approved. You can proceed with payments.'}
              {subscriptionStatus === 'pending' && 'Your plot application is under review.'}
              {subscriptionStatus === 'rejected' && 'Your plot application was not approved. Please contact support.'}
              {!['approved', 'pending', 'rejected'].includes(subscriptionStatus) && `Status: ${subscriptionStatus}`}
            </p>
          </div>
          <div className="status-indicator">
            <span className={`status-badge ${subscriptionStatus}`}>
              {subscriptionStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="header-section">
        <h2>
          <FaNairaSign className="header-icon" />
          {dataSource === 'subscriptions' ? 'Subsequent Payments' : 'Payment Requests'}
        </h2>
        <div className="summary-badge">
          Total: {payments.length} {dataSource === 'subscriptions' ? 'payment' : 'request'}{payments.length !== 1 ? 's' : ''}
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="empty-state">
          <FiFileText size={48} className="empty-icon" />
          <h3>No {dataSource === 'subscriptions' ? 'Subsequent Payments' : 'Payment Requests'}</h3>
          <p>
            {dataSource === 'subscriptions' 
              ? "You haven't made any additional payments yet."
              : "You haven't made any payment requests yet."
            }
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table with Receipt Column */}
          <div className="desktop-view">
            <div className="table-wrapper">
              <table className="payments-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th><FiUser className="th-icon" />Name</th>
                    <th><FiPhone className="th-icon" />Contact</th>
                    <th><FaNairaSign className="th-icon" />Amount</th>
                    <th><FiCreditCard className="th-icon" />Method</th>
                    <th>Note</th>
                    <th><FiCalendar className="th-icon" />Date</th>
                    <th>Status</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, idx) => (
                    <tr key={p.id} className="payment-row">
                      <td className="serial-number">{idx + 1}</td>
                      <td className="user-name">
                        <div className="name-cell">
                          <FiUser size={14} />
                          {getUserName(p)}
                        </div>
                      </td>
                      <td className="user-contact">
                        <div className="contact-cell">
                          <FiPhone size={14} />
                          {getUserContact(p)}
                        </div>
                      </td>
                      <td className="amount">
                        <span className="amount-value">
                          {formatCurrency(getPaymentAmount(p))}
                        </span>
                      </td>
                      <td className="method">
                        <span className="method-badge">
                          {getPaymentMethod(p)}
                        </span>
                      </td>
                      <td className="note">
                        <span className="note-text" title={getNote(p)}>
                          {getNote(p)}
                        </span>
                      </td>
                      <td className="date">
                        <div className="date-cell">
                          <FiCalendar size={14} />
                          {formatDate(getDate(p))}
                        </div>
                      </td>
                      <td className="status">
                        <span className={`status-badge ${getPaymentStatus(p)}`}>
                          {getPaymentStatus(p)}
                        </span>
                      </td>
                      <td className="receipt-action">
                        <ReceiptGenerator 
                          payment={p} 
                          paymentItem={p} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards with Receipt */}
          <div className="mobile-view">
            <div className="payments-cards">
              {payments.map((p, idx) => (
                <div key={p.id} className="payment-card">
                  <div className="card-header">
                    <div className="payment-meta">
                      <span className="serial">#{idx + 1}</span>
                      <span className={`status-badge ${getPaymentStatus(p)}`}>
                        {getPaymentStatus(p)}
                      </span>
                    </div>
                    <div className="amount-display">
                      <FaNairaSign className="naira-icon" />
                      {Number(getPaymentAmount(p)).toLocaleString()}
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="info-grid">
                      <div className="info-item">
                        <FiUser className="info-icon" />
                        <div className="info-content">
                          <span className="label">Name</span>
                          <span className="value">{getUserName(p)}</span>
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <FiPhone className="info-icon" />
                        <div className="info-content">
                          <span className="label">Contact</span>
                          <span className="value">{getUserContact(p)}</span>
                        </div>
                      </div>

                      <div className="info-item">
                        <FiCreditCard className="info-icon" />
                        <div className="info-content">
                          <span className="label">Method</span>
                          <span className="value method-badge">
                            {getPaymentMethod(p)}
                          </span>
                        </div>
                      </div>

                      <div className="info-item">
                        <FiCalendar className="info-icon" />
                        <div className="info-content">
                          <span className="label">Date</span>
                          <span className="value">{formatDate(getDate(p))}</span>
                        </div>
                      </div>

                      {getNote(p) && getNote(p) !== "-" && (
                        <div className="info-item full-width">
                          <FiFileText className="info-icon" />
                          <div className="info-content">
                            <span className="label">Note</span>
                            <span className="value note-text">
                              {getNote(p)}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="info-item full-width">
                        <FiFileText className="info-icon" />
                        <div className="info-content">
                          <span className="label">Receipt</span>
                          <ReceiptGenerator 
                            payment={p} 
                            paymentItem={p} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Keep your existing styles here */}
      <style jsx>{`
        .payments-container {
          padding: 16px;
          max-width: 100%;
          min-height: 400px;
        }

        /* ... (keep all your existing styles exactly as they were) ... */
        
        .receipt-action {
          text-align: center;
        }
        
        .receipt-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
      `}</style>  
    </div>
  );
};

export default UserSubsequentPayments;