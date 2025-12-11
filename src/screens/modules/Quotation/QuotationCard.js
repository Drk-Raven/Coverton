import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { COLOR, QUOTATION_STATUS } from '../../../utils/constants';
const QuotationCard = ({ data, onPress }) => {
  const {
    id,
    customerName,
    insurerName,
    producType,
    categoryType,
    quotedAmount,
    status,
  } = data;

  const statusColor =
    status === 'approved'
      ? COLOR.APPROVED_COLOR
      : status === 'rejected'
      ? COLOR.REJECTED_COLOR
      : COLOR.PENDING_COLOR;

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={()=>{onPress(data)}}>
      {/* Header: Customer + Status */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <MaterialDesignIcons
            name="account-circle-outline"
            size={22}
            style={styles.icon}
          />
          <View>
            <Text style={styles.idText}>{id}</Text>

            <Text style={styles.customerText}>
              {customerName}
              {insurerName ? ` (${insurerName})` : ''}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.statusPill,
            {

              borderColor: statusColor,
              backgroundColor: `${statusColor}20`, // light tinted bg
            },
          ]}
        >
          <Text style={[styles.statusText, { color: statusColor }]}>
            {status?.toUpperCase() ? QUOTATION_STATUS[status?.toUpperCase()] : 'N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Product Row */}
      <View style={styles.row}>
        <MaterialDesignIcons
          name="shield-check-outline"
          size={18}
          style={styles.icon}
        />
        <View style={styles.textGroup}>
          <Text style={styles.label}>Product Type</Text>
          <Text style={styles.value}>
            {producType} {categoryType ? `• ${categoryType}` : ''}
          </Text>
        </View>
      </View>

      {/* Amount Row */}
      <View style={styles.footerRow}>
        <View style={styles.textGroup}>
          <Text style={styles.label}>Quoted Amount</Text>
          <Text style={styles.amount}>
            ₹ {Number(quotedAmount).toLocaleString('en-IN')}
          </Text>
        </View>
        <MaterialDesignIcons
          name="chevron-right"
          size={22}
          style={styles.chevron}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  icon: {
    marginRight: 8,
    color: '#6B7280',
  },
  customerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  idText: {
    marginTop: 2,
    fontSize: 11,
    color: '#6B7280',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    width: '20%'
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    marginRight: 6,
  },
  statusText: {
    fontSize: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  textGroup: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  value: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'space-between',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F766E',
  },
  chevron: {
    color: '#9CA3AF',
    marginLeft: 8,
  },
});

export default QuotationCard;
