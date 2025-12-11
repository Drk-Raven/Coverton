import Immutable from 'seamless-immutable';
import { createReducer, createActions } from 'reduxsauce';
import * as RequestStatus from '../Entities/RequestStatus';

export const INITIAL_STATE = Immutable({
  customersName: [],
  getCustomersNameRequestStatus: RequestStatus.INITIAL,
  customerFields: [],
  getCustomerFieldsRequestStatus: RequestStatus.INITIAL,
  customers: [],
  getCustomersRequestStatus: RequestStatus.INITIAL,
  customerById: [],
  getCustomerByIdRequestStatus: RequestStatus.INITIAL,
  createCustomerRequestStatus: RequestStatus.INITIAL,
  customersFirstLevel: [],
  getCustomersFirstLevelRequestStatus: RequestStatus.INITIAL,
  customersSecondLevel: [],
  getCustomersSecondLevelRequestStatus: RequestStatus.INITIAL,
  insuredCustomer: [],
  getInsuredCustomerRequestStatus: RequestStatus.INITIAL,
  createIGTRequestStatus: RequestStatus.INITIAL,
});

const { Types, Creators } = createActions({
  getCustomersName: [],
  setCustomersNameRequestStatus: ['status'],
  storeCustomersName: ['customers'],
  getCustomerFields: ['categoryId'],
  setCustomerFieldsRequestStatus: ['status'],
  storeCustomerFields: ['customerFields'],
  getCustomers: [],
  setCustomersRequestStatus: ['status'],
  storeCustomers: ['customers'],
  getCustomerById: ['insurerId'],
  setCustomerByIdRequestStatus: ['status'],
  storeCustomerById: ['customer'],
  createCustomer: [ 'customerData' ],
  setCreateCustomerRequestStatus: ['status'],
  getCustomerFirstLevel: [],
  setCustomerFirstLevelRequestStatus: ['status'],
  storeCustomerFirstLevel: ['customers'],
  getCustomerSecondLevel: ['customerId'],
  setCustomerSecondLevelRequestStatus: ['status'],
  storeCustomerSecondLevel: ['customers'],
  getInsuredCustomer: ['customerId', 'selfId'],
  setInsuredCustomerRequestStatus: ['status'],
  storeInsuredCustomer: ['insurer'],
  createIGT: [ 'igtData' ],
  setCreateIGTRequestStatus: ['status'],
});

export const CustomerTypes = Types;
export const CustomerActions = Creators;

export default Creators;

export const getCustomersName = (state = INITIAL_STATE, action = {}) => {
  return state.merge({
    getCustomersNameRequestStatus: RequestStatus.INPROGRESS,
  });
};

export const setCustomersNameRequestStatus = (state, { status }) =>
  state.merge({ getCustomersNameRequestStatus: status });

export const storeCustomersName = (state, { customers }) => {
  return state.merge({
    customersName: customers?.responseData ?? customers ?? [], // defensive: allow both raw or { responseData }
    getCustomersNameRequestStatus: RequestStatus.OK,
  });
};

export const getCustomerFields = (
  state = INITIAL_STATE,
  action = { categoryId },
) => {
  return state.merge({
    getCustomerFieldsRequestStatus: RequestStatus.INPROGRESS,
  });
};

export const setCustomerFieldsRequestStatus = (state, { status }) =>
  state.merge({ getCustomerFieldsRequestStatus: status });

export const storeCustomerFields = (state, { customerFields }) => {
  return state.merge({
    customerFields: customerFields?.responseData ?? customerFields ?? [],
    getCustomerFieldsRequestStatus: RequestStatus.OK,
  });
};

export const getCustomers = (state = INITIAL_STATE, action = {}) => {
  return state.merge({
    getCustomersRequestStatus: RequestStatus.INPROGRESS,
  });
};

export const setCustomersRequestStatus = (state, { status }) =>
  state.merge({ getCustomersRequestStatus: status });

export const storeCustomers = (state, { customers }) => {
  return state.merge({
    customers: customers?.responseData ?? customers ?? [], // defensive: allow both raw or { responseData }
    getCustomersRequestStatus: RequestStatus.OK,
  });
};

export const getCustomerById = (
  state = INITIAL_STATE,
  action = { insurerId },
) => {
  return state.merge({
    getCustomerByIdRequestStatus: RequestStatus.INPROGRESS,
  });
};

export const setCustomerByIdRequestStatus = (state, { status }) =>
  state.merge({ getCustomerByIdRequestStatus: status });

export const storeCustomerById = (state, { customer }) => {
  return state.merge({
    customerById: customer?.responseData ?? customer ?? [],
    getCustomerByIdRequestStatus: RequestStatus.OK,
  });
};

export const createCustomer = (state, { customerData }) => {
  return state.merge({ createCustomerRequestStatus: RequestStatus.INPROGRESS })
}

