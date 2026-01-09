import React from "react";
import { FiEdit } from "react-icons/fi";

const PaymentTable = ({ payments, onAddPayment }) => {
  return (
    <div className="desktop-view">
      <table className="payments-table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Date</th>
            <th>Amount (₦)</th>
            <th>Plot Size</th>
            <th>Plots</th>
            <th>Total Price</th>
            <th>Outstanding</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p, index) => (
            <tr key={p.id}>
              <td>{index + 1}</td>
              <td>{p.name}</td>
              <td>{p.contact}</td>
              <td>
                {p.created_at
                  ? new Date(p.created_at).toLocaleDateString()
                  : "-"}
              </td>
              <td>{Number(p.amount).toLocaleString()}</td>
              <td>{p.plot_size}</td>
              <td>{p.number_of_plots}</td>
              <td>
                {Number(p.total_price || 0).toLocaleString()}
              </td>
              <td>
                {Number(p.outstanding_balance || 0).toLocaleString()}
              </td>
              <td>
                <span className={`status-badge ${p.status}`}>{p.status}</span>
              </td>
              <td>
                <button
                  className={`btn btn-sm ${
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
                  <FiEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .desktop-view {
          display: block;
        }

        .payments-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .payments-table th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 8px;
          text-align: left;
          font-weight: 600;
          font-size: 0.85rem;
          white-space: nowrap;
        }

        .payments-table td {
          padding: 10px 8px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .payments-table tr:hover {
          background: #f8f9fa;
        }

        .payments-table tr:last-child td {
          border-bottom: none;
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

        .status-badge.rejected {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .btn-sm {
          padding: 4px 8px;
          font-size: 0.75rem;
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

        .btn-secondary:hover:not(:disabled) {
          background: #4b5563;
        }

        @media (max-width: 1200px) {
          .payments-table {
            font-size: 0.8rem;
          }
          
          .payments-table th,
          .payments-table td {
            padding: 8px 6px;
          }
        }

        @media (max-width: 1024px) {
          .payments-table th:nth-child(3),
          .payments-table td:nth-child(3),
          .payments-table th:nth-child(6),
          .payments-table td:nth-child(6) {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .desktop-view {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentTable;