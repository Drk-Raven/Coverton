import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

import { COLOR } from '../../../utils/constants';

const DocumentUploadField = ({ label, docType, document }) => (
    <View style={styles.formGroup}>
      <Text style={styles.formLabel}>{label}</Text>
      {document ? (
        <View style={styles.documentUploadedContainer}>
          <TouchableOpacity 
            style={styles.documentInfo}
            // onPress={() => viewDocument(document)}
            activeOpacity={0.7}
          >
            <MaterialDesignIcons
            //   name={isImageFile(document) ? "file-image" : "file-pdf-box"}
              size={24}
              color={COLOR.PRIMARY_COLOR}
            />
            <View style={styles.documentTextContainer}>
              <Text style={styles.documentName}>
                {/* {truncateFileName(document.name)} */}
              </Text>
              <Text style={styles.documentViewText}>Tap to view</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            // onPress={() => removeDocument(docType)}
            style={styles.removeDocButton}
          >
            <MaterialDesignIcons
              name="close-circle"
              size={20}
              color="#EF4444"
            />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.documentUploadContainer}
        //   onPress={() => handleDocumentPick(docType)}
          activeOpacity={0.7}
        >
          <MaterialDesignIcons
            name="cloud-upload"
            size={24}
            color="#6B7280"
          />
          <Text style={styles.documentUploadText}>
            Upload {label}
          </Text>
          <Text style={styles.documentUploadSubtext}>
            PDF or Image (Max 2MB)
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

export default DocumentUploadField

const styles = StyleSheet.create({
    formGroup: {
        marginBottom: 20,
      },
      formLabel: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#374151',
        marginBottom: 8,
      },
      documentUploadContainer: {
        backgroundColor: '#F9FAFB',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        borderRadius: 12,
        paddingVertical: 24,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
      },
      documentUploadText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#374151',
        marginTop: 8,
      },
      documentUploadSubtext: {
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
      },
      documentUploadedContainer: {
        backgroundColor: '#F0F9FF',
        borderWidth: 1,
        borderColor: '#BFDBFE',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      documentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
      },
      documentTextContainer: {
        marginLeft: 10,
        flex: 1,
      },
      documentName: {
        fontFamily: 'Poppins-Medium',
        fontSize: 13,
        color: '#1F2937',
      },
      documentViewText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 11,
        color: COLOR.PRIMARY_COLOR,
        marginTop: 2,
      },
      removeDocButton: {
        padding: 4,
      },
})