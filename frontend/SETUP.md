# Payment Collection App - Quick Start Guide

## Time: ~15 minutes to get running

## Step 1: Install Dependencies (5 minutes)

Open a terminal in the frontend folder:

```powershell
cd c:\Users\abhis\Desktop\Coligo\bankApp\frontend
npm install
```

This will install all required packages:
- React Native & Expo
- React Navigation
- Axios for API calls

## Step 2: Configure Backend Connection (1 minute)

Open `config.js` and update the API URL:

**For testing with localhost backend:**
```javascript
export const API_URL = 'http://localhost:3000';
```

**For Android Emulator:**
```javascript
export const API_URL = 'http://10.0.2.2:3000';
```

**For Physical Device (use your computer's IP):**
```javascript
export const API_URL = 'http://192.168.1.XXX:3000';
```

To find your IP:
```powershell
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

## Step 3: Start the Backend (if not already running)

In a separate terminal:
```powershell
cd c:\Users\abhis\Desktop\Coligo\bankApp\backend
npm start
```

The backend should be running on http://localhost:3000

## Step 4: Start the Frontend (2 minutes)

In the frontend terminal:
```powershell
npm start
```

This will open Expo DevTools in your browser.

## Step 5: Run on Device

### Option A: Physical Device (Recommended)
1. Install "Expo Go" app from Play Store (Android) or App Store (iOS)
2. Scan the QR code shown in the terminal
3. App will load on your device

### Option B: Android Emulator
```powershell
npm run android
```
(Requires Android Studio with an emulator set up)

### Option C: iOS Simulator (Mac only)
```powershell
npm run ios
```

### Option D: Web Browser
```powershell
npm run web
```

## Features to Test

### 1. View Loan Accounts
- Open the app
- See list of all customer loan accounts
- View account details: Number, Issue Date, Interest Rate, Tenure, EMI Due

### 2. View Loan Details
- Tap on any loan account card
- See detailed information
- Tap "Make Payment" button

### 3. Make a Payment
- Enter account number (or pre-filled from previous screen)
- Enter payment amount
- Tap "Submit Payment"
- See confirmation screen with transaction details

### 4. Direct Payment
- From home screen, tap "Make Payment" button
- Manually enter account number and amount
- Submit payment

## Troubleshooting

### Cannot connect to backend:
1. Check backend is running on port 3000
2. Verify API_URL in config.js matches your setup
3. For physical device, ensure device and computer are on same WiFi network

### Metro bundler errors:
```powershell
expo start --clear
```

### Port already in use:
```powershell
expo start --port 19001
```

### Dependencies issues:
```powershell
rm -rf node_modules
npm install
```

## Project Structure

```
frontend/
├── App.js                    # Main navigation setup
├── config.js                 # API configuration
├── screens/
│   ├── HomeScreen.js        # Loan accounts list
│   ├── LoanDetailsScreen.js # Detailed loan view
│   ├── PaymentScreen.js     # Payment form
│   └── ConfirmationScreen.js # Success confirmation
└── services/
    └── api.js               # API integration
```

## Testing Checklist

- [ ] App launches successfully
- [ ] Home screen shows list of loans
- [ ] Can navigate to loan details
- [ ] Loan details display correctly
- [ ] Payment form accepts input
- [ ] Account number validation works
- [ ] Payment submission succeeds
- [ ] Confirmation screen shows correctly
- [ ] Can navigate back to home
- [ ] UI is responsive on mobile
- [ ] No console errors

## Next Steps

After frontend is working:
1. Test all API endpoints
2. Handle edge cases (invalid account, network errors)
3. Add loading states (already implemented)
4. Test on multiple devices
5. Prepare for deployment

## Tips for 3-Hour Timeline

**Already Complete (Frontend):**
- ✅ All screens created
- ✅ Navigation setup
- ✅ API integration
- ✅ Form validation
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states

**Focus on Backend Next:**
- Create Node.js/Express server
- Set up MySQL/PostgreSQL database
- Implement API endpoints
- Test integration

Good luck with your hiring test! 🚀
