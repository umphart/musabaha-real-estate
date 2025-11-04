import React from "react";
import { tabsContainerStyles, tabStyles, activeTabStyles } from "../styles/componentStyles";

const PaymentTabs = ({ activeTab, setActiveTab, pendingRequestsCount }) => {
  return (
    <div style={tabsContainerStyles}>
      <button 
        style={{
          ...tabStyles,
          ...(activeTab === "summary" ? activeTabStyles : {})
        }}
        onClick={() => setActiveTab("summary")}
      >
        Payment Summary
      </button>
      <button 
        style={{
          ...tabStyles,
          ...(activeTab === "pending" ? activeTabStyles : {})
        }}
        onClick={() => setActiveTab("pending")}
      >
      Payments Requests ({pendingRequestsCount})
      </button>
    </div>
  );
};

export default PaymentTabs;