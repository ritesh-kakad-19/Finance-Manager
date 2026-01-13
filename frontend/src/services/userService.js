// services/userService.js
import axios from "axios";

const API_URL = "https://finance-manager-91sp.onrender.com/api/users";

export const getProfile = async (token) => {
  const res = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateProfile = async (token, data) => {
  const res = await axios.put(`${API_URL}/profile`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
