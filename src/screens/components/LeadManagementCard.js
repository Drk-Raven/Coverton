import { View, Text, StyleSheet, Platform } from 'react-native';
import React from 'react';
import { COLOR, FONTS } from '../../utils/constants';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

const LeadManagementCard = props => {
  const { leadData } = props;

  const getLeadTemperature = (dateString) => {
    if (!dateString) return { label: 'Cold', color: '#95A5A6' };
    
    const targetDate = new Date(dateString);
    const currentDate = new Date();
    
    const monthsDiff = (targetDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                       (targetDate.getMonth() - currentDate.getMonth());
    
    if (monthsDiff <= 3) {
      return { label: 'Hot', color: '#E74C3C', bgColor: '#FFEBEE' };
    } else if (monthsDiff <= 6) {
      return { label: 'Warm', color: '#F39C12', bgColor: '#FFF3E0' };
    } else {
      return { label: 'Cold', color: '#3498DB', bgColor: '#E3F2FD' };
    }
  };

  const leadTemp = getLeadTemperature(leadData?.TimeByWhen);

  return (
    <View style={styles.cardContainer}>
      {/* Compact Header with all badges inline */}
      <View style={styles.headerRow}>
        <View style={styles.titleBadge}>
          <Text style={styles.titleText}>{leadData.Title}</Text>
        </View>
        <View style={[styles.tempBadge, { backgroundColor: leadTemp.bgColor }]}>
          <Text style={[styles.badgeText, { color: leadTemp.color }]}>
            {leadTemp.label}
          </Text>
        </View>
        <View style={styles.typeBadge}>
          <Text style={styles.badgeText}>{leadData.Type}</Text>
        </View>
      </View>

      {/* Consultant Name */}
      <Text style={styles.consultantText}>{leadData?.Consultant}</Text>

      {/* Compact Details Section */}
      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <MaterialDesignIcons name="bullseye" size={14} color={COLOR.PRIMARY_COLOR || '#4A90E2'} />
          <Text style={styles.detailText}>{leadData?.Category}</Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialDesignIcons name="phone" size={14} color={COLOR.PRIMARY_COLOR || '#4A90E2'} />
          <Text style={styles.detailText}>988765456</Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialDesignIcons name="calendar-blank" size={14} color={COLOR.PRIMARY_COLOR || '#4A90E2'} />
          <Text style={styles.detailText}>{leadData?.TimeByWhen}</Text>
          <Text style={styles.premiumText}>₹ {leadData?.PremiumExpected}</Text>
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
    flexWrap: 'wrap',
  },
  titleBadge: {
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  titleText: {
    fontFamily: FONTS.FONT_MEDIUM || FONTS.FONT_REGULAR,
    fontSize: 11,
    color: '#2C3E50',
  },
  tempBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadge: {
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontFamily: FONTS.FONT_SEMIBOLD,
    fontSize: 10,
    color: '#1A1A1A',
  },
  consultantText: {
    fontFamily: FONTS.FONT_BOLD,
    fontSize: 15,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  detailsSection: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontFamily: FONTS.FONT_REGULAR,
    fontSize: 11,
    color: '#4A4A4A',
    flex: 1,
  },
  premiumText: {
    fontFamily: FONTS.FONT_SEMIBOLD,
    fontSize: 11,
    color: '#1A1A1A',
    textAlign: 'right',
  },
});

export default LeadManagementCard;