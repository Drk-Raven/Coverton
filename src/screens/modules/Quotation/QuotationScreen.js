import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Animated,
  Dimensions,
} from 'react-native';
import React, { useCallback, useRef, useState, useMemo } from 'react';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

import { COLOR } from '../../../utils/constants';
import CustomInput from '../../components/CustomInput';
import QuotationCard from './QuotationCard';
import QuotationModal from './QuotationModal';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { QuotationActions } from '../../../Redux/QuotationRedux';
import * as RequestStatus from '../../../Entities/RequestStatus';
import QuotationCardShimmer from './QuotationShimmer';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const QuotationScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null); // 'pending' | 'approved' | 'issued' | null

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const dispatch = useDispatch();
  const quotation = useSelector(state => state.quotation?.quotations ?? []);

  const getQuotationsRequestStatus = useSelector(
    state => state.quotation?.getQuotationsRequestStatus ?? 'INITIAL',
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(QuotationActions.getQuotations());

      return () => {
        setSearchText('');
      }
    }, [dispatch]),
  );

  // counts (total counts across all quotations)
  const pendigQuotCount = quotation.filter(
    q => q.status === 'Quotation Waiting Approval',
  ).length;
  const approvedQuotCount = quotation.filter(q => q.status === 'approved').length;
  const issuedQuotCount = quotation.filter(q => q.status === 'issued').length;
  const isLoading = getQuotationsRequestStatus === RequestStatus.INPROGRESS;

  // map our filter keyword to actual status values in the data
  const filterStatusMap = {
    pending: ['Quotation Waiting Approval', 'pending'],
    approved: ['approved'],
    issued: ['issued'],
  };

  // Memoized filtered data based on searchText and selectedFilter
  const filteredQuotations = useMemo(() => {
    const q = quotation ?? [];
    const search = (searchText ?? '').trim().toLowerCase();

    const matchesFilter = item => {
      if (!selectedFilter) return true;
      const allowedStatuses = filterStatusMap[selectedFilter] || [];
      // check if item's status matches any mapped values (case-insensitive)
      return allowedStatuses.some(s => (item.status ?? '').toLowerCase() === (s ?? '').toLowerCase());
    };

    const matchesSearch = item => {
      if (!search) return true;
      // fields to search
      const fields = [
        item.id,
        item.customerName,
        item.insurerName,
        item.phoneNo,
        item.productName,
        item.categoryName,
      ];
      return fields
        .filter(Boolean)
        .some(f => String(f).toLowerCase().includes(search));
    };

    return q.filter(item => matchesFilter(item) && matchesSearch(item));
  }, [quotation, searchText, selectedFilter]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.titleRow}>
        <View style={styles.iconCircle}>
          <MaterialDesignIcons
            name="account-cash-outline"
            size={22}
            color={COLOR.PRIMARY_COLOR}
          />
        </View>
        <View style={styles.titleTextContainer}>
          <Text style={styles.titleHeaderText}>Quotation Management</Text>
          <Text style={styles.subtitleText}>
            {quotation?.length}{' '}
            {quotation?.length === 1 ? 'quotation' : 'quotations'} available
          </Text>
        </View>
      </View>

      <CustomInput
        placeholder="Search by Id, Name, Phone, Product..."
        value={searchText}
        setValue={setSearchText}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.badgeRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.pendingBadge,
              selectedFilter === 'pending' && styles.selectedBadge,
            ]}
            onPress={() =>
              setSelectedFilter(prev => (prev === 'pending' ? null : 'pending'))
            }
          >
            <MaterialDesignIcons name="clock" color={COLOR.PENDING_COLOR} size={20} />
            <Text style={styles.pendingText}>{`Pending: ${pendigQuotCount}`}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.approvedBadge,
              selectedFilter === 'approved' && styles.selectedBadge,
            ]}
            onPress={() =>
              setSelectedFilter(prev => (prev === 'approved' ? null : 'approved'))
            }
          >
            <MaterialDesignIcons name="check" color={COLOR.APPROVED_COLOR} size={20} />
            <Text style={styles.approvedText}>{`Approved: ${approvedQuotCount}`}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.issuedBadge,
              selectedFilter === 'issued' && styles.selectedBadge,
            ]}
            onPress={() => setSelectedFilter(prev => (prev === 'issued' ? null : 'issued'))}
          >
            <MaterialDesignIcons name="note-outline" color={'#594caf'} size={20} />
            <Text style={styles.issuedText}>{`Issued: ${issuedQuotCount}`}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const openModal = quotation => {
    setSelectedQuotation(quotation);
    setShowQuotationModal(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setShowQuotationModal(false);
      setSelectedQuotation(null);
    });
  };

  const NoDataView = () => (
    <View style={styles.noDataContainer}>
      <MaterialDesignIcons name="file-document-outline" size={48} color="#bdbdbd" />
      <Text style={styles.noDataText}>No quotations found</Text>
      <Text style={styles.noDataSubText}>
        Try a different search or clear the filter.
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {renderHeader()}

      {isLoading ? (
        <FlatList
          data={[1, 2, 3, 4, 5]}
          keyExtractor={item => item.toString()}
          renderItem={() => <QuotationCardShimmer />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 250 }}
        />
      ) : filteredQuotations.length === 0 ? (
        <View style={{ flex: 1 }}>
          <NoDataView />
        </View>
      ) : (
        <FlatList
          data={filteredQuotations}
          renderItem={({ item }) => <QuotationCard data={item} onPress={openModal} />}
          keyExtractor={item => item.id ?? JSON.stringify(item)}
          contentContainerStyle={{ paddingBottom: 250 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {showQuotationModal && (
        <QuotationModal
          slideAnim={slideAnim}
          modalVisible={showQuotationModal}
          closeModal={closeModal}
          selectedQuotation={selectedQuotation}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
    zIndex: 5000,
  },

  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },

  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 26,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleTextContainer: { marginLeft: 14, flex: 1 },

  titleHeaderText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },

  subtitleText: {
    color: '#6b6b6b',
    marginTop: 2,
    fontSize: 13,
  },

  hiddenItemContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingRight: 8,
    gap: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  selectedBadge: {
    borderWidth: 2,
    borderColor: COLOR.PRIMARY_COLOR,
    transform: [{ scale: 1.02 }],
  },
  approvedText: {
    color: COLOR.APPROVED_COLOR,
    paddingLeft: 7,
    fontSize: 13,
  },
  approvedBadge: {
    backgroundColor: COLOR.APPROVED_COLOR + '20',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  pendingText: {
    color: COLOR.PENDING_COLOR,
    paddingLeft: 7,
    fontSize: 13,
  },
  pendingBadge: {
    backgroundColor: COLOR.PENDING_COLOR + '20',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  issuedBadge: {
    backgroundColor: '#eee8f5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  issuedText: {
    color: '#594caf',
    paddingLeft: 7,
    fontSize: 13,
  },

  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  noDataText: {
    marginTop: 12,
    fontSize: 16,
    color: '#9e9e9e',
    fontWeight: '600',
  },
  noDataSubText: {
    marginTop: 6,
    fontSize: 13,
    color: '#bdbdbd',
  },
});

export default QuotationScreen;
