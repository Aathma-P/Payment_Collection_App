const { pool } = require('../config/database');

// GET /customers - Retrieve all customers with loan details
const getAllCustomers = async (req, res) => {
  try {
    const [customers] = await pool.query(
      'SELECT id, account_number, issue_date, interest_rate, tenure, emi_due FROM customers ORDER BY id'
    );
    
    // Calculate remaining EMI for each customer based on this month's payments
    const customersWithBalance = await Promise.all(customers.map(async (customer) => {
      // Get total payments made this month for this customer
      const [payments] = await pool.query(
        `SELECT COALESCE(SUM(payment_amount), 0) as total_paid 
         FROM payments 
         WHERE customer_id = ? 
         AND MONTH(payment_date) = MONTH(CURRENT_DATE())
         AND YEAR(payment_date) = YEAR(CURRENT_DATE())
         AND status = 'completed'`,
        [customer.id]
      );
      
      const totalPaid = payments[0].total_paid || 0;
      const remainingEmi = Math.max(0, customer.emi_due - totalPaid);
      
      return {
        ...customer,
        total_paid_this_month: parseFloat(totalPaid),
        remaining_emi: parseFloat(remainingEmi.toFixed(2)),
        emi_status: remainingEmi <= 0 ? 'paid' : 'pending'
      };
    }));
    
    res.json(customersWithBalance);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ 
      message: 'Error fetching customer data',
      error: error.message 
    });
  }
};

// GET /customers/:id - Get specific customer
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const [customers] = await pool.query(
      'SELECT id, account_number, issue_date, interest_rate, tenure, emi_due FROM customers WHERE id = ?',
      [id]
    );
    
    if (customers.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json(customers[0]);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ 
      message: 'Error fetching customer data',
      error: error.message 
    });
  }
};

// GET /customers/account/:accountNumber - Get customer by account number
const getCustomerByAccountNumber = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const [customers] = await pool.query(
      'SELECT id, account_number, issue_date, interest_rate, tenure, emi_due FROM customers WHERE account_number = ?',
      [accountNumber]
    );
    
    if (customers.length === 0) {
      return res.status(404).json({ message: 'Account not found' });
    }
    
    const customer = customers[0];
    
    // Get total payments made this month for this customer
    const [payments] = await pool.query(
      `SELECT COALESCE(SUM(payment_amount), 0) as total_paid 
       FROM payments 
       WHERE customer_id = ? 
       AND MONTH(payment_date) = MONTH(CURRENT_DATE())
       AND YEAR(payment_date) = YEAR(CURRENT_DATE())
       AND status = 'completed'`,
      [customer.id]
    );
    
    const totalPaid = payments[0].total_paid || 0;
    const remainingEmi = Math.max(0, customer.emi_due - totalPaid);
    
    const customerWithBalance = {
      ...customer,
      total_paid_this_month: parseFloat(totalPaid),
      remaining_emi: parseFloat(remainingEmi.toFixed(2)),
      emi_status: remainingEmi <= 0 ? 'paid' : 'pending'
    };
    
    res.json(customerWithBalance);
  } catch (error) {
    console.error('Error fetching customer by account number:', error);
    res.status(500).json({ 
      message: 'Error fetching customer data',
      error: error.message 
    });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  getCustomerByAccountNumber
};
