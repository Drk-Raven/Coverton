import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useDispatch, useSelector } from 'react-redux';
import { COLOR } from '../../../utils/constants';
import { QuotationActions } from '../../../Redux/QuotationRedux';
import * as RequestStatus from '../../../Entities/RequestStatus';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const safeToNumber = v => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const normalizeCompanies = rawCompanies => {
  if (!rawCompanies) return [];
  if (typeof rawCompanies.toJS === 'function') {
    try {
      const converted = rawCompanies.toJS();
      return Array.isArray(converted)
        ? converted
        : Object.values(converted || {});
    } catch (e) {
      // fall through
    }
  }
  if (typeof rawCompanies.asMutable === 'function') {
    try {
      const converted = rawCompanies.asMutable({ deep: true });
      return Array.isArray(converted)
        ? converted
        : Object.values(converted || {});
    } catch (e) {
      // fall through
    }
  }
  if (Array.isArray(rawCompanies)) return rawCompanies;
  if (typeof rawCompanies === 'object') return Object.values(rawCompanies);
  return [];
};

const QuotationModal = ({
  modalVisible,
  closeModal,
  slideAnim,
  selectedQuotation,
}) => {
  const dispatch = useDispatch();

  const quotation = useSelector(state => {
    const q = state.quotation?.quotationById;
    if (!q) return null;
    if (typeof q.toJS === 'function') {
      try {
        return q.toJS();
      } catch (e) {
        return q;
      }
    }
    return q;
  });

  const getQuotationByIdStatus = useSelector(
    state => state.quotation?.getQuotationByIdRequestStatus ?? 'INITIAL',
  );

  const isLoading = getQuotationByIdStatus === RequestStatus.INPROGRESS;

  useEffect(() => {
    const id = selectedQuotation?.id;
    if (!modalVisible || !id) return;
    dispatch(QuotationActions.getQuotationById(id));
  }, [dispatch, selectedQuotation?.id, modalVisible]);

  const companies = useMemo(
    () => normalizeCompanies(quotation?.insuranceCompanies),
    [quotation?.insuranceCompanies],
  );

  const handleModalClose = () => {
    if (typeof closeModal === 'function') closeModal();
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={Boolean(modalVisible)}
      onDismiss={handleModalClose}
      onRequestClose={handleModalClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={handleModalClose}
        />
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.modalHeader}>
            <View style={styles.modalHandle} />
            <View style={styles.modalTitleRow}>
              <MaterialDesignIcons
                name="license"
                size={24}
                color={COLOR.PRIMARY_COLOR}
              />
              <Text style={styles.modalTitle}>Quotation Details</Text>
            </View>
            <TouchableOpacity
              onPress={handleModalClose}
              style={styles.closeButton}
            >
              <MaterialDesignIcons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={{ flex: 1 }}>
              <ActivityIndicator
                size="large"
                color={COLOR.PRIMARY_COLOR}
                style={{ marginTop: 20 }}
              />
            </View>
          ) : (
            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={styles.modalBodyContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.card}>
                <View style={styles.rowSpaceBetween}>
                  <View>
                    <Text style={styles.label}>Quotation ID</Text>
                    <Text style={styles.valuePrimary}>
                      {quotation?.quotationId ?? selectedQuotation?.id ?? '—'}
                    </Text>
                  </View>
                  <View style={styles.statusPill}>
                    <MaterialDesignIcons
                      name="file-document-outline"
                      size={16}
                      color={COLOR.PRIMARY_COLOR}
                    />
                    <Text style={styles.statusPillText}>Quote</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.rowSpaceBetween}>
                  <View style={styles.infoBlock}>
                    <Text style={styles.label}>Customer</Text>
                    <Text style={styles.value}>
                      {quotation?.customerName ??
                        selectedQuotation?.customerName ??
                        '—'}
                    </Text>
                  </View>
                  <View style={styles.infoBlock}>
                    <Text style={styles.label}>Insured Name</Text>
                    <Text style={styles.value}>
                      {quotation?.insuredName ?? quotation?.insurerName ?? '—'}
                    </Text>
                  </View>
                </View>

                <View style={[styles.rowSpaceBetween, { marginTop: 12 }]}>
                  <View style={styles.chip}>
                    <MaterialDesignIcons
                      name="car-info"
                      size={14}
                      color={COLOR.PRIMARY_COLOR}
                    />
                    <Text style={styles.chipText}>
                      {quotation?.productType ?? quotation?.productName ?? '—'}
                    </Text>
                  </View>
                  <View style={styles.chipSecondary}>
                    <MaterialDesignIcons
                      name="bike"
                      size={14}
                      color="#4B5563"
                    />
                    <Text style={styles.chipSecondaryText}>
                      {quotation?.categoryType ??
                        quotation?.categoryName ??
                        '—'}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Insurance Companies</Text>

              {companies.map(company => {
                const id =
                  company?.id ??
                  company?.companyId ??
                  `${company?.name ?? 'company'}-${Math.random()}`;
                const isActive =
                  company?.isActive === 1 || company?.isActive === true;
                const companyValue = safeToNumber(
                  company?.value ??
                    company?.quotedAmount ??
                    company?.quotedAmountAmount ??
                    0,
                );
                return (
                  <View
                    key={String(id)}
                    style={[
                      styles.companyCard,
                      isActive && styles.companyCardActive,
                    ]}
                  >
                    <View style={styles.rowSpaceBetween}>
                      <View style={styles.rowCenter}>
                        <MaterialDesignIcons
                          name={isActive ? 'star-circle' : 'shield-check'}
                          size={20}
                          color={isActive ? COLOR.PRIMARY_COLOR : '#9CA3AF'}
                        />
                        <Text style={styles.companyName}>
                          {company?.name ?? '—'}
                        </Text>
                      </View>

                      {isActive && (
                        <View style={styles.selectedBadge}>
                          <Text style={styles.selectedBadgeText}>Active</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.companyValuesRow}>
                      <View style={styles.valueColumn}>
                        <Text style={styles.smallLabel}>Premium Est.</Text>
                        <Text style={styles.moneyText}>
                          ₹{' '}
                          {Number(
                            quotation?.premiumEstimation ??
                              quotation?.premiumEst ??
                              0,
                          ).toLocaleString('en-IN')}
                        </Text>
                      </View>

                      <View style={styles.valueColumn}>
                        <Text style={styles.smallLabel}>Quoted Amount</Text>
                        <Text style={styles.moneyTextHighlight}>
                          ₹{' '}
                          {Number(
                            quotation?.quotedAmount ?? quotation?.quoted ?? 0,
                          ).toLocaleString('en-IN')}
                        </Text>
                      </View>

                      <View style={styles.valueColumn}>
                        <Text style={styles.smallLabel}>Actual Quotation</Text>
                        <Text style={styles.moneyText}>
                          ₹ {Number(companyValue).toLocaleString('en-IN')}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}

              <View style={{ height: 16 }} />
            </ScrollView>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: { flex: 1 },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: SCREEN_HEIGHT * 0.75,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitleRow: { flexDirection: 'row', alignItems: 'center' },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#111827',
    marginLeft: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: Platform.OS === 'ios' ? 20 : 16,
    padding: 4,
  },

  modalBody: { flex: 1, backgroundColor: '#F9FAFB' },
  modalBodyContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
    fontFamily: 'Poppins-Regular',
  },
  smallLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 2,
    fontFamily: 'Poppins-Regular',
  },
  valuePrimary: {
    fontSize: 15,
    color: '#111827',
    fontFamily: 'Poppins-SemiBold',
  },
  value: { fontSize: 13, color: '#111827', fontFamily: 'Poppins-Medium' },
  infoBlock: { flex: 1, marginRight: 12 },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
  },
  statusPillText: {
    marginLeft: 6,
    fontSize: 11,
    color: COLOR.PRIMARY_COLOR,
    fontFamily: 'Poppins-Medium',
  },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#ECFEFF',
  },
  chipText: {
    marginLeft: 6,
    fontSize: 12,
    color: COLOR.PRIMARY_COLOR,
    fontFamily: 'Poppins-Medium',
  },
  chipSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
  chipSecondaryText: { marginLeft: 6, fontSize: 12, color: '#374151' },

  sectionTitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
    marginTop: 4,
  },

  companyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  companyCardActive: {
    borderColor: COLOR.PRIMARY_COLOR,
    backgroundColor: '#EEF2FF',
  },
  companyName: {
    marginLeft: 8,
    fontSize: 14,
    color: '#111827',
    fontFamily: 'Poppins-SemiBold',
  },
  selectedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: COLOR.PRIMARY_COLOR,
  },
  selectedBadgeText: { fontSize: 10, color: '#FFFFFF' },

  companyValuesRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  valueColumn: {
    flex: 1,
    marginRight: 8,
  },
  moneyText: { fontSize: 13, fontFamily: 'Poppins-Medium', color: '#111827' },
  moneyTextHighlight: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: COLOR.PRIMARY_COLOR,
  },

  emptyState: { padding: 16, alignItems: 'center' },
  emptyText: { color: '#6B7280' },
});

export default QuotationModal;
