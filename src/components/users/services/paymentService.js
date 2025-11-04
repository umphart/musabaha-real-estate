// API service functions
export const fetchPayments = async (userId) => {
  const res = await fetch(`https://musabaha-homes-ltd.com.ng/api/user-payments/user/${userId}`);
  return await res.json();
};

export const fetchSubsequentPayments = async (userId) => {
  const res = await fetch(`https://musabaha-homes-ltd.com.ng/api/user-subsequent-payments/user/${userId}`);
  return await res.json();
};