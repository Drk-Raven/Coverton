import { all, put, call } from 'redux-saga/effects';

import * as QuotationAPI from '../API/QuotationAPI';
import QuotationActions from '../Redux/QuotationRedux';
import * as RequestStatus from '../Entities/RequestStatus';

export function* createQuotation({ quotationData }) {
  console.log({ quotationData });
  try {
    const response = yield call(QuotationAPI.createQuotation, {
      quotationData,
    });

    if (response?.err) {
      yield put(
        QuotationActions.setQuotationRequestStatus(RequestStatus.ERROR),
      );
      return;
    }
    yield all([
      put(QuotationActions.setQuotationRequestStatus(RequestStatus.OK)),
    ]);
  } catch (e) {
    yield put(QuotationActions.setQuotationRequestStatus(RequestStatus.ERROR));
  }
}

export function* getQuotations() {
  try {
    const response = yield call(QuotationAPI.getQuotation);
    if (response?.err) {
      yield put(
        QuotationActions.setQuotationsRequestStatus(RequestStatus.ERROR),
      );
      return;
    }
    const quotations = response.data ?? response ?? [];
    yield all([
      put(QuotationActions.setQuotationsRequestStatus(RequestStatus.OK)),
      put(QuotationActions.storeQuotations(quotations)),
    ]);
  } catch (err) {
    console.error('getCustomersName saga error', err);
    yield put(QuotationActions.setQuotationsRequestStatus(RequestStatus.ERROR));
  }
}

export function* getQuotationById({ quotationId }) {
  try {
    const response = yield call(QuotationAPI.getQuotationById, { quotationId });

    if (response?.err) {
      yield put(
        QuotationActions.setQuotationByIdRequestStatus(RequestStatus.ERROR),
      );
      return;
    }
    const quotation = response.data ?? response ?? [];
    yield all([
      put(QuotationActions.setQuotationByIdRequestStatus(RequestStatus.OK)),
      put(QuotationActions.storeQuotationById(quotation)),
    ]);
  } catch (e) {
    yield put(
      QuotationActions.setQuotationByIdRequestStatus(RequestStatus.ERROR),
    );
  }
}
