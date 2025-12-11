import axios from 'axios';
import * as Endpoints from '../Entities/Endpoint';

const api = axios.create({
  baseURL: Endpoints.BASE_ENDPOINT,
  headers: {
    'Accept-Language': 'en-US',
    'Content-Type': 'application/json',
    Accept: 'application/json', // optional but good
  },
});

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
