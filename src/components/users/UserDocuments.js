import React, { useEffect, useState } from "react";
import { FiCalendar, FiUser, FiPhone, FiCreditCard, FiFileText } from "react-icons/fi";
import { FaNairaSign } from "react-icons/fa6";
import Swal from "sweetalert2";

const UserSubsequentPayments = ({ user }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchPayments = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/user-subsequent-payments/user/${user.id}`
        );
        const data = await res.json();
        console.log("Payment data:", data);

        if (data.success) {
          setPayments(data.payments);

          // Optional: show a success message
          Swal.fire({
            icon: "success",
            title: "Payments Loaded",
            text: "Your subsequent payments were fetched successfully.",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          console.error("Failed to fetch payments:", data.error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch your payments.",
          });
        }
      } catch (err) {
        console.error("Error fetching payments:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while fetching payments.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

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
      <div className="header-section">
        <h2>
          <FaNairaSign className="header-icon" />
          Subsequent Payments
        </h2>
        <div className="summary-badge">
          Total: {payments.length} payment{payments.length !== 1 ? 's' : ''}
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="empty-state">
          <FiFileText size={48} className="empty-icon" />
          <h3>No Subsequent Payments</h3>
          <p>You haven't made any additional payments yet.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table - Hidden on small screens */}
          <div className="desktop-view">
            <div className="table-wrapper">
              <table className="payments-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>
                      <FiUser className="th-icon" />
                      Name
                    </th>
                    <th>
                      <FiPhone className="th-icon" />
                      Contact
                    </th>
                    <th>
                      <FaNairaSign className="th-icon" />
                      Amount
                    </th>
                    <th>
                      <FiCreditCard className="th-icon" />
                      Method
                    </th>
                    <th>Note</th>
                    <th>
                      <FiCalendar className="th-icon" />
                      Date
                    </th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, idx) => (
                    <tr key={p.id} className="payment-row">
                      <td className="serial-number">{idx + 1}</td>
                      <td className="user-name">
                        <div className="name-cell">
                          <FiUser size={14} />
                          {p.user_name || "N/A"}
                        </div>
                      </td>
                      <td className="user-contact">
                        <div className="contact-cell">
                          <FiPhone size={14} />
                          {p.user_contact || "N/A"}
                        </div>
                      </td>
                      <td className="amount">
                        <span className="amount-value">
                          {formatCurrency(p.amount)}
                        </span>
                      </td>
                      <td className="method">
                        <span className="method-badge">
                          {p.payment_method || "N/A"}
                        </span>
                      </td>
                      <td className="note">
                        <span className="note-text" title={p.note || p.notes || "-"}>
                          {p.note || p.notes || "-"}
                        </span>
                      </td>
                      <td className="date">
                        <div className="date-cell">
                          <FiCalendar size={14} />
                          {formatDate(p.created_at)}
                        </div>
                      </td>
                      <td className="status">
                        <span className={`status-badge ${p.status || 'pending'}`}>
                          {p.status || "pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards - Show on small screens */}
          <div className="mobile-view">
            <div className="payments-cards">
              {payments.map((p, idx) => (
                <div key={p.id} className="payment-card">
                  <div className="card-header">
                    <div className="payment-meta">
                      <span className="serial">#{idx + 1}</span>
                      <span className={`status-badge ${p.status || 'pending'}`}>
                        {p.status || "pending"}
                      </span>
                    </div>
                    <div className="amount-display">
                      <FaNairaSign className="naira-icon" />
                      {Number(p.amount).toLocaleString()}
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="info-grid">
                      <div className="info-item">
                        <FiUser className="info-icon" />
                        <div className="info-content">
                          <span className="label">Name</span>
                          <span className="value">{p.user_name || "N/A"}</span>
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <FiPhone className="info-icon" />
                        <div className="info-content">
                          <span className="label">Contact</span>
                          <span className="value">{p.user_contact || "N/A"}</span>
                        </div>
                      </div>

                      <div className="info-item">
                        <FiCreditCard className="info-icon" />
                        <div className="info-content">
                          <span className="label">Method</span>
                          <span className="value method-badge">
                            {p.payment_method || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="info-item">
                        <FiCalendar className="info-icon" />
                        <div className="info-content">
                          <span className="label">Date</span>
                          <span className="value">{formatDate(p.created_at)}</span>
                        </div>
                      </div>

                      {(p.note || p.notes) && (
                        <div className="info-item full-width">
                          <FiFileText className="info-icon" />
                          <div className="info-content">
                            <span className="label">Note</span>
                            <span className="value note-text">
                              {p.note || p.notes}
                            </span>
                          </div>
                        </div>
                      )}
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
      `}</style>
    </div>
  );
};

export default UserSubsequentPayments;