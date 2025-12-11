import { all, put, call } from 'redux-saga/effects';

import * as CustomerAPI from '../API/CustomerAPI';
import CustomerActions from '../Redux/CustomerRedux';
import * as RequestStatus from '../Entities/RequestStatus';

export function* getCustomersName() {
  try {
    const response = yield call(CustomerAPI.getCustomersName)
    if (response?.err) {
      yield put(CustomerActions.setCustomersNameRequestStatus(RequestStatus.ERROR))
      return
    }
    const customers = response.data ?? response ?? []
    yield all([
      put(CustomerActions.setCustomersNameRequestStatus(RequestStatus.OK)),
      put(CustomerActions.storeCustomersName(customers))
    ])
  } catch (err) {
    console.error('getCustomersName saga error', err)
    yield put(CustomerActions.setCustomersNameRequestStatus(RequestStatus.ERROR))
  }
}

export function* getCustomerFields({ categoryId }) {
  try {
    const response = yield call(CustomerAPI.getCustomerFields, { categoryId });

    if (response?.err) {
      yield put(
        CustomerActions.setCustomerFieldsRequestStatus(RequestStatus.ERROR),
      );
      return;
    }
    const customerFields = response.data ?? response ?? [];
    yield all([
      put(CustomerActions.setCustomerFieldsRequestStatus(RequestStatus.OK)),
      put(CustomerActions.storeCustomerFields(customerFields)),
    ]);
  } catch (e) {
    console.log('updateLead saga error------>', e);
    yield put(
      CustomerActions.setCustomerFieldsRequestStatus(RequestStatus.ERROR),
    );
  }
}

export function* getCustomers() {
  try {
    const response = yield call(CustomerAPI.getCustomers)
    if (response?.err) {
      yield put(CustomerActions.setCustomersRequestStatus(RequestStatus.ERROR))
      return
    }
    const customers = response.data ?? response ?? []
    yield all([
      put(CustomerActions.setCustomersRequestStatus(RequestStatus.OK)),
      put(CustomerActions.storeCustomers(customers))
    ])
  } catch (err) {
    console.error('getCustomers saga error', err)
    yield put(CustomerActions.setCustomersRequestStatus(RequestStatus.ERROR))
  }
}

export function* getCustomerById({ insurerId }) {
  try {
    const response = yield call(CustomerAPI.getCustomerFields, { insurerId });

    if (response?.err) {
      yield put(
        CustomerActions.setCustomerByIdRequestStatus(RequestStatus.ERROR),
      );
      return;
    }
    const customer = response.data ?? response ?? [];
    yield all([
      put(CustomerActions.setCustomerByIdRequestStatus(RequestStatus.OK)),
      put(CustomerActions.storeCustomerById(customer)),
    ]);
  } catch (e) {
    yield put(
      CustomerActions.setCustomerByIdRequestStatus(RequestStatus.ERROR),
    );
  }
}

export function* createCustomer ({ customerData }) {
  try {
    const response = yield call(CustomerAPI.createCustomer,{ customerData })

if (response?.err) {
      yield put(CustomerActions.setCreateCustomerRequestStatus(RequestStatus.ERROR))
      return
    }
    yield all([
      put(CustomerActions.setCreateCustomerRequestStatus(RequestStatus.OK)),
    ])
  } catch (e) {
    yield put(CustomerActions.setCreateCustomerRequestStatus(RequestStatus.ERROR))
  }
}

export function* getCustomerFirstLevel() {
  try {
    const response = yield call(CustomerAPI.getCustomerFirstLevel)
    if (response?.err) {
      yield put(CustomerActions.setCustomerFirstLevelRequestStatus(RequestStatus.ERROR))
      return
    }
    const customers = response.data ?? response ?? []
    
    yield all([
      put(CustomerActions.setCustomerFirstLevelRequestStatus(RequestStatus.OK)),
      put(CustomerActions.storeCustomerFirstLevel(customers))
    ])
  } catch (err) {
    console.log({err})
    yield put(CustomerActions.setCustomerFirstLevelRequestStatus(RequestStatus.ERROR))
  }
}

export function* getCustomerSecondLevel({ customerId}) {
  try {
    const response = yield call(CustomerAPI.getCustomerSecondLevel,{customerId})
    if (response?.err) {
      yield put(CustomerActions.setCustomerSecondLevelRequestStatus(RequestStatus.ERROR))
      return
    }
    const customers = response.data ?? response ?? []
    yield all([
      put(CustomerActions.setCustomerSecondLevelRequestStatus(RequestStatus.OK)),
      put(CustomerActions.storeCustomerSecondLevel(customers))
    ])
  } catch (err) {
    console.error('getCustomerSecondLevel saga error', err)
    yield put(CustomerActions.setCustomerSecondLevelRequestStatus(RequestStatus.ERROR))
  }
}

export function* getInsuredCustomer({ customerId, selfId }) {
  try {
    const response = yield call(CustomerAPI.getInsuredCustomer, { customerId, selfId });
    if (response?.err) {
      yield put(
        CustomerActions.setInsuredCustomerRequestStatus(RequestStatus.ERROR),
      );
      return;
    }
    const insurer = response.data ?? response ?? [];
    yield all([
      put(CustomerActions.setInsuredCustomerRequestStatus(RequestStatus.OK)),
      put(CustomerActions.storeInsuredCustomer(insurer)),
    ]);
  } catch (e) {
    console.log('updateLead saga error------>', e);
    yield put(
      CustomerActions.setInsuredCustomerRequestStatus(RequestStatus.ERROR),
    );
  }
}

export function* createIGT ({ igtData }) {
  try {
    const response = yield call(CustomerAPI.createIGT,{ igtData })

if (response?.err) {
      yield put(CustomerActions.setCreateIGTRequestStatus(RequestStatus.ERROR))
      return
    }
    const igtResponse = response.data ?? response ?? []
    yield all([
      put(CustomerActions.setCreateIGTRequestStatus(RequestStatus.OK)),
    ])
  } catch (e) {
    console.error('createLead saga error', e)
    yield put(CustomerActions.setCreateIGTRequestStatus(RequestStatus.ERROR))
  }
}
