const express = require('express');
const router = express.Router();
const {
  getAllCustomers,
  getCustomerById,
  getCustomerByAccountNumber
} = require('../controllers/customerController');

// GET /customers - Retrieve all customers
router.get('/', getAllCustomers);

// GET /customers/:id - Get specific customer by ID
router.get('/:id', getCustomerById);

// GET /customers/account/:accountNumber - Get customer by account number
router.get('/account/:accountNumber', getCustomerByAccountNumber);

module.exports = router;