export const setCreateCustomerRequestStatus = (state,{ status }) =>
  state.merge({ createCustomerRequestStatus: status })

export const getCustomerFirstLevel = (state = INITIAL_STATE, action = {}) => {
  return state.merge({
    getCustomersFirstLevelRequestStatus: RequestStatus.INPROGRESS,
  });
};

export const setCustomerFirstLevelRequestStatus = (state, { status }) =>
  state.merge({ getCustomersFirstLevelRequestStatus: status });

export const storeCustomerFirstLevel = (state, { customers }) => {
  return state.merge({
    customersFirstLevel: customers?.responseData ?? customers ?? [], // defensive: allow both raw or { responseData }
    getCustomersFirstLevelRequestStatus: RequestStatus.OK,
  });
};
export const getCustomerSecondLevel = (state = INITIAL_STATE, action = { customerId }) => {
  return state.merge({
    getCustomersSecondLevelRequestStatus: RequestStatus.INPROGRESS,
  });
};

export const setCustomerSecondLevelRequestStatus = (state, { status }) =>
  state.merge({ getCustomersSecondLevelRequestStatus: status });

export const storeCustomerSecondLevel = (state, { customers }) => {
  return state.merge({
    customersSecondLevel: customers?.responseData ?? customers ?? [], // defensive: allow both raw or { responseData }
    getCustomersSecondLevelRequestStatus: RequestStatus.OK,
  });
};

export const getInsuredCustomer = (
  state = INITIAL_STATE,
  action = { customerId, selfId },
) => {
  return state.merge({
    getInsuredCustomerRequestStatus: RequestStatus.INPROGRESS,
  });
};

export const setInsuredCustomerRequestStatus = (state, { status }) =>
  state.merge({ getInsuredCustomerRequestStatus: status });

export const storeInsuredCustomer = (state, { insurer }) => {
  return state.merge({
    insuredCustomer: insurer?.responseData ?? insurer ?? [],
    getInsuredCustomerRequestStatus: RequestStatus.OK,
  });
};

export const createIGT = (state, { igtData }) => {
  return state.merge({ createIGTRequestStatus: RequestStatus.INPROGRESS })
}

export const setCreateIGTRequestStatus = (state,{ status }) =>
  state.merge({ createIGTRequestStatus: status })

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_CUSTOMERS_NAME]: getCustomersName,
  [Types.SET_CUSTOMERS_NAME_REQUEST_STATUS]: setCustomersNameRequestStatus,
  [Types.STORE_CUSTOMERS_NAME]: storeCustomersName,
  [Types.GET_CUSTOMER_FIELDS]: getCustomerFields,
  [Types.SET_CUSTOMER_FIELDS_REQUEST_STATUS]: setCustomerFieldsRequestStatus,
  [Types.STORE_CUSTOMER_FIELDS]: storeCustomerFields,
  [Types.GET_CUSTOMERS]: getCustomers,
  [Types.SET_CUSTOMERS_REQUEST_STATUS]: setCustomersRequestStatus,
  [Types.STORE_CUSTOMERS]: storeCustomers,
  [Types.GET_CUSTOMER_BY_ID]: getCustomerById,
  [Types.SET_CUSTOMER_BY_ID_REQUEST_STATUS]: setCustomerByIdRequestStatus,
  [Types.STORE_CUSTOMER_BY_ID]: storeCustomerById,
  [Types.CREATE_CUSTOMER]: createCustomer,
  [Types.SET_CREATE_CUSTOMER_REQUEST_STATUS]: setCreateCustomerRequestStatus,
  [Types.GET_CUSTOMER_FIRST_LEVEL]: getCustomerFirstLevel,
  [Types.SET_CUSTOMER_FIRST_LEVEL_REQUEST_STATUS]: setCustomerFirstLevelRequestStatus,
  [Types.STORE_CUSTOMER_FIRST_LEVEL]: storeCustomerFirstLevel,
  [Types.GET_CUSTOMER_SECOND_LEVEL]: getCustomerSecondLevel,
  [Types.SET_CUSTOMER_SECOND_LEVEL_REQUEST_STATUS]: setCustomerSecondLevelRequestStatus,
  [Types.STORE_CUSTOMER_SECOND_LEVEL]: storeCustomerSecondLevel,
  [Types.GET_INSURED_CUSTOMER]: getInsuredCustomer,
  [Types.SET_INSURED_CUSTOMER_REQUEST_STATUS]: setInsuredCustomerRequestStatus,
  [Types.STORE_INSURED_CUSTOMER]: storeInsuredCustomer,
  [Types.CREATE_IGT]: createIGT,
  [Types.SET_CREATE_IGT_REQUEST_STATUS]: setCreateIGTRequestStatus,
});
