# Payment Collection Backend API

Node.js/Express backend for the Payment Collection mobile application.

## Features

- RESTful API for loan and payment management
- MySQL database integration
- Customer loan details management
- Payment processing and history tracking
- CORS enabled for mobile app integration

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **dotenv** - Environment configuration

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

## Installation

### 1. Install Dependencies

```powershell
cd backend
npm install
```

### 2. Configure Database

Update `.env` file with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=payment_collection_db
DB_PORT=3306
```

### 3. Set Up Database

Run the setup script to create database, tables, and sample data:

```powershell
npm run setup
```

This will:
- Create the database
- Create customers and payments tables
- Insert sample loan data
- Insert sample payment records

### 4. Start the Server

```powershell
npm start
```

For development with auto-reload:
```powershell
npm run dev
```

Server will run on: **http://localhost:3000**

## API Endpoints

### Customers

#### Get All Customers
```
GET /customers
```
Returns all customer loan details.

**Response:**
```json
[
  {
    "id": 1,
    "account_number": "ACC001",
    "issue_date": "2024-01-15",
    "interest_rate": 8.50,
    "tenure": 24,
    "emi_due": 4500.00
  }
]
```

#### Get Customer by ID
```
GET /customers/:id
```

#### Get Customer by Account Number
```
GET /customers/account/:accountNumber
```
Used to verify account numbers before payment.

### Payments

#### Make Payment
```
POST /payments
```

**Request Body:**
```json
{
  "account_number": "ACC001",
  "payment_amount": 4500.00,
  "payment_date": "2024-12-11T10:30:00",
  "status": "completed"
}
```

**Response:**
```json
{
  "message": "Payment successful",
  "payment": {
    "id": 1,
    "customer_id": 1,
    "account_number": "ACC001",
    "payment_amount": 4500.00,
    "payment_date": "2024-12-11T10:30:00",
    "status": "completed"
  }
}
```

#### Get Payment History
```
GET /payments/:accountNumber
```
Returns all payments for a specific account.

## Database Schema

### Customers Table
```sql
- id (INT, Primary Key, Auto Increment)
- account_number (VARCHAR, Unique)
- issue_date (DATE)
- interest_rate (DECIMAL)
- tenure (INT) - in months
- emi_due (DECIMAL)
```

### Payments Table
```sql
- id (INT, Primary Key, Auto Increment)
- customer_id (INT, Foreign Key)
- account_number (VARCHAR)
- payment_amount (DECIMAL)
- payment_date (TIMESTAMP)
- status (ENUM: 'pending', 'completed', 'failed')
```

## Sample Data

The setup script includes 5 sample customers with accounts:
- ACC001 - ACC005

## Environment Variables

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=payment_collection_db
DB_PORT=3306
CORS_ORIGIN=*
```

## Testing the API

### Using cURL

```powershell
# Get all customers
curl http://localhost:3000/customers

# Make a payment
curl -X POST http://localhost:3000/payments -H "Content-Type: application/json" -d "{\"account_number\":\"ACC001\",\"payment_amount\":4500}"

# Get payment history
curl http://localhost:3000/payments/ACC001
```

### Using Browser
Visit: http://localhost:3000

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database connection
├── controllers/
│   ├── customerController.js # Customer business logic
│   └── paymentController.js  # Payment business logic
├── routes/
│   ├── customers.js         # Customer routes
│   └── payments.js          # Payment routes
├── database/
│   └── schema.sql           # Database schema
├── server.js                # Main server file
├── setup-database.js        # Database setup script
├── package.json
└── .env                     # Environment variables
```

## Troubleshooting

### Database Connection Failed
1. Check if MySQL is running
2. Verify credentials in `.env`
3. Ensure MySQL user has proper permissions

### Port Already in Use
Change the PORT in `.env` file:
```env
PORT=3001
```

### Cannot find module errors
Run:
```powershell
npm install
```

## Development

Watch mode with auto-reload:
```powershell
npm run dev
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:
```powershell
npm install -g pm2
pm2 start server.js --name payment-api
```

## Security Notes

- Never commit `.env` file to version control
- Use strong database passwords in production
- Configure CORS properly for production
- Implement authentication for production use

## License

Private - Hiring Test Project
