import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { paymentAPI, customerAPI } from '../services/api';

export default function PaymentScreen({ route, navigation }) {
  const prefilledAccountNumber = route.params?.accountNumber || '';
  const suggestedAmount = route.params?.emiDue || '';

  const [accountNumber, setAccountNumber] = useState(prefilledAccountNumber);
  const [amount, setAmount] = useState(suggestedAmount.toString());
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);

  const validateAccountNumber = async () => {
    if (!accountNumber.trim()) {
      Alert.alert('Error', 'Please enter an account number');
      return false;
    }

    try {
      const customer = await customerAPI.getCustomerByAccountNumber(accountNumber);
      setCustomerInfo(customer);
      return true;
    } catch (error) {
      Alert.alert('Error', 'Invalid account number. Please check and try again.');
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!accountNumber.trim()) {
      Alert.alert('Error', 'Please enter your account number');
      return;
    }

    if (!amount.trim() || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid payment amount');
      return;
    }

    setLoading(true);

    try {
      // Validate account number first
      const isValid = await validateAccountNumber();
      if (!isValid) {
        setLoading(false);
        return;
      }

      // Make payment
      const paymentData = {
        account_number: accountNumber,
        payment_amount: parseFloat(amount),
        payment_date: new Date().toISOString(),
        status: 'completed',
      };

      const response = await paymentAPI.makePayment(paymentData);

      setLoading(false);

      // Navigate to confirmation screen
      navigation.navigate('Confirmation', {
        paymentData: {
          ...paymentData,
          ...response,
        },
        customerInfo,
      });

      // Reset form
      setAccountNumber('');
      setAmount('');
      setCustomerInfo(null);
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Payment Failed',
        error.response?.data?.message ||
          'Unable to process payment. Please try again.'
      );
    }
  };

  const formatCurrency = (value) => {
    return `₹${parseFloat(value).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Make Payment</Text>
          <Text style={styles.subtitle}>
            Enter your account details to process EMI payment
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your account number"
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="default"
              autoCapitalize="characters"
              editable={!loading}
            />
            <Text style={styles.helper}>
              Enter the account number associated with your loan
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Payment Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                editable={!loading}
              />
            </View>
            {suggestedAmount && (
              <Text style={styles.helper}>
                Suggested EMI: {formatCurrency(suggestedAmount)}
              </Text>
            )}
          </View>

          {customerInfo && (
            <View style={styles.customerInfoCard}>
              <Text style={styles.customerInfoTitle}>Account Verified ✓</Text>
              <Text style={styles.customerInfoText}>
                A/C: {customerInfo.account_number}
              </Text>
              <Text style={styles.customerInfoText}>
                EMI Due: {formatCurrency(customerInfo.emi_due)}
              </Text>
              {customerInfo.total_paid_this_month > 0 && (
                <>
                  <Text style={styles.customerInfoPaid}>
                    Paid This Month: {formatCurrency(customerInfo.total_paid_this_month)}
                  </Text>
                  <Text style={[
                    styles.customerInfoRemaining,
                    customerInfo.emi_status === 'paid' && styles.fullyPaid
                  ]}>
                    {customerInfo.emi_status === 'paid' 
                      ? '✅ EMI Fully Paid' 
                      : `Remaining: ${formatCurrency(customerInfo.remaining_emi)}`}
                  </Text>
                </>
              )}
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Payment</Text>
            )}
          </TouchableOpacity>

          <View style={styles.securityNote}>
            <Text style={styles.securityIcon}>🔒</Text>
            <Text style={styles.securityText}>
              Your payment is secure and encrypted
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 10,
    padding: 16,
    fontSize: 17,
    color: '#000000',
  },
  helper: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 6,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 10,
    paddingLeft: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    padding: 16,
    paddingLeft: 0,
    fontSize: 17,
    color: '#000000',
  },
  customerInfoCard: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 10,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  customerInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  customerInfoText: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 4,
  },
  customerInfoPaid: {
    fontSize: 14,
    color: '#1976D2',
    marginBottom: 4,
    fontWeight: '600',
  },
  customerInfoRemaining: {
    fontSize: 15,
    color: '#D32F2F',
    fontWeight: 'bold',
    marginTop: 4,
  },
  fullyPaid: {
    color: '#2E7D32',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  securityIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  securityText: {
    fontSize: 14,
    color: '#8E8E93',
  },
});
