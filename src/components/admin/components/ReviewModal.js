import React, { useState } from "react";
import PendingRequestsTable from "./PendingRequestsTable";
import ReviewModal from "./ReviewModal";

const PaymentRequestsPage = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Format currency function
  const formatCurrency = (amount) => {
    if (!amount) return "₦0";
    return `₦${Number(amount).toLocaleString()}`;
  };

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle approve action
  const handleApprove = async (request) => {
    try {

      const response = await fetch(`https://musabaha-homes.onrender.com/api/payment-requests/${request.id}/approve`, {

        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        // Remove from pending requests
        setPendingRequests(prev => prev.filter(req => req.id !== request.id));
        alert('Payment approved successfully!');
      } else {
        throw new Error('Failed to approve payment');
      }
    } catch (error) {
      console.error('Approval failed:', error);
      throw error;
    }
  };

  // Handle reject action
  const handleReject = async (request) => {
    try {

      const response = await fetch(`https://musabaha-homes.onrender.com/api/payment-requests/${request.id}/reject`, {

        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        // Remove from pending requests
        setPendingRequests(prev => prev.filter(req => req.id !== request.id));
        alert('Payment rejected successfully!');
      } else {
        throw new Error('Failed to reject payment');
      }
    } catch (error) {
      console.error('Rejection failed:', error);
      throw error;
    }
  };

  // Open modal for detailed review
  const openReviewModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  return (
    <div>
<PendingRequestsTable 
  pendingRequests={pendingRequests}
  formatCurrency={formatCurrency}
  setSelectedRequest={setSelectedRequest}
  setShowModal={setShowModal}
  handleApprove={handleApprove}
  handleReject={handleReject}
/>
      
      {showModal && selectedRequest && (
        <ReviewModal
          selectedRequest={selectedRequest}
          setShowModal={setShowModal}
          setSelectedRequest={setSelectedRequest}
          onApprove={handleApprove}
          onReject={handleReject}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

export default PaymentRequestsPage;