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
      const response = await fetch(`https://musabaha-homes.onrender.com/api/subscriptions?email=${user.email}`);
      const result = await response.json();
      //("Subscription data for source determination:", result);

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
      //("Fetching payments with source:", source, "subscriptionId:", currentSubscriptionId);

      const baseUrl = "https://musabaha-homes.onrender.com/api";
      
      if (source === 'subscriptions') {
        url = `${baseUrl}/user-subsequent-payments/user/${user.id}`;
      } else {
        if (!currentSubscriptionId) {
          //("No subscriptionId available, skipping payment fetch");
          return;
        }
        url = `${baseUrl}/user-payment-requests/user/${currentSubscriptionId}`;
      }

      //("✅ Fetch URL:", url);
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      //("✅ Returned Data:", data);

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
        //("🔄 Initializing payment data...");
        
        // Step 1: Determine data source
        const sourceInfo = await determineDataSource();
        //("📊 Source determined:", sourceInfo);
        
        // Step 2: Fetch payments based on source
        if (sourceInfo.source === 'userstable' && !sourceInfo.subscriptionId) {
          //("⏳ Waiting for subscription data...");
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
    <style jsx>{`
        .payments-container {
          padding: 16px;
          max-width: 100%;
          min-height: 400px;
        }

        /* Subscription Status Banner */
        .subscription-banner {
          margin-bottom: 20px;
          border-radius: 12px;
          padding: 16px;
          border-left: 4px solid;
        }

        .subscription-banner.status-approved {
          background: #d1fae5;
          border-left-color: #059669;
        }

        .subscription-banner.status-pending {
          background: #fef3c7;
          border-left-color: #d97706;
        }

        .subscription-banner.status-rejected {
          background: #fee2e2;
          border-left-color: #dc2626;
        }

        .banner-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .banner-text h3 {
          margin: 0 0 4px 0;
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
        }

        .banner-text p {
          margin: 0;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .status-indicator .status-badge {
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-indicator .status-badge.approved {
          background: #059669;
          color: white;
        }

        .status-indicator .status-badge.pending {
          background: #d97706;
          color: white;
        }

        .status-indicator .status-badge.rejected {
          background: #dc2626;
          color: white;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: #666;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .header-section h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0;
          color: #374151;
          font-size: 1.4rem;
          font-weight: 700;
        }

        .header-icon {
          color: #059669;
        }

        .summary-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 6px 14px;
          border-radius: 16px;
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .empty-state {
          text-align: center;
          padding: 50px 20px;
          background: #f8f9fa;
          border-radius: 12px;
          border: 2px dashed #e5e7eb;
        }

        .empty-icon {
          color: #9ca3af;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          color: #6b7280;
          font-size: 1.2rem;
        }

        .empty-state p {
          margin: 0;
          color: #9ca3af;
          font-size: 0.95rem;
        }

        .make-payment-btn {
          margin-top: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .make-payment-btn:hover {
          transform: translateY(-2px);
        }

        /* Desktop Table Styles */
        .desktop-view {
          display: block;
        }

        .table-wrapper {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow-x: auto;
        }

        .payments-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          min-width: 900px;
        }

        .payments-table th {
          background: #f8fafc;
          padding: 14px 12px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          font-size: 0.85rem;
          border-bottom: 2px solid #e5e7eb;
          white-space: nowrap;
        }

        .th-icon {
          color: #667eea;
          margin-right: 6px;
          vertical-align: middle;
        }

        .payment-row td {
          padding: 12px;
          border-bottom: 1px solid #f3f4f6;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }

        .payment-row:hover td {
          background: #f9fafb;
        }

        .payment-row:last-child td {
          border-bottom: none;
        }

        .serial-number {
          font-weight: 600;
          color: #6b7280;
          text-align: center;
          width: 50px;
        }

        .name-cell, .contact-cell, .date-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .amount-value {
          font-weight: 700;
          color: #059669;
          font-size: 0.95rem;
        }

        .method-badge {
          background: #e0e7ff;
          color: #3730a3;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .note-text {
          display: block;
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #6b7280;
        }

        /* Status Badges */
        .status-badge {
          padding: 5px 10px;
          border-radius: 16px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .status-badge.approved {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
        }

        .status-badge.rejected {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        /* Mobile Cards Styles */
        .mobile-view {
          display: none;
        }

        .payments-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .payment-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
        }

        .payment-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .serial {
          font-weight: 600;
          color: #6b7280;
          font-size: 0.85rem;
        }

        .amount-display {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 1.1rem;
          font-weight: 700;
          color: #059669;
        }

        .naira-icon {
          font-size: 0.9rem;
        }

        .card-body {
          padding: 16px;
        }

        .info-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .info-item.full-width {
          width: 100%;
        }

        .info-icon {
          color: #667eea;
          margin-top: 2px;
          flex-shrink: 0;
          width: 16px;
        }

        .info-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .info-content .label {
          font-size: 0.7rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-content .value {
          font-size: 0.85rem;
          color: #374151;
          font-weight: 500;
          line-height: 1.3;
        }

        .note-text {
          line-height: 1.3;
          word-break: break-word;
          white-space: normal;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .payments-table {
            min-width: 800px;
          }
        }

        @media (max-width: 1024px) {
          .payments-table th:nth-child(3), /* Contact */
          .payments-table td:nth-child(3) {
            display: none;
          }
        }

        @media (max-width: 900px) {
          .payments-table th:nth-child(6), /* Note */
          .payments-table td:nth-child(6) {
            display: none;
          }
        }

        /* Switch to mobile view at 768px */
        @media (max-width: 768px) {
          .desktop-view {
            display: none;
          }
          
          .mobile-view {
            display: block;
          }
          
          .payments-container {
            padding: 12px;
          }
          
          .header-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .header-section h2 {
            font-size: 1.3rem;
          }

          .banner-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }

        @media (max-width: 480px) {
          .payments-container {
            padding: 8px;
          }
          
          .payment-card {
            border-radius: 8px;
            margin: 0 4px;
          }
          
          .card-header,
          .card-body {
            padding: 12px;
          }
          
          .amount-display {
            font-size: 1rem;
          }
          
          .info-item {
            gap: 10px;
          }
          
          .info-content .value {
            font-size: 0.8rem;
          }
        }

        @media (max-width: 360px) {
          .header-section h2 {
            font-size: 1.2rem;
          }
          
          .summary-badge {
            font-size: 0.8rem;
            padding: 5px 12px;
          }
          
          .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .payment-meta {
            width: 100%;
            justify-content: space-between;
          }
          
          .amount-display {
            width: 100;
            justify-content: flex-end;
          }
        }

        /* Extra small devices */
        @media (max-width: 320px) {
          .payments-container {
            padding: 6px;
          }
          
          .info-item {
            gap: 8px;
          }
          
          .info-icon {
            width: 14px;
          }
          
          .info-content .label {
            font-size: 0.65rem;
          }
          
          .info-content .value {
            font-size: 0.75rem;
          }
        }
    
    
        .payments-container {
          padding: 16px;
          max-width: 100%;
          min-height: 400px;
        }

    
        
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