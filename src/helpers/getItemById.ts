import axios from "./axios";
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

export const getItemById = async (
  id: string,
  url: string,
  idName?: string,
): Promise<any> => {
  try {
    if (!id) return false;

    const res = await axios.get(
      `${publicRuntimeConfig.ORIGIN_URL}/${url}?${idName || "id"}=${id}`,
    );
    if (res?.data?.data) {
      return res.data.data;
    } else return false;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};
