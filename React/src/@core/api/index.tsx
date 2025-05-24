/* eslint-disable no-constant-binary-expression */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { handleToast } from "@/utils/toast";
import type { AxiosResponse } from "axios";
import Axios from "axios";

import { ApiRoutes } from "../constants";

export const axios = Axios.create({
  baseURL: ApiRoutes.API_HOSTNAME,
  timeout: 1000000000,
  responseType: "json",
});

const endPoint = ["uploadmedia"];

axios.interceptors.request.use(
  async (config: any) => {
    config.headers = {
      Accept: "application/json , */*",
      "Content-Type": endPoint.includes(config.url)
        ? "multipart/form-data"
        : "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}` || "",
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
