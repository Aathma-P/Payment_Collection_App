const express = require('express');
const router = express.Router();
const {
  makePayment,
  getPaymentHistory
} = require('../controllers/paymentController');

// POST /payments - Make a payment
router.post('/', makePayment);

// GET /payments/:accountNumber - Get payment history for an account
router.get('/:accountNumber', getPaymentHistory);

module.exports = router;
