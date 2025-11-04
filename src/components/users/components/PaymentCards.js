import React from "react";
import { FiEdit } from "react-icons/fi";

const PaymentCards = ({ payments, onAddPayment }) => {
  return (
    <div className="mobile-view">
      <div className="payments-cards">
        {payments.map((p, index) => (
          <div key={p.id} className="payment-card">
            <div className="card-header">
              <div className="user-info">
                <h4>{p.name}</h4>
                <span className="contact">{p.contact}</span>
              </div>
              <span className={`status-badge ${p.status}`}>{p.status}</span>
            </div>
            
            <div className="card-body">
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Date:</span>
                  <span className="value">
                    {p.created_at
                      ? new Date(p.created_at).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Amount:</span>
                  <span className="value">₦{Number(p.amount).toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="label">Plot Size:</span>
                  <span className="value">{p.plot_size}</span>
                </div>
                <div className="info-item">
                  <span className="label">Plots:</span>
                  <span className="value">{p.number_of_plots}</span>
                </div>
                <div className="info-item">
                  <span className="label">Total Price:</span>
                  <span className="value highlight">
                    {p.total_price
                      ? `₦${Number(p.total_price).toLocaleString()}`
                      : "N/A"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Outstanding:</span>
                  <span className={`value ${p.outstanding_balance === 0 ? 'success' : 'warning'}`}>
                    {p.outstanding_balance
                      ? `₦${Number(p.outstanding_balance).toLocaleString()}`
                      : "0"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="card-footer">
              <button
                className={`btn btn-block ${
                  p.status === "approved" ? "btn-success" : "btn-secondary"
                }`}
                onClick={() => onAddPayment(p)}
                disabled={p.status !== "approved"}
                title={
                  p.status !== "approved"
                    ? "Only approved payments can receive additional payments"
                    : "Add payment"
                }
              >
                <FiEdit className="btn-icon" />
                Add Payment
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .mobile-view {
          display: none;
        }

        .payments-cards {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .payment-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 16px;
          background: #f8f9fa;
          border-bottom: 1px solid #e5e7eb;
        }

        .user-info h4 {
          margin: 0 0 4px 0;
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
        }

        .user-info .contact {
          font-size: 0.85rem;
          color: #6b7280;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
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

        .card-body {
          padding: 16px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .info-item .label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-item .value {
          font-size: 0.9rem;
          color: #374151;
          font-weight: 500;
        }

        .info-item .highlight {
          color: #059669;
          font-weight: 600;
        }

        .info-item .success {
          color: #059669;
          font-weight: 600;
        }

        .info-item .warning {
          color: #dc2626;
          font-weight: 600;
        }

        .card-footer {
          padding: 16px;
          border-top: 1px solid #e5e7eb;
          background: #fafafa;
        }

        .btn {
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-block {
          width: 100%;
          justify-content: center;
        }

        .btn-success {
          background: #10b981;
          color: white;
        }

        .btn-success:hover:not(:disabled) {
          background: #059669;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: #6b7280;
          color: white;
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-icon {
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .mobile-view {
            display: block;
          }
        }

        @media (max-width: 480px) {
          .info-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          
          .card-header {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }
          
          .payment-card {
            margin: 0 -10px;
            border-radius: 0;
            border-left: none;
            border-right: none;
          }
        }

        @media (max-width: 360px) {
          .user-info h4 {
            font-size: 0.9rem;
          }
          
          .info-item .value {
            font-size: 0.85rem;
          }
          
          .btn {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentCards;