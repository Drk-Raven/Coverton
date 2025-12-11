import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { COLOR } from '../../utils/constants';

const CustomInput = props => {
  const { placeholder, value, setValue, addNew, disabled } = props;

  return (
    <View style={[styles.searchContainer, {width: addNew ? '70%' : '100%'}]}>
        <View style={styles.searchIconContainer}>
          <MaterialDesignIcons name="magnify" size={18} color={COLOR.PLACEHOLDER_COLOR} />
        </View>
        <TextInput
          editable={disabled}
          style={styles.searchInput}
          onChangeText={setValue}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={COLOR.PLACEHOLDER_COLOR}
        />
        {value.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setValue('')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialDesignIcons name="close-circle" size={18} color={COLOR.PLACEHOLDER_COLOR} />
          </TouchableOpacity>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  searchIconContainer: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#1A1A1A',
    paddingVertical: 10,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default CustomInput;
