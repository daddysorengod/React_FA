//all-code-api/find-by-cd-type
import axios from "./axios";
import getConfig from 'next/config'
import { getQueryStringByFetchDataConfig } from "./getListDataBase";
const { publicRuntimeConfig } = getConfig()

export const getAllCode = async (
  cdName: string,
  cdType: string
): Promise<any> => {
    const url = getQueryStringByFetchDataConfig({
        url: "all-code-api/find-by-cd-type",
        params: [
          {
            paramKey: "cdName",
            paramValue: cdName,
          },
          {
            paramKey: "cdType",
            paramValue: cdType,
          }
        ],
      });
    
      const res = await axios.get(`${publicRuntimeConfig.ORIGIN_URL}/${url}`);
      return res?.data?.data || null;
};
