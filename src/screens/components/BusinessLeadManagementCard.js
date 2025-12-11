import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import React from 'react';

import { COLOR, FONTS } from '../../utils/constants';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';


const BusinessLeadManagementCard = props => {
  const { leadData } = props;
  const getLeadTemperature = dateString => {
    if (!dateString) return { label: 'Cold', color: '#95A5A6' };

    if (leadData?.status === 'Hot') {
      return { label: 'Hot', color: '#E74C3C', bgColor: '#FFEBEE' };
    } else if (leadData?.status === 'Warm') {
      return { label: 'Warm', color: '#F39C12', bgColor: '#FFF3E0' };
    } else if (leadData?.status === 'Cold') {
      return { label: 'Cold', color: '#3498DB', bgColor: '#E3F2FD' };
    } else {
      // For past dates or far future
      return { label: 'Cold', color: COLOR.LIGHT_GREY, bgColor: '#F5F5F5' };
    }
  };
  const leadTemp = getLeadTemperature(leadData?.timeByWhen);

  return (
  <View style={styles.cardContainer}>
    <View style={styles.headerRow}>
      <View style={styles.titleBadge}>
        <Text style={styles.titleText}>{leadData.prospectID}</Text>
      </View>
      <View style={styles.badgesContainer}>
        <View
          style={[styles.tempBadge, { backgroundColor: leadTemp.bgColor }]}
        >
          <Text style={[styles.badgeText, { color: leadTemp.color }]}>
            {leadData.status}
          </Text>
        </View>
        <View style={styles.typeBadge}>
          <Text style={styles.badgeText}>{leadData.customerType}</Text>
        </View>
      </View>
      {!(leadData?.leadStatus === 'BOI Created') ? <TouchableOpacity activeOpacity={0.7}>
        <MaterialDesignIcons
          name="check-circle-outline"
          size={22}
          color={COLOR.GREEN_COLOR}
        />
      </TouchableOpacity> : null}
    </View>
    {/* Consultant Name */}
    <Text style={styles.consultantText}>{leadData?.customer}</Text>
    {/* Compact Details Grid */}
    <View style={styles.detailsGrid}>
      <View style={styles.detailItem}>
        <MaterialDesignIcons
          name="bullseye"
          size={14}
          color={COLOR.PRIMARY_COLOR || '#4A90E2'}
        />
        <Text
          style={styles.detailLabel}
        >{`${leadData?.product} - ${leadData?.category}`}</Text>
      </View>

      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>Premium:</Text>
        <Text style={styles.detailValue}>₹{leadData?.premiumExpected}</Text>
      </View>

      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>SAIDV:</Text>
        <Text style={styles.detailValue}>₹{leadData?.saidv}</Text>
      </View>

      <View style={styles.detailItem}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.callContainer}
          onPress={()=>{Linking.openURL(`tel:${leadData?.phoneno}`)}}
        >
          <MaterialDesignIcons
            name="phone"
            size={14}
            color={COLOR.PRIMARY_COLOR || '#4A90E2'}
          />
          <Text style={styles.detailLabel}>{leadData?.phoneno}</Text>
        </TouchableOpacity>
        <Text style={styles.detailValue}>
          {leadData?.timeByWhen
            ? new Date(leadData.timeByWhen).toISOString().split('T')[0]
            : ''}
        </Text>
      </View>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginTop: 12,
    marginHorizontal: 2,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  titleBadge: {
    backgroundColor: COLOR.BADGE_BACKGROUND,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  titleText: {
    fontFamily: FONTS.FONT_MEDIUM || FONTS.FONT_REGULAR,
    fontSize: 11,
    color: COLOR.BADGE_TEXT_COLOR,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
  tempBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadge: {
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontFamily: FONTS.FONT_SEMIBOLD,
    fontSize: 10,
    color: '#1A1A1A',
  },
  menuButton: {
    padding: 2,
  },
  consultantText: {
    fontFamily: FONTS.FONT_BOLD,
    fontSize: 15,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  detailsGrid: {
    gap: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailLabel: {
    fontFamily: FONTS.FONT_REGULAR,
    fontSize: 11,
    color: '#666',
  },
  detailValue: {
    fontFamily: FONTS.FONT_SEMIBOLD,
    fontSize: 11,
    color: '#1A1A1A',
    marginLeft: 'auto',
  },
  callContainer: { 
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center' 
  }
});

export default BusinessLeadManagementCard;