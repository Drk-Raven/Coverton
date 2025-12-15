// src/utils/tokenManager.js
import AsyncStorage from '@react-native-async-storage/async-storage';

let currentAccessToken = null;
let currentRefreshToken = null;
let currentTokenExpiry = null;

// Keys used inside the persisted auth object (reference only)
const AUTH_PERSIST_KEY = 'persist:root';
const AUTH_REDUX_KEY = 'auth';

export const setTokens = (accessToken, refreshToken, tokenExpiry = null) => {
  currentAccessToken = accessToken || null;
  currentRefreshToken = refreshToken || null;
  currentTokenExpiry = tokenExpiry || null;
};

export const getAccessToken = () => currentAccessToken;
export const getRefreshToken = () => currentRefreshToken;
export const getTokenExpiry = () => currentTokenExpiry;

export const clearToken = () => {
  currentAccessToken = null;
  currentRefreshToken = null;
  currentTokenExpiry = null;
};
