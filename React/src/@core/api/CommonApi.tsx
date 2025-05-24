/* eslint-disable @typescript-eslint/no-explicit-any */

import Request from ".";
import { ApiRoutes } from "../constants";

// Define a type for the data parameter
interface ApiResponse {
  status: number;
  message: string;
  data?: any;
  description: string; // Adjust type based on your actual API response
}

// Authentication;
export const RegistrationApi = async (data: any): Promise<ApiResponse> => {
  console.log(data);
  const res: any = await Request.post(ApiRoutes.REGISTRATION, data);
  return res;
};

export const LoginApi = async (data: any): Promise<ApiResponse> => {
  const res: any = await Request.post(ApiRoutes.LOGIN, data);
  return res;
};

export const uploadMediaApi = async (data: any): Promise<ApiResponse> => {
  const res: any = await Request.post(ApiRoutes.UPLOADMEDIA, data);
  return res;
};

export const fetchActiveMediaApi = async (): Promise<ApiResponse> => {
  const res: any = await Request.get(ApiRoutes.ACTIVEMEDIA);
  return res;
};

export const fetchExpiredMediaApi = async (): Promise<ApiResponse> => {
  const res: any = await Request.get(ApiRoutes.EXPIREDMEDIA);
  return res;
};

export const fetchExpiredMediaApibyID = async (
  media_id: string
): Promise<ApiResponse> => {
  const res: any = await Request.get(`${ApiRoutes.GETMEDIABYID}/${media_id}`);
  return res;
};

export const deleteMediaApi = async (
  media_id: number | string
): Promise<ApiResponse> => {
  const res: any = await Request.delete(`${ApiRoutes.DELETEMEDIA}/${media_id}`);
  return res;
};
