import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { MultiSelect } from 'react-native-element-dropdown';
import { useDispatch, useSelector } from 'react-redux';

import { COLOR, FONTS, INSURANCE_COMPANIES } from '../../../utils/constants';
import { QuotationActions } from '../../../Redux/QuotationRedux';
import { CustomerActions } from '../../../Redux/CustomerRedux';
import * as RequestStatus from '../../../Entities/RequestStatus';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AddQuotationModal = props => {
  const {
    modalVisible,
    closeModal,
    isEditMode,
    slideAnim,
    selectedLead,
    customerId,
    onSave,
  } = props;

  const [selected, setSelected] = useState([]);
  const [quotationRequest, setQuotationRequest] = useState([]);
  const [premiumEstimation, setPremiumEstimation] = useState('');
  const [saidv, setSaidv] = useState('');

  const dispatch = useDispatch()
  const createQuotationRequestStatus = useSelector(state => state.quotation.createQuotationRequestStatus)
  const isLoading = createQuotationRequestStatus === RequestStatus.INPROGRESS

  useEffect(() => {
    if (selectedLead?.premium != null) {
      setPremiumEstimation(String(selectedLead.premium));
    } else {
      setPremiumEstimation('');
    }
  }, [selectedLead]);

  useEffect(() => {
    if (createQuotationRequestStatus === RequestStatus.OK ) {
      dispatch(CustomerActions.getCustomerSecondLevel(customerId));
      handleCloseModal();
    }
  }, [createQuotationRequestStatus, dispatch]);

  const resetState = () => {
    setQuotationRequest([]);
    setSelected([]);
    setPremiumEstimation('');
    setSaidv('');
  };

  const handleCloseModal = useCallback(() => {
    resetState();
    closeModal && closeModal();
  }, [closeModal]);

  const insuranceCompany = INSURANCE_COMPANIES;

  const handleCompanyChange = useCallback(
    items => {
      if (items.length > 4) {
        return;
      }

      setSelected(items);

      setQuotationRequest(prev =>
        items.map((companyValue, index) => {
          const company = insuranceCompany.find(c => c.value === companyValue);
          const existing = prev.find(q => q.name === companyValue);
      
          return {
            id: company?.id ?? index + 1,
            name: companyValue,
            value: existing?.value ?? '',
            isActive: existing?.isActive ?? 0,
          };
        }),
      );
    },
    [insuranceCompany],
  );

  const handleToggleActive = useCallback(id => {
    setQuotationRequest(prev =>
      prev.map(item => ({
        ...item,
        // only one active at a time
        isActive: item.id === id ? 1 : 0,
    })),
    );
  }, []);

  const handleValueChange = useCallback((id, text) => {
    setQuotationRequest(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              value: Number(text),
            }
          : item,
      ),
    );
  }, []);

  const handleSave = () => {
    const payload = {
      prospectId: selectedLead?.prospectId,
      productId: selectedLead?.productId,
      categoryId: selectedLead?.categoryId,
      insurerId: selectedLead?.insuredId,
      premiumEstimation:
        premiumEstimation.trim() !== '' ? Number(premiumEstimation) : null,
      saidv: saidv.trim() !== '' ? Number(saidv) : null,
      quotationRequest: quotationRequest,
    };

    // Pass to parent if provided
    dispatch(QuotationActions.createQuotation(payload));

    // handleCloseModal();
  };

  const renderDynamicInputField = useCallback(
    ({ item }) => {
      return (
        <View style={styles.formGroup}>
          {/* Row with checkbox + name */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => handleToggleActive(item.id)}
            activeOpacity={0.8}
          >
            <MaterialDesignIcons
              name={item.isActive === 1 ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={22}
              color={item.isActive ? COLOR.PRIMARY_COLOR : '#9CA3AF'}
            />
            <Text style={styles.formLabelCheckbox}>{item?.name}</Text>
          </TouchableOpacity>

          {/* Input for value */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={item.value ?? ''}
              onChangeText={text => handleValueChange(item.id, text)}
              placeholder="Enter Quotation Amount"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>
        </View>
      );
    },
    [handleToggleActive, handleValueChange],
  );

  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onDismiss={handleCloseModal}
      onRequestClose={handleCloseModal} // Android back
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={handleCloseModal}
        />
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* HEADER */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHandle} />
            <View style={styles.modalTitleRow}>
              <MaterialDesignIcons
                name={isEditMode ? 'pencil-box' : 'plus-box'}
                size={24}
                color={COLOR.PRIMARY_COLOR}
              />
              <Text style={styles.modalTitle}>{'Add Quotation'}</Text>
            </View>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}
            >
              <MaterialDesignIcons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* BODY */}
          {isLoading ? 
          <View style={[styles.modalBody, {justifyContent: 'center', alignItems: 'center'}]}>
            <ActivityIndicator size="large" color={COLOR.PRIMARY_COLOR} />
          </View>
          :<View style={styles.modalBody}>
            <FlatList
              data={quotationRequest}
              keyExtractor={(item, index) =>
                String(item?.id || item?.name || index)
              }
              renderItem={renderDynamicInputField}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalBodyContent}
              ListHeaderComponent={
                <View style={styles.formGroup}>
                  {/* SA / IDV */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>{'SA / IDV Amount'}</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.textInput}
                        value={saidv}
                        onChangeText={text => setSaidv(text)}
                        placeholder="Enter SA/IDV Amount"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  {/* Premium */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>{'Premium Amount'}</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.textInput}
                        value={premiumEstimation}
                        onChangeText={text => setPremiumEstimation(text)}
                        placeholder="Enter Premium Amount"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  {/* Insurance Companies */}
                  <Text style={styles.formLabel}>{'Insurance Companies'}</Text>
                  <MultiSelect
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    search
                    data={insuranceCompany}
                    labelField="value"
                    valueField="value"
                    placeholder="Select Insurance Companies"
                    searchPlaceholder="Search..."
                    value={selected}
                    onChange={handleCompanyChange}
                    renderLeftIcon={() => (
                      <MaterialDesignIcons
                        style={styles.icon}
                        color={COLOR.LIGHT_GREY}
                        name="shield-check"
                        size={20}
                      />
                    )}
                    selectedStyle={styles.selectedStyle}
                  />
                </View>
              }
              ListEmptyComponent={null}
            />
          </View>}

          {/* FOOTER */}
          <View style={styles.modalFooter}>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCloseModal}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <MaterialDesignIcons
                  name={isEditMode ? 'check' : 'plus'}
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.saveButtonText}>{'Save Quotation'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default AddQuotationModal;

const styles = StyleSheet.create({
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
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontFamily: FONTS.FONT_MEDIUM,
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  formLabelCheckbox: {
    fontFamily: FONTS.FONT_MEDIUM,
    fontSize: 14,
    color: '#111827',
    marginLeft: 8,
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
  dropdown: {
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: COLOR.LIGHT_GREY,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  selectedStyle: {
    borderRadius: 12,
  },
  textInput: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: '#1F2937',
    padding: 0,
  },
  inputContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});
