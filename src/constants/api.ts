import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const ACCOUNTS = "/user-login-api";
const FORM_BUILDER = "/form-builder-api";

export const api = {
  BASE_URL: publicRuntimeConfig.ORIGIN_URL,
  ACCOUNTS_LOGIN: publicRuntimeConfig.ORIGIN_URL + ACCOUNTS + "/login",
  FORM_BUILDER_CONFIG: publicRuntimeConfig.ORIGIN_URL + FORM_BUILDER + "/form-builder-config",
  ADD_OR_UPDATE_FORM: publicRuntimeConfig.ORIGIN_URL + FORM_BUILDER + "/add-or-update-record",
  FORM_SETTING: "/form-setting",
  ADD_OR_UPDATE_FORM_BASE: "/add-or-update-record",
};

export const list_api_need_global_fund_id = [
  "fund-contract-fee-api/add-or-update-record",
];
