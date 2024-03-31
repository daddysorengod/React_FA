import { api } from "../constants";
import { FETCH_DATA_API_CONFIG_INTERFACE } from "../types";
import axios from "./axios";
import { getQueryStringByFetchDataConfig } from "./getListDataBase";
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

export const getAccountingEntryDetails = async (
  config: FETCH_DATA_API_CONFIG_INTERFACE,
) => {
  try {
    if (!config.url) return false;
    const queryString = getQueryStringByFetchDataConfig(config);
    const res = await axios.get(
      `${publicRuntimeConfig.ORIGIN_URL}/${queryString}`,
    );
    if (res?.data && res.data.data) {
      return res.data.data;
    }
    return false;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};
