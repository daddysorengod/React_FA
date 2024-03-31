import { api } from "../constants";
import axios from "./axios";
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

export const getHeaderExcelFile = async (
  url: string,
  excelFile: File,
): Promise<string[]> => {
  try {
    const formData = new FormData();
    formData.append("fileUpload", excelFile);

    const res = await axios.post(
      `${publicRuntimeConfig.ORIGIN_URL}/${url}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const arrStr = res?.data?.data;
    if (arrStr && Array.isArray(arrStr)) {
      return arrStr;
    } else return [];
  } catch (error) {
    console.log("error", error);
    return [];
  }
};

export const getMappedFieldsData = async (
  url: string,
): Promise<
  {
    entityField: string;
    description: string;
    isRequired: boolean;
  }[]
> => {
  try {
    const res = await axios.get(`${publicRuntimeConfig.ORIGIN_URL}/${url}`);

    const arrStr = res?.data?.data;
    if (arrStr && Array.isArray(arrStr)) {
      return arrStr;
    } else return [];
  } catch (error) {
    console.log("error", error);
    return [];
  }
};

export const getDataReadFromExcelFile = async (
  url: string,
  excelFile: File,
  fieldMappings: {
    [key: string]: string;
  },
  parentId?: string,
  parentIdName?: string,
): Promise<any[]> => {
  try {
    if (!url || !excelFile || !fieldMappings) {
      return [];
    }
    const formData = new FormData();
    formData.append("fileUpload", excelFile);
    if (!!parentId && !!parentIdName) {
      formData.append(parentIdName || "id", parentId);
    }

    let count = 0;
    Object.keys(fieldMappings).forEach(key => {
      formData.append(
        `fieldMappings[${count}].excelColumn`,
        fieldMappings[key],
      );
      formData.append(`fieldMappings[${count}].entityColumn`, key);
      count++;
    });

    const res = await axios.post(
      `${publicRuntimeConfig.ORIGIN_URL}/${url}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const arr = res?.data?.data;
    if (arr && Array.isArray(arr)) {
      return arr;
    } else return [];
  } catch (error) {
    console.log("error", error);
    return [];
  }
};

export const addManyRecordsImportFromExcel = async (
  url: string,
  data: any,
  parentId?: string,
  parentIdName?: string,
): Promise<any> => {
  try {
    const res = await axios.post(
      `${publicRuntimeConfig.ORIGIN_URL}/${url}${
        !!parentId && !!parentIdName ? `?${parentIdName}=${parentId}` : ``
      }`,
      data,
    );
    return res;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};

export const downloadExcelFileTemplate = async (url: string) => {
  const fileUrl = `/excel/${url}`;
  try {
    const response = await fetch(fileUrl, { method: "HEAD" });
    if (response.ok) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log("File Not Found!");
    }
  } catch (error) {
    console.log("File Not Found!", error);
  }
};
