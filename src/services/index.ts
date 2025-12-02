import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import { type AuthenticatedUserType } from '../contexts/AuthenticatedUserContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const setAuthHeader = (userContext: AuthenticatedUserType | null): void => {
  
    if (userContext?.token) {
    axios.defaults.headers.common['Authorization'] = userContext.token;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

};

export const request = async (
  method: AxiosRequestConfig['method'],
  url: string,
  userContext: AuthenticatedUserType | null,
  data?: any,
  options?: { params: { [key: string]: any } } | null,
  onUploadProgress?:any,
  baseUrl = API_BASE_URL,
  headers?: { [key: string]: string }
): Promise<any> => {


  setAuthHeader(userContext);

  try {
    const response = await axios({
      method,
      baseURL: baseUrl,
      url,
      data,
      ...(options ? options : {}),
      onUploadProgress,
      headers
    });
    return response;
  } catch (error) {
    return (error as AxiosError)?.response ?? null;
  }

}
