import api from './apiClient';
import * as Endpoints from '../Entities/Endpoint';

export const getPolicy = async () => {
  try {
    const response = await api.get(Endpoints.GET_POLICY);

    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error);
    throw error?.response?.data || error;
  }
};