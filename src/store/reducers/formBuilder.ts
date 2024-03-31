// third-party
import {
  createSlice,
} from "@reduxjs/toolkit";

// project imports
import { dispatch } from "../store";
import axios from "@/src/helpers/axios";
import { api } from "@/src/constants/api";
import { openSnackbar } from "./snackbar";
import { FormBuilderProps } from "@/src/types/formBuilder";
import getConfig from "next/config";
import { IForm } from "@/src/types";
import { getSearchTermInArray } from "@/src/helpers/getQueryURL";
import { cloneDeep } from "lodash";
const { publicRuntimeConfig } = getConfig();
// types

// ----------------------------------------------------------------------

const initialState: FormBuilderProps = {
  formBuilderConfig: {},
  currentFormData: {},
  currentField: {},
  currentFieldIndex: NaN,
  currentFieldType: null,
  listForms: [],
};

const formField = createSlice({
  name: "formField",
  initialState,
  reducers: {
    setFormBuilderConfigs(state, action) {
      state.formBuilderConfig = action.payload;
    },
    setFormBuilderSettings(state, action) {
      state.currentFormData = action.payload;
    },
    setCurrentField(state, action) {
      state.currentField = action.payload;
    },
    setCurrentFieldType(state, action) {
      state.currentFieldType = action.payload;
    },
    setCurrentFieldIndex(state, action) {
      state.currentFieldIndex = action.payload;
    },
    getFormDataEffect(state, action) {},
    setListFormFormBuilder(state, action) {
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
  },
});

// Reducer
export default formField.reducer;

export const {
  setFormBuilderSettings,
  getFormDataEffect,
  setCurrentFieldType,
  setListFormFormBuilder
} = formField.actions;
// ----------------------------------------------------------------------
export function getFormBuilderConfigReducer() {
  return async () => {
    try {
      const response = await axios.get(api.FORM_BUILDER_CONFIG);
      const { data } = response;
      if (data.success) {
        dispatch(formField.actions.setFormBuilderConfigs(data.data));
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  };
}
export function setCurrentFieldReducer(params?) {
  return async () => {
    try {
      if (params) {
        dispatch(formField.actions.setCurrentField(params));
        return;
      }
      dispatch(formField.actions.setCurrentField({}));
    } catch (err) {
      console.log(err);
    }
  };
}
export function setCurrentFieldIndexReducer(params?) {
  return async () => {
    try {
      if (typeof params === "number") {
        dispatch(formField.actions.setCurrentFieldIndex(params));
        return;
      }
      dispatch(formField.actions.setCurrentFieldIndex(null));
    } catch (err) {
      console.log(err);
    }
  };
}
export function addOrUpdateFormRecordReducer(params) {
  return async (dispatch, getState) => {
    try {
      const response = await axios.post(api.ADD_OR_UPDATE_FORM, params);
      const { data } = response;
      if (data.success) {
        // dispatch(formField.actions.addOrUpdateFormRecord(data.data))
        dispatch(
          openSnackbar({
            open: true,
            message: data?.message,
            variant: "alert",
            alert: {
              color: "success",
            },
            close: false,
            transition: "SlideLeft",
          }),
        );
        return true;
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: data?.message,
            variant: "alert",
            alert: {
              color: "error",
            },
            close: false,
            transition: "SlideLeft",
          }),
        );
        return true;
      }
    } catch (err) {
      console.log(err);
    }
  };
}

export function saveJsonReducer(params) {
  return async () => {
    try {
      const blob = new Blob([JSON.stringify(params)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${params.code ?? "data"}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {}
  };
}

export const getFormDataSetting = (id?: string | null | undefined) => {
  return async (dispatch, getState) => {
    try {
      const { baseRouteApi } = getState().menu;
      if (!baseRouteApi) return;

      const { data } = await axios.get(
        `${publicRuntimeConfig.ORIGIN_URL}/form-builder-api/find-by-id?id=${id}`,
      );

      if (data?.success) {
        dispatch(setFormBuilderSettings(data?.data));
        // return data?.data;
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export const deleteFormSetting = (id?: string | null | undefined) => {
  return async (dispatch, getState) => {
    try {
      const { data } = await axios.delete(
        `${publicRuntimeConfig.ORIGIN_URL}/form-builder-api/delete?id=${id}`,
      );

      if (data.success) {
        dispatch(
          openSnackbar({
            open: true,
            message: data?.message,
            variant: "alert",
            alert: {
              color: "success",
            },
            close: false,
            transition: "SlideLeft",
          }),
        );
        return true;
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: data?.message,
            variant: "alert",
            alert: {
              color: "error",
            },
            close: false,
            transition: "SlideLeft",
          }),
        );
        return false;
      }
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: `${err}`,
          variant: "alert",
          alert: {
            color: "error",
          },
          close: false,
          transition: "SlideLeft",
        }),
      );
      return false;
    }
  };
};

export const getListFormConfigFromCodesFormBuilder = (codes?: string[]) => {
  return async (dispatch, getState) => {
    try {
      const find = getState().menu?.routeConfig?.fetchDataUrl;
      let urlParams = `${publicRuntimeConfig.ORIGIN_URL}/form-builder-api/${find}`;
      urlParams =
        urlParams +
        '?pageIndex=1&pageSize=80&searchTerms[0].fieldName=formType&searchTerms[0].fieldValue=["SUBMIT_IFRAME","SUBMIT_IFRAME_LARGE","SUBMIT_IFRAME_XLARGE"]&searchTerms[0].condition=IN_ARRAY';
      const response = await axios.get(urlParams);
      const { data } = response;
      if (data?.success) {
        dispatch(setListFormFormBuilder(data?.data?.source));
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export const getListFormConfigFromCodesSingleScreen = (codes?: string[]) => {
  return async (dispatch, getState) => {
    try {
      const find = getState().menu?.routeConfig?.fetchDataUrl;
      let urlParams = `${publicRuntimeConfig.ORIGIN_URL}/form-builder-api/${find}`;
      let tempStorageForms: string[] = [];
      let currentFormCodes: IForm[] = cloneDeep(
        getState().formBuilder.listForms,
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
          dispatch(setListFormFormBuilder(data?.data?.source));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
};


