import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { paymentAPI, customerAPI } from '../services/api';

export default function LoanDetailsScreen({ route, navigation }) {
  const [customerData, setCustomerData] = useState(route.params.customer);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (showHistory && paymentHistory.length === 0) {
      fetchPaymentHistory();
    }
  }, [showHistory]);

  useEffect(() => {
    // Refresh customer data when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      refreshCustomerData();
    });

    return unsubscribe;
  }, [navigation]);

  const refreshCustomerData = async () => {
    try {
      const updated = await customerAPI.getCustomerByAccountNumber(customerData.account_number);
      setCustomerData(updated);
      // Also refresh payment history if it's showing
      if (showHistory) {
        fetchPaymentHistory();
      }
    } catch (error) {
      console.error('Error refreshing customer data:', error);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      setLoadingHistory(true);
      const history = await paymentAPI.getPaymentHistory(customerData.account_number);
      setPaymentHistory(history);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Loan Details</Text>
        <Text style={styles.accountNumber}>{customerData.account_number}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Account Number</Text>
            <Text style={styles.detailValue}>{customerData.account_number}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Issue Date</Text>
            <Text style={styles.detailValue}>
              {formatDate(customerData.issue_date)}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Interest Rate</Text>
            <Text style={styles.detailValue}>{customerData.interest_rate}% per annum</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Tenure</Text>
            <Text style={styles.detailValue}>
              {customerData.tenure} {customerData.tenure === 1 ? 'month' : 'months'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.emiSection}>
        <Text style={styles.sectionTitle}>EMI Details</Text>
        <View style={styles.emiCard}>
          <Text style={styles.emiLabel}>Monthly EMI Due</Text>
          <Text style={styles.emiAmount}>
            {formatCurrency(customerData.emi_due)}
          </Text>
          
          {customerData.total_paid_this_month > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.paidLabel}>Paid This Month</Text>
              <Text style={styles.paidAmount}>
                {formatCurrency(customerData.total_paid_this_month)}
              </Text>
              
              <View style={styles.divider} />
              <Text style={styles.remainingLabel}>
                {customerData.emi_status === 'paid' ? '✅ Fully Paid' : 'Remaining Balance'}
              </Text>
              <Text style={[
                styles.remainingAmount,
                customerData.emi_status === 'paid' && styles.paidStatus
              ]}>
                {formatCurrency(customerData.remaining_emi)}
              </Text>
            </>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.paymentButton}
        onPress={() =>
          navigation.navigate('Payment', {
            accountNumber: customerData.account_number,
            emiDue: customerData.emi_due,
          })
        }
      >
        <Text style={styles.paymentButtonText}>Make Payment</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => setShowHistory(!showHistory)}
      >
        <Text style={styles.historyButtonText}>
          {showHistory ? '🔼 Hide Payment History' : '🔽 View Payment History'}
        </Text>
      </TouchableOpacity>

      {showHistory && (
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          {loadingHistory ? (
            <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
          ) : paymentHistory.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyText}>No payment history found</Text>
            </View>
          ) : (
            paymentHistory.map((payment, index) => (
              <View key={payment.id || index} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyAmount}>
                    {formatCurrency(payment.payment_amount)}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    payment.status === 'completed' ? styles.statusCompleted : styles.statusPending
                  ]}>
                    <Text style={styles.statusText}>
                      {payment.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.historyDate}>
                  {formatDate(payment.payment_date)}
                </Text>
                <Text style={styles.historyAccount}>
                  Account: {payment.account_number}
                </Text>
              </View>
            ))
          )}
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Tip: You can make partial or full EMI payments. Enter the amount you wish to pay on the payment screen.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  accountNumber: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  detailRow: {
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000000',
  },
  emiSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emiCard: {
    backgroundColor: '#F2F2F7',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  emiLabel: {
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 8,
  },
  emiAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#C7C7CC',
    marginVertical: 15,
  },
  paidLabel: {
    fontSize: 15,
    color: '#34C759',
    marginBottom: 8,
    fontWeight: '600',
  },
  paidAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34C759',
  },
  remainingLabel: {
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 8,
    fontWeight: '600',
  },
  remainingAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  paidStatus: {
    color: '#34C759',
  },
  paymentButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  historyButton: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  historyButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  historySection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loader: {
    marginVertical: 20,
  },
  emptyHistory: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#8E8E93',
  },
  historyCard: {
    backgroundColor: '#F2F2F7',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: '#D4EDDA',
  },
  statusPending: {
    backgroundColor: '#FFF3CD',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  historyDate: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  historyAccount: {
    fontSize: 13,
    color: '#8E8E93',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 16,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
});
