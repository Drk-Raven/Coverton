import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  Image,
  Alert,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNFetchBlob from 'react-native-blob-util';
import { pick, types } from '@react-native-documents/picker';
import Pdf from 'react-native-pdf';
import { useDispatch, useSelector } from 'react-redux';

import { COLOR } from '../../../utils/constants';
import { CustomerActions } from '../../../Redux/CustomerRedux';
import DynamicInput from '../../components/DynamicInput';
import * as RequestStatus from '../../../Entities/RequestStatus';
import { isImageFile, isPdfFile, getTomorrowDate } from '../../../utils/utils';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const AddPolicyModal = props => {
  const {
    modalVisible,
    closeModal,
    slideAnim,
    selectedLead,
    customerId
  } = props;

  const dispatch = useDispatch();

  const [customerFields, setCustomerFields] = useState([]);
  const [documents, setDocuments] = useState({});
  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [dob, setDob] = useState(null);
  const [expectedCloseDate, setExpectedCloseDate] = useState(null);
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showCloseDatePicker, setShowCloseDatePicker] = useState(false);

  const customerFieldsData = useSelector(
    state => state.customer?.customerFields ?? [],
  );

  const createIGTRequestStatus = useSelector(
    state => state.customer?.createIGTRequestStatus ?? null,
  );

  const getCustomerFieldsRequestStatus = useSelector(
    state => state.customer?.getCustomerFieldsRequestStatus ?? null,
  );

  const isLoading =
    createIGTRequestStatus === RequestStatus.INPROGRESS ||
    getCustomerFieldsRequestStatus === RequestStatus.INPROGRESS;

  const selectedCategoryId = selectedLead?.categoryId;

  const resetState = useCallback(() => {
    setCustomerFields([]);
    setDocuments({});
    setViewerVisible(false);
    setCurrentDocument(null);
    setDob(null);
    setExpectedCloseDate(null);
    setShowDobPicker(false);
    setShowCloseDatePicker(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    resetState();
    closeModal();
  }, [resetState, closeModal]);

  useEffect(() => {
    if (modalVisible && selectedCategoryId) {
      dispatch(CustomerActions.getCustomerFields(selectedCategoryId));
    }
  }, [dispatch, modalVisible, selectedCategoryId]);

  useEffect(() => {
    if (customerFieldsData && customerFieldsData.length > 0) {
      const withValue = customerFieldsData.map(field => ({
        ...field,
        value: field.value ?? null,
      }));
      setCustomerFields(withValue);
    } else if (!customerFieldsData || customerFieldsData.length === 0) {
      setCustomerFields([]);
    }
  }, [customerFieldsData]);

  useEffect(() => {
    if (createIGTRequestStatus === RequestStatus.OK && modalVisible) {
      dispatch(CustomerActions.getCustomerSecondLevel(customerId));
      handleCloseModal();
    }
  }, [createIGTRequestStatus, dispatch]);

  const handleDobChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDobPicker(false);
    }
    if (event.type === 'set' && date) {
      setDob(date);
    }
  };

  const handleCloseDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowCloseDatePicker(false);
    }
    if (event.type === 'set' && date) {
      setExpectedCloseDate(date);
    }
  };

  const saveContentUriToFile = async (uri, ext = 'pdf') => {
    try {
      if (!(Platform.OS === 'android' && uri && uri.startsWith('content://'))) {
        return uri;
      }

      const cacheDir = RNFetchBlob.fs.dirs.CacheDir;
      const filename = `picked_${Date.now()}.${ext}`;
      const destPath = `${cacheDir}/${filename}`;

      const base64Data = await RNFetchBlob.fs.readFile(uri, 'base64');
      await RNFetchBlob.fs.writeFile(destPath, base64Data, 'base64');

      return `file://${destPath}`;
    } catch {
      return uri;
    }
  };

  const viewDocument = async document => {
    if (!document) return;

    if (isPdfFile(document)) {
      const preparedUri = await saveContentUriToFile(document.uri, 'pdf');
      setCurrentDocument({ ...document, uri: preparedUri });
    } else {
      setCurrentDocument(document);
    }

    setViewerVisible(true);
  };

  const closeViewer = async () => {
    try {
      if (currentDocument?.uri && currentDocument.uri.startsWith('file://')) {
        const path = currentDocument.uri.replace('file://', '');
        const exists = await RNFetchBlob.fs.exists(path);
        if (exists) {
          await RNFetchBlob.fs.unlink(path).catch(() => {});
        }
      }
    } catch {
    } finally {
      setViewerVisible(false);
      setCurrentDocument(null);
    }
  };

  const onValueChange = (value, item) => {
    setCustomerFields(prev =>
      prev?.map(field =>
        field?.id === item?.id ? { ...field, value } : field,
      ),
    );
  };

  const handleDocumentPick = async (docType, fieldItem) => {
    try {
      const result = await pick({
        mode: 'open',
        type: [types.pdf, types.images],
        allowMultiSelection: false,
      });

      if (result && Array.isArray(result) && result.length > 0) {
        const file = result[0];
        const mimeType = file.type || file.mimeType || '';
        const isPdf = mimeType.includes('pdf');

        const document = {
          uri: file.uri,
          name: file.name,
          type: mimeType,
          size: file.size,
        };

        setDocuments(prev => ({
          ...prev,
          [docType]: document,
        }));

        const ext = isPdf ? 'pdf' : 'jpg';
        const fileUriForRead = await saveContentUriToFile(file.uri, ext);

        let base64Data = null;
        try {
          const path = fileUriForRead.replace('file://', '');
          base64Data = await RNFetchBlob.fs.readFile(path, 'base64');
        } catch (e) {
          base64Data = await RNFetchBlob.fs.readFile(file.uri, 'base64');
        }

        const finalMime =
          mimeType || (isPdf ? 'application/pdf' : 'image/jpeg');

        const dataUrl = `data:${finalMime};base64,${base64Data}`;

        setCustomerFields(prev =>
          prev.map(field =>
            field.id === fieldItem.id ? { ...field, value: dataUrl } : field,
          ),
        );

        Alert.alert('Success', `${file.name} uploaded successfully`);
      }
    } catch (err) {
      if (
        err?.message?.includes('User canceled') ||
        err?.message?.includes('canceled')
      ) {
        return;
      }
      Alert.alert(
        'Error',
        'Failed to pick document: ' + (err?.message || 'Unknown error'),
      );
    }
  };

  const removeDocument = (docType, fieldItem) => {
    setDocuments(prev => ({
      ...prev,
      [docType]: null,
    }));

    setCustomerFields(prev =>
      prev.map(field =>
        field.id === fieldItem.id ? { ...field, value: null } : field,
      ),
    );
  };

  const handleFormSave = () => {
    const payload = customerFields?.map(field => ({
      ...field,
      profileId: selectedLead?.profileId,
      categoryId: selectedLead?.categoryId,
      boiProspectID: selectedLead?.prospectId,
    }));

    dispatch(CustomerActions.createIGT(payload));
  };

  const renderDynamicInputField = useCallback(
    ({ item }) => {
      const docKey = item?.fieldName?.split(' ')?.join('').toLowerCase();

      return (
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>{item?.label}</Text>
          <DynamicInput
            item={item}
            documents={documents}
            handleDocumentPick={docTypeParam =>
              handleDocumentPick(docTypeParam || docKey, item)
            }
            onRemoveDocument={docTypeParam =>
              removeDocument(docTypeParam || docKey, item)
            }
            onViewDocument={viewDocument}
            onValueChange={onValueChange}
          />
        </View>
      );
    },
    [documents, customerFields],
  );

  return (
    <>
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onDismiss={handleCloseModal}
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
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <View style={styles.modalTitleRow}>
                <MaterialDesignIcons
                  name={'pencil-box'}
                  size={24}
                  color={COLOR.PRIMARY_COLOR}
                />
                <Text style={styles.modalTitle}>
                  {'Add IGT'}
                </Text>
              </View>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <MaterialDesignIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color={COLOR.PRIMARY_COLOR} />
              </View>
            ) : customerFields && customerFields.length > 0 ? (
              <FlatList
                data={customerFields}
                style={styles.modalBody}
                contentContainerStyle={styles.modalBodyContent}
                renderItem={renderDynamicInputField}
                keyExtractor={(item, index) =>
                  String(item?.id || item?.fieldName || index)
                }
                showsVerticalScrollIndicator={false}
              />
            ) : null}

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
                  onPress={handleFormSave}
                  activeOpacity={0.8}
                  disabled={isLoading}
                >
                  <MaterialDesignIcons
                    name={'check'}
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={styles.saveButtonText}>
                    {'Save Changes'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {showDobPicker && (
        <DateTimePicker
          value={dob || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
          onChange={handleDobChange}
          maximumDate={new Date()}
          textColor="#1F2937"
        />
      )}

      {showCloseDatePicker && (
        <DateTimePicker
          value={expectedCloseDate || getTomorrowDate()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
          onChange={handleCloseDateChange}
          minimumDate={getTomorrowDate()}
          textColor="#1F2937"
        />
      )}

      {showDobPicker && Platform.OS === 'ios' && (
        <View style={styles.iosDatePickerActions}>
          <TouchableOpacity
            style={styles.iosDatePickerButton}
            onPress={() => setShowDobPicker(false)}
          >
            <Text style={styles.iosDatePickerButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}

      {showCloseDatePicker && Platform.OS === 'ios' && (
        <View style={styles.iosDatePickerActions}>
          <TouchableOpacity
            style={styles.iosDatePickerButton}
            onPress={() => setShowCloseDatePicker(false)}
          >
            <Text style={styles.iosDatePickerButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        animationType="fade"
        transparent
        visible={viewerVisible}
        onRequestClose={closeViewer}
      >
        <View style={styles.viewerOverlay}>
          <View style={styles.viewerHeader}>
            <Text style={styles.viewerTitle} numberOfLines={1}>
              {currentDocument?.name || 'Document'}
            </Text>
            <TouchableOpacity
              onPress={closeViewer}
              style={styles.viewerCloseButton}
            >
              <MaterialDesignIcons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.viewerContent}>
            {currentDocument && isImageFile(currentDocument) && (
              <ScrollView
                contentContainerStyle={styles.imageScrollContent}
                maximumZoomScale={3}
                minimumZoomScale={1}
                showsVerticalScrollIndicator={false}
              >
                <Image
                  source={{ uri: currentDocument.uri }}
                  style={styles.documentImage}
                  resizeMode="contain"
                />
              </ScrollView>
            )}
            {currentDocument && isPdfFile(currentDocument) && (
              <Pdf
                source={{ uri: currentDocument.uri }}
                style={styles.pdf}
                onLoadComplete={() => {}}
                onError={() => {
                  Alert.alert('Error', 'Failed to load PDF');
                }}
              />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

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
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
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
  viewerOverlay: {
    flex: 1,
    backgroundColor: '#000000',
  },
  viewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  viewerTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
    marginRight: 16,
  },
  viewerCloseButton: {
    padding: 4,
  },
  viewerContent: {
    flex: 1,
    backgroundColor: '#000000',
  },
  imageScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 100,
  },
  pdf: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddPolicyModal;
