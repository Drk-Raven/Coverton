import Immutable from 'seamless-immutable'
import { createReducer, createActions } from 'reduxsauce'
import * as RequestStatus from '../Entities/RequestStatus'

export const INITIAL_STATE = Immutable({
  getProductsRequestStatus: RequestStatus.INITIAL,
  products: [],
  getCategoriesRequestStatus: RequestStatus.INITIAL,
  categories: [],
  getLeadsRequestStatus: RequestStatus.INITIAL,
  leads: [],
  createLeadRequestStatus: RequestStatus.INITIAL,
  updateLeadRequestStatus: RequestStatus.INITIAL,
})

const { Types, Creators } = createActions({
  getProducts: [],
  setProductsRequestStatus: ['status'],
  storeProducts: ['products'],
  getCategories: [],
  setCategoriesRequestStatus: ['status'],
  storeCategories: ['categories'],
  getLeads: [],
  setLeadsRequestStatus: ['status'],
  storeLeads: ['leads'],
  createLead: [ 'leadData' ],
  setCreateLeadRequestStatus: ['status'],
  updateLead: [ 'leadData', 'prospectId' ],
  setUpdateLeadRequestStatus: ['status'],
})

export const BusinessOpportunitiesTypes = Types
export const BusinessOpportunitiesActions = Creators

export default Creators

export const getProducts = (state = INITIAL_STATE, action = {}) => {
  return state.merge({
    getProductsRequestStatus: RequestStatus.INPROGRESS,
  })
}

export const setProductsRequestStatus = (state, { status }) =>
  state.merge({ getProductsRequestStatus: status })

export const storeProducts = (state, { products }) => {
  console.log('Redux State------->',products )
  return state.merge({
    products: products?.responseData ?? products ?? [], // defensive: allow both raw or { responseData }
    getProductsRequestStatus: RequestStatus.SUCCESS,
  })
}

export const getCategories = (state = INITIAL_STATE, action = {}) => {
  return state.merge({
    getCategoriesRequestStatus: RequestStatus.INPROGRESS,
  })
}

export const setCategoriesRequestStatus = (state, { status }) =>
  state.merge({ getCategoriesRequestStatus: status })

export const storeCategories = (state, { categories }) => {
  return state.merge({
    categories: categories?.responseData ?? categories ?? [],
    getCategoriesRequestStatus: RequestStatus.SUCCESS,
  })
}

export const getLeads = (state = INITIAL_STATE, action = {}) => {
  return state.merge({
    getLeadsRequestStatus: RequestStatus.INPROGRESS,
  })
}

export const setLeadsRequestStatus = (state, { status }) =>
  state.merge({ getLeadsRequestStatus: status })

export const storeLeads = (state, { leads }) => {
  return state.merge({
    leads: leads?.responseData ?? leads ?? [], // defensive: allow both raw or { responseData }
    getLeadsRequestStatus: RequestStatus.SUCCESS,
  })
}

export const createLead = (state, { leadData }) => {
  return state.merge({ createLeadRequestStatus: RequestStatus.INPROGRESS })
}

export const setCreateLeadRequestStatus = (state,{ status }) =>
  state.merge({ createLeadRequestStatus: status })

export const updateLead = (state, { leadData, prospectId }) => {
  return state.merge({ updateLeadRequestStatus: RequestStatus.INPROGRESS })
}

export const setUpdateLeadRequestStatus = (state,{ status }) =>
  state.merge({ updateLeadRequestStatus: status })

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_PRODUCTS]: getProducts,
  [Types.STORE_PRODUCTS]: storeProducts,
  [Types.SET_PRODUCTS_REQUEST_STATUS]: setProductsRequestStatus,
  [Types.GET_CATEGORIES]: getCategories,
  [Types.STORE_CATEGORIES]: storeCategories,
  [Types.SET_CATEGORIES_REQUEST_STATUS]: setCategoriesRequestStatus,
  [Types.GET_LEADS]: getLeads,
  [Types.SET_LEADS_REQUEST_STATUS]: setLeadsRequestStatus,
  [Types.STORE_LEADS]: storeLeads,
  [Types.CREATE_LEAD]: createLead,
  [Types.SET_CREATE_LEAD_REQUEST_STATUS]: setCreateLeadRequestStatus,
  [Types.UPDATE_LEAD]: updateLead,
  [Types.SET_UPDATE_LEAD_REQUEST_STATUS]: setUpdateLeadRequestStatus,
})
