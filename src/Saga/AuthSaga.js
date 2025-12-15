// src/Saga/AuthSaga.js
import { put, call } from 'redux-saga/effects';
import { AuthActions } from '../Redux/AuthRedux';
import { verifyOTP } from '../API/AuthAPI';
import * as RequestStatus from '../Entities/RequestStatus';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function* signIn(action) {
    const { email, otp } = action;
    try {
        const response = yield call(verifyOTP, { emailId: email, otp });
        yield put(AuthActions.storeAuthUser(response, response.token));
    } catch (error) {
        console.error('SignIn Error:', error);
        yield put(AuthActions.setSignInRequestStatus(RequestStatus.FAILURE));
    }
}

export function* signOut() {
    try {
        // Clear AsyncStorage (redux-persist will handle the rest)
        yield call([AsyncStorage, 'removeItem'], 'persist:root');
    } catch (error) {
        console.error('SignOut Error:', error);
    }
}

export function* restoreAuth() {
    try {
        // Redux-persist automatically rehydrates, so we just update status
        yield put(AuthActions.setRestoreAuthRequestStatus(RequestStatus.SUCCESS));
    } catch (error) {
        console.error('RestoreAuth Error:', error);
        yield put(AuthActions.setRestoreAuthRequestStatus(RequestStatus.FAILURE));
    }
}