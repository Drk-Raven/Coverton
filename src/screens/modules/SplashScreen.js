// src/screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const userDetails = await AsyncStorage?.getItem('userDetails');  
        setTimeout(() => {
          navigation.replace(userDetails ? 'App' : 'Auth');
        }, 4000);
  
      } catch (err) {
        navigation.replace('Auth');
      }
    };
  
    checkLogin();
  }, []);
  
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
