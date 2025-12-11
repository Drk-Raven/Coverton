// src/Redux/AuthRedux.js
import Immutable from 'seamless-immutable';
import { createReducer, createActions } from 'reduxsauce';
import * as RequestStatus from '../Entities/RequestStatus';

export const INITIAL_STATE = Immutable({
  restoreAuthRequestStatus: RequestStatus.INITIAL,
  signInRequestStatus: RequestStatus.INITIAL,
  isAuthenticated: false,
  user: null,
});

const { Types, Creators } = createActions({
  restoreAuth: [],
  setRestoreAuthRequestStatus: ['status'],
  signIn: ['email', 'otp'],
  setSignInRequestStatus: ['status'],
  storeAuthUser: ['user'],
  signOut: [],
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

export const storeAuthUser = (state, { user }) =>
  state.merge({
    user: user ?? null,
    isAuthenticated: true,
    signInRequestStatus: RequestStatus.SUCCESS,
    restoreAuthRequestStatus: RequestStatus.SUCCESS,
  });

export const signOut = (state = INITIAL_STATE, action = {}) =>
  state.merge({
    isAuthenticated: false,
    user: null,
    signInRequestStatus: RequestStatus.INITIAL,
  });

export const reducer = createReducer(INITIAL_STATE, {
  [Types.RESTORE_AUTH]: restoreAuth,
  [Types.SET_RESTORE_AUTH_REQUEST_STATUS]: setRestoreAuthRequestStatus,
  [Types.SIGN_IN]: signIn,
  [Types.SET_SIGN_IN_REQUEST_STATUS]: setSignInRequestStatus,
  [Types.STORE_AUTH_USER]: storeAuthUser,
  [Types.SIGN_OUT]: signOut,
});
