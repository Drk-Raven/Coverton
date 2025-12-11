import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

import { COLOR, FONTS } from '../../../utils/constants';
import CustomInput from '../../components/CustomInput';
import CustomerCard from './CustomerCard';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import { CustomerActions } from '../../../Redux/CustomerRedux';
import * as RequestStatus from '../../../Entities/RequestStatus';

const CustomerScreen = props => {
  const { navigation } = props;

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(CustomerActions.getCustomerFirstLevel());
    }, [dispatch]),
  );

  const firstLevelData = useSelector(
    state => state.customer.customersFirstLevel,
  );
  const getCustomersFirstLevelRequestStatus = useSelector(
    state => state.customer.getCustomersFirstLevelRequestStatus,
  );

  const isCustomersLoading =
    getCustomersFirstLevelRequestStatus === RequestStatus.INPROGRESS;

  useLayoutEffect(() => {
    setFilteredData(firstLevelData || []);
  }, [firstLevelData]);

  useLayoutEffect(() => {
    const text = searchText.trim().toLowerCase();

    if (!text) {
      setFilteredData(firstLevelData || []);
      return;
    }

    const filtered = (firstLevelData || []).filter(item => {
      const id = (item?.id || '').toString().toLowerCase();
      const name = (item?.name || '').toString().toLowerCase();
      const phoneNo = (item?.phoneNo || '').toString().toLowerCase();
      const premium = (item?.premium || '').toString().toLowerCase();
      return (
        id.includes(text) ||
        name.includes(text) ||
        phoneNo.includes(text) ||
        premium.includes(text)
      );
    });

    setFilteredData(filtered);
  }, [searchText, firstLevelData]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.titleRow}>
        <View style={styles.iconCircle}>
          <MaterialDesignIcons
            name="account-multiple-outline"
            size={22}
            color={COLOR.PRIMARY_COLOR}
          />
        </View>
        <View style={styles.titleTextContainer}>
          <Text style={styles.titleHeaderText}>Customer Management</Text>
        </View>
      </View>

      <CustomInput
        placeholder="Search by ID, Name, Phone, Premium..."
        value={searchText}
        setValue={setSearchText}
        disabled={!isCustomersLoading}
      />
    </View>
  );

  const renderHiddenItem = ({ item }) => (
    <View style={styles.hiddenItemContainer}>
      <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
        <View style={styles.iconContainer}>
          <MaterialDesignIcons
            name="pencil"
            size={20}
            color={COLOR.BLACK_COLOR}
          />
        </View>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.convertButton}
        onPress={() => navigation.replace('PolicyDetails', { leadData: item })}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <MaterialDesignIcons
            name="account-convert-outline"
            size={20}
            color={COLOR.BLACK_COLOR}
          />
        </View>
        <Text style={styles.convertButtonText}>Policies</Text>
      </TouchableOpacity>
    </View>
  );

  const renderShimmerItem = () => (
    <View style={styles.shimmerCardContainer}>
      <View style={styles.shimmerHeaderRow}>
        <ShimmerPlaceHolder style={styles.shimmerTitleBadge} />
        <View style={styles.shimmerBadgesContainer}>
          <ShimmerPlaceHolder style={styles.shimmerStatusBadge} />
        </View>
        <ShimmerPlaceHolder style={styles.shimmerIconCircle} />
      </View>

      <ShimmerPlaceHolder style={styles.shimmerNameLine} />

      <View style={styles.shimmerDetailsGrid}>
        <View style={styles.shimmerDetailItem}>
          <ShimmerPlaceHolder style={styles.shimmerDetailLabel} />
          <ShimmerPlaceHolder style={styles.shimmerDetailValueShort} />
        </View>

        <View style={styles.shimmerDetailItem}>
          <ShimmerPlaceHolder style={styles.shimmerPhoneIcon} />
          <ShimmerPlaceHolder style={styles.shimmerPhoneText} />
        </View>

        <View style={styles.shimmerDetailItem}>
          <ShimmerPlaceHolder style={styles.shimmerDetailLabel} />
          <ShimmerPlaceHolder style={styles.shimmerDetailValue} />
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => {
    const isSearch = !!searchText.trim();

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <MaterialDesignIcons
            name={isSearch ? 'magnify-close' : 'clipboard-outline'}
            size={48}
            color={COLOR.PLACEHOLDER_COLOR}
          />
        </View>
        <Text style={styles.emptyTitle}>
          {isSearch ? 'No matching customers found' : 'No customer available'}
        </Text>
        <Text style={styles.emptySubtitle}>
          {isSearch
            ? 'Try adjusting your search criteria'
            : 'New customer will appear here'}
        </Text>
      </View>
    );
  };

  return (
    <View>
      {renderHeader()}

      {isCustomersLoading ? (
        <SwipeListView
          data={[1, 2, 3, 4, 5]}
          keyExtractor={item => item.toString()}
          renderItem={renderShimmerItem}
          disableRightSwipe
          rightOpenValue={0}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        <SwipeListView
          data={filteredData}
          keyExtractor={(item, index) =>
            item?.id?.toString() || index.toString()
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.cardWrapper,
                index === filteredData?.length - 1 && styles.lastCard,
              ]}
            >
              <CustomerCard data={item} leadData={item} onPress={()=>{navigation.navigate('PolicyDetails', { leadData: item })}} />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          // renderHiddenItem={renderHiddenItem}
          rightOpenValue={-98}
          disableLeftSwipe
          disableRightSwipe
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: { marginBottom: 10 },
  lastCard: { marginBottom: 20 },

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

  hiddenItemContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingRight: 8,
    gap: 12,
  },

  editButton: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    borderRadius: 12,
    borderColor: COLOR.WHITE_COLOR,
    borderWidth: 1.5,
    elevation: 5,
  },

  convertButton: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    borderRadius: 12,
    borderColor: COLOR.WHITE_COLOR,
    borderWidth: 1.5,
    elevation: 5,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },

  editButtonText: {
    color: COLOR.BLACK_COLOR,
    fontFamily: FONTS.FONT_SEMIBOLD,
    fontSize: 10,
  },

  convertButtonText: {
    color: COLOR.BLACK_COLOR,
    fontFamily: FONTS.FONT_SEMIBOLD,
    fontSize: 10,
  },

  shimmerCardContainer: {
    marginTop: 12,
    marginHorizontal: 10,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },

  shimmerHeaderRow: { flexDirection: 'row', alignItems: 'center' },

  shimmerTitleBadge: {
    width: 80,
    height: 18,
    borderRadius: 6,
    marginRight: 6,
  },

  shimmerBadgesContainer: { flex: 1 },

  shimmerStatusBadge: { width: 50, height: 16, borderRadius: 8 },

  shimmerIconCircle: { width: 24, height: 24, borderRadius: 12 },

  shimmerNameLine: {
    width: '60%',
    height: 18,
    borderRadius: 6,
    marginVertical: 10,
  },

  shimmerDetailsGrid: { gap: 6 },

  shimmerDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  shimmerDetailLabel: { width: '50%', height: 12, borderRadius: 6 },

  shimmerDetailValueShort: { width: 30, height: 12, borderRadius: 6 },

  shimmerDetailValue: { width: 60, height: 12, borderRadius: 6 },

  shimmerPhoneIcon: { width: 18, height: 18, borderRadius: 9 },

  shimmerPhoneText: { flex: 1, marginLeft: 6, height: 12, borderRadius: 6 },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },

  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  emptyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#374151',
    marginBottom: 8,
  },

  emptySubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default CustomerScreen;
