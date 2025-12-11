import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import DashboardTargetCard from './DashboardTargetCard';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { formatDecimals } from '../../../utils/utils';
import { PolicyActions } from '../../../Redux/PolicyRedux';
import * as RequestStatus from '../../../Entities/RequestStatus';
import { COLOR } from '../../../utils/constants';

const KPI = ({ icon, label, value, color, bg }) => (
  <View style={[styles.kpiCard, { backgroundColor: bg || '#fff' }]}>
    <View style={[styles.kpiIcon, { backgroundColor: color || '#eef2ff' }]}>
      <MaterialDesignIcons name={icon} size={18} color="#fff" />
    </View>
    <View style={styles.kpiText}>
      <Text numberOfLines={1} style={styles.kpiValue}>
        {value}
      </Text>
      <Text numberOfLines={1} style={styles.kpiLabel}>
        {label}
      </Text>
    </View>
  </View>
);

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const policy = useSelector(state => state.policy?.policy ?? {});

  const getPolicyRequestStatus = useSelector(
    state => state.policy?.getPolicyRequestStatus ?? 'INITIAL',
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(PolicyActions.getPolicy());
    }, [dispatch]),
  );

  const isLoading = getPolicyRequestStatus === RequestStatus.INPROGRESS;

  const totalPremium = `₹ ${formatDecimals(policy?.totalPremium) || 0}`;
  const totalCommission = `₹ ${formatDecimals(policy?.totalCommission) || 0}`;
  const totalPolicies = `${policy?.totalPolicies ?? 0}`;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fafbff" />
      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={COLOR.PRIMARY_COLOR} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* KPI Row (ideal for exactly 3 numbers from API) */}
          {/* <View style={styles.kpiRow}>
            <KPI
              icon="wallet"
              label="Net Premiums"
              value={totalPremium}
              color="#6366f1"
              bg="#eef2ff"
            />
            <KPI
              icon="currency-inr"
              label="Total Brokerage"
              value={totalCommission}
              color="#06b6d4"
              bg="#ecfeff"
            />
            <KPI
              icon="file-document"
              label="Total Policies"
              value={totalPolicies}
              color="#10b981"
              bg="#ecfdf5"
            />
          </View> */}

          {/* Prominent total premium card */}
          <View style={styles.commissionCard}>
            <View style={styles.commissionHeader}>
              <View style={styles.iconContainer}>
                <MaterialDesignIcons name="wallet" size={18} color="#fff" />
              </View>
              <Text style={styles.commissionTitle}>Total Net Premiums</Text>
            </View>

            <Text style={styles.commissionAmount}>{totalPremium}</Text>
            <View style={styles.dateRangeContainer}>
              <MaterialDesignIcons
                name="calendar-range"
                size={11}
                color="#94a3b8"
              />
              <Text style={styles.dateRange}>Jan - Dec 2025</Text>
            </View>
          </View>
          {/* Target Tracker section */}
          <View style={styles.targetSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBg}>
                <MaterialDesignIcons name="target" size={18} color="#6366f1" />
              </View>
              <Text style={styles.sectionTitle}>Policy Tracker</Text>
            </View>

            <DashboardTargetCard
              title="Total Brokerage"
              month="2025"
              achievedAmount={totalCommission}
              isCustomer={false}
            />
            <DashboardTargetCard
              title="Total Policies"
              month="2025"
              achievedAmount={totalPolicies}
              isCustomer={true}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbff'
  },
  scrollView: {
    flex: 1
  },
  contentContainer: {
    paddingVertical: 12
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 12,
  },
  kpiCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  kpiIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  kpiText: {
    flex: 1
  },
  kpiValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a'
  },
  kpiLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2
  },
  commissionCard: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  commissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#6366f1',
    marginRight: 10,
  },
  commissionTitle: {
    fontSize: 13,
    color: '#64748b',
    flex: 1,
    fontWeight: '600',
  },
  commissionAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  dateRange: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500'
  },
  targetSection: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 20
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  sectionIconBg: {
    backgroundColor: '#f1f5f9',
    padding: 8,
    borderRadius: 12
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a'
  },
});
