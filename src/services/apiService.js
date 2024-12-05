import axiosInstance from '../api/axiosInstance';

const apiService = {
  login: (data) => axiosInstance.post('/auth/login', data),
  register: (data) => axiosInstance.post('/auth/register', data),
  fetchInventory: () => axiosInstance.get('/inventory'),  // Fetch inventory
  fetchOrders: () => axiosInstance.get('/orders'),  // Fetch orders
  fetchReports: () => axiosInstance.get('/reports'),  // Fetch reports
  fetchStaff: () => axiosInstance.get('/staff'),  // Fetch staff
  // Add other endpoints as needed
};

export default apiService;