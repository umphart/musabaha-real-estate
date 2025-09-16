// src/utils/auth.js
export const getAuthToken = () => {
  return localStorage.getItem("adminToken"); // or "token" depending on login flow
};

export const setAuthToken = (token) => {
  localStorage.setItem("adminToken", token);
};

export const clearAuthToken = () => {
  localStorage.removeItem("adminToken");
};
