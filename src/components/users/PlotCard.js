import React from 'react';
import { FiCheck, FiClock, FiAlertCircle, FiLayers, FiHome, FiCalendar, FiDatabase, FiCreditCard } from 'react-icons/fi';
import { FaNairaSign } from 'react-icons/fa6';
import { styles, getStatusStyle, getSourceBadge } from './styles';

const PlotCard = ({ plot, onProceedToPayment }) => {
  const progress = calculatePaymentProgress(plot);
  const isUsersTable = plot.source === 'usersTable';
  const canMakePayment = (isUsersTable && plot.status === 'Active' && plot.total_balance > 0) || 
                        (!isUsersTable && plot.status === 'approved');

  function calculatePaymentProgress(plot) {
    if (!plot.total_money_to_pay || plot.total_money_to_pay === 0) return 0;
    if (!plot.total_balance && plot.total_balance !== 0) return 0;
    
    const totalToPay = parseFloat(plot.total_money_to_pay);
    const totalBalance = parseFloat(plot.total_balance);
    
    // Calculate paid amount: total_money_to_pay - total_balance
    const paidAmount = totalToPay - totalBalance;
    
    // Ensure we don't exceed 100% and handle division by zero
    return Math.min(Math.round((paidAmount / totalToPay) * 100), 100);
  }

  function formatCurrency(value) {
    if (!value || isNaN(value)) return "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(Number(value));
  }

  // Calculate paid amount
  function calculatePaidAmount(plot) {
    if (!plot.total_money_to_pay || !plot.total_balance) return 0;
    const totalToPay = parseFloat(plot.total_money_to_pay);
    const totalBalance = parseFloat(plot.total_balance);
    return Math.max(totalToPay - totalBalance, 0);
  }

  return (
    <div style={styles.plotCard}>
      {/* Card Header */}
      <div style={styles.cardHeader}>
        <div style={styles.estateInfo}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h3 style={styles.estateName}>
              {plot.plot_name || plot.layout_name || 'Unnamed Plot'}
            </h3>
            <span style={getSourceBadge(plot.source)}>
              <FiDatabase size={10} />
              {isUsersTable ? 'Direct Customer' : 'Subscription'}
            </span>
          </div>
          <p style={styles.plotId}>
            {isUsersTable ? `Customer Plot #${plot.id}` : `Subscription #${plot.id}`}
          </p>
        </div>
        <div style={getStatusStyle(plot.status, plot.source)}>
          {plot.status === 'approved' || plot.status === 'completed' ? <FiCheck size={14} /> : 
           plot.status === 'active' ? <FiClock size={14} /> : 
           <FiAlertCircle size={14} />}
          {plot.status || 'Pending'}
        </div>
      </div>

      {/* Plot Details */}
      <div style={styles.plotDetails}>
        <div style={styles.detailGrid}>
          <div style={styles.detailItem}>
            <FiLayers style={styles.detailIcon} />
            <div>
              <span style={styles.detailLabel}>Plots</span>
              <span style={styles.detailValue}>{plot.number_of_plots || 1}</span>
            </div>
          </div>
          <div style={styles.detailItem}>
            <FiHome style={styles.detailIcon} />
            <div>
              <span style={styles.detailLabel}>Plot Size</span>
              <span style={styles.detailValue}>{plot.plot_size }</span>
            </div>
          </div>
          <div style={styles.detailItem}>
            <FaNairaSign style={styles.detailIcon} />
            <div>
              <span style={styles.detailLabel}>Total Price</span>
              <span style={styles.detailValue}>{formatCurrency(plot.total_money_to_pay)}</span>
            </div>
          </div>
          <div style={styles.detailItem}>
            <FiCalendar style={styles.detailIcon} />
            <div>
              <span style={styles.detailLabel}>
                {isUsersTable ? 'Acquired' : 'Submitted'}
              </span>
              <span style={styles.detailValue}>
                {new Date(plot.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Progress for usersTable */}
        {isUsersTable && (
          <div style={styles.paymentProgress}>
            <div style={styles.progressHeader}>
              <span style={styles.progressLabel}>Payment Progress</span>
              <span style={styles.progressPercentage}>{progress}%</span>
            </div>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${progress}%`,
                  background: progress === 100 ? 
                    'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                }}
              ></div>
            </div>
            <div style={styles.paymentSummary}>
              <span>Paid: {formatCurrency(calculatePaidAmount(plot))}</span>
              <span>Balance: {formatCurrency(plot.total_balance)}</span>
            </div>
          </div>
        )}

        {/* Payment Status */}
        {plot.latest_payment && (
          <div style={styles.paymentStatus}>
            <div style={styles.paymentInfo}>
              <span style={styles.paymentLabel}>Latest Payment:</span>
              <span style={getStatusStyle(plot.latest_payment.status, plot.source)}>
                {plot.latest_payment.status || 'Pending'}
              </span>
            </div>
            {plot.latest_payment.amount && (
              <div style={styles.paymentInfo}>
                <span style={styles.paymentLabel}>Amount:</span>
                <span style={styles.paymentAmount}>
                  {formatCurrency(plot.latest_payment.amount)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={styles.actionButtons}>
        {canMakePayment && !plot.latest_payment && (
          <button
            style={styles.primaryButton}
            onClick={() => onProceedToPayment(plot)}
          >
            <FiCreditCard style={styles.buttonIcon} />
            {isUsersTable ? 'Make Payment' : 'Proceed to Payment'}
          </button>
        )}

        {plot.latest_payment && 
        (plot.latest_payment.status?.toLowerCase() === "approved" || 
          plot.latest_payment.status?.toLowerCase() === "completed") && (
          <button style={styles.successButton} disabled>
            <FiCheck style={styles.buttonIcon} />
            Payment Approved
          </button>
        )}

        {plot.latest_payment && 
        plot.latest_payment.status?.toLowerCase() === "pending" && (
          <button style={styles.pendingButton} disabled>
            <FiClock style={styles.buttonIcon} />
            Waiting Approval
          </button>
        )}
        
        {plot.latest_payment && 
        plot.latest_payment.status?.toLowerCase() === "rejected" && (
          <button style={styles.dangerButton} disabled>
            <FiAlertCircle style={styles.buttonIcon} />
            Payment Rejected
          </button>
        )}

        {isUsersTable && progress === 100 && (
          <button style={styles.successButton} disabled>
            <FiCheck style={styles.buttonIcon} />
            Fully Paid
          </button>
        )}
      </div>
    </div>
  );
};

export default PlotCard;