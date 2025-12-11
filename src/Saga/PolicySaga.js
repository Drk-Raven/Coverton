import { all, put, call } from 'redux-saga/effects';

import * as PolicyAPI from '../API/PolicyAPI';
import PolicyActions from '../Redux/PolicyRedux';
import * as RequestStatus from '../Entities/RequestStatus';

export function* getPolicy() {
    try {
      const response = yield call(PolicyAPI.getPolicy);
      if (response?.err) {
        yield put(
          PolicyActions.setPolicyRequestStatus(RequestStatus.ERROR),
        );
        return;
      }
      const policy = response.data ?? response ?? [];
      yield all([
        put(PolicyActions.setPolicyRequestStatus(RequestStatus.OK)),
        put(PolicyActions.storePolicy(policy)),
      ]);
    } catch (err) {
      console.error('getCustomersName saga error', err);
      yield put(PolicyActions.setPolicyRequestStatus(RequestStatus.ERROR));
    }
  }