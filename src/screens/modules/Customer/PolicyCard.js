import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { COLOR, FONTS, LEAD_STATUS } from '../../../utils/constants';

const STATUS_STYLES = {
  [LEAD_STATUS.INSURED_ADDED] : {
    bg: '#dafbe1',
    text: '#1a8a47',
  },
  [LEAD_STATUS.QUOTATION_PENDING]: {
    bg: '#FFF3E0',
    text: COLOR.WARM_LEADS_COLOR,
  },
  default: {
    bg: '#f0f4ff',
    text: COLOR.BADGE_TEXT_COLOR || '#1A73E8',
  },
};

const PolicyCard = ({ leadData, handleEditLead, handleEditQuote }) => {
  const status = leadData?.status?.trim() || '';
  const styleObj = STATUS_STYLES[status] || STATUS_STYLES.default;
  const showEdit = leadData?.status === LEAD_STATUS.INSURED_ADDED
  const showInsured = leadData?.status === LEAD_STATUS.QUOTATION_PENDING

  return (
    <View style={styles.cardContainer}>
      {/* Header: ID badge, status chip and edit */}
      <View style={styles.headerRow}>
        <View style={styles.leftHeader}>
          <View style={styles.titleBadge}>
            <Text style={styles.titleText} numberOfLines={1}>
              {leadData?.insuredId ?? '-'}
            </Text>
          </View>

          {/* Status chip */}
          <View style={[styles.statusChip, { backgroundColor: styleObj.bg }]}>
            <Text
              style={[styles.statusText, { color: styleObj.text }]}
              numberOfLines={1}
            >
              {status || '—'}
            </Text>
          </View>
        </View>

        {showEdit ? <TouchableOpacity
          style={styles.menuButton}
          activeOpacity={0.7}
          onPress={() => handleEditLead && handleEditLead(leadData)}
        >
          <MaterialDesignIcons
            name="pencil"
            size={20}
            color={COLOR.BADGE_TEXT_COLOR}
          />
        </TouchableOpacity> : null}
        {showInsured ? <TouchableOpacity
          style={styles.menuButton}
          activeOpacity={0.7}
          onPress={() => handleEditQuote && handleEditQuote(leadData)}
        >
          <MaterialDesignIcons
            name="account-clock-outline"
            size={20}
            color={COLOR.BADGE_TEXT_COLOR}
          />
        </TouchableOpacity> : null}
      </View>

      {/* Name */}
      <Text style={styles.consultantText} numberOfLines={1}>
        {leadData?.insuredName ?? '-'}
      </Text>

      {/* Details row: product/category | premium | contact */}
      <View style={styles.detailsRow}>
        {/* Left: product + category */}
        <View style={styles.colLeft}>
          <View style={styles.detailInline}>
            <MaterialDesignIcons
              name="bullseye"
              size={13}
              color={COLOR.PRIMARY_COLOR || '#4A90E2'}
            />
            <View style={styles.productWrap}>
              <Text
                style={styles.detailLabel}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {leadData?.productName ?? 'Motor'}
              </Text>
            </View>
          </View>
          <Text style={styles.detailSub} numberOfLines={1} ellipsizeMode="tail">
            {leadData?.categoryName ? ` • ${leadData.categoryName}` : ' • Bike'}
          </Text>
        </View>

        <View style={styles.colCenter}>
          <Text numberOfLines={1} style={styles.detailLabelSmall}>Expected Premium</Text>
          <Text style={styles.detailValue}>₹{leadData?.premium ?? '-'}</Text>
        </View>

        {/* Right: contact (fixed width) */}
        <View style={styles.colRight}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.callContainer}
            onPress={() => {
              if (leadData?.contactNumber) {
                Linking.openURL(`tel:${leadData.contactNumber}`);
              }
            }}
          >
            <MaterialDesignIcons
              name="phone"
              size={13}
              color={COLOR.PRIMARY_COLOR || '#4A90E2'}
            />
            <Text style={styles.contactText} numberOfLines={1}>
              {leadData?.contactNumber ?? '—'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PolicyCard;

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 6,
    marginHorizontal: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    // subtle elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F4F6F8',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleBadge: {
    backgroundColor: COLOR.BADGE_BACKGROUND || '#F0F4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: FONTS.FONT_MEDIUM || FONTS.FONT_REGULAR,
    fontSize: 11,
    color: COLOR.BADGE_TEXT_COLOR || '#1A73E8',
  },
  statusChip: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontFamily: FONTS.FONT_REGULAR,
    fontSize: 11,
  },
  menuButton: {
    padding: 6,
    backgroundColor: 'transparent',
    borderRadius: 12,
  },

  consultantText: {
    fontFamily: FONTS.FONT_BOLD || FONTS.FONT_SEMIBOLD,
    fontSize: 16,
    color: '#111',
    marginBottom: 6,
  },

  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // left column - flexible
  colLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  detailInline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    flexShrink: 1, // allow shrink so it doesn't push other columns
  },
  detailLabel: {
    fontFamily: FONTS.FONT_REGULAR,
    fontSize: 12,
    color: '#333',
  },
  detailSub: {
    fontFamily: FONTS.FONT_SEMIBOLD,
    fontSize: 11,
    color: '#777',
    marginLeft: 6,
  },

  // center column - fixed width to prevent overlap
  colCenter: {
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailLabelSmall: {
    fontFamily: FONTS.FONT_REGULAR,
    fontSize: 11,
    color: '#666',
  },
  detailValue: {
    fontFamily: FONTS.FONT_SEMIBOLD,
    fontSize: 13,
    color: '#111',
    marginTop: 4,
  },

  // right column - fixed width
  colRight: {
    width: '30%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  callContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontFamily: FONTS.FONT_REGULAR,
    fontSize: 12,
    color: '#333',
    marginLeft: 8,
  },
});
