import api from './apiClient';
import * as Endpoints from '../Entities/Endpoint';

export const createQuotation = async ({ quotationData }) => {
  try {
    const response = await api.post(Endpoints.CREATE_QUOTATION, quotationData);

    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error);
    throw error?.response?.data || error;
  }
};

export const getQuotation = async () => {
  try {
    const response = await api.get(Endpoints.GET_QUOTATION);

    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error);
    throw error?.response?.data || error;
  }
};

export const getQuotationById = async ({ quotationId }) => {
  try {
    const response = await api.get(Endpoints.GET_QUOTATION_BY_ID, {
      params: { quotationid: quotationId },
    });

    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || error;
  }
};
