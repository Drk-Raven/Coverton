import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

import { COLOR, FONTS } from '../../utils/constants';

const MessageModal = ({
    visible,
    title,
    message,
    type = 'info', // success | error | info
    onClose,
  }) => {
    const isSuccess = type === 'success';
    const isError = type === 'error';
  
    return (
      <Modal transparent animationType="fade" visible={visible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <MaterialDesignIcons
              name={
                isSuccess
                  ? 'check-circle-outline'
                  : isError
                  ? 'alert-circle-outline'
                  : 'information-outline'
              }
              size={44}
              color={
                isSuccess
                  ? '#22c55e'
                  : isError
                  ? '#ef4444'
                  : COLOR.PRIMARY_COLOR
              }
            />
  
            <Text style={styles.modalTitle}>{title}</Text>
            <Text style={styles.modalMessage}>{message}</Text>
  
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

export default MessageModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContainer: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
      },
      modalTitle: {
        fontSize: 18,
        fontFamily: FONTS.FONT_BOLD,
        color: '#0f172a',
        marginTop: 12,
      },
      modalMessage: {
        fontSize: 14,
        color: '#475569',
        textAlign: 'center',
        marginVertical: 10,
        fontFamily: FONTS.FONT_REGULAR,
      },
      modalButton: {
        marginTop: 12,
        backgroundColor: COLOR.PRIMARY_COLOR,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
      },
      modalButtonText: {
        color: '#fff',
        fontFamily: FONTS.FONT_BOLD,
        fontSize: 14,
      },
      
})
  