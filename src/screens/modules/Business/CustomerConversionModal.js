import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useDispatch, useSelector } from 'react-redux';
import RNDateTimePicker from '@react-native-community/datetimepicker';

import { COLOR } from '../../../utils/constants';
import * as RequestStatus from '../../../Entities/RequestStatus';
import DynamicDropdown from '../../components/DynamicDropdown';
import { CustomerActions } from '../../../Redux/CustomerRedux';
import { useNavigation } from '@react-navigation/native';
import { validateAadhar, validatePAN } from '../../../utils/utils';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const INITIAL_LEAD_DATA = {
  selfId: 0,
  customerId: '',
  insuredName: '',
  email: '',
  phoneno: '',
  dob: '',
  address: '',
  pan: '',
  aadhar: '',
  productId: 0,
  categoryId: 0,
};

const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate());
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

const formatDate = date => {
  if (!date) return '';
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const CustomerConversionModal = props => {
  const {
    modalVisible,
    handleModalClose,
    slideAnim,
    convertCustomerData,
    insurerCount,
    leadDataOriginal,
  } = props;

  const dispatch = useDispatch();
  const createCustomerRequestStatus = useSelector(
    state => state.customer?.createCustomerRequestStatus,
  );

  const insurer = useSelector(state => state.customer?.insuredCustomer ?? []);

  const getInsuredCustomerRequestStatus = useSelector(
    state => state.customer?.getInsuredCustomerRequestStatus,
  );

  const updatedInsurer = insurer?.map(item => {
    return { ...item, name: item.insuredName };
  });

  const customers = useSelector(state => state?.customer?.customersName ?? []);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [leadData, setLeadData] = useState(INITIAL_LEAD_DATA);
  const [isSelf, setIsSelf] = useState(true);
  const [useExistingInsurer, setUseExistingInsurer] = useState(true);

  const [lastRequestedSelfId, setLastRequestedSelfId] = useState(null);
  const [panError, setPanError] = useState(false);
  const [panErrorMsg, setPanErrorMsg] = useState('');
  const [aadharError, setAadharError] = useState(false);
  const [aadharErrorMsg, setAadharErrorMsg] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    if (modalVisible && convertCustomerData) {
      const custId = convertCustomerData.customerId || '';
      setIsSelf(false);
      setUseExistingInsurer(true);
      setLeadData(prev => ({
        ...prev,
        ...convertCustomerData,
        selfId: 0,
        insuredName: '',
        customerId: custId,
      }));

      if (custId) {
        setLastRequestedSelfId(0);
        dispatch(CustomerActions.getInsuredCustomer(custId, 0));
      }
    }

    if (!modalVisible) {
      setLeadData(INITIAL_LEAD_DATA);
      setIsSelf(true);
      setUseExistingInsurer(true);
      setLastRequestedSelfId(null);
      // reset errors
      setPanError(false);
      setPanErrorMsg('');
      setAadharError(false);
      setAadharErrorMsg('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible, convertCustomerData]);

  useEffect(() => {
    if (getInsuredCustomerRequestStatus !== RequestStatus.OK) return;

    const arr = Array.isArray(insurer) ? insurer : [];
    const requestedSelf = lastRequestedSelfId;

    if (requestedSelf === 0) {
      if (arr.length > 0) {
        setUseExistingInsurer(true);
        setLeadData(prev => ({ ...prev, insuredName: '' }));
      } else {
        setUseExistingInsurer(false);
        setLeadData(prev => ({ ...prev, insuredName: '' }));
      }
    }

    if (requestedSelf === 1) {
      if (arr.length === 1) {
        const chosen = arr[0];
        setUseExistingInsurer(true);
        setLeadData(prev => ({
          ...prev,
          insuredName: chosen.insuredId ?? String(chosen.insuredName ?? ''),
        }));
      } else if (arr.length > 1) {
        setUseExistingInsurer(true);
        setLeadData(prev => ({ ...prev, insuredName: '' }));
      } else {
        setUseExistingInsurer(false);
        setLeadData(prev => ({ ...prev, insuredName: '' }));
      }
      setIsSelf(true);
    }
  }, [getInsuredCustomerRequestStatus, insurer, lastRequestedSelfId]);

  const handleSelfToggle = value => {
    setIsSelf(value);
    setLeadData(prev => ({ ...prev, selfId: value ? 1 : 0, insuredName: '' }));

    const custId = leadData.customerId || convertCustomerData?.customerId;
    if (!custId) return;

    const requested = value ? 1 : 0;
    setLastRequestedSelfId(requested);
    dispatch(CustomerActions.getInsuredCustomer(custId, requested));
  };

  useEffect(() => {
    if (createCustomerRequestStatus !== RequestStatus.OK) return;

    setLeadData(INITIAL_LEAD_DATA);
    handleModalClose();
    navigation.navigate('CustomerTab', { screen: 'CustomerMain' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createCustomerRequestStatus]);

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
        dob: utcDate.toISOString(),
      }));
    }
  };

  // Validate PAN when user finishes typing or on blur/submit
  const validatePanField = panValue => {
    const trimmed = (panValue || '').trim().toUpperCase();
    if (!trimmed) {
      setPanError(false);
      setPanErrorMsg('');
      return true;
    }
    const valid = validatePAN(trimmed);
    if (!valid) {
      setPanError(true);
      setPanErrorMsg('Enter valid PAN (e.g. ABCDE1234F)');
      return false;
    }
    setPanError(false);
    setPanErrorMsg('');
    return true;
  };

  const validateAadharField = aadharValue => {
    const trimmed = (aadharValue || '').replace(/\s+/g, '');
    if (!trimmed) {
      setAadharError(false);
      setAadharErrorMsg('');
      return true;
    }
    const valid = validateAadhar(trimmed);
    if (!valid) {
      setAadharError(true);
      setAadharErrorMsg('Enter 12 digit Aadhaar number');
      return false;
    }
    setAadharError(false);
    setAadharErrorMsg('');
    return true;
  };

  const convertCustomer = () => {
    const prospectIDUpdated = {
      ...leadData,
      prospectId: leadDataOriginal?.prospectID || 0,
    };

    // final normalize PAN
    prospectIDUpdated.pan = (prospectIDUpdated.pan || '').trim().toUpperCase();
    prospectIDUpdated.aadhar = (prospectIDUpdated.aadhar || '').replace(/\s+/g, '');

    const panValid = validatePanField(prospectIDUpdated.pan);
    const aadharValid = validateAadharField(prospectIDUpdated.aadhar);

    if (!panValid || !aadharValid) {
      // do not proceed — errors are already set & shown in UI
      return;
    }

    dispatch(CustomerActions.createCustomer(prospectIDUpdated));
  };

  // helpers for UI button disabled state
  const isSubmitting = createCustomerRequestStatus === RequestStatus.INPROGRESS;
  const hasValidationErrors = panError || aadharError;

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
                name="account-convert-outline"
                size={24}
                color={COLOR.PRIMARY_COLOR}
              />
              <Text style={styles.modalTitle}>
                {`Customer - ${convertCustomerData?.customerId || ''}`}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleModalClose}
              style={styles.closeButton}
            >
              <MaterialDesignIcons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {isSubmitting ? (
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
              <View style={styles.selfRow}>
                <Text style={styles.formLabel}>Self</Text>
                <Switch 
                  value={isSelf} 
                  onValueChange={handleSelfToggle} 
                  thumbColor={isSelf ? COLOR.PRIMARY_COLOR : '#f4f3f4'}
                  trackColor={{ false: '#767577', true: COLOR.PRIMARY_COLOR + '80' }}
                  />
              </View>

              {isSelf ? (
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Insured Name</Text>

                  {useExistingInsurer && updatedInsurer?.length > 0 ? (
                    <DynamicDropdown
                      placeholder=" Select an Insurer"
                      dropdownData={updatedInsurer}
                      labelField="name"
                      valueField="insuredId"
                      selectedOption={leadData.insuredName}
                      onSelect={item => {
                        setLeadData(prev => ({
                          ...prev,
                          insuredName: item.insuredId,
                        }));
                      }}
                      field=""
                      showLabel={false}
                      propContainerStyle={styles.inputContainer}
                      propPlaceholderStyle={{ color: '#9CA3AF' }}
                      isSearch
                    />
                  ) : (
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.textInput}
                        value={leadData.insuredName}
                        onChangeText={text =>
                          setLeadData(prev => ({ ...prev, insuredName: text }))
                        }
                        placeholder="Enter insured name"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.formGroup}>
                  <View style={styles.rowSpaceBetween}>
                    <Text style={styles.formLabel}>Insured Name</Text>

                    {insurerCount > 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          setUseExistingInsurer(prev => {
                            const next = !prev;
                            if (!next) {
                              setLeadData(ld => ({ ...ld, insuredName: '' }));
                            }
                            return next;
                          });
                        }}
                        style={styles.toggleNewInsurerButton}
                      >
                        <MaterialDesignIcons
                          name="plus"
                          size={20}
                          color={COLOR.SECONDARY_COLOR}
                        />
                        <Text style={styles.toggleNewInsurerText}>
                          {useExistingInsurer ? 'New Insurer' : 'Add Existing Insurer'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {insurerCount === 0 || !useExistingInsurer ? (
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.textInput}
                        value={leadData.insuredName}
                        onChangeText={text =>
                          setLeadData(prev => ({ ...prev, insuredName: text }))
                        }
                        placeholder="Enter insurer name"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="default"
                      />
                    </View>
                  ) : (
                    <DynamicDropdown
                      placeholder=" Select an Insurer"
                      dropdownData={updatedInsurer}
                      labelField="name"
                      valueField="insuredId"
                      selectedOption={leadData.insuredName}
                      onSelect={item => {
                        setLeadData(prev => ({
                          ...prev,
                          insuredName: item.insuredId,
                        }));
                      }}
                      field=""
                      showLabel={false}
                      propContainerStyle={styles.inputContainer}
                      propPlaceholderStyle={{ color: '#9CA3AF' }}
                      isSearch
                    />
                  )}
                </View>
              )}

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone Number</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    editable={false}
                    style={styles.textInput}
                    value={leadData.phoneno}
                    onChangeText={text =>
                      setLeadData(prev => ({ ...prev, phoneno: text }))
                    }
                    placeholder="Enter phone number"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={leadData.email}
                    onChangeText={text =>
                      setLeadData(prev => ({ ...prev, email: text }))
                    }
                    placeholder="Enter email"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="default"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Address</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={leadData.address}
                    onChangeText={text =>
                      setLeadData(prev => ({ ...prev, address: text }))
                    }
                    placeholder="Enter address"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="default"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Date of Birth</Text>
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.datePickerContent}>
                    <Text
                      style={[
                        styles.textInput,
                        !leadData.dob && { color: '#9CA3AF' },
                      ]}
                    >
                      {leadData.dob
                        ? formatDate(new Date(leadData.dob))
                        : 'Select date of birth'}
                    </Text>
                    <MaterialDesignIcons
                      name="calendar-month"
                      size={20}
                      color="#6B7280"
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Pan</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={leadData.pan}
                    onChangeText={text =>
                      setLeadData(prev => ({ ...prev, pan: text.toUpperCase() }))
                    }
                    onEndEditing={() => validatePanField(leadData.pan)}
                    placeholder="Enter PAN"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="default"
                    autoCapitalize="characters"
                    maxLength={10}
                  />
                </View>
                {panError ? (
                  <Text style={[styles.formLabel, { color: COLOR.RED_COLOR, marginTop: 5 }]}>
                    {panErrorMsg || 'Enter valid PAN'}
                  </Text>
                ) : null}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Aadhar</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={leadData.aadhar}
                    onChangeText={text =>
                      setLeadData(prev => ({ ...prev, aadhar: text.replace(/\s+/g, '') }))
                    }
                    onEndEditing={() => validateAadharField(leadData.aadhar)}
                    placeholder="Enter Aadhaar"
                    placeholderTextColor="#9CA3AF"
                    keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                    maxLength={12}
                  />
                </View>
                {aadharError ? (
                  <Text style={[styles.formLabel, { color: COLOR.RED_COLOR, marginTop: 5 }]}>
                    {aadharErrorMsg || 'Enter valid Aadhaar'}
                  </Text>
                ) : null}
              </View>

              {showDatePicker && (
                <RNDateTimePicker
                  value={
                    leadData.dob ? new Date(leadData.dob) : getTomorrowDate()
                  }
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'spinner'}
                  onChange={handleDateChange}
                  maximumDate={getTomorrowDate()}
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
                style={[
                  styles.saveButton,
                  (isSubmitting) && { opacity: 0.5 },
                  // (hasValidationErrors || isSubmitting) && { opacity: 0.5 },
                ]}
                onPress={convertCustomer}
                activeOpacity={0.8}
                disabled={isSubmitting}
                // disabled={hasValidationErrors || isSubmitting}
              >
                <MaterialDesignIcons
                  name="account-convert-outline"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.saveButtonText}>Convert</Text>
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
  selfRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    alignItems: 'center',
  },
  toggleNewInsurerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: COLOR.SECONDARY_COLOR + '20',
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  toggleNewInsurerText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 5,
    color: COLOR.SECONDARY_COLOR,
  },
});

export default CustomerConversionModal;
