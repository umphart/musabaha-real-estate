import React from "react";
import { statsContainerStyles, statCardStyles, pendingStatCardStyles, statTitleStyles, statAmountStyles, statSubtitleStyles } from "../styles/componentStyles";

const StatsCards = ({ 
  totalRevenue, 
  paymentsCount, 
  pendingRequestsCount, 
  completedPaymentsCount,
  formatCurrency 
}) => {
  // Safe value conversion with better error handling
  const getSafeNumber = (value) => {
    if (value == null || value === '' || isNaN(Number(value))) {
      return 0;
    }
    return Number(value);
  };

  const safeTotalRevenue = getSafeNumber(totalRevenue);
  const safePaymentsCount = getSafeNumber(paymentsCount);
  const safePendingRequestsCount = getSafeNumber(pendingRequestsCount);
  const safeCompletedPaymentsCount = getSafeNumber(completedPaymentsCount);

  const safeFormatCurrency = (amount) => {
    const numericAmount = getSafeNumber(amount);
    
    if (typeof formatCurrency === 'function') {
      return formatCurrency(numericAmount);
    }
    
    // Fallback formatter
    return `₦${numericAmount.toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <div style={statsContainerStyles}>
      <div style={statCardStyles}>
        <h3 style={statTitleStyles}>Total Revenue</h3>
        <p style={statAmountStyles}>{safeFormatCurrency(safeTotalRevenue)}</p>
        <span style={statSubtitleStyles}>
          {safeCompletedPaymentsCount} completed payments
        </span>
      </div>
      <div style={statCardStyles}>
        <h3 style={statTitleStyles}>Total Payments</h3>
        <p style={statAmountStyles}>{safePaymentsCount.toLocaleString()}</p>
        <span style={statSubtitleStyles}>Across all users</span>
      </div>
      <div style={pendingStatCardStyles}>
        <h3 style={statTitleStyles}>Payments Requests</h3>
        <p style={statAmountStyles}>{safePendingRequestsCount.toLocaleString()}</p>
        <span style={statSubtitleStyles}>Approval By Admin</span>
      </div>
    </div>
  );
};

export default StatsCards;