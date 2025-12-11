import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { COLOR } from '../../utils/constants';
import CustomInput from './CustomInput'
const CommonHeader = (props) => {
    const { leads,searchText, setSearchText, isLoading, handleAdditionalFunction } = props
  return (
    <View>
      <View style={styles.titleRow}>
        <View style={styles.iconCircle}>
          <MaterialDesignIcons
            name="bullseye"
            size={26}
            color={COLOR.PRIMARY_COLOR}
          />
        </View>
        <View style={styles.titleTextContainer}>
          <Text style={styles.titleText}>Business Opportunities</Text>
          <Text style={styles.subtitleText}>
            {leads?.length}{' '}
            {leads?.length === 1 ? 'lead' : 'leads'} available
          </Text>
        </View>
      </View>

      <View style={styles.searchAddContainer}>
        <CustomInput
          label="Title"
          placeholder="Search by Customer, phone no..."
          value={searchText}
          setValue={setSearchText}
          addNew
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleAdditionalFunction}
          disabled={isLoading}
          style={styles.addButton}
        >
          <MaterialDesignIcons
            name="plus"
            color={COLOR.PRIMARY_COLOR}
            size={16}
          />
          <Text style={styles.addButtonText}>Add New</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CommonHeader

const styles = StyleSheet.create({
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
      titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
      },
      iconCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#F0F4FF',
        justifyContent: 'center',
        alignItems: 'center',
      },
      titleTextContainer: {
        marginLeft: 14,
        flex: 1,
      },
      titleText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 22,
        color: '#1A1A1A',
        letterSpacing: -0.5,
      },
      subtitleText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
      },
      searchAddContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      addButton: {
        marginLeft: 12,
        backgroundColor: '#F0F4FF',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 7,
        width: '25%'
      },
      addButtonText: {
        // fontFamily: FONTS.FONT_REGULAR,
        fontSize: 10
      },
})