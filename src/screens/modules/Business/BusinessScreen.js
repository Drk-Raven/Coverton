import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import React, { useCallback, useState, useRef, useEffect } from 'react';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import AddBusinessModal from './AddBusinessModal';
import { COLOR, FONTS } from '../../../utils/constants';
import BusinessLeadMangementCard from '../../components/BusinessLeadManagementCard';
import { BusinessOpportunitiesActions } from '../../../Redux/BusinessOpportunitiesRedux';
import * as RequestStatus from '../../../Entities/RequestStatus';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import CommonHeader from '../../components/CommonHeader';
import CustomerConversionModal from './CustomerConversionModal';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BusinessScreen = props => {
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [conversionVisible, setConversionVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null); // 'Hot', 'Warm', 'Cold', 'Dropped', or null
  const [formData, setFormData] = useState({
    consultant: user?.userName || '',
    customerType: '',
    customer: '',
    product: '',
    premiumExpected: '',
    saidv: '',
    phoneno: '',
    timeByWhen: '',
    category: '',
  });
  const [ convertCustomerData, setConvertCustomerData ] = useState({
      selfId: 0,
      customerId: "",
      insuredName: "",
      email: "",
      phoneno: "",
      dob: "",
      address: "",
      pan: "",
      aadhar: "",
      productId: 0,
      categoryId: 0,
      insuredCount: 0
    });
  const [prospectId, setProspectId] = useState(null);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const leadsData = useSelector(
    state => state.businessOpportunities?.leads ?? [],
  );
  const leadsDataRequestStatus = useSelector(
    state =>
      state.businessOpportunities?.getLeadsRequestStatus ??
      RequestStatus.INITIAL,
  );
  const products = useSelector(
    state => state.businessOpportunities?.products ?? [],
  );
  const categories = useSelector(
    state => state.businessOpportunities?.categories ?? [],
  );
  const user = useSelector(state => state.auth?.user ?? null);

  const isLoading = leadsDataRequestStatus === RequestStatus.INPROGRESS

  // reverse data so newest first
  let alteredData = [];
  for (let i = 0; i < leadsData.length; i++) {
    alteredData?.unshift(leadsData[i]);
  }

  const filteredLeads = alteredData?.filter(lead => {
    if (selectedFilter && lead.status !== selectedFilter) {
      return false;
    }

    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();

    return (
      (lead?.customer || '').toLowerCase().includes(searchLower) ||
      (lead?.customerType || '').toLowerCase().includes(searchLower) ||
      (lead?.product || '').toLowerCase().includes(searchLower) ||
      (lead?.category || '').toLowerCase().includes(searchLower) ||
      `${lead?.premiumExpected || ''}`.toLowerCase().includes(searchLower) ||
      `${lead?.saidv || ''}`.toLowerCase().includes(searchLower) ||
      `${lead?.phoneno || ''}`.toLowerCase().includes(searchLower)
    );
  });

  const tiek = useSelector((state) => state.auth);

  console.log({tiek})

  useFocusEffect(
    useCallback(() => {
      dispatch(BusinessOpportunitiesActions.getLeads());
      dispatch(BusinessOpportunitiesActions.getProducts());
      dispatch(BusinessOpportunitiesActions.getCategories());

      return () => {
        setSearchText('');
      };
    }, [dispatch]),
  );

  useEffect(() => {
    if (user?.userName) {
      setFormData(prev => ({
        ...prev,
        consultant: user.userName,
      }));
    }
  }, [user]);

  const openModal = () => {
    setModalVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const openConversionModal = () => {
    setConversionVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setIsEditMode(false);
      setFormData({
        consultant: '',
        customerType: '',
        customer: '',
        product: '',
        premiumExpected: '',
        saidv: '',
        phoneno: '',
        timeByWhen: '',
        category: '',
      });
      setConvertCustomerData({
        selfId: 0,
        customerId: "",
        insuredName: "",
        email: "",
        phoneno: "",
        dob: "",
        address: "",
        pan: "",
        aadhar: "",
        productId: 0,
        categoryId: 0,
        insuredCount: 0
      })
    });
  };

  const closeConversionModal = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setConversionVisible(false);
      setConvertCustomerData({
        selfId: 0,
        customerId: "",
        insuredName:  "",
        email: "",
        phoneno: "",
        dob: "",
        address: "",
        pan: "",
        aadhar: "",
        productId: 0,
        categoryId: 0,
        insuredCount: 0
      })
    });
  }

  const handleAddNew = () => {
    setIsEditMode(false);
    setFormData({
      consultant: user?.userName || '',
      customerType: '',
      customer: '',
      product: '',
      premiumExpected: '',
      saidv: '',
      phoneno: '',
      timeByWhen: '',
      category: '',
    });
    openModal();
  };

  const handleEditLead = leadData => {
    setIsEditMode(true);
    setFormData({
      consultant: user?.userName || '',
      customerType: leadData?.customerType || '',
      customer: leadData?.customer || '',
      product: leadData?.product || '',
      premiumExpected: leadData?.premiumExpected || '',
      saidv: leadData?.saidv || '',
      phoneno: leadData?.phoneno || '',
      timeByWhen: leadData?.timeByWhen || '',
      category: leadData?.category || '',
      directExpenditure: leadData?.directExpenditure || '',
      expectedExpenditure: leadData?.expectedExpenditure || '',
    });
    setProspectId(leadData?.prospectID || null);
    openModal();
  };

  const handleConvertLead = leadData => {
    // navigation.navigate('CustomerTab');
    const productId = products?.find(product => product?.value === leadData?.product)?.id
    const categoryId = categories?.find(category => category?.value === leadData?.category)?.id

    setConvertCustomerData({
      selfId: 0,
      customerId: leadData?.customerID || "",
      insuredName: leadData?.customer || "",
      email: "",
      phoneno: leadData?.phoneno || "",
      dob: "",
      address: "",
      pan: "",
      aadhar: "",
      productId: productId || 0,
      categoryId: categoryId || 0,
      insuredCount: leadData?.insuredCount || 0,
    })
    setProspectId(leadData?.prospectID || null);
    openConversionModal()
  };

  const handleFilterPress = filter => {
    if (selectedFilter === filter) {
      setSelectedFilter(null);
    } else {
      setSelectedFilter(filter);
    }
  };

  const hotLeadCount = leadsData.filter(lead => lead.status === 'Hot').length;
  const warmLeadCount = leadsData.filter(lead => lead.status === 'Warm').length;
  const coldLeadCount = leadsData.filter(lead => lead.status === 'Cold').length;
  const droppedLeadCount = leadsData.filter(
    lead => lead.status === 'Dismissed',
  ).length;
  const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

  const CARD_HORIZONTAL_MARGIN = 4;
  const CARD_PADDING_HORIZONTAL = 24;
  const cardInnerWidth = Math.round(
    SCREEN_WIDTH - CARD_HORIZONTAL_MARGIN - CARD_PADDING_HORIZONTAL,
  );
  const badgeWidth = Math.round(cardInnerWidth * 0.1);
  const titleWidth = Math.round(cardInnerWidth * 0.4);
  const consultantWidth = Math.round(cardInnerWidth * 0.75);

  const ShimmerCard = ({ index }) => (
    <View
      key={`shimmer-${index}`}
      style={[styles.cardWrapper, index === 2 && styles.lastCard]}
    >
      <View style={[styles.cardContainer, { backgroundColor: '#fff' }]}>
        <View
          style={[
            styles.headerRow,
            {
              marginBottom: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 5,
            },
          ]}
        >
          <ShimmerPlaceholder
            style={{ width: titleWidth, height: 18, borderRadius: 6 }}
            shimmerStyle={{ borderRadius: 6 }}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ShimmerPlaceholder
              style={{ width: badgeWidth, height: 18, borderRadius: 6 }}
            />
          </View>
        </View>

        <View style={{ marginBottom: 10, paddingBottom: 5 }}>
          <ShimmerPlaceholder
            style={{ width: consultantWidth, height: 20, borderRadius: 6 }}
          />
        </View>

        <View style={{ gap: 8 }}>
          <View style={[styles.detailItem, { paddingBottom: 5 }]}>
            <ShimmerPlaceholder
              style={{
                width: Math.round(cardInnerWidth * 0.45),
                height: 14,
                borderRadius: 6,
              }}
            />
            <ShimmerPlaceholder
              style={{
                width: Math.round(cardInnerWidth * 0.25),
                height: 14,
                borderRadius: 6,
                marginLeft: 'auto',
              }}
            />
          </View>

          <View style={[styles.detailItem, { paddingBottom: 5 }]}>
            <ShimmerPlaceholder
              style={{
                width: Math.round(cardInnerWidth * 0.45),
                height: 14,
                borderRadius: 6,
              }}
            />
            <ShimmerPlaceholder
              style={{
                width: Math.round(cardInnerWidth * 0.25),
                height: 14,
                borderRadius: 6,
                marginLeft: 'auto',
              }}
            />
          </View>

          <View style={styles.detailItem}>
            <ShimmerPlaceholder
              style={{
                width: Math.round(cardInnerWidth * 0.35),
                height: 14,
                borderRadius: 6,
              }}
            />
            <ShimmerPlaceholder
              style={{
                width: Math.round(cardInnerWidth * 0.25),
                height: 14,
                borderRadius: 6,
                marginLeft: 'auto',
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <CommonHeader
        leads={filteredLeads}
        searchText={searchText}
        setSearchText={setSearchText}
        isLoading={isLoading}
        handleAdditionalFunction={handleAddNew}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.badgeRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.hotLeadBadge,
              selectedFilter === 'Hot' && styles.selectedBadge,
            ]}
            onPress={() => handleFilterPress('Hot')}
          >
            <MaterialDesignIcons
              name="fire"
              color={COLOR.HOT_LEADS_COLOR}
              size={20}
            />
            <Text style={styles.hotLeadText}>{`Hot: ${hotLeadCount}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.warmLeadBadge,
              selectedFilter === 'Warm' && styles.selectedBadge,
            ]}
            onPress={() => handleFilterPress('Warm')}
          >
            <MaterialDesignIcons
              name="heat-wave"
              color={COLOR.WARM_LEADS_COLOR}
              size={20}
            />
            <Text style={styles.warmLeadText}>{`Warm: ${warmLeadCount}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.coldLeadBadge,
              selectedFilter === 'Cold' && styles.selectedBadge,
            ]}
            onPress={() => handleFilterPress('Cold')}
          >
            <MaterialDesignIcons
              name="snowflake"
              color={COLOR.COLD_LEADS_COLOR}
              size={20}
            />
            <Text style={styles.coldLeadText}>{`Cold: ${coldLeadCount}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.droppedLeadBadge,
              selectedFilter === 'Dismissed' && styles.selectedBadge,
            ]}
            onPress={() => handleFilterPress('Dismissed')}
          >
            <MaterialDesignIcons
              name="emoticon-dead-outline"
              color="#757575"
              size={20}
            />
            <Text
              style={styles.droppedLeadText}
            >{`Dismissed: ${droppedLeadCount}`}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const renderHiddenItem = ({ item }) => {

    return (
      <View style={styles.hiddenItemContainer}>
        <TouchableOpacity
          style={[styles.editButton, {backgroundColor: item?.leadStatus === 'BOI Created' ? '#FFFFFF' : '#F8FAFC'}]}
          onPress={() => handleEditLead(item)}
          disabled={!(item?.leadStatus === 'BOI Created')}
          activeOpacity={0.8}
        >
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
          style={[styles.convertButton, {backgroundColor: item?.leadStatus === 'BOI Created' ? '#FFFFFF' : '#F8FAFC'}]}
          disabled={!(item?.leadStatus === 'BOI Created')}
          onPress={() => handleConvertLead(item)}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <MaterialDesignIcons
              name="account-convert-outline"
              size={20}
              color={COLOR.BLACK_COLOR}
            />
          </View>
          <Text style={styles.convertButtonText}>Convert</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderEmptyState = () => {
    let emptyMessage = 'No leads available';
    let emptySubtitle = 'New leads will appear here';
    let iconName = 'clipboard-outline';

    if (selectedFilter) {
      emptyMessage = `No ${selectedFilter.toLowerCase()} leads found`;
      emptySubtitle = 'Try selecting a different filter';
      iconName = 'filter-off-outline';
    } else if (searchText) {
      emptyMessage = 'No matching leads';
      emptySubtitle = 'Try adjusting your search criteria';
      iconName = 'magnify-close';
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <MaterialDesignIcons
            name={iconName}
            size={48}
            color={COLOR.PLACEHOLDER_COLOR}
          />
        </View>
        <Text style={styles.emptyTitle}>{emptyMessage}</Text>
        <Text style={styles.emptySubtitle}>{emptySubtitle}</Text>
        {selectedFilter && (
          <TouchableOpacity
            style={styles.clearFilterButton}
            onPress={() => setSelectedFilter(null)}
            activeOpacity={0.7}
          >
            <Text style={styles.clearFilterText}>Clear Filter</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLOR.PRIMARY_COLOR}
      />
      {renderHeader()}

      {isLoading ? (
        <View>
          {[0, 1, 2, 4, 5, 6].map(i => (
            <ShimmerCard key={`s-${i}`} index={i} />
          ))}
        </View>
      ) : (
        <SwipeListView
          data={filteredLeads}
          keyExtractor={(item, index) =>
            item?.prospectID ? String(item.prospectID) : String(index)
          }
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.cardWrapper,
                index === filteredLeads?.length - 1 && styles.lastCard,
              ]}
            >
              <BusinessLeadMangementCard leadData={item} />
            </View>
          )}
          renderHiddenItem={renderHiddenItem}
          contentContainerStyle={styles.listContent}
          previewDuration={500}
          previewOpenValue={-105}
          previewFirstRow={true}
          previewRowKey={((item, index) =>
            item?.prospectID ? String(item.prospectID) : String(index))(filteredLeads?.length > 0 ? filteredLeads[0] : {}, 0)}
          rightOpenValue={-105}
          disableRightSwipe
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          onRowOpen={(rowKey, rowMap) => {
            Object.keys(rowMap).forEach(key => {
              if (key !== rowKey) {
                const row = rowMap[key];
                if (row && typeof row.closeRow === 'function') {
                  row.closeRow();
                }
              }
            });
          }}
        />
      )}
      <AddBusinessModal
        modalVisible={modalVisible}
        closeModal={closeModal}
        isEditMode={isEditMode}
        formData={formData}
        setFormData={setFormData}
        slideAnim={slideAnim}
        prospectId={prospectId}
      />
      <CustomerConversionModal
        modalVisible={conversionVisible}
        handleModalClose={closeConversionModal}
        leadDataOriginal={
          leadsData.find(lead => lead.prospectID === prospectId)
        }
        slideAnim={slideAnim}
        convertCustomerData={convertCustomerData}
        insurerCount ={convertCustomerData?.insuredCount}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginTop: 12,
    marginHorizontal: 2,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 25,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  hotLeadBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  hotLeadText: {
    color: COLOR.HOT_LEADS_COLOR,
    paddingLeft: 7,
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },
  warmLeadBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginLeft: 8,
  },
  warmLeadText: {
    color: COLOR.WARM_LEADS_COLOR,
    paddingLeft: 7,
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },
  coldLeadBadge: {
    backgroundColor: COLOR.COLD_LEADS_BACKGROUND,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  coldLeadText: {
    color: COLOR.COLD_LEADS_COLOR,
    paddingLeft: 7,
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },
  droppedLeadBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  droppedLeadText: {
    color: COLOR.LIGHT_GREY,
    paddingLeft: 7,
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },
  listContent: {
    paddingBottom: 140,
  },
  cardWrapper: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  lastCard: {
    marginBottom: 0,
  },
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
    height: 80,
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
  convertButton: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLOR.WHITE_COLOR,
    shadowColor: '#6b6d70',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  convertButtonText: {
    color: COLOR.BLACK_COLOR,
    fontFamily: FONTS.FONT_SEMIBOLD,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
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
  clearFilterButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLOR.PRIMARY_COLOR,
    borderRadius: 8,
  },
  clearFilterText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },

  // small helper style used by shimmer card
  headerRow: {
    // used in shimmer card only
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
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
  },
});

export default BusinessScreen;
