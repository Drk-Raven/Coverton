import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

const DashboardTargetCard = ({ title, month, achievedAmount, isCustomer }) => {
  const icon = isCustomer ? 'chart-line' : 'bullseye-arrow';
  return (
    <View style={styles.targetCard}>
      <View style={styles.targetHeader}>
        <View style={styles.targetTitleContainer}>
          <Text numberOfLines={1} style={styles.targetCardTitle}>
            {title}
          </Text>
          <Text style={styles.targetMonth}>{month}</Text>
        </View>
        <View style={styles.targetIconContainer}>
          <MaterialDesignIcons name={icon} size={18} color="#059669" />
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Text numberOfLines={1} style={styles.currentAmount}>
          {achievedAmount}
        </Text>
      </View>
    </View>
  );
};

export default DashboardTargetCard;

const styles = StyleSheet.create({
  targetCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 1,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    marginBottom: 12,
  },
  targetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  targetIconContainer: {
    backgroundColor: '#ecfdf5',
    padding: 8,
    borderRadius: 10,
  },
  targetTitleContainer: { flex: 1, marginRight: 8 },
  targetCardTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  targetMonth: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  amountContainer: { marginTop: 2 },
  currentAmount: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
});
