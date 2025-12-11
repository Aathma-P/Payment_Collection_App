# Payment Collection App - Frontend

A React Native mobile application for managing personal loan payments.

## Features

- **Loan Details Display**: View all customer loan information including:
  - Account Number
  - Issue Date
  - Interest Rate
  - Tenure
  - EMI Due

- **Payment Processing**: Make EMI payments with:
  - Account number verification
  - Custom payment amounts
  - Secure transaction processing
  - Payment confirmation

- **Responsive UI**: Modern, user-friendly interface optimized for mobile devices

## Tech Stack

- React Native (Expo)
- React Navigation
- Axios for API calls

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure the API URL:
   - Open `config.js`
   - Update the `API_URL` to point to your backend server
   ```javascript
   export const API_URL = 'http://YOUR_BACKEND_IP:3000';
   ```

## Running the App

### Start the development server:
```bash
npm start
```

### Run on specific platform:

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

**Web:**
```bash
npm run web
```

## Project Structure

```
frontend/
├── App.js                      # Main app component with navigation
├── config.js                   # API configuration
├── package.json               # Dependencies
├── app.json                   # Expo configuration
├── babel.config.js            # Babel configuration
├── screens/
│   ├── HomeScreen.js          # List of all loan accounts
│   ├── LoanDetailsScreen.js   # Detailed loan information
│   ├── PaymentScreen.js       # Payment form
│   └── ConfirmationScreen.js  # Payment success confirmation
└── services/
    └── api.js                 # API service layer
```

## API Integration

The app connects to the following backend endpoints:

- `GET /customers` - Retrieve all customers with loan details
- `GET /customers/:id` - Get specific customer details
- `GET /customers/account/:accountNumber` - Verify account number
- `POST /payments` - Submit payment
- `GET /payments/:accountNumber` - Get payment history

## Screens

### 1. Home Screen
Displays a list of all customer loan accounts with quick overview of:
- Account number
- Issue date
- Interest rate
- Tenure
- EMI due amount

### 2. Loan Details Screen
Shows comprehensive information about a specific loan account with option to make payment.

### 3. Payment Screen
Form to process payments:
- Enter account number
- Enter payment amount
- Account verification
- Submit payment

### 4. Confirmation Screen
Displays payment success confirmation with:
- Transaction ID
- Payment details
- Date and time
- Status

## Environment Variables

Update `config.js` with your backend API URL:

```javascript
export const API_URL = 'http://localhost:3000';
```

For production deployment, use the actual server IP or domain.

## Building for Production

### Android:
```bash
expo build:android
```

### iOS:
```bash
expo build:ios
```

## Troubleshooting

**Cannot connect to backend:**
- Ensure backend server is running
- Check API_URL in `config.js`
- For Android emulator, use `http://10.0.2.2:3000`
- For iOS simulator, use `http://localhost:3000`
- For physical device, use your computer's IP address

**Expo errors:**
```bash
expo start --clear
```

## Contributing

This is a hiring test project. Modifications should follow the requirements specified in the test documentation.

## License

Private - Hiring Test Project
