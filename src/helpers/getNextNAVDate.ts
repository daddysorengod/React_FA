import axios from "./axios";
import { getQueryStringByFetchDataConfig } from "./getListDataBase";
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

export const getNextNAVDate = async (
  fundId: string,
  contractStartDate: string,
  contractEndDate: string,
): Promise<string | null> => {
  if (!fundId || !contractStartDate || !contractEndDate) {
    return null;
  }

  const url = getQueryStringByFetchDataConfig({
    url: "fund-nav-config-api/next-nav-date",
    params: [
      {
        paramKey: "fundId",
        paramValue: fundId,
      },
      {
        paramKey: "contractStartDate",
        paramValue: contractStartDate,
      },
      {
        paramKey: "contractEndDate",
        paramValue: contractEndDate,
      },
    ],
  });

  const res = await axios.get(`${publicRuntimeConfig.ORIGIN_URL}/${url}`);
  return res?.data?.data || null;
};
