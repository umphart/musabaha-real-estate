import React from 'react';
import { FiFileText } from 'react-icons/fi';

const ReceiptGenerator = ({ payment, paymentItem }) => {
  const handleGenerateReceipt = () => {
    // Basic receipt generation logic
    const receiptData = {
      id: payment.id,
      amount: payment.amount,
      date: payment.created_at || payment.transaction_date,
      name: payment.user_name,
      contact: payment.user_contact,
      method: payment.payment_method,
      note: payment.note || payment.notes
    };
    
    console.log('Generating receipt:', receiptData);
    // Add your receipt generation logic here
    alert(`Receipt for payment ${payment.id} would be generated here`);
  };

  const isApproved = payment.status === 'approved';

  return (
    <button
      className={`receipt-btn ${isApproved ? 'approved' : 'not-approved'} ${!isApproved ? 'disabled' : ''}`}
      onClick={isApproved ? handleGenerateReceipt : undefined}
      disabled={!isApproved}
    >
      <FiFileText size={14} />
      {isApproved ? 'Download' : 'Pending'}
    </button>
  );
};

export default ReceiptGenerator;