import React, { useState } from 'react';
import { FiHome, FiAlertCircle } from 'react-icons/fi';
import useUserPlots from './useUserPlots';
import PlotCard from './PlotCard';
import PaymentModal from './PaymentModal';
import { styles } from './styles';

const UserPlots = ({ user }) => {
  const { plots, loading, error, refreshPlots } = useUserPlots(user);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(null);

  const handleProceedToPayment = (plot) => {
    setSelectedPlot(plot);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    refreshPlots();
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
          <p style={styles.subtitle}>Manage your plots and payments from all sources</p>
        </div>
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>{plots.length}</span>
            <span style={styles.statLabel}>Total Plots</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>
              {plots.filter(p => p.source === 'usersTable').length}
            </span>
            <span style={styles.statLabel}>Direct Customers</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>
              {plots.filter(p => p.source === 'subscriptions').length}
            </span>
            <span style={styles.statLabel}>Subscriptions</span>
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
        {plots.map(plot => (
          <PlotCard 
            key={`${plot.source}-${plot.id}`} 
            plot={plot} 
            onProceedToPayment={handleProceedToPayment}
          />
        ))}
      </div>

      {/* Empty State */}
      {plots.length === 0 && !loading && (
        <div style={styles.emptyState}>
          <FiHome size={64} style={styles.emptyIcon} />
          <h3 style={styles.emptyTitle}>No Plots Found</h3>
          <p style={styles.emptyText}>You don't have any plots yet.</p>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedPlot && (
        <PaymentModal
          plot={selectedPlot}
          user={user}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
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
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default UserPlots;