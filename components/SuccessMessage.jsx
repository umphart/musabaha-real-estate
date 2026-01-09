import React from 'react';

const SuccessMessage = () => (
  <div className="success-overlay">
    <div className="success-message">
      <div className="success-icon">✅</div>
      <h2>Application Submitted Successfully!</h2>
      <p>Thank you for your application. Your subscription is under review.</p>
      <p>Please wait for approval. You will be redirected to your profile shortly.</p>
      <div className="loading-spinner"></div>
    </div>
  </div>
);

export default SuccessMessage;