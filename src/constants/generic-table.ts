// TABLE
export enum TABLE_TYPE {
  BASE = "base",
  EDITABLE = "editable",
  EXPANDABLE = "expandble",
  FIX_IMPORTED_DATA = "FIX_IMPORTED_DATA",
  ACCOUNTING_ENTRY_DETAILS = "ACCOUNTING_ENTRY_DETAILS",
}

export enum TABLE_LEVEL_TYPE {
  MAIN = "main",
  CHILD = "child",
}

export enum PARAM_TYPE {
  PARAM = "PARAM",
  SEARCH_TERM = "SEARCH_TERM",
}

// ------ ROW SETTINGS ------
// ROW SETTINGS TYPE
export enum RS_TYPE {
  SHOW = "show",
  UPDATE = "update",
  INACTIVE = "inactive",
  ACTIVE = "active",
  DELETE = "delete",
}

// ROW SETTINGS ACTION
export enum API_ACTION {
  FETCH_DATA_URL = "fetchDataUrl",
  FETCH_BY_ID_URL = "fetchByIdUrl",
  INSERT_UPDATE_URL = "insertUpdateUrl",
  ACTIVE_DE_ACTIVE_URL = "activeDeActiveUrl",
  DELETE_URL = "deleteUrl",
  DELETE_MANY_URL = "deleteManyUrl",
  EXPORT_TO_XLSX_FILE = "exportToXlsxFile",
  DO_CERT_ACCOUNTING = "DO_CERT_ACCOUNTING",
  CANCEL_CERT_ACCOUNTING = "CANCEL_CERT_ACCOUNTING",
  APPROVE = "APPROVE",
  DENY = "DENY",
  CANCEL_APPROVE = "CANCEL_APPROVE",
  CANCEL_ACCOUNTING_ENTRY = "CANCEL_ACCOUNTING_ENTRY",
}

// ROW SETTINGS ACTION TYPE
export enum RS_ACTION_TYPE {
  CALL_API = "callApi",
  CALL_API_POPUP = "callAPI-popup",
  OPEN_TABLE_BUILDER_POPUP = "OPEN_TABLE_BUILDER_POPUP",
}

// ROW SETTINGS COLOR
export enum RS_COLOR {
  ERROR = "error",
  NORMAL = "normal",
}

// ROW SETTINGS METHOD
export enum RS_METHOD {
  GET = "get",
  PUT = "put",
  POST = "post",
  DELETE = "delete",
}

// ------ END ROW SETTINGS ------

// ------ COLUMN OPTIONS ------

// COLUMN OPTIONS TYPE
export enum CO_TYPE {
  TEXT = "text",
  NUMBER = "number",
  DATE = "date",
  TIME = "time",
  ENABLED = "enabled",
  WORK_FOLLOW = "WORK_FOLLOW",
  SETTING = "setting",
  CHECKER_SETTING = "checker_setting",
  VALUE_NAME_OBJECT = "valueNameObject",
  VALUE_NAME_OBJECT_ID = "valueNameObjectId",
  ORGANIZE_PROVIDER_ROLES = "organizeProviderRoles",
  ACTION_DELETE = "action-delete",
  JSON_STRING = "JSON_STRING",
  VALIDATE_TOOLTIP = "VALIDATE_TOOLTIP",
  STATUS = "STATUS",
  FA_STATUS = "FA_STATUS",
  SB_STATUS = "SB_STATUS",
  MATCHED_STATUS = "MATCHED_STATUS",
  CHECKBOX = "CHECKBOX",
}

// COLUMN OPTIONS FILTER TYPE
export enum CO_FILTER_TYPE {
  TEXT = "text",
  NUMBER = "number",
  MIN_MAX_NUMBER = "minmaxNumber",
  MIN_MAX_DATE = "minmaxDate",
  SELECT = "select",
  NONE = "",
}

// COLUMN OPTIONS ALIGN
export enum CO_ALIGN {
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center",
}

// COLUMN OPTIONS EDIT TYPE
export enum CO_EDIT_TYPE {
  TEXT = "text",
  NUMBER = "number",
  TEL = "tel",
  EMAIL = "email",
  SELECT = "select",
  DATE = "date",
  DATETIME_LOCAL = "datetime-local",
  TIME = "time",
  NONE = "none",
}

// ----- END COLUMN OPTIONS -----

