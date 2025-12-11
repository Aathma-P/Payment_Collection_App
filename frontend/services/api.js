import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const customerAPI = {
  // GET /customers: Retrieve loan details of all customers
  getAllCustomers: async () => {
    try {
      const response = await api.get('/customers');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /customers/:id: Retrieve specific customer loan details
  getCustomerById: async (id) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /customers/account/:accountNumber: Retrieve customer by account number
  getCustomerByAccountNumber: async (accountNumber) => {
    try {
      const response = await api.get(`/customers/account/${accountNumber}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const paymentAPI = {
  // POST /payments: Allow customers to make a payment for their personal loan
  makePayment: async (paymentData) => {
    try {
      const response = await api.post('/payments', paymentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /payments/:accountNumber: Retrieve payment history for a specific account
  getPaymentHistory: async (accountNumber) => {
    try {
      const response = await api.get(`/payments/${accountNumber}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
