export const BASE = 'api/'
// export const BASE_ENDPOINT = 'https://cibs.coverton.in/'
export const BASE_ENDPOINT = 'https://cibs-dev.coverton.in'
// export const BASE_ENDPOINT = 'http://10.0.2.2:5030/'


// Business Opportunities Endpoints
export const GET_PRODUCT = BASE + 'BOI/Products'
export const GET_CATEGORY = BASE + 'BOI/Category'
export const GET_LEAD = BASE + 'BOI'
export const GET_CUSTOMERS_NAME = BASE + 'BOI/Customers'
export const CREATE_LEAD = BASE + 'BOI'
export const UPDATE_LEAD = BASE + 'BOI'

// Customers Endpoints
export const GET_CUSTOMER_FIELDS = BASE + 'Customer/Fields'
export const GET_CUSTOMERS = BASE + 'Customer'
export const GET_CUSTOMER_BY_ID = BASE + 'Customer/GetById'
export const CREATE_CUSTOMER = BASE + 'Customer'
export const GET_CUSTOMER_FIRST_LEVEL = BASE + 'Customer/CustomerFirstLevel'
export const GET_CUSTOMER_SECOND_LEVEL = BASE + 'Customer/CustomerSecondLevel'
export const GET_INSURED_CUSTOMER = BASE + 'Customer/Insured-dropdown-by-customerid'
export const CREATE_IGT = BASE + 'IGT'

// Authentication Endpoints
export const SEND_OTP = BASE + 'Login/Send-OTP'
export const VERIFY_OTP = BASE + 'Login/Verify-OTP'

// Quotation Endpoints
export const CREATE_QUOTATION = BASE + 'Quotation'
export const GET_QUOTATION = BASE + 'Quotation/get-quotation'
export const GET_QUOTATION_BY_ID = BASE + 'Quotation/view-quotation'

// Policy Endpoints
export const GET_POLICY = BASE + 'Policy/Dashboard'