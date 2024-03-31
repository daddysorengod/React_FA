//all-code-api/find-by-cd-type
import axios from "./axios";
import getConfig from "next/config";
import { getQueryStringByFetchDataConfig } from "./getListDataBase";
const { publicRuntimeConfig } = getConfig();

export const getListPrivileges = async (pPageIndex: number, pPageSize: number): Promise<any> => {
  const url = getQueryStringByFetchDataConfig({
    url: `group-privileges-api/group-roles-select-options/?pageIndex=${pPageIndex}&pageSize=${pPageSize}`,
    params: [],
  });

  const res = await axios.get(`${publicRuntimeConfig.ORIGIN_URL}/${url}`);
  return res?.data?.data || null;
};
