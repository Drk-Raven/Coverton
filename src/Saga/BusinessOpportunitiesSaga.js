import { all, put, call } from 'redux-saga/effects'

import * as BusinessOpportunitiesAPI from '../API/BusinessOpportunitiesAPI'
import BusinessOpportunitiesActions from '../Redux/BusinessOpportunitiesRedux'
import * as RequestStatus from '../Entities/RequestStatus'

export function* getProducts() {
  try {
    const response = yield call(BusinessOpportunitiesAPI.getProducts)
    if (response?.err) {
      yield put(BusinessOpportunitiesActions.setProductsRequestStatus(RequestStatus.ERROR))
      return
    }
    const products = response.data ?? response ?? []
    yield all([
      put(BusinessOpportunitiesActions.setProductsRequestStatus(RequestStatus.OK)),
      put(BusinessOpportunitiesActions.storeProducts(products))
    ])
  } catch (e) {
    console.error('getProducts saga error', e)
    yield put(BusinessOpportunitiesActions.setProductsRequestStatus(RequestStatus.ERROR))
  }
}

export function* getCategories () {
  try {
    const response = yield call(BusinessOpportunitiesAPI.getCaterogies)
    if (response?.err) {
      yield put(BusinessOpportunitiesActions.setCategoriesRequestStatus(RequestStatus.ERROR))
      return
    }
    const categories = response.data ?? response ?? []
    yield all([
      put(BusinessOpportunitiesActions.setCategoriesRequestStatus(RequestStatus.OK)),
      put(BusinessOpportunitiesActions.storeCategories(categories))
    ])
  } catch (e) {
    console.error('getCategories saga error', e)
    yield put(BusinessOpportunitiesActions.setCategoriesRequestStatus(RequestStatus.ERROR))
  }
}

export function* getLeads () {
  try {
    const response = yield call(BusinessOpportunitiesAPI.getLeads)
    if (response?.err) {
      yield put(BusinessOpportunitiesActions.setLeadsRequestStatus(RequestStatus.ERROR))
      return
    }
    const leads = response.data ?? response ?? []
    yield all([
      put(BusinessOpportunitiesActions.setLeadsRequestStatus(RequestStatus.OK)),
      put(BusinessOpportunitiesActions.storeLeads(leads))
    ])
  } catch (e) {
    console.error('getLeads saga error', e)
    yield put(BusinessOpportunitiesActions.setLeadsRequestStatus(RequestStatus.ERROR))
  }
}

export function* createLead ({ leadData }) {
  try {
    const response = yield call(BusinessOpportunitiesAPI.createLead,{ leadData })
if (response?.err) {
      yield put(BusinessOpportunitiesActions.setCreateLeadRequestStatus(RequestStatus.ERROR))
      return
    }
    const leads = response.data ?? response ?? []
    yield all([
      put(BusinessOpportunitiesActions.setCreateLeadRequestStatus(RequestStatus.OK)),
    ])
  } catch (e) {
    console.error('createLead saga error', e)
    yield put(BusinessOpportunitiesActions.setCreateLeadRequestStatus(RequestStatus.ERROR))
  }
}

export function* updateLead ({ leadData, prospectId }) {
  try {
    const response = yield call(BusinessOpportunitiesAPI.updateLead,{ leadData, prospectId })
if (response?.err) {
      yield put(BusinessOpportunitiesActions.setUpdateLeadRequestStatus(RequestStatus.ERROR))
      return
    }
    const leads = response.data ?? response ?? []
    yield all([
      put(BusinessOpportunitiesActions.setUpdateLeadRequestStatus(RequestStatus.OK)),
    ])
  } catch (e) {
    console.error('updateLead saga error', e)
    yield put(BusinessOpportunitiesActions.setUpdateLeadRequestStatus(RequestStatus.ERROR))
  }
}
