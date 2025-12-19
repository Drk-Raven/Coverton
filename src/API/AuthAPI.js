import axios from 'axios';
import * as Endpoints from '../Entities/Endpoint';

const api = axios.create({
  baseURL: Endpoints.BASE_ENDPOINT,
  headers: {
    'Accept-Language': 'en-US',
    'Content-Type': 'application/json',
    'Accept': 'application/json', // optional but good
  },
});


export const sendOTP = async ({ emailId }) => {
  console.log('sendOTP ->', emailId);
  try {
    const response = await api.post(
      Endpoints.SEND_OTP,
      {},
      { params: { email: emailId } }
    );

    console.log({apiRe: response})

    return response.data;
  } catch (error) {
    console.error('sendOTP API Error:', error?.response?.data || error);
    throw error?.response?.data || error;
  }
};

export const verifyOTP = async ({ emailId, otp }) => {
  console.log('verifyOTP ->', emailId, otp);

  try {
    const response = await api.post(
      Endpoints.VERIFY_OTP,
      {},
      {
        params: {
          email: emailId,
          otp: otp,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('verifyOTP API Error:', error?.response?.data || error);
    throw error?.response?.data || error;
  }
};