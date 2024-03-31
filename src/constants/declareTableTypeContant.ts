export const declareTableTypeContant = `
// TABLE
enum TABLE_TYPE {
  BASE = "base",
  EDITABLE = "editable",
  EXPANDABLE = "expandble",
  FIX_IMPORTED_DATA = "FIX_IMPORTED_DATA",
  ACCOUNTING_ENTRY_DETAILS = "ACCOUNTING_ENTRY_DETAILS",
}

enum TABLE_LEVEL_TYPE {
  MAIN = "main",
  CHILD = "child",
}

enum PARAM_TYPE {
  PARAM = "PARAM",
  SEARCH_TERM = "SEARCH_TERM",
}

// ------ ROW SETTINGS ------
// ROW SETTINGS TYPE
enum RS_TYPE {
  SHOW = "show",
  UPDATE = "update",
  INACTIVE = "inactive",
  ACTIVE = "active",
  DELETE = "delete",
}

// ROW SETTINGS ACTION
enum API_ACTION {
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
enum RS_ACTION_TYPE {
  CALL_API = "callApi",
  CALL_API_POPUP = "callAPI-popup",
  OPEN_TABLE_BUILDER_POPUP = "OPEN_TABLE_BUILDER_POPUP",
}

// ROW SETTINGS COLOR
enum RS_COLOR {
  ERROR = "error",
  NORMAL = "normal",
}

// ROW SETTINGS METHOD
enum RS_METHOD {
  GET = "get",
  PUT = "put",
  POST = "post",
  DELETE = "delete",
}

// ------ END ROW SETTINGS ------

// ------ COLUMN OPTIONS ------

// COLUMN OPTIONS TYPE
enum CO_TYPE {
  TEXT = "text",
  NUMBER = "number",
  DATE = "date",
  TIME = "time",
  ENABLED = "enabled",
  WORK_FOLLOW = "WORK_FOLLOW",
  SETTING = "setting",
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
enum CO_FILTER_TYPE {
  TEXT = "text",
  NUMBER = "number",
  MIN_MAX_NUMBER = "minmaxNumber",
  MIN_MAX_DATE = "minmaxDate",
  SELECT = "select",
  NONE = "",
}

// COLUMN OPTIONS ALIGN
enum CO_ALIGN {
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center",
}

// COLUMN OPTIONS EDIT TYPE
enum CO_EDIT_TYPE {
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
enum SEARCH_CONDITIONS {
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
const LIST_PAGINATION_OPTIONS = [
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
];

//  EXPORT_EXCEL_TYPE
enum EXPORT_EXCEL_TYPE {
  ALL = "all",
  SELECTED = "selected",
}

enum VC_TYPE {
  REQUIRED = "REQUIRED",
  LENGTH = "LENGTH",
  FORMAT = "FORMAT",
  NO_SPEACIAL_CHARACTERS = "NO_SPEACIAL_CHARACTERS",
  DATA_TYPE = "DATA_TYPE",
  IN_RANGE = "IN_RANGE",
  DUPLICATE = "DUPLICATE",
}

enum VC_FORMAT_VALIDATE_TYPE {
  EMAIL = "EMAIL",
  PHONE_NUMBER = "PHONE_NUMBER",
  URL = "URL",
  STRONG_PASSWORD = "STRONG_PASSWORD",
  TIME = "TIME",
  NO_SPEACIAL_CHARACTERS = "NO_SPEACIAL_CHARACTERS",
}

enum VC_DATA_TYPE_VALIDATE_TYPE {
  INTEGER = "INTEGER",
  NUMBER = "NUMBER",
  STRING = "STRING",
  BOOLEAN = "BOOLEAN",
}

enum VC_IN_RANGE_VALIDATE_TYPE {
  NUMBER = "NUMBER",
  DATE = "DATE",
}

enum VALIDATE_TYPE {
  REQUIRED = "REQUIRED",
  LENGTH = "LENGTH",
  FORMAT = "FORMAT",
  NO_SPEACIAL_CHARACTERS = "NO_SPEACIAL_CHARACTERS",
  DATA_TYPE = "DATA_TYPE",
  IN_RANGE = "IN_RANGE",
  DUPLICATE = "DUPLICATE",
}

enum FORMAT_VALIDATE_TYPE {
  EMAIL = "EMAIL",
  PHONE_NUMBER = "PHONE_NUMBER",
  URL = "URL",
  STRONG_PASSWORD = "STRONG_PASSWORD",
  TIME = "TIME",
}

enum DATA_TYPE_VALIDATE_TYPE {
  INTEGER = "INTEGER",
  NUMBER = "NUMBER",
  STRING = "STRING",
  BOOLEAN = "BOOLEAN",
}

enum IN_RANGE_VALIDATE_TYPE {
  NUMBER = "NUMBER",
  DATE = "DATE",
}

enum INPUT_FORMAT_TYPE {
  UPPERCASE = "UPPERCASE",
  ONLY_NUMBER = "ONLY_NUMBER",
  NUMBER_VALUE = "NUMBER_VALUE",
  NO_SPACE = "NO_SPACE",
}

interface VALIDATION_ERROR_INTERFACE {
  error: boolean;
  errorMessage: string;
}
interface VALIDATION_INTERFACE {
  requiredValidate?: boolean;
  lengthValidate?: boolean;
  formatValidate?: boolean;
  inRangeValidate?: boolean;
  noSpecialCharacterValidate?: boolean;
  noBetweenSpace?: boolean;

  // Kiểu LENGTH
  minLength?: number;
  maxLength?: number;

  // Kiểu FORMAT
  formatValidateType?: FORMAT_VALIDATE_TYPE; // EMAIL || PHONE_NUMBER || URL || STRONG_PASSWORD || NO_SPEACIAL_CHARACTERS || IP
  regexString?: RegExp;
  // Kiểu DATA_TYPE
  // dataTypeValidateType?: DATA_TYPE_VALIDATE_TYPE; // INTEGER | NUMBER | STRING | BOOLEAN

  // Kiểu IN_RANGE
  inRangeValidateType?: IN_RANGE_VALIDATE_TYPE; // NUMBER | DATE
  minNumberValue?: number;
  maxNumberValue?: number;
  minDateValue?: string;
  maxDateValue?: string;
}

// -------------------------------

interface TABLE_OPTIONS_INTERFACE {
  tableType: TABLE_TYPE;
  tableTitle?: string;
  showGlobalFilter?: boolean;
  showPagination?: boolean;
  enableSorting?: boolean;
  enableRowSelection: boolean;
  enableExpanding?: boolean;
  enableColumnResizing: boolean;
  enableColumnOrdering: boolean;
  enableColumnDragging: boolean;
  enableEditing?: boolean;
  enableTopToolbar?: boolean;
  enableBottomToolbar?: boolean;
  enableStickyHeader: boolean;
  enablePagination: boolean;
  showAddNewButton: boolean;
  showExportExcelButton: boolean;
  showRefreshButton: boolean;
  hasSummaryRow?: boolean;
  hasRowClickedEvent?: boolean;
  parentIdName?: string;
  useCurrentRecordId?: boolean;
  checkerApprove?: boolean;
  checkerCancelAccountingEntry?: boolean;
  addNewConfig?: TABLE_ADD_NEW_CONFIG_INTERFACE;
  routes: TABLE_ROUTES_INTERFACE;
  selectOptionsListField: {
    [key: string]: TABLE_SELECT_OPTIONS_FIELD_CONFIG;
  };
  defaultPageSize?: number;
  defaultExpanded?: boolean;
  listRowAction: ROW_ACTION_INTERFACE[];
  listHandleAllAction: ALL_ACTION_INTERFACE[];
  listColumn: COLUMN_OPTIONS_INTERFACE[];
}

interface TABLE_ROUTES_INTERFACE {
  [API_ACTION.FETCH_DATA_URL]: TABLE_ROUTE_INTERFACE;
  [API_ACTION.EXPORT_TO_XLSX_FILE]?: TABLE_ROUTE_INTERFACE;
  [API_ACTION.ACTIVE_DE_ACTIVE_URL]?: TABLE_ROUTE_INTERFACE;
  [API_ACTION.DELETE_URL]?: TABLE_ROUTE_INTERFACE;
  [API_ACTION.DELETE_MANY_URL]?: TABLE_ROUTE_INTERFACE;
  [API_ACTION.INSERT_UPDATE_URL]?: TABLE_ROUTE_INTERFACE;
  [API_ACTION.DO_CERT_ACCOUNTING]?: TABLE_ROUTE_INTERFACE;
  [API_ACTION.CANCEL_CERT_ACCOUNTING]?: TABLE_ROUTE_INTERFACE;
  [API_ACTION.APPROVE]?: TABLE_ROUTE_INTERFACE;
  [API_ACTION.DENY]?: TABLE_ROUTE_INTERFACE;
  [API_ACTION.CANCEL_APPROVE]?: TABLE_ROUTE_INTERFACE;
  [API_ACTION.CANCEL_ACCOUNTING_ENTRY]?: TABLE_ROUTE_INTERFACE;
}

interface TABLE_ADD_NEW_CONFIG_INTERFACE {
  title?: string;
  actions: TABLE_ADD_NEW_ACTION_CONFIG_INTERFACE[];
  hiddenCondition?: ADD_NEW_CONDITION_INTERFACE;
  disabledCondition?: ADD_NEW_CONDITION_INTERFACE;
}

interface TABLE_ADD_NEW_ACTION_CONFIG_INTERFACE {
  title: string;
  dialogCode: string;
}

interface TABLE_ROUTE_INTERFACE {
  url: string;
  parentIdName?: string;
  searchTerms?: SEARCH_TERMS_INTERFACE[];
  params?: PARAM_INTERFACE[];
  defaultSorting?: {
    fieldOrderBy: string;
    isDescending: boolean;
  };
  entryPropKeys?: {
    keyInEntryProp: string;
    paramType: PARAM_TYPE;
    paramKey?: string;
    condition?: SEARCH_CONDITIONS;
  }[];
}

interface PARAM_INTERFACE {
  paramKey: string;
  paramValue: any;
}

interface SEARCH_TERMS_INTERFACE {
  fieldName: string;
  fieldValue: any;
  condition?: SEARCH_CONDITIONS;
}

interface FETCH_DATA_API_CONFIG_INTERFACE {
  url: string;
  params?: PARAM_INTERFACE[];
  searchTerms?: SEARCH_TERMS_INTERFACE[];
  exportedColumns?: string[];
}

interface COLUMN_OPTIONS_INTERFACE {
  key: string;
  relatedKey?: string;
  label: string;
  type: CO_TYPE;
  typeFilter: CO_FILTER_TYPE;
  editType?: CO_EDIT_TYPE;
  listSelectOption?: any[];
  align: CO_ALIGN;
  size: {
    xxl: number;
    xl: number;
    lg: number;
  };
  minSize: {
    xxl: number;
    xl: number;
    lg: number;
  };
  maxSize: {
    xxl: number;
    xl: number;
    lg: number;
  };
  enableClickToCopy?: boolean;
  enableResizing?: boolean;
  enableSorting: boolean;
  enableColumnActions: boolean;
  enableColumnOrdering: boolean;
  enableHiding: boolean;
  visible: boolean;
  enableEditing?: boolean;
  validations?: VALIDATION_INTERFACE;
  formatConfig?: {
    type: INPUT_FORMAT_TYPE;
  };
  isRootBold?: boolean;
  isRootFullColspan?: boolean;
  isRootPaddingIncreasing?: boolean;
  hasSummary?: boolean;
  summaryKey?: string;
  hiddenCondition?: COLUMN_CONDITION_INTERFACE;
  styleColLevel?: number;
}

interface ROW_ACTION_INTERFACE {
  label: string;
  type: RS_TYPE;
  actionType: RS_ACTION_TYPE;
  action: API_ACTION;
  color?: RS_COLOR;
  method: RS_METHOD;
  disabledCondition?: ROW_ACTION_CONDITION_INTERFACE;
  hiddenCondition?: ROW_ACTION_CONDITION_INTERFACE;
  dialogCode?: string;
  dialogCodeCondition?: I_DIALOG_CODE_CONDITION[];
  url?: string;
}

interface ADD_NEW_CONDITION_INTERFACE {
  parentIdCheck?: boolean;
  onlyShowCheck?: boolean;
  roleCheck?: boolean;
  allowedRoles?: any[];
}

interface COLUMN_CONDITION_INTERFACE {
  roleCheck?: boolean;
  allowedRoles?: any[];
}

interface ROW_ACTION_CONDITION_INTERFACE {
  valueCheck?: boolean;
  valueConditions?: SEARCH_TERMS_INTERFACE[];
  roleCheck?: boolean;
  allowedRoles?: any[];
  onlyShowCheck?: boolean;
}

interface ALL_ACTION_INTERFACE {
  label: string;
  type: RS_TYPE;
  actionType: RS_ACTION_TYPE;
  action: API_ACTION;
  color: RS_COLOR;
  method: RS_METHOD;
}

interface ParamObject {
  [key: string]: any;
}

interface VALIDATION_CELL_INTERFACE {
  type: VC_TYPE; // REQUIRED | LENGTH | FORMAT | DATA_TYPE | IN_RANGE | DUPLICATE

  // Kiểu LENGTH
  minLength?: number;
  maxLength?: number;

  // Kiểu FORMAT
  formatValidateType?: VC_FORMAT_VALIDATE_TYPE; // EMAIL || PHONE_NUMBER || URL || STRONG_PASSWORD || NO_SPEACIAL_CHARACTERS || IP

  // Kiểu DATA_TYPE
  dataTypeValidateType?: VC_DATA_TYPE_VALIDATE_TYPE; // INTEGER | NUMBER | STRING | BOOLEAN

  // Kiểu IN_RANGE
  inRangeValidateType?: VC_IN_RANGE_VALIDATE_TYPE; // NUMBER | DATE
  minNumberValue?: number;
  maxNumberValue?: number;
  minDateValue?: string;
  maxDateValue?: string;
}

interface TABLE_SELECT_OPTIONS {
  list: any[];
  nameKey: string;
  valueKey: string;
}

interface TABLE_SELECT_OPTIONS_FIELD_CONFIG {
  url: string;
  nameKey: string;
  valueKey: string;
  parentIdName?: string;
}

interface I_DIALOG_CODE_CONDITION {
  dialogCode?: string,
  recordStatus?: string,
  configValueEqual?: string
}
`;
