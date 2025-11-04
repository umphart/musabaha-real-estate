// API service functions
export const fetchPayments = async (userId) => {
  const res = await fetch(`http://localhost:5000/api/user-payments/user/${userId}`);
  return await res.json();
};

export const fetchSubsequentPayments = async (userId) => {
  const res = await fetch(`http://localhost:5000/api/user-subsequent-payments/user/${userId}`);
  return await res.json();
};