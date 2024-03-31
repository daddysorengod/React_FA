// third-party
import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
// project imports
import { dispatch } from "../store";
import axios from "@/src/helpers/axios";
import { api, list_api_need_global_fund_id } from "@/src/constants/api";
import { showErrorSnackBar, showSuccessSnackBar } from "./snackbar";
import { GeneralProps } from "@/src/types/general";
import { FormBuilder, IForm } from "@/src/types/field";
import { FETCH_DATA_API_CONFIG_INTERFACE } from "@/src/types";
import { getQueryStringByFetchDataConfig } from "@/src/helpers";
import { getQueryURL, getSearchTermInArray } from "@/src/helpers/getQueryURL";
import { setAllCodeConfig } from "./allCodeConfig";
import getConfig from "next/config";
import moment from "moment";
import { evaluateExpression } from "@/src/helpers/handleAccounting";
const { publicRuntimeConfig } = getConfig();

const initialState: GeneralProps = {
  currentFormSetting: [],
  currentFormData: {},
  currentIdRecord: "",
  listForms: [],
  autoFill: {},
  globalFundId: "",
  globalRecentNavDate: "",
  globalFundData: {},
  systemSetting: {},
  detailContract: {},
};

const general = createSlice({
  name: "general",
  initialState,
  reducers: {
    setFormBuilderSetting(state, action) {
      if (!action.payload) {
        state.currentFormSetting = [{ ...new FormBuilder() }];
      }
      state.currentFormSetting = action.payload;
    },
    setFormData(state, action) {
      if (!action.payload) {
        state.currentFormData = state.currentFormSetting[0];
        return;
      }
      state.currentFormData = action.payload;
      state.currentFormSetting[0] = action.payload;
    },
    setListForm(state, action) {
      if (
        action?.payload &&
        Array.isArray(action?.payload) &&
        action?.payload?.length
      ) {
        state.listForms = [
          ...state.listForms,

          ...action?.payload.filter(
            item => !state.listForms.map(item => item.code).includes(item.code),
          ),
        ];
        return;
      }
    },
    setAutoFillValue(state, action) {
      if (
        typeof action?.payload !== "object" ||
        Object.keys(action?.payload).length < 1
      ) {
        return;
      }
      try {
        const key = Object.keys(action?.payload)[0];
        if (state.autoFill[key]) {
          state.autoFill = { ...state.autoFill, [key]: action?.payload[key] };
        } else {
          state.autoFill = { ...state.autoFill, ...action?.payload };
        }
      } catch (err) {}
    },
    setGlobalFundId(state, action) {
      if (typeof action.payload === "string") {
        state.globalFundId = action.payload;
      }
    },
    setGlobalRecentNavDate(state, action) {
      state.globalRecentNavDate = action.payload;
    },
    setGlobalFundData(state, action) {
      state.globalFundData = action.payload;
    },
    setDetailContract(state, action) {
      state.detailContract = {
        ...state.detailContract,
        ...action.payload,
      };
    },
    clearDetailContract(state) {
      state.detailContract = {};
    },
    setDetailContractUpdateSeparateKey(state, action) {
      if (!action?.payload?.key || typeof action?.payload?.value !== "number") {
        return;
      }

      state.detailContract = {
        ...state.detailContract,
        [action.payload.key]: action.payload.value,
        ["editing"]: action?.payload?.editing ? 1 : 0,
      };
    },
    setSystemConfig(state, actions) {
      state.systemSetting = { ...state.systemSetting, ...actions.payload };
    },
  },
});

export default general.reducer;

export const {
  setListForm,
  setFormData,
  setFormBuilderSetting,
  setAutoFillValue,
  setGlobalFundId,
  setGlobalRecentNavDate,
  setDetailContract,
  setDetailContractUpdateSeparateKey,
  clearDetailContract,
} = general.actions;

export function getFormDataReducer(params) {
  return async (dispatch, getState) => {
    try {
      if (!params.url) return;
      const { data } = await axios.get(
        `${publicRuntimeConfig.ORIGIN_URL}${params.url}?${
          params?.key ? params?.key : "id"
        }=${params?.id}`,
      );
      if (data.success) {
        if (typeof data.data !== undefined && data?.data?.source) {
          return data.data.source[0];
        } else {
          return data.data;
        }
      } else {
        return {
          // ...new FormBuilder()
        };
      }
    } catch (err) {
      console.log(err);
    }
  };
}

export function getSystemConfig(params: { url?: string; slice?: string }) {
  return async (dispatch, getState) => {
    try {
      if (!params.url) return;
      const { data } = await axios.get(
        `${publicRuntimeConfig.ORIGIN_URL}${params.url}`,
      );
      if (data.success) {
        if (params?.slice) {
          dispatch({
            type: "general/setSystemConfig",
            payload: { [params?.slice]: data.data },
          });
        }
        return data.data;
      } else {
        return {
          // ...new FormBuilder()
        };
      }
    } catch (err) {
      console.log(err);
    }
  };
}
// Handle Export Excel File
export function getFileExcel(config: FETCH_DATA_API_CONFIG_INTERFACE) {
  return async () => {
    try {
      if (!config.url) return;
      const queryString = getQueryStringByFetchDataConfig(config);
      const response = await axios.get(
        `${publicRuntimeConfig.ORIGIN_URL}/${queryString}`,
        {
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "data.xlsx";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
    }
  };
}

// Handle Export Excel File
export function handleGetExcelFile(params) {
  return async () => {
    try {
      if (!params?.queryString) return;

      const response = await axios.get(
        `${publicRuntimeConfig.ORIGIN_URL}/${params?.queryString}`,
        {
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${params?.fileName ? params?.fileName : "data"}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
    }
  };
}

export function insertOrUpdateRecordFormData({ url, params }) {
  return async (dispatch, getState) => {
    try {
      if (!params) {
        return false;
      }
      let bodyFormData = new FormData();
      Object.keys(params)?.map(item => {
        if (params[item]) {
          bodyFormData.append(item, params[item]);
        }
      });
      const response = await axios.post(
        `${publicRuntimeConfig.ORIGIN_URL}/${url}`,
        bodyFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      if (response?.data?.success) {
        dispatch(showSuccessSnackBar(response?.data));
        return response.data.data;
      } else {
        dispatch(showErrorSnackBar(response?.data?.message));
        return false;
      }
    } catch (err) {
      console.log(`${err}`);
      dispatch(showErrorSnackBar(`${err}`));
    }
  };
}

export function insertOrUpdateRecord({ url, params }) {
  return async (dispatch, getState) => {
    try {
      if (!params) {
        return false;
      }
      let payload = params;
      if (list_api_need_global_fund_id.includes(url)) {
        payload = { ...payload, fundId: getState().general.globalFundId ?? "" };
      }
      const response = await axios.post(
        `${publicRuntimeConfig.ORIGIN_URL}/${url}`,
        payload,
      );
      if (response?.data?.success) {
        dispatch(showSuccessSnackBar(response?.data));
        return response.data.data;
      } else {
        dispatch(showErrorSnackBar(response?.data?.message));
        return false;
      }
    } catch (err) {
      console.log(`${err}`);
      dispatch(showErrorSnackBar(`${err}`));
    }
  };
}

export const getListOptionsDropdown = (url: string) => {
  return async (dispatch, getState) => {
    try {
      const checkUrlIsAllCode = url.split("/")[0] === "all-code-api";
      if (checkUrlIsAllCode) {
        const data = getState().allCodeConfig[url];
        if (data) {
          return {
            ...data,
          };
        }
      }
      const response = await axios.get(
        `${publicRuntimeConfig.ORIGIN_URL}/${url}`,
      );
      const { data } = response;
      if (data?.success) {
        dispatch(
          setAllCodeConfig({
            code: url,
            value: {
              totalRecords: data?.data?.totalRecords,
              source: data?.data?.source,
              page: data?.data?.page,
            },
          }),
        );
        return {
          totalRecords: data?.data?.totalRecords,
          source: data?.data?.source,
          page: data?.data?.page,
        };
      } else {
        return { totalRecords: 0, source: [], page: 1 };
      }
    } catch (err) {
      console.log(err);
      return { totalRecords: 0, source: [], page: 1 };
    }
  };
};

export const getListObject = (param: {
  url: string;
  saveValues?: string;
  formCode?: string;
  fieldName?: string;
}) => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(
        `${publicRuntimeConfig.ORIGIN_URL}/${param.url}`,
      );
      const { data } = response;
      if (data?.success) {
        const keyValues = param?.saveValues ? param.saveValues.split("*") : [];
        let storeData = {};
        keyValues.map((item: string) => {
          if (item) {
            storeData[item] = data?.data[item];
          }
        });
        if (
          Object.keys(storeData).length > 0 &&
          param.formCode &&
          param.fieldName
        ) {
          dispatch(
            setAutoFillValue({
              [`${param.formCode}_${param.fieldName}`]: storeData,
            }),
          );
        }
        return {
          totalRecords: data?.data?.totalRecords,
          source: data?.data?.source,
          page: data?.data?.page,
        };
      } else {
        return { totalRecords: 0, source: [], page: 1 };
      }
    } catch (err) {
      console.log(err);
      return { totalRecords: 0, source: [], page: 1 };
    }
  };
};

export const getListFormConfigFromCodes = (codes?: string[]) => {
  return async (dispatch, getState) => {
    try {
      const find = getState().menu?.routeConfig?.fetchDataUrl;
      let urlParams = `${publicRuntimeConfig.ORIGIN_URL}/form-builder-api/${find}`;
      let tempStorageForms: string[] = [];
      let currentFormCodes: IForm[] = cloneDeep(
        getState().general.listForms,
      ).map((form: IForm) => form?.code);
      codes?.forEach((code: string) => {
        if (code) {
          const isStorageForm = currentFormCodes.find(
            formCode => formCode === code,
          );
          if (!isStorageForm) {
            tempStorageForms.push(code);
          }
        }
      });
      const stringifyCodes = getSearchTermInArray(tempStorageForms);
      if (stringifyCodes) {
        urlParams =
          urlParams +
          `?searchTerms[0].fieldName=code&searchTerms[0].fieldValue=${stringifyCodes}&searchTerms[0].condition=IN_ARRAY`;
        const response = await axios.get(urlParams);
        const { data } = response;
        if (data?.success) {
          dispatch(setListForm(data?.data?.source));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export function accountingInvestment(params) {
  return async (dispatch, getState) => {
    try {
      const response = await axios.post(
        getQueryURL(
          `${publicRuntimeConfig.ORIGIN_URL}/fund-accounting-api/set-accounting-date`,
          params,
        ),
      );
      if (response?.data?.success) {
        dispatch(showSuccessSnackBar(response?.data));
        return true;
      } else {
        dispatch(showErrorSnackBar(response?.data?.message));
        return false;
      }
    } catch (err) {
      dispatch(showErrorSnackBar(`${err}`));
    }
  };
}

export function approveRecord(params) {
  return async (dispatch, getState) => {
    try {
      const response = await axios.post(
        getQueryURL(`${publicRuntimeConfig.ORIGIN_URL}/${params.url}`, {
          id: params.id,
        }),
      );
      if (response?.data?.success) {
        dispatch(showSuccessSnackBar(response?.data));
        return true;
      } else {
        dispatch(showErrorSnackBar(response?.data?.message));
        return false;
      }
    } catch (err) {
      dispatch(showErrorSnackBar(`${err}`));
    }
  };
}

export function lockNAV(params) {
  return async (dispatch, getState) => {
    try {
      const response = await axios.post(
        getQueryURL(`${publicRuntimeConfig.ORIGIN_URL}/${params.url}`, {
          fundId: params.id,
        }),
      );
      if (response?.data?.success) {
        dispatch(showSuccessSnackBar(response?.data));
        return true;
      } else {
        dispatch(showErrorSnackBar(response?.data?.message));
        return false;
      }
    } catch (err) {
      dispatch(showErrorSnackBar(`${err}`));
    }
  };
}

export function getGeneralData() {
  return async (dispatch, getState) => {
    try {
      return getState().general;
    } catch (err) {
      return {};
    }
  };
}
export function storageDetailContract(params) {
  return async (dispatch, getState) => {
    try {
      // const PRINCIPAL_WITHDRAW = 0; // use
      // const TOTAL_AMOUNT = 0; // use
      // const RATE = params?.interestRate || 0; // use
      // const INTEREST_WITHDRAW = TOTAL_AMOUNT - PRINCIPAL_WITHDRAW; // use
      // const DAYS_OF_YEAR = getDataOfYear(params?.dayBasic, params?.valueDate); // use
      // const INCLUDE_FROM_DATE = getAccrualOfInterest(params?.accrualOfInterest); // use
      // const IS_ACCRUAL = getIsAccrualDate(params?.accrualDate); // use
      // const IS_NOT_ACCRUAL = getIsNotAccrualDate(params?.accrualDate); // use
      // const NUMBER_OF_VALUE_DAYS = getTotalContractDays(
      //   params?.accrualDate,
      //   params?.valueDate,
      // ); // use
      dispatch(
        setDetailContract({
          depositContractId: params?.id || "",
          interestPeriod: params?.interestPeriod || "",
          currencyCode: params?.currencyCode || "",
          contractNumber: params?.contractNumber || "",
          actualDepositDay: params?.actualDepositDay || "",
          interestFrequencytVal: params?.interestFrequencytVal || "",
          accruedAmount: params?.accruedAmount || "",
          accruedAmountConvert: params?.accruedAmountConvert || "",
          accountingEntryNameDeposit: `Nhận tiền lãi theo HĐ số ${params?.contractNumber}`,
          // PRINCIPAL_WITHDRAW: PRINCIPAL_WITHDRAW,
          // TOTAL_AMOUNT: TOTAL_AMOUNT,
          // RATE: RATE,
          // INTEREST_WITHDRAW: INTEREST_WITHDRAW,
          // DAYS_OF_YEAR: DAYS_OF_YEAR,
          // INCLUDE_FROM_DATE: INCLUDE_FROM_DATE,
          // IS_ACCRUAL: IS_ACCRUAL,
          // IS_NOT_ACCRUAL: IS_NOT_ACCRUAL,
          // NUMBER_OF_VALUE_DAYS: NUMBER_OF_VALUE_DAYS,
        }),
      );
    } catch (err) {
      return {};
    }
  };
}

export function getListAccounting(params) {
  return async (dispatch, getState) => {
    try {
      const res = await axios.get(
        getQueryURL(
          `${publicRuntimeConfig.ORIGIN_URL}/${params.url}`,
          params?.payload,
        ),
      );
      if (res?.data.data) {
        return res?.data.data;
      }
      return [];
    } catch (err) {
      return [];
    }
  };
}

const getDataOfYear = (dayBasic: string, valueDate: string) => {
  if (dayBasic === "1") {
    return 360;
  } else if (dayBasic === "2") {
    return 365;
  } else if (dayBasic === "3") {
    const tmp = moment(valueDate).year();

    var startDate = moment(`01/01/${tmp}`, "DD/MM/YYYY");
    var endDate = moment(`31/12/${tmp}`, "DD/MM/YYYY");
    var result = Number(moment.duration(endDate.diff(startDate)).asDays()) + 1;
    return result || 365;
  }
};

const getAccrualOfInterest = (accrualOfInterest: string) => {
  if (accrualOfInterest === "1") {
    return 0;
  } else if (accrualOfInterest === "2") {
    return 1;
  } else return 0;
};

const getIsAccrualDate = (accrualDate: string) => {
  try {
    if (!accrualDate) {
      return 0;
    }
    const currentDate = moment(new Date(), "DD/MM/YYYY");
    const accrualDateFormat = moment(accrualDate, "DD/MM/YYYY");
    const diff = Number(
      moment.duration(accrualDateFormat.diff(currentDate)).asDays(),
    );
    if (diff && diff > 1) {
      return 1;
    }
    return 0;
  } catch (error) {
    return 0;
  }
};

const getIsNotAccrualDate = (accrualDate: string) => {
  try {
    if (!accrualDate) {
      return 1;
    }
    const currentDate = moment(new Date(), "DD/MM/YYYY");
    const accrualDateFormat = moment(accrualDate);
    const diff = Math.floor(
      Number(moment.duration(accrualDateFormat.diff(currentDate)).asDays()),
    );
    if (diff && diff > 1) {
      return 0;
    }
    return 1;
  } catch (error) {
    return 0;
  }
};

const getTotalContractDays = (accrualDate: string, valueDate: string) => {
  try {
    if (!accrualDate) {
      return 0;
    }
    var startDate = moment(accrualDate);
    var endDate = moment(valueDate);
    var result =
      Math.floor(Number(moment.duration(endDate.diff(startDate)).asDays())) + 1;
    return result ? result : 0;
  } catch (error) {
    return 0;
  }
};
