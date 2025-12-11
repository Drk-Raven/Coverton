import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import PolicyCard from './PolicyCard';
import AddPolicyModal from './AddPolicyModal';
import AddQuotationModal from './AddQuotationModal';
import { COLOR, FONTS } from '../../../utils/constants';
import { CustomerActions } from '../../../Redux/CustomerRedux';
import * as RequestStatus from '../../../Entities/RequestStatus';
import CustomInput from '../../components/CustomInput';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const PolicyDetailsScreen = props => {
  const { route } = props;
  const { leadData } = route?.params || {};

  const dispatch = useDispatch();

  const secondLevelData = useSelector(
    state => state.customer.customersSecondLevel,
  );
  const getCustomersSecondLevelRequestStatus = useSelector(
    state => state.customer.getCustomersSecondLevelRequestStatus,
  );

  const isLoading =
    getCustomersSecondLevelRequestStatus === RequestStatus.INPROGRESS;

  const [policyModalVisible, setPolicyModalVisible] = useState(false);
  const [quotationModalVisible, setQuotationModalVisible] = useState(false);

  const [selectedLead, setSelectedLead] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Separate animations for each modal to avoid delays / interference
  const policySlideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const quotationSlideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useFocusEffect(
    useCallback(() => {
      if (leadData?.id) {
        dispatch(CustomerActions.getCustomerSecondLevel(leadData.id));
      }
    }, [dispatch, leadData]),
  );

  /** ---------- MODAL HELPERS ---------- */

  const animateIn = useCallback(anim => {
    // Ensure it starts from bottom every time
    anim.setValue(SCREEN_HEIGHT);
    Animated.spring(anim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, []);

  const animateOut = useCallback((anim, onEnd) => {
    Animated.timing(anim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && typeof onEnd === 'function') {
        onEnd();
      }
    });
  }, []);

  const closePolicyModal = useCallback(() => {
    animateOut(policySlideAnim, () => {
      setPolicyModalVisible(false);
      setSelectedLead(null);
      setIsEditMode(false);
    });
  }, [animateOut, policySlideAnim]);

  const openPolicyModal = useCallback((lead = null, editMode = false) => {
    setSelectedLead(lead);
    setIsEditMode(editMode);
    setPolicyModalVisible(true);
    animateIn(policySlideAnim);
  }, [animateIn, policySlideAnim]);

  const closeQuotationModal = useCallback(() => {
    animateOut(quotationSlideAnim, () => {
      setQuotationModalVisible(false);
      setSelectedLead(null);
    });
  }, [animateOut, quotationSlideAnim]);

  const openQuotationModal = useCallback(lead => {
    setSelectedLead(lead);
    setQuotationModalVisible(true);
    animateIn(quotationSlideAnim);
  }, [animateIn, quotationSlideAnim]);

  const handleSave = () => {
    if (isEditMode) {
      // TODO: update logic here
    } else {
      // TODO: create logic here
    }
    closePolicyModal();
  };

  const handleEditLead = useCallback(item => {
    openPolicyModal(item, true);
  }, [openPolicyModal]);

  const handleEditQuote = useCallback(item => {
    openQuotationModal(item);
  }, [openQuotationModal]);

  /** ---------- LIST & FILTERING ---------- */

  // Only show "Insured Added" and apply search
  const filteredPolicies = useMemo(() => {
    const list = Array.isArray(secondLevelData) ? secondLevelData : [];
  
    const query = searchText.trim().toLowerCase();
    if (!query) return list;
  
    return list.filter(item => {
      const id = String(item?.insuredId || '').toLowerCase();
      const name = (item?.insuredName || '').toLowerCase();
      const phone = (item?.insuredContactNo || '').toLowerCase();
      const premium = String(item?.premium || '').toLowerCase();
  
      return (
        id.includes(query) ||
        name.includes(query) ||
        phone.includes(query) ||
        premium.includes(query)
      );
    });
  }, [secondLevelData, searchText]);
  

  /** ---------- RENDERERS ---------- */

  const renderShimmerItem = () => (
    <View style={styles.shimmerCardContainer}>
      <View style={styles.shimmerHeaderRow}>
        <ShimmerPlaceHolder style={styles.shimmerTitleBadge} />
        <ShimmerPlaceHolder style={styles.shimmerSwipeIcon} />
      </View>

      <ShimmerPlaceHolder style={styles.shimmerNameLine} />

      <View style={styles.shimmerDetailsGrid}>
        <View style={styles.shimmerDetailItem}>
          <ShimmerPlaceHolder style={styles.shimmerIconCircle} />
          <ShimmerPlaceHolder style={styles.shimmerDetailLong} />
        </View>

        <View style={styles.shimmerDetailItem}>
          <ShimmerPlaceHolder style={styles.shimmerDetailLabel} />
          <ShimmerPlaceHolder style={styles.shimmerDetailValue} />
        </View>

        <View style={styles.shimmerDetailItem}>
          <ShimmerPlaceHolder style={styles.shimmerPhoneIcon} />
          <ShimmerPlaceHolder style={styles.shimmerPhoneText} />
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <MaterialDesignIcons
          name="clipboard-list-outline"
          size={48}
          color={COLOR.PLACEHOLDER_COLOR}
        />
      </View>
      <Text style={styles.emptyTitle}>No policies available</Text>
      <Text style={styles.emptySubtitle}>
        Policies for this customer will appear here
      </Text>
    </View>
  );

  const renderPolicyItem = ({ item, index }) => (
    <View
      style={[
        styles.cardWrapper,
        index === (filteredPolicies?.length || 0) - 1 && styles.lastCard,
      ]}
    >
      <PolicyCard
        leadData={item}
        showSwipe
        handleEditLead={() => handleEditLead(item)}
        handleEditQuote={() => handleEditQuote(item)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleRow}>
          <View style={styles.iconCircle}>
            <MaterialDesignIcons
              name="book-alphabet"
              size={26}
              color={COLOR.PRIMARY_COLOR}
            />
          </View>
          <View style={styles.titleTextContainer}>
            <Text style={styles.titleHeaderText}>Policy Management</Text>
          </View>
        </View>
        <CustomInput
          placeholder="Search by ID, Name, Phone, Premium..."
          value={searchText}
          setValue={setSearchText}
          disabled={!isLoading}
        />
      </View>

      {isLoading ? (
        <FlatList
          data={[1, 2, 3, 4, 5]}
          keyExtractor={item => item.toString()}
          renderItem={renderShimmerItem}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={filteredPolicies}
          keyExtractor={(item, index) =>
            `${item?.insuredId || 'no-id'}-${index}`
          }
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={renderPolicyItem}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}

      <AddPolicyModal
        modalVisible={policyModalVisible}
        closeModal={closePolicyModal}
        handleSave={handleSave}
        slideAnim={policySlideAnim}
        selectedLead={selectedLead}
        customerId={leadData?.id}
      />

      <AddQuotationModal
        modalVisible={quotationModalVisible}
        closeModal={closeQuotationModal}
        slideAnim={quotationSlideAnim}
        selectedLead={selectedLead}
        customerId={leadData?.id}
      />
    </View>
  );
};

export default PolicyDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 15,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 5000,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 26,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleTextContainer: {
    marginLeft: 14,
    flex: 1,
  },
  titleHeaderText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },

  cardWrapper: {
    marginTop: 4,
  },
  lastCard: {
    marginBottom: 20,
  },

  // Hidden item styles kept in case you re-enable swipe actions
  hiddenItemContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 12,
    paddingVertical: 8,
    paddingRight: 8,
    gap: 12,
  },
  editButton: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 153,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLOR.WHITE_COLOR,
    shadowColor: '#6b6d70',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
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
    fontSize: 12,
    letterSpacing: 0.3,
  },

  shimmerCardContainer: {
    marginTop: 12,
    marginHorizontal: 12,
    marginBottom: 6,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  shimmerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    justifyContent: 'space-between',
  },
  shimmerTitleBadge: {
    width: 80,
    height: 18,
    borderRadius: 6,
  },
  shimmerSwipeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  shimmerNameLine: {
    width: '60%',
    height: 18,
    borderRadius: 6,
    marginBottom: 8,
  },
  shimmerDetailsGrid: {
    gap: 6,
  },
  shimmerDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shimmerIconCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  shimmerDetailLong: {
    flex: 1,
    height: 12,
    borderRadius: 6,
  },
  shimmerDetailLabel: {
    width: 60,
    height: 12,
    borderRadius: 6,
  },
  shimmerDetailValue: {
    width: 50,
    height: 12,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  shimmerPhoneIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  shimmerPhoneText: {
    flex: 1,
    height: 12,
    borderRadius: 6,
  },

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
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});
