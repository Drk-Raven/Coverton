// src/screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const SplashScreen = () => {
  const navigation = useNavigation();
  // New changes from here
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    // Wait for splash animation and then navigate based on auth state
    const timer = setTimeout(() => {
      navigation.replace(isAuthenticated ? 'App' : 'Auth');
    }, 4000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigation]);

  // New changes to here
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/animations/FamilyInsurance.json')}
        autoPlay
        loop={false}
        style={styles.lottie}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 250,
    height: 250,
  },
});

