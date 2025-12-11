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

export const getPolicy = async () => {
    try {
      const response = await api.get(Endpoints.GET_POLICY);
  
      return response.data;
    } catch (error) {
      console.error('API Error:', error?.response?.data || error);
      throw error?.response?.data || error;
    }
  };