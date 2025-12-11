import Immutable from 'seamless-immutable';
import { createReducer, createActions } from 'reduxsauce';
import * as RequestStatus from '../Entities/RequestStatus';

export const INITIAL_STATE = Immutable({
  policy: [],
  getPolicyRequestStatus: RequestStatus.INITIAL,
});

const { Types, Creators } = createActions({
  getPolicy: [],
  setPolicyRequestStatus: ['status'],
  storePolicy: ['policy'],
});

export const PolicyTypes = Types;
export const PolicyActions = Creators;

export default Creators;

export const getPolicy = (state = INITIAL_STATE, action = {}) => {
  return state.merge({
    getPolicyRequestStatus: RequestStatus.INPROGRESS,
  });
};

export const setPolicyRequestStatus = (state, { status }) =>
  state.merge({ getPolicyRequestStatus: status });

export const storePolicy = (state, { policy }) => {
  return state.merge({
    policy: policy?.responseData ?? policy ?? [],
    getPolicyRequestStatus: RequestStatus.OK,
  });
};


export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_POLICY]: getPolicy,
  [Types.SET_POLICY_REQUEST_STATUS]: setPolicyRequestStatus,
  [Types.STORE_POLICY]: storePolicy,
});