// SEARCH CONDITIONS
export enum SEARCH_CONDITIONS {
  CONTAINS = "CONTAINS",
  EQUAL = "EQUAL",
  GREATER_THAN = "GREATER_THAN",
  GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL",
  LESS_THAN = "LESS_THAN",
  LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL",
  IN_ARRAY = "IN_ARRAY",
  NOT_EQUAL_TO = "NOT_EQUAL_TO",
  IN_RANGE = "IN_RANGE",
}

// LIST PAGINATION OPTIONS
export const LIST_PAGINATION_OPTIONS = [
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
];

//  EXPORT_EXCEL_TYPE
export enum EXPORT_EXCEL_TYPE {
  ALL = "all",
  SELECTED = "selected",
}

export enum VC_TYPE {
  REQUIRED = "REQUIRED",
  LENGTH = "LENGTH",
  FORMAT = "FORMAT",
  NO_SPEACIAL_CHARACTERS = "NO_SPEACIAL_CHARACTERS",
  DATA_TYPE = "DATA_TYPE",
  IN_RANGE = "IN_RANGE",
  DUPLICATE = "DUPLICATE",
}

export enum VC_FORMAT_VALIDATE_TYPE {
  EMAIL = "EMAIL",
  PHONE_NUMBER = "PHONE_NUMBER",
  URL = "URL",
  STRONG_PASSWORD = "STRONG_PASSWORD",
  TIME = "TIME",
  NO_SPEACIAL_CHARACTERS = "NO_SPEACIAL_CHARACTERS",
}

export enum VC_DATA_TYPE_VALIDATE_TYPE {
  INTEGER = "INTEGER",
  NUMBER = "NUMBER",
  STRING = "STRING",
  BOOLEAN = "BOOLEAN",
}

export enum VC_IN_RANGE_VALIDATE_TYPE {
  NUMBER = "NUMBER",
  DATE = "DATE",
}

export const MAPPED_TABLE_CODE_BY_ROUTER = {
  // Table Builder
  "/table-builder": "TABLE-BUILDER",

  // Tham số chung
  "/general/bank-api": "GENERAL/BANK/MAIN",
  "/general/organize-api": "GENERAL/ORGANIZE/MAIN",
  "/general/security-api": "GENERAL/SECURITY/MAIN",
  "/general/issuer-api": "GENERAL/ISSUER/MAIN",
  "/general/asset-policy-api": "GENERAL/ASSET-POLICY/MAIN",
  "/general/customer-master-api": "GENERAL/CUSTOMER-MASTER/MAIN",

  // Quỹ
  "/fund/fund-information-api": "FUND/INFORMATION/MAIN",
  "/fund/fund-exchange-rate-api": "FUND/EXCHANGE_RATE/MAIN",

  // Số dư ban đầu
  "/fund-balance/fund-accounting-balance-api": "FUND/FUND-ACCOUNTING-BALANCE",
  "/fund-balance/bank-account": "FUND-BALANCE/BANK-ACCOUNT/MAIN",
  "/fund-balance/organize-api": "FUND-BALANCE/ORGANIZE/MAIN",
  "/fund-balance/investor-api": "FUND-BALANCE/INVESTOR/MAIN",

  // Huy động vốn
  "/fund-raising/trans-result": "FUND-RAISING/TRANS-RESULT/MAIN",
  "/fund-raising/accounting-distribution":
    "FUND-RAISING/ACCOUNTING-DISTRIBITION/MAIN",

  // Quy trình tính NAV
  "/nav-calculation-process/balance-reconciliation":
    "NAV-CAL-PROCESS/BALANCE-RECONCILIATION/MAIN",
  "/nav-calculation-process/nav-determination":
    "NAV-CAL-PROCESS/NAV-DETERMINATION/MAIN",

  // Giao dịch nội bộ
  "/internal-transaction/manual-accounting":
    "INTERNAL_TRANSACTION/MANUAL_ACCOUNTING",

    // sự kiện quyền
    "/event-THQ/event-list" : "EVENT-THQ/INFO-LIST/MAIN",
    
    //nhóm quyền và tài khoản
    // "/decentralization/decentralization-account": "DECENTRALIZATION/DECENTRALIZATION-GROUP-FUNCTION/ACCOUNT-LIST/MAIN",
    "/decentralization/decentralization-group-function" : "DECENTRALIZATION/DECENTRALIZATION-GROUP-FUNCTION/GROUP-FUNCTION-LIST/MAIN"
};
