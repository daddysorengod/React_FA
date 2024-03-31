import axios from "axios";
import { handleAxiosErrorRequest } from "./axios";
const axiosSSR = axios.create({
  baseURL: process?.env?.ORIGIN_URL || "http://localhost:3000",
});
// Add a request interceptor
axiosSSR.interceptors.request.use(
  (config: any) => {
    if (config?.context?.req?.cookies?.token) {
      axiosSSR.defaults.headers.common.Authorization =
        "Bearer " + config?.context?.req?.cookies?.token;
    }
    const getCurrentLang = () => {
      switch (config?.context?.locale || config?.context?.ctx?.locale) {
        case "vn":
          return "VI";
        case "en":
          return "EN";
        default:
          return "EN";
      }
    };
    config.headers["X-CULTURE-CODE"] = getCurrentLang();
    config.headers["X-VIA"] = 2;
    config.headers["X-USER-AGENT"] = config?.context?.userAgent ?? "";
    // Do something before request is sent
    config.headers["X-LOCATION"] = "";
    config.headers["X-IP-ADDRESS"] = "";
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  },
);
// Add a response interceptor
axiosSSR.interceptors.response.use(
  response => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async (error: any) => {
    handleAxiosErrorRequest(error);
    // let response = error.response;
    return Promise.reject(error);
  },
);

export default axiosSSR;
