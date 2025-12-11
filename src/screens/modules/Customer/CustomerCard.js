import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

import { COLOR, FONTS } from '../../../utils/constants';

const CustomerCard = ({ data, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={onPress}>
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.nameContainer}>
          <MaterialDesignIcons
            name="account-circle"
            size={26}
            color={COLOR.PRIMARY_COLOR}
          />
          <Text style={styles.title} numberOfLines={2}>
            {data.name}
          </Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{data.count} Policies</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Details */}
      <View style={styles.infoRow}>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Customer ID</Text>
          <Text style={styles.value}>{data.id}</Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{data.phoneNo}</Text>
        </View>
      </View>

      {/* Premium */}
      <View style={[styles.rowBetween, { marginTop: 12 }]}>
        <Text style={styles.premiumLabel}>Total Premium</Text>
        <Text style={styles.premiumValue}>₹ {data.premium.toLocaleString()}</Text>
      </View>

    </TouchableOpacity>
  );
};

export default CustomerCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  nameContainer: {
    flexDirection: 'row',
    marginRight: 8,
    alignItems: 'center',
    width: '65%',
  },

  title: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
  },

  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 11,
    color: COLOR.PRIMARY_COLOR,
    fontFamily: 'Poppins-Medium',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoBlock: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
    fontFamily: 'Poppins-Regular',
  },
  value: {
    fontSize: 13,
    color: '#1F2937',
    fontFamily: 'Poppins-Medium',
  },

  premiumLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Poppins-Medium',
  },
  premiumValue: {
    fontSize: 16,
    color: COLOR.PRIMARY_COLOR,
    fontFamily: 'Poppins-SemiBold',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});