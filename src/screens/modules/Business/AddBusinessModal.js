import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  ToastAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useDispatch, useSelector } from 'react-redux';
import RNDateTimePicker from '@react-native-community/datetimepicker'

import DynamicDropdown from '../../components/DynamicDropdown';
import { COLOR } from '../../../utils/constants';
import { BusinessOpportunitiesActions } from '../../../Redux/BusinessOpportunitiesRedux';
import { CustomerActions } from '../../../Redux/CustomerRedux';

import * as RequestStatus from '../../../Entities/RequestStatus';
import { getCategoriesByProduct } from '../../../utils/utils';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const INITIAL_LEAD_DATA = {
  consultant: '',
  customer: '',
  customerType: '',
  product: '',
  category: '',
  timeByWhen: '',
  premiumExpected: 0,
  saidv: 0,
  phoneno: '',
  expectedExpenditure: 0,
  directExpenditure: 0
};

const AddBusinessModal = props => {
  const {
    modalVisible,
    closeModal,
    isEditMode,
    formData,
    slideAnim,
    prospectId,
  } = props;

  const dispatch = useDispatch();

  const [leadData, setLeadData] = useState(INITIAL_LEAD_DATA);
  const [customerType, setCustomerType] = useState([
    { label: 'Corporate', value: 'Corporate' },
    { label: 'Retail', value: 'Retail' },
  ]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [ showCreateCustomer, setShowCreateCustomer ] = useState(true);

  const productsState = useSelector(
    state => state.businessOpportunities?.products ?? [],
  );
  const productsCategories = useSelector(
    state => state.businessOpportunities?.categories ?? [],
  );
  const createLeadsRequestStatus = useSelector(
    state => state.businessOpportunities?.createLeadRequestStatus,
  );
  const updateLeadRequestStatus = useSelector(
    state => state.businessOpportunities?.updateLeadRequestStatus,
  );
  const customers = useSelector(
    state => state?.customer?.customersName ?? [],
  );
  const user = useSelector(state => state.auth?.user ?? null);

  useEffect(() => {
    if (modalVisible && user?.userName && !leadData.consultant) {
      setLeadData(prev => ({
        ...prev,
        consultant: user.userName,
      }));
    }
  }, [modalVisible, user]);

  useEffect(() => {
    if (modalVisible) {
      setShowCreateCustomer(!isEditMode)

      if (isEditMode && formData) {
        const processedFormData = { ...formData };

        if (processedFormData.timeByWhen) {
          const localDate = new Date(processedFormData.timeByWhen);
          const utcDate = new Date(
            Date.UTC(
              localDate.getFullYear(),
              localDate.getMonth(),
              localDate.getDate(),
              0,
              0,
              0,
              0,
            ),
          );
          processedFormData.timeByWhen = utcDate.toISOString();
        }
        if (processedFormData?.product) {
          const productId = products?.find(product => product?.value === processedFormData?.product)?.id;
          processedFormData.product = productId
        }
        if (processedFormData?.category) {
          const categoryId = categories?.find(category => category?.value === processedFormData?.category)?.id;
          processedFormData.category = categoryId
        }

        setLeadData(processedFormData);
      } else {
        setLeadData({
          ...INITIAL_LEAD_DATA,
          consultant: user?.userName || '',
        });
      }
    }
  }, [modalVisible, isEditMode, formData]);

  useEffect(() => {
    if (createLeadsRequestStatus === RequestStatus.OK) {
      setLeadData(INITIAL_LEAD_DATA);
      closeModal();
      dispatch(BusinessOpportunitiesActions.getLeads());
    }
  }, [createLeadsRequestStatus, dispatch]);
  
  useEffect(() => {
    if (updateLeadRequestStatus === RequestStatus.OK) {
      setLeadData(INITIAL_LEAD_DATA);
      closeModal();
      dispatch(BusinessOpportunitiesActions.getLeads());
    }
  }, [updateLeadRequestStatus, dispatch]); 

  useEffect(() => {
    dispatch(BusinessOpportunitiesActions.getProducts());
    dispatch(BusinessOpportunitiesActions.getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (modalVisible) {
      dispatch(CustomerActions.getCustomersName());
    }
  }, [modalVisible, dispatch]);

  useEffect(() => {
    let data = productsState?.map(product => {
      return { ...product, label: product.value };
    });
    setProducts(data);
  }, [productsState]);

  useEffect(() => {
    let data = productsCategories?.map(category => {
      return { ...category, label: category.value };
    });
    setCategories(data);
  }, [productsCategories]);

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  };

  const getMaxDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 180);
    return date;
  };

  const formatDate = date => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (event.type === 'set' && date) {
      const utcDate = new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          0,
          0,
          0,
          0,
        ),
      );

      setLeadData(prevData => ({
        ...prevData,
        timeByWhen: utcDate.toISOString(),
      }));
    }
  };

  const handleModalClose = () => {
    setLeadData(INITIAL_LEAD_DATA);
    setShowDatePicker(false);
    closeModal();
  };

  const handleSaveWrapper = async () => {
    try {
      const payload = {
        consultant: leadData.consultant || '',
        customer: leadData.customer || '',
        customerType: leadData.customerType || '',
        productId: leadData.product || '',
        categoryId: leadData.category || '',
        timeByWhen: leadData.timeByWhen || new Date().toISOString(),
        premiumExpected: leadData.premiumExpected || 0,
        saidv: leadData.saidv || 0,
        phoneno: leadData.phoneno || '',
        expectedExpenditure: leadData?.expectedExpenditure || 0,
        directExpenditure: leadData?.directExpenditure || 0
      };

      if (isEditMode) {
        dispatch(BusinessOpportunitiesActions.updateLead(payload, prospectId));
      } else {
        dispatch(BusinessOpportunitiesActions.createLead(payload));
      }
    } catch (error) {

      if (Platform.OS === 'android') {
        ToastAndroid.show('Failed to save lead!', ToastAndroid.SHORT);
      } else {
        Alert.alert('Error', 'Failed to save lead!');
      }
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onDismiss={handleModalClose}
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
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <View style={styles.modalHandle} />
            <View style={styles.modalTitleRow}>
              <MaterialDesignIcons
                name={isEditMode ? 'pencil-box' : 'plus-box'}
                size={24}
                color={COLOR.PRIMARY_COLOR}
              />
              <Text style={styles.modalTitle}>
                {isEditMode ? 'Edit Lead' : 'Add Lead'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleModalClose}
              style={styles.closeButton}
            >
              <MaterialDesignIcons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          {createLeadsRequestStatus === RequestStatus.INPROGRESS ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={COLOR.PRIMARY_COLOR} />
            </View>
          ) : (
            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={styles.modalBodyContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View style={styles.formGroup}>
                <View style={styles.rowSpaceBetween}>
                  <Text style={styles.formLabel}>Customer Name</Text>
                  {!isEditMode ? (
                    <TouchableOpacity
                      onPress={() => {
                        setLeadData({
                          ...leadData,
                          customer: '',
                          phoneno: '',
                        });
                        setShowCreateCustomer(!showCreateCustomer)
                      }}
                      style={[
                        styles.rowCenter,
                        {
                          marginBottom: 10,
                          backgroundColor: COLOR.SECONDARY_COLOR + 20,
                          borderRadius: 12,
                          paddingHorizontal: 10,
                        },
                      ]}
                    >
                      <MaterialDesignIcons
                        name="plus"
                        size={20}
                        color={COLOR.SECONDARY_COLOR}
                      />
                      <Text
                        style={[
                          styles.formLabel,
                          {
                            marginTop: 8,
                            marginLeft: 5,
                            color: COLOR.SECONDARY_COLOR,
                          },
                        ]}
                      >
                        {showCreateCustomer
                          ? 'New Customer'
                          : 'Add Existing Customer'}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                {showCreateCustomer ? (
                  <DynamicDropdown
                    placeholder={' Select a Customer'}
                    dropdownData={customers}
                    labelField={'name'}
                    valueField={'id'}
                    selectedOption={leadData.product}
                    onSelect={(item, field) => {
                      setLeadData({
                        ...leadData,
                        customer: item.id,
                        phoneno: item?.phoneNo,
                      });
                    }}
                    field={''}
                    showLabel={false}
                    propContainerStyle={styles.inputContainer}
                    propPlaceholderStyle={{ color: '#9CA3AF' }}
                    isSearch
                  />
                ) : (
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.textInput}
                      value={leadData.customer}
                      onChangeText={text =>
                        setLeadData({ ...leadData, customer: text })
                      }
                      placeholder="Enter name"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone Number</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    editable={!showCreateCustomer}
                    style={styles.textInput}
                    value={leadData.phoneno}
                    onChangeText={text =>
                      setLeadData({ ...leadData, phoneno: `${text}` })
                    }
                    placeholder="Enter phone number"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={[styles.formGroup, { zIndex: 4000 }]}>
                <Text style={styles.formLabel}>Type</Text>
                <DynamicDropdown
                  placeholder={' Select a Type'}
                  dropdownData={customerType}
                  labelField={'label'}
                  valueField={'value'}
                  selectedOption={leadData.customerType}
                  onSelect={(item, field) => {
                    setLeadData({ ...leadData, customerType: item.value });
                  }}
                  field={''}
                  showLabel={false}
                  propContainerStyle={styles.inputContainer}
                  propPlaceholderStyle={{ color: '#9CA3AF' }}
                />
              </View>

              <View style={[styles.formGroup, { zIndex: 3000 }]}>
                <Text style={styles.formLabel}>Product</Text>
                <DynamicDropdown
                  placeholder={' Select a Product'}
                  dropdownData={products}
                  labelField={'label'}
                  valueField={'value'}
                  selectedOption={products?.find(product=>product?.id === leadData.product)?.value}
                  onSelect={(item, field) => {
                    setLeadData({ ...leadData, product: item.id });
                  }}
                  field={''}
                  showLabel={false}
                  propContainerStyle={styles.inputContainer}
                  propPlaceholderStyle={{ color: '#9CA3AF' }}
                />
              </View>

              <View style={[styles.formGroup, { zIndex: 2000 }]}>
                <Text style={styles.formLabel}>Category</Text>
                <DynamicDropdown
                  placeholder={' Select a Category'}
                  dropdownData={getCategoriesByProduct(categories, leadData)}
                  labelField={'label'}
                  valueField={'value'}
                  selectedOption={categories?.find(catogory => catogory?.id === leadData?.category)?.value}
                  onSelect={(item, field) => {
                    setLeadData({ ...leadData, category: item.id });
                  }}
                  field={''}
                  showLabel={false}
                  propContainerStyle={styles.inputContainer}
                  propPlaceholderStyle={{ color: '#9CA3AF' }}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>SA/IDV Amount</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={leadData.saidv ? String(leadData.saidv) : ''}
                    keyboardType="numeric"
                    onChangeText={text =>
                      setLeadData({ ...leadData, saidv: Number(text) || 0 })
                    }
                    placeholder="Eg: 5,00,000"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Expected Premium Amount</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={
                      leadData.premiumExpected
                        ? String(leadData.premiumExpected)
                        : ''
                    }
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      const premium = Number(text);
                    
                      setLeadData(prev => ({
                        ...prev,
                        premiumExpected: isNaN(premium) ? 0 : premium,
                        expectedExpenditure: isNaN(premium) ? 0 : premium / 10,
                      }));
                    }}
                    placeholder="Enter expected premium amount"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Expected Expenditure</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    editable={false}
                    value={
                      leadData.expectedExpenditure
                        ? String(leadData.expectedExpenditure)
                        : ''
                    }
                    keyboardType="numeric"
                    placeholder="Enter expected premium amount"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Direct Expenditure</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={
                      leadData.directExpenditure
                        ? String(leadData.directExpenditure)
                        : ''
                    }
                    keyboardType="numeric"
                    onChangeText={text =>
                      setLeadData({
                        ...leadData,
                        directExpenditure: Number(text) || 0,
                      })
                    }
                    placeholder="Enter expected premium amount"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Expected Close Date</Text>
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.datePickerContent}>
                    <Text
                      style={[
                        styles.textInput,
                        !leadData.timeByWhen && { color: '#9CA3AF' },
                      ]}
                    >
                      {leadData.timeByWhen
                        ? formatDate(new Date(leadData.timeByWhen))
                        : 'Select expected close date'}
                    </Text>
                    <MaterialDesignIcons
                      name="calendar-month"
                      size={20}
                      color="#6B7280"
                    />
                  </View>
                </TouchableOpacity>
              </View>

              {showDatePicker && (
                <RNDateTimePicker
                  value={
                    leadData.timeByWhen
                      ? new Date(leadData.timeByWhen)
                      : getTomorrowDate()
                  }
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                  onChange={handleDateChange}
                  minimumDate={getTomorrowDate()}
                  maximumDate={getMaxDate()}
                  textColor="#1F2937"
                  positiveButton={{
                    label: 'OK',
                    textColor: COLOR.PRIMARY_COLOR,
                  }}
                  negativeButton={{
                    label: 'Cancel',
                    textColor: COLOR.PRIMARY_COLOR,
                  }}
                />
              )}
              {showDatePicker && Platform.OS === 'ios' && (
                <View style={styles.iosDatePickerActions}>
                  <TouchableOpacity
                    style={styles.iosDatePickerButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.iosDatePickerButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          )}
          <View style={styles.modalFooter}>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleModalClose}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={()=>{handleSaveWrapper()}}
                activeOpacity={0.8}
              >
                <MaterialDesignIcons
                  name={isEditMode ? 'check' : 'plus'}
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.saveButtonText}>
                  {isEditMode ? 'Save Changes' : 'Add Lead'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: SCREEN_HEIGHT * 0.75,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1A1A1A',
    marginLeft: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    padding: 4,
  },
  modalBody: {
    flex: 1,
  },
  modalBodyContent: {
    padding: 20,
    paddingBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  textInput: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: '#1F2937',
    padding: 0,
  },
  datePickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iosDatePickerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 20,
  },
  iosDatePickerButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: COLOR.PRIMARY_COLOR,
    borderRadius: 8,
  },
  iosDatePickerButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  modalFooter: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLOR.PRIMARY_COLOR,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
    marginLeft: 6,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddBusinessModal;
