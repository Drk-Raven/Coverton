// src/Redux/AuthRedux.js
import Immutable from 'seamless-immutable';
import { createReducer, createActions } from 'reduxsauce';
import * as RequestStatus from '../Entities/RequestStatus';

export const INITIAL_STATE = Immutable({
  restoreAuthRequestStatus: RequestStatus.INITIAL,
  signInRequestStatus: RequestStatus.INITIAL,
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  tokenExpiry: null,
  isSessionExpired: false,
});

const { Types, Creators } = createActions({
  restoreAuth: [],
  setRestoreAuthRequestStatus: ['status'],
  signIn: ['email', 'otp'],
  setSignInRequestStatus: ['status'],
  storeAuthUser: ['user', 'token', 'refreshToken', 'tokenExpiry'],
  updateTokens: ['token', 'refreshToken', 'tokenExpiry'],
  signOut: [],
  setSessionExpired: ['isExpired'],
});

export const AuthTypes = Types;
export const AuthActions = Creators;

export default Creators;

export const restoreAuth = (state = INITIAL_STATE, action = {}) =>
  state.merge({
    restoreAuthRequestStatus: RequestStatus.INPROGRESS,
  });

export const setRestoreAuthRequestStatus = (state, { status }) =>
  state.merge({ restoreAuthRequestStatus: status });

export const signIn = (state, { email, otp }) =>
  state.merge({
    signInRequestStatus: RequestStatus.INPROGRESS,
  });

export const setSignInRequestStatus = (state, { status }) =>
  state.merge({ signInRequestStatus: status });

export const storeAuthUser = (state, { user, token, refreshToken, tokenExpiry }) =>
  state.merge({
    user: user ?? null,
    token: token ?? null,
    refreshToken: refreshToken ?? null,
    tokenExpiry: tokenExpiry ?? null,
    isAuthenticated: true,
    isSessionExpired: false,
    signInRequestStatus: RequestStatus.SUCCESS,
    restoreAuthRequestStatus: RequestStatus.SUCCESS,
  });

export const updateTokens = (state, { token, refreshToken, tokenExpiry }) =>
  state.merge({
    token: token ?? state.token,
    refreshToken: refreshToken ?? state.refreshToken,
    tokenExpiry: tokenExpiry ?? state.tokenExpiry,
  });

export const signOut = (state = INITIAL_STATE, action = {}) =>
  state.merge({
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
    signInRequestStatus: RequestStatus.INITIAL,
  });

export const setSessionExpired = (state, { isExpired }) =>
  state.merge({ isSessionExpired: isExpired });

export const reducer = createReducer(INITIAL_STATE, {
  [Types.RESTORE_AUTH]: restoreAuth,
  [Types.SET_RESTORE_AUTH_REQUEST_STATUS]: setRestoreAuthRequestStatus,
  [Types.SIGN_IN]: signIn,
  [Types.SET_SIGN_IN_REQUEST_STATUS]: setSignInRequestStatus,
  [Types.STORE_AUTH_USER]: storeAuthUser,
  [Types.UPDATE_TOKENS]: updateTokens,
  [Types.SIGN_OUT]: signOut,
  [Types.SET_SESSION_EXPIRED]: setSessionExpired,
});
