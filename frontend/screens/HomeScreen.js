import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { customerAPI } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    try {
      setError(null);
      const data = await customerAPI.getAllCustomers();
      setCustomers(data);
    } catch (err) {
      setError('Failed to load customer data. Please check your connection.');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    
    // Listen for focus event to refresh when returning to this screen
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCustomers();
    });

    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCustomers();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading customer data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCustomers}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Loan Accounts</Text>
        <Text style={styles.subtitle}>
          {customers.length} Active {customers.length === 1 ? 'Loan' : 'Loans'}
        </Text>
      </View>

      {customers.map((customer) => (
        <TouchableOpacity
          key={customer.id}
          style={styles.card}
          onPress={() =>
            navigation.navigate('LoanDetails', { customer })
          }
        >
          <View style={styles.cardHeader}>
            <Text style={styles.accountNumber}>
              A/C: {customer.account_number}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Active</Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.row}>
              <View style={styles.infoBlock}>
                <Text style={styles.label}>Issue Date</Text>
                <Text style={styles.value}>
                  {formatDate(customer.issue_date)}
                </Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.label}>Interest Rate</Text>
                <Text style={styles.value}>{customer.interest_rate}%</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.infoBlock}>
                <Text style={styles.label}>Tenure</Text>
                <Text style={styles.value}>
                  {customer.tenure} {customer.tenure === 1 ? 'month' : 'months'}
                </Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.label}>EMI Due</Text>
                <Text style={styles.emiValue}>
                  {formatCurrency(customer.emi_due)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.linkText}>View Details & Make Payment →</Text>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Payment')}
      >
        <Text style={styles.floatingButtonText}>Make Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    padding: 20,
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  accountNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  badge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoBlock: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  emiValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  cardFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '500',
  },
  floatingButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 15,
    marginVertical: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
