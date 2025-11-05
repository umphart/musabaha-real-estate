import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

// Import components
import PaymentTable from "./components/PaymentTable";
import PaymentCards from "./components/PaymentCards";
import AddPaymentModal from "./components/AddPaymentModal";
import PaymentInstructions from "./components/PaymentInstructions";
import { fetchPayments, fetchSubsequentPayments } from "./services/paymentService";

const UserPayments = ({ user }) => {
  const [payments, setPayments] = useState([]);
  const [subsequentPayments, setSubsequentPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ Fetch main payments
  useEffect(() => {
    if (!user?.id) return;

    const loadPayments = async () => {
      try {
        const data = await fetchPayments(user.id);
        if (data.success) {
          setPayments(data.payments);
        }
      } catch (err) {
        console.error("Error fetching payments:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Could not load payments.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [user]);

  // ✅ Fetch subsequent payments
  useEffect(() => {
    if (!user?.id) return;

    const loadSubsequentPayments = async () => {
      try {
        const data = await fetchSubsequentPayments(user.id);
        if (data.success) {
          setSubsequentPayments(data.payments);
        }
      } catch (err) {
        console.error("Error fetching subsequent payments:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while fetching subsequent payments.",
        });
      }
    };

    loadSubsequentPayments();
  }, [user]);

  // ✅ Show payment instructions first, then open modal
  const handleAddPaymentClick = async (payment) => {
    setSelectedPayment(payment);
    
    const { isConfirmed } = await PaymentInstructions.show();
    
    // If user confirms, open the modal
    if (isConfirmed) {
      setShowModal(true);
    }
  };

  // ✅ Submit payment
  const handleSubmitPayment = async (formData) => {
    if (!formData.amount) {
      Swal.fire({
        icon: "warning",
        title: "Missing Amount",
        text: "Please enter the payment amount before submitting.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const submitFormData = new FormData();
      submitFormData.append("amount", formData.amount);
      submitFormData.append("payment_method", formData.payment_method);
      submitFormData.append("user_id", selectedPayment.user_id);
      submitFormData.append("user_name", selectedPayment.name);
      submitFormData.append("user_contact", selectedPayment.contact);
      submitFormData.append("plot_id", selectedPayment.plot_id);
      submitFormData.append("number_of_plots", selectedPayment.number_of_plots);
      submitFormData.append("plot_size", selectedPayment.plot_size);
      submitFormData.append("total_price", selectedPayment.total_price);
      submitFormData.append("outstanding_balance", selectedPayment.outstanding_balance);
      submitFormData.append("note", formData.note || "");
      if (formData.receipt) {
        submitFormData.append("receipt", formData.receipt);
      }

      const res = await fetch("https://musabaha-homes.onrender.com/api/user-subsequent-payments", {

        method: "POST",
        body: submitFormData,
      });

      const data = await res.json();
      if (data.success) {
        setSubsequentPayments((prev) => [...prev, data.payment]);
        setShowModal(false);

        Swal.fire({
          icon: "success",
          title: "Payment Added",
          text: "Your payment was submitted successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.error || "Failed to add payment",
        });
      }
    } catch (err) {
      console.error("Error adding payment:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while adding the payment.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading payment history...</p>;
  }

  return (
    <div className="payments-container">
      <h2>Payments</h2>

      {payments.length === 0 ? (
        <p className="no-payments">No payments found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <PaymentTable 
            payments={payments} 
            onAddPayment={handleAddPaymentClick} 
          />

          {/* Mobile Cards */}
          <PaymentCards 
            payments={payments} 
            onAddPayment={handleAddPaymentClick} 
          />
        </>
      )}

      {/* Modal */}
      {showModal && selectedPayment && (
        <AddPaymentModal
          payment={selectedPayment}
          subsequentPayments={subsequentPayments}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitPayment}
          submitting={submitting}
        />
      )}

      <style jsx>{`
        .payments-container {
          padding: 20px;
          max-width: 100%;
          overflow-x: auto;
        }

        .payments-container h2 {
          margin-bottom: 20px;
          color: #333;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .no-payments {
          text-align: center;
          padding: 40px;
          color: #666;
          font-size: 1.1rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        @media (max-width: 768px) {
          .payments-container {
            padding: 15px;
          }
          
          .payments-container h2 {
            font-size: 1.3rem;
          }
        }

        @media (max-width: 480px) {
          .payments-container {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default UserPayments;