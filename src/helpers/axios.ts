import Axios from "axios";
import { dispatch, store } from "@app/store";
import Cookies from "js-cookie";
import getT from "next-translate/getT";
import { getIpAndLocation } from "@app/helpers";
import { logout, logoutEffect } from "../store/reducers/auth";
import { showExpiredSnackBar } from "../store/reducers/snackbar";

const axios = Axios.create();
setCommonAuthorizationToken();
axios.interceptors.request.use(
  async (config: any) => {
    config.headers["X-CULTURE-CODE"] = "VI";
    config.headers["X-VIA"] = 2;
    config.headers["X-USER-AGENT"] = navigator.userAgent;
    // const ipLocation = await getIpAndLocation();
    // config.headers[
    //   "X-LOCATION"
    // ] = `${ipLocation?.city} ${ipLocation?.country_name}`;
    // config.headers["X-IP-ADDRESS"] = ipLocation?.IPv4;
    // Do something before request is sent
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  },
);
// Add a response interceptor
axios.interceptors.response.use(
  response => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async (error: any) => {
    handleAxiosErrorRequest(error);
    const errorMessage = error?.response?.data?.message;
    if (errorMessage) {
      return Promise.reject(errorMessage);
    }
    // console.log("error response",error,error?.response)
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  },
);

export default axios;

export async function setCommonAuthorizationToken() {
  const userToken = await Cookies.get("token");
  if (userToken) {
    axios.defaults.headers.common.Authorization = "Bearer " + userToken;
  }
}

export async function handleAxiosErrorRequest(error: any) {
  // const t = await getT("vn", "common");
  // Find request error
  if (error?.response?.status) {
    switch (error?.response?.status) {
      case 401: {
        removeCommonAuthorizationToken();
        window.location.href = `/login`;
        //  dispatch(logoutEffect());
        //  dispatch(showExpiredSnackBar(""))
        break;
      }
      case 502:
        console.log(502, error?.response?.status);
        break;

      default: {
      }
    }
  } else {
  }

  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
}

export async function removeCommonAuthorizationToken() {
  delete axios.defaults.headers.common.Authorization;
  /// clear profile
  /// clear token
  await Cookies.remove("token");
}
