import { useState, useEffect, useCallback } from 'react';

export const useUserPlots = (user) => {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "₦0";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(Number(value));
  };

  const fetchUserPlots = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/subscriptions?email=${user.email}`);
      const result = await response.json();

      console.log('All plots data:', result);

      if (result.success && result.data && result.data.length > 0) {
        const allPlots = result.data.map(item => ({
          ...item,
          source: item.source || 'subscriptions',
          plot_name: item.layout_name || item.plot_taken,
          plot_size: item.plot_size,
          number_of_plots: item.number_of_plots || item.plot_number,
          total_price: item.price || item.total_money_to_pay,
          initial_deposit: item.initial_deposit || '0',
          current_balance: item.total_balance || (item.price - (item.initial_deposit || 0)),
          status: item.status,
          contact: item.contact || item.phone_number,
          created_at: item.created_at
        }));

        setPlots(allPlots);

        // Fetch payments for all plots
        try {
          const paymentsResponse = await fetch(
            `http://localhost:5000/api/user-payments/user/${user.id}`
          );
          const paymentsData = await paymentsResponse.json();
          
          if (paymentsData.success) {
            setPayments(paymentsData.payments);
            
            const plotsWithPayments = allPlots.map(plot => {
              const plotPayments = paymentsData.payments.filter(payment => 
                payment.subscription_id === plot.id || 
                payment.user_id === plot.user_id
              );
              
              return {
                ...plot,
                payments: plotPayments,
                total_paid: plotPayments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0),
                latest_payment: plotPayments[0]
              };
            });
            
            setPlots(plotsWithPayments);
          }
        } catch (paymentError) {
          console.error('Error fetching payments:', paymentError);
        }
      } else {
        setError('No plots found for this user');
      }
    } catch (err) {
      console.error('Error fetching plots:', err);
      setError('Error loading plot data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.email && user?.id) {
      fetchUserPlots();
    }
  }, [user, fetchUserPlots]);

  const refreshPlots = () => {
    setLoading(true);
    fetchUserPlots();
  };

  return {
    plots,
    loading,
    error,
    payments,
    refreshPlots,
    formatCurrency
  };
};

export default useUserPlots;