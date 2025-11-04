// UserSubsequentPaymentsStyles.js
import { css } from '@emotion/react';

export const styles = {
  paymentsContainer: css`
    padding: 16px;
    max-width: 100%;
    min-height: 400px;
  `,

  loadingContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #666;
  `,

  spinner: css`
    width: 40px;
    height: 40px;
    border: 4px solid #f3f4f6;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  `,

  subscriptionBanner: (status) => css`
    margin-bottom: 20px;
    border-radius: 12px;
    padding: 16px;
    border-left: 4px solid;
    ${status === 'approved' && `
      background: #d1fae5;
      border-left-color: #059669;
    `}
    ${status === 'pending' && `
      background: #fef3c7;
      border-left-color: #d97706;
    `}
    ${status === 'rejected' && `
      background: #fee2e2;
      border-left-color: #dc2626;
    `}
  `,

  bannerContent: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  `,

  bannerText: css`
    h3 {
      margin: 0 0 4px 0;
      font-size: 1rem;
      font-weight: 600;
      color: #374151;
    }
    p {
      margin: 0;
      font-size: 0.9rem;
      color: #6b7280;
    }
  `,

  statusIndicator: css`
    .status-badge {
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .status-badge.approved {
      background: #059669;
      color: white;
    }
    .status-badge.pending {
      background: #d97706;
      color: white;
    }
    .status-badge.rejected {
      background: #dc2626;
      color: white;
    }
  `,

  headerSection: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;
  `,

  headerTitle: css`
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    color: #374151;
    font-size: 1.4rem;
    font-weight: 700;
  `,

  headerIcon: css`
    color: #059669;
  `,

  summaryBadge: css`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 6px 14px;
    border-radius: 16px;
    font-size: 0.85rem;
    font-weight: 600;
    white-space: nowrap;
  `,

  emptyState: css`
    text-align: center;
    padding: 50px 20px;
    background: #f8f9fa;
    border-radius: 12px;
    border: 2px dashed #e5e7eb;
  `,

  emptyIcon: css`
    color: #9ca3af;
    margin-bottom: 16px;
  `,

  emptyTitle: css`
    margin: 0 0 8px 0;
    color: #6b7280;
    font-size: 1.2rem;
  `,

  emptyText: css`
    margin: 0;
    color: #9ca3af;
    font-size: 0.95rem;
  `,

  makePaymentBtn: css`
    margin-top: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
    &:hover {
      transform: translateY(-2px);
    }
  `,

  desktopView: css`
    display: block;
  `,

  tableWrapper: css`
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow-x: auto;
  `,

  paymentsTable: css`
    width: 100%;
    border-collapse: collapse;
    background: white;
    min-width: 900px;
  `,

  tableHeader: css`
    background: #f8fafc;
    padding: 14px 12px;
    text-align: left;
    font-weight: 600;
    color: #374151;
    font-size: 0.85rem;
    border-bottom: 2px solid #e5e7eb;
    white-space: nowrap;
  `,

  thIcon: css`
    color: #667eea;
    margin-right: 6px;
    vertical-align: middle;
  `,

  paymentRow: css`
    td {
      padding: 12px;
      border-bottom: 1px solid #f3f4f6;
      font-size: 0.9rem;
      transition: background-color 0.2s;
    }
    &:hover td {
      background: #f9fafb;
    }
    &:last-child td {
      border-bottom: none;
    }
  `,

  serialNumber: css`
    font-weight: 600;
    color: #6b7280;
    text-align: center;
    width: 50px;
  `,

  nameCell: css`
    display: flex;
    align-items: center;
    gap: 8px;
  `,

  contactCell: css`
    display: flex;
    align-items: center;
    gap: 8px;
  `,

  dateCell: css`
    display: flex;
    align-items: center;
    gap: 8px;
  `,

  amountValue: css`
    font-weight: 700;
    color: #059669;
    font-size: 0.95rem;
  `,

  methodBadge: css`
    background: #e0e7ff;
    color: #3730a3;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
  `,

  noteText: css`
    display: block;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #6b7280;
  `,

  statusBadge: (status) => css`
    padding: 5px 10px;
    border-radius: 16px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
    ${status === 'approved' && `
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    `}
    ${status === 'pending' && `
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
    `}
    ${status === 'rejected' && `
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
    `}
  `,

  mobileView: css`
    display: none;
  `,

  paymentsCards: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,

  paymentCard: css`
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
    overflow: hidden;
  `,

  cardHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: #f8fafc;
    border-bottom: 1px solid #e5e7eb;
  `,

  paymentMeta: css`
    display: flex;
    align-items: center;
    gap: 10px;
  `,

  serial: css`
    font-weight: 600;
    color: #6b7280;
    font-size: 0.85rem;
  `,

  amountDisplay: css`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 1.1rem;
    font-weight: 700;
    color: #059669;
  `,

  nairaIcon: css`
    font-size: 0.9rem;
  `,

  cardBody: css`
    padding: 16px;
  `,

  infoGrid: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,

  infoItem: css`
    display: flex;
    align-items: flex-start;
    gap: 12px;
  `,

  fullWidth: css`
    width: 100%;
  `,

  infoIcon: css`
    color: #667eea;
    margin-top: 2px;
    flex-shrink: 0;
    width: 16px;
  `,

  infoContent: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  `,

  label: css`
    font-size: 0.7rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  `,

  value: css`
    font-size: 0.85rem;
    color: #374151;
    font-weight: 500;
    line-height: 1.3;
  `,

  noteTextMobile: css`
    line-height: 1.3;
    word-break: break-word;
    white-space: normal;
  `,

  // Responsive styles
  responsive: {
    largeDesktop: css`
      @media (max-width: 1200px) {
        .payments-table {
          min-width: 800px;
        }
      }
    `,
    
    desktop: css`
      @media (max-width: 1024px) {
        .payments-table th:nth-child(3),
        .payments-table td:nth-child(3) {
          display: none;
        }
      }
    `,
    
    tablet: css`
      @media (max-width: 900px) {
        .payments-table th:nth-child(6),
        .payments-table td:nth-child(6) {
          display: none;
        }
      }
    `,
    
    mobile: css`
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
    `,
    
    smallMobile: css`
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
    `,
    
    extraSmallMobile: css`
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
          width: 100%;
          justify-content: flex-end;
        }
      }
    `,
    
    tinyMobile: css`
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
    `
  }
};

// Keyframes for spinner
export const globalStyles = css`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;