import { all, takeLatest } from 'redux-saga/effects';

import { BusinessOpportunitiesTypes as BOTypes } from '../Redux/BusinessOpportunitiesRedux';
import { CustomerTypes } from '../Redux/CustomerRedux';
import { QuotationTypes } from '../Redux/QuotationRedux';
import { PolicyTypes } from '../Redux/PolicyRedux';

import {
  getProducts,
  getCategories,
  getLeads,
  createLead,
  updateLead,
} from './BusinessOpportunitiesSaga';
import {
  getCustomersName,
  getCustomerFields,
  getCustomers,
  getCustomerById,
  getCustomerFirstLevel,
  getCustomerSecondLevel,
  getInsuredCustomer,
  createCustomer,
  createIGT,
} from './CustomerSaga';
import {
  createQuotation,
  getQuotations,
  getQuotationById
} from './QuotationSaga';
import {
  getPolicy
} from './PolicySaga'

export default function* root() {
  yield all([
    takeLatest(BOTypes.GET_PRODUCTS, getProducts),
    takeLatest(BOTypes.GET_CATEGORIES, getCategories),
    takeLatest(BOTypes.GET_LEADS, getLeads),
    takeLatest(BOTypes.CREATE_LEAD, createLead),
    takeLatest(BOTypes.UPDATE_LEAD, updateLead),

    takeLatest(CustomerTypes.GET_CUSTOMERS_NAME, getCustomersName),
    takeLatest(CustomerTypes.GET_CUSTOMER_FIELDS, getCustomerFields),
    takeLatest(CustomerTypes.GET_CUSTOMERS, getCustomers),
    takeLatest(CustomerTypes.GET_CUSTOMER_BY_ID, getCustomerById),
    takeLatest(CustomerTypes.GET_CUSTOMER_FIRST_LEVEL, getCustomerFirstLevel),
    takeLatest(CustomerTypes.GET_CUSTOMER_SECOND_LEVEL, getCustomerSecondLevel),
    takeLatest(CustomerTypes.GET_INSURED_CUSTOMER, getInsuredCustomer),
    takeLatest(CustomerTypes.CREATE_CUSTOMER, createCustomer),
    takeLatest(CustomerTypes.CREATE_IGT, createIGT),

    takeLatest(QuotationTypes.CREATE_QUOTATION, createQuotation),
    takeLatest(QuotationTypes.GET_QUOTATIONS, getQuotations),
    takeLatest(QuotationTypes.GET_QUOTATION_BY_ID, getQuotationById),

    takeLatest(PolicyTypes.GET_POLICY, getPolicy),

  ]);
}
