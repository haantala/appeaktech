/* eslint-disable @typescript-eslint/no-explicit-any */
// import { handleToast } from "@/utils/toast";
import type { AxiosResponse } from "axios";
import Axios from "axios";

import { ApiRoutes } from "../constants";

const getToken = () => {
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  }
  // If not in a browser environment, return null or handle accordingly
  return null;
};

export const axios = Axios.create({
  baseURL: ApiRoutes.API_HOSTNAME,
  timeout: 1000000000,
  responseType: "json",
});

const endPoint = ["uploadmedia"];

axios.interceptors.request.use(
  async (config: any) => {
    const token = getToken();
    config.headers = {
      Accept: "application/json , */*",
      "Content-Type": endPoint.includes(config.url)
        ? "multipart/form-data"
        : "application/json",
      Authorization: `Bearer ${token} || "{}"
      `,
    };

    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response: AxiosResponse) => response?.data,
  (error) => {
    if (error.response?.status === 403) {
      localStorage.clear();
      window.location.replace("/");
    }

    return Promise.reject(error);
  }
);

export default axios;
