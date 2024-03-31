import axios from "@/src/helpers/axios";
import { api } from "../constants";
import { TABLE_OPTIONS_INTERFACE } from "../types";
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

export const getTableConfigFromAPI = async (
  tableCode: string,
): Promise<TABLE_OPTIONS_INTERFACE | null> => {
  try {
    const res = await axios.get(
      `${publicRuntimeConfig.ORIGIN_URL}/form-builder-api/find-form-table-by-code?code=${tableCode}`,
    );
    const item = res.data.data;

    if (item?.jsonString) {
      const tableOptionConfig = JSON.parse(item?.jsonString);
      if (tableOptionConfig as TABLE_OPTIONS_INTERFACE) {
        return tableOptionConfig;
      }
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
