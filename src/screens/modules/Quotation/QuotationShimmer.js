import React from 'react';
import { View, StyleSheet } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const QuotationCardShimmer = () => {
  return (
    <View style={styles.card}>

      {/* Header Row */}
      <View style={styles.row}>
        <ShimmerPlaceHolder
          style={styles.circle}
          LinearGradient={LinearGradient}
        />
        <View style={{ marginLeft: 10 }}>
          <ShimmerPlaceHolder
            style={styles.smallLine}
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            style={[styles.mediumLine, { marginTop: 6 }]}
            LinearGradient={LinearGradient}
          />
        </View>

        <ShimmerPlaceHolder
          style={styles.statusPill}
          LinearGradient={LinearGradient}
        />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Product Type */}
      <View style={styles.row}>
        <ShimmerPlaceHolder
          style={styles.icon}
          LinearGradient={LinearGradient}
        />
        <View style={{ marginLeft: 10 }}>
          <ShimmerPlaceHolder
            style={styles.smallLine}
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            style={[styles.mediumLine, { marginTop: 6, width: 140 }]}
            LinearGradient={LinearGradient}
          />
        </View>
      </View>

      {/* Amount Row */}
      <View style={styles.footerRow}>
        <ShimmerPlaceHolder
          style={[styles.mediumLine, { width: 120 }]}
          LinearGradient={LinearGradient}
        />
        <ShimmerPlaceHolder
          style={styles.chevron}
          LinearGradient={LinearGradient}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  circle: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  smallLine: {
    width: 90,
    height: 10,
    borderRadius: 4,
  },
  mediumLine: {
    width: 160,
    height: 12,
    borderRadius: 4,
  },
  statusPill: {
    width: 70,
    height: 20,
    borderRadius: 20,
    marginLeft: 'auto',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    alignItems: 'center',
  },
  chevron: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
});

export default QuotationCardShimmer;
