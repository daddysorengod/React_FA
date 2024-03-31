import { SEARCH_CONDITIONS, api } from "../constants";
import { FETCH_DATA_API_CONFIG_INTERFACE } from "../types";
import axios from "./axios";
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

export const getListDataBase = async (
  config: FETCH_DATA_API_CONFIG_INTERFACE,
): Promise<{
  source: any[];
  totalRecords: number;
  pages: number;
}> => {
  try {
    if (!config.url) {
      return {
        source: [],
        totalRecords: 0,
        pages: 0,
      };
    }
    const queryString = getQueryStringByFetchDataConfig(config);
    const res = await axios.get(
      `${publicRuntimeConfig.ORIGIN_URL}/${queryString}`,
    );
    if (res?.data?.data?.source && Array.isArray(res?.data?.data?.source)) {
      return res.data.data;
    } else
      return {
        source: [],
        totalRecords: 0,
        pages: 0,
      };
  } catch (error) {
    console.log("error", error);
    return {
      source: [],
      totalRecords: 0,
      pages: 0,
    };
  }
};

export const getQueryStringByFetchDataConfig = (
  config: FETCH_DATA_API_CONFIG_INTERFACE,
): string => {  
  if (!config.url) {
    return "";
  }
  let paramsStr = "";
  if (config.params) {
    config.params.forEach(item => {
      if (checkNotEmpty(item.paramKey) && checkNotEmpty(item.paramValue)) {
        paramsStr += `${item.paramKey}=${item.paramValue}&`;
      }
    });
  }
  let searchTermsStr = "";
  if (config.searchTerms) {
    let count = 0;
    config.searchTerms.forEach(item => {
      if (checkNotEmpty(item.fieldName) && checkNotEmpty(item.fieldValue)) {
        searchTermsStr += `searchTerms[${count}].fieldName=${
          item.fieldName
        }&searchTerms[${count}].fieldValue=${
          item.fieldValue
        }&searchTerms[${count}].condition=${
          item.condition || SEARCH_CONDITIONS.EQUAL
        }&`;
        count++;
      }
    });
  }
  let exportedColumnsStr = "";
  if (config.exportedColumns) {
    config.exportedColumns.forEach(item => {
      exportedColumnsStr += `columns=${item}&`;
    });
  }

  const res = `${config.url}${
    config.url.includes("?") ? "&" : "?"
  }${paramsStr}${searchTermsStr}${exportedColumnsStr.slice(
    0,
    exportedColumnsStr.length - 1,
  )}`;

  return res;
};

const checkNotEmpty = (value: any): boolean => {
  return typeof value === "string" && value.length === 0 ? false : true;
};
