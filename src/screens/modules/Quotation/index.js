import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { FONTS } from '../../../utils/constants';

const QuotationComingSoon = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.title}>✨ Coming Soon</Text>
        <Text style={styles.subtitle}>This feature is under development.</Text>
        <Text style={styles.subtitle}>Stay tuned for updates!</Text>
      </Animated.View>
    </View>
  );
};

export default QuotationComingSoon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 40,
    paddingHorizontal: 25,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    alignItems: 'center',
    width: '90%',
  },
  title: {
    fontSize: 24,
    color: '#333',
    marginBottom: 10,
    fontFamily: FONTS.FONT_BOLD
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    marginTop: 4,
    fontFamily: FONTS.FONT_REGULAR
  },
});
