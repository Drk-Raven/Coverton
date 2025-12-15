import api from './apiClient';
import * as Endpoints from '../Entities/Endpoint';

export const getCustomersName = async () => {
  try {
    const response = await api.get(Endpoints.GET_CUSTOMERS_NAME);
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || error;
  }
};

export const getCustomerFields = async ({ categoryId }) => {
  try {
    const response = await api.get(Endpoints.GET_CUSTOMER_FIELDS, {
      params: { id: categoryId },
    });

    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error);
    throw error?.response?.data || error;
  }
};

export const getCustomers = async () => {
  try {
    const response = await api.get(Endpoints.GET_CUSTOMERS);
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || error;
  }
};

export const getCustomerById = async ({ insurerId }) => {
  try {
    const response = await api.get(Endpoints.GET_CUSTOMER_BY_ID, {
      params: { id: insurerId },
    });

    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error);
    throw error?.response?.data || error;
  }
};

export const createCustomer = async ({ customerData }) => {
  try {
    const response = await api.post(Endpoints.CREATE_CUSTOMER, customerData);

    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error);
    throw error?.response?.data || error;
  }
};

export const getCustomerFirstLevel = async () => {
  try {
    const response = await api.get(Endpoints.GET_CUSTOMER_FIRST_LEVEL);
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || error;
  }
};

export const getCustomerSecondLevel = async ({ customerId }) => {
  try {
    const response = await api.get(Endpoints.GET_CUSTOMER_SECOND_LEVEL, {
      params: { id: customerId },
    });

    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || error;
  }
};

export const getInsuredCustomer = async ({ customerId, selfId }) => {
  try {
    const response = await api.get(Endpoints.GET_INSURED_CUSTOMER, {
      params: { customerid: customerId, selfid: selfId },
    });

    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error);
    throw error?.response?.data || error;
  }
};

export const createIGT = async ({ igtData }) => {
  try {
    const response = await api.post(Endpoints.CREATE_IGT, igtData);

    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error);
    throw error?.response?.data || error;
  }
};