const { pool } = require('../config/database');

// POST /payments - Create a new payment
const makePayment = async (req, res) => {
  try {
    const { account_number, payment_amount, payment_date, status } = req.body;

    // Validate required fields
    if (!account_number || !payment_amount) {
      return res.status(400).json({ 
        message: 'Account number and payment amount are required' 
      });
    }

    // Verify customer exists
    const [customers] = await pool.query(
      'SELECT id FROM customers WHERE account_number = ?',
      [account_number]
    );

    if (customers.length === 0) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const customerId = customers[0].id;

    // Format date for MySQL (YYYY-MM-DD HH:MM:SS)
    const formattedDate = payment_date 
      ? new Date(payment_date).toISOString().slice(0, 19).replace('T', ' ')
      : new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Insert payment
    const [result] = await pool.query(
      'INSERT INTO payments (customer_id, account_number, payment_amount, payment_date, status) VALUES (?, ?, ?, ?, ?)',
      [
        customerId,
        account_number,
        payment_amount,
        formattedDate,
        status || 'completed'
      ]
    );

    // Fetch the created payment
    const [payment] = await pool.query(
      'SELECT * FROM payments WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Payment successful',
      payment: payment[0]
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ 
      message: 'Error processing payment',
      error: error.message 
    });
  }
};

// GET /payments/:accountNumber - Get payment history for an account
const getPaymentHistory = async (req, res) => {
  try {
    const { accountNumber } = req.params;

    const [payments] = await pool.query(
      'SELECT * FROM payments WHERE account_number = ? ORDER BY payment_date DESC',
      [accountNumber]
    );

    res.json(payments);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ 
      message: 'Error fetching payment history',
      error: error.message 
    });
  }
};

module.exports = {
  makePayment,
  getPaymentHistory
};
