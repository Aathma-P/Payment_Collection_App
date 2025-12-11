-- Payment Collection Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS payment_collection_db;
USE payment_collection_db;

-- Customers table (stores loan details)
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    tenure INT NOT NULL COMMENT 'Tenure in months',
    emi_due DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_account_number (account_number)
);

-- Payments table (tracks EMI payments)
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    payment_amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_account_number (account_number),
    INDEX idx_payment_date (payment_date)
);

-- Insert sample customer data
INSERT INTO customers (account_number, issue_date, interest_rate, tenure, emi_due) VALUES
('ACC001', '2024-01-15', 8.50, 24, 4500.00),
('ACC002', '2024-02-20', 9.00, 36, 3200.00),
('ACC003', '2024-03-10', 7.75, 12, 8500.00),
('ACC004', '2024-04-05', 8.25, 48, 2800.00),
('ACC005', '2024-05-18', 9.50, 24, 5200.00);

-- Insert sample payment data
INSERT INTO payments (customer_id, account_number, payment_amount, payment_date, status) VALUES
(1, 'ACC001', 4500.00, '2024-06-01 10:30:00', 'completed'),
(1, 'ACC001', 4500.00, '2024-07-01 11:15:00', 'completed'),
(2, 'ACC002', 3200.00, '2024-06-15 14:20:00', 'completed'),
(3, 'ACC003', 8500.00, '2024-06-10 09:45:00', 'completed');
