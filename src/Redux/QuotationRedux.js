import Immutable from 'seamless-immutable';
import { createReducer, createActions } from 'reduxsauce';
import * as RequestStatus from '../Entities/RequestStatus';

export const INITIAL_STATE = Immutable({
  createQuotationRequestStatus: RequestStatus.INITIAL,
  quotations: [],
  getQuotationsRequestStatus: RequestStatus.INITIAL,
  quotationById: [],
  getQuotationByIdRequestStatus: RequestStatus.INITIAL,
});

const { Types, Creators } = createActions({
  createQuotation: ['quotationData'],
  setQuotationRequestStatus: ['status'],
  getQuotations: [],
  setQuotationsRequestStatus: ['status'],
  storeQuotations: ['quotations'],
  getQuotationById: ['quotationId'],
  setQuotationByIdRequestStatus: ['status'],
  storeQuotationById: ['quotation'],
});

export const QuotationTypes = Types;
export const QuotationActions = Creators;

export default Creators;

export const createQuotation = (state, { quotationData }) => {
  return state.merge({
    createQuotationRequestStatus: RequestStatus.INPROGRESS,
  });
};

export const setQuotationRequestStatus = (state, { status }) =>
  state.merge({ createQuotationRequestStatus: status });

export const getQuotations = (state = INITIAL_STATE, action = {}) => {
  return state.merge({
    getQuotationsRequestStatus: RequestStatus.INPROGRESS,
  });
};

export const setQuotationsRequestStatus = (state, { status }) =>
  state.merge({ getQuotationsRequestStatus: status });

export const storeQuotations = (state, { quotations }) => {
  return state.merge({
    quotations: quotations?.responseData ?? quotations ?? [],
    getQuotationsRequestStatus: RequestStatus.OK,
  });
};

export const getQuotationById = (
  state = INITIAL_STATE,
  action = { quotationId },
) => {
  return state.merge({
    getQuotationByIdRequestStatus: RequestStatus.INPROGRESS,
  });
};

export const setQuotationByIdRequestStatus = (state, { status }) =>
  state.merge({ getQuotationByIdRequestStatus: status });

export const storeQuotationById = (state, { quotation }) => {
  return state.merge({
    quotationById: quotation?.responseData ?? quotation ?? [],
    getQuotationByIdRequestStatus: RequestStatus.OK,
  });
};

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CREATE_QUOTATION]: createQuotation,
  [Types.SET_QUOTATION_REQUEST_STATUS]: setQuotationRequestStatus,
  [Types.GET_QUOTATIONS]: getQuotations,
  [Types.SET_QUOTATIONS_REQUEST_STATUS]: setQuotationsRequestStatus,
  [Types.STORE_QUOTATIONS]: storeQuotations,
  [Types.GET_QUOTATION_BY_ID]: getQuotationById,
  [Types.SET_QUOTATION_BY_ID_REQUEST_STATUS]: setQuotationByIdRequestStatus,
  [Types.STORE_QUOTATION_BY_ID]: storeQuotationById,
});
