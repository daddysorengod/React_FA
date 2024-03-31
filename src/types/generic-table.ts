import { INPUT_FORMAT_TYPE } from "../constants/built-form";
import {
  API_ACTION,
  CO_ALIGN,
  CO_EDIT_TYPE,
  CO_FILTER_TYPE,
  CO_TYPE,
  RS_ACTION_TYPE,
  RS_COLOR,
  RS_METHOD,
  RS_TYPE,
  SEARCH_CONDITIONS,
  VC_DATA_TYPE_VALIDATE_TYPE,
  VC_FORMAT_VALIDATE_TYPE,
  VC_IN_RANGE_VALIDATE_TYPE,
  VC_TYPE,
  TABLE_TYPE,
  PARAM_TYPE,
} from "./../constants";
import { VALIDATION_INTERFACE } from "./built-form";

export interface TABLE_OPTIONS_INTERFACE {
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

export interface TABLE_ROUTES_INTERFACE {
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

export interface TABLE_ADD_NEW_CONFIG_INTERFACE {
  title?: string;
  actions: TABLE_ADD_NEW_ACTION_CONFIG_INTERFACE[];
  hiddenCondition?: ADD_NEW_CONDITION_INTERFACE;
  disabledCondition?: ADD_NEW_CONDITION_INTERFACE;
}

export interface TABLE_ADD_NEW_ACTION_CONFIG_INTERFACE {
  title: string;
  dialogCode: string;
}

export interface TABLE_ROUTE_INTERFACE {
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

export interface PARAM_INTERFACE {
  paramKey: string;
  paramValue: any;
}

export interface SEARCH_TERMS_INTERFACE {
  fieldName: string;
  fieldValue: any;
  condition?: SEARCH_CONDITIONS;
}

export interface FETCH_DATA_API_CONFIG_INTERFACE {
  url: string;
  params?: PARAM_INTERFACE[];
  searchTerms?: SEARCH_TERMS_INTERFACE[];
  exportedColumns?: string[];
}

export interface COLUMN_OPTIONS_INTERFACE {
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

export interface ROW_ACTION_INTERFACE {
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

export interface ADD_NEW_CONDITION_INTERFACE {
  parentIdCheck?: boolean;
  onlyShowCheck?: boolean;
  roleCheck?: boolean;
  allowedRoles?: any[];
}

export interface COLUMN_CONDITION_INTERFACE {
  roleCheck?: boolean;
  allowedRoles?: any[];
}

export interface ROW_ACTION_CONDITION_INTERFACE {
  valueCheck?: boolean;
  valueConditions?: SEARCH_TERMS_INTERFACE[];
  roleCheck?: boolean;
  allowedRoles?: any[];
  onlyShowCheck?: boolean;
}

export interface ALL_ACTION_INTERFACE {
  label: string;
  type: RS_TYPE;
  actionType: RS_ACTION_TYPE;
  action: API_ACTION;
  color: RS_COLOR;
  method: RS_METHOD;
}

export interface ParamObject {
  [key: string]: any;
}

export interface VALIDATION_CELL_INTERFACE {
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

export interface TABLE_SELECT_OPTIONS {
  list: any[];
  nameKey: string;
  valueKey: string;
}

export interface TABLE_SELECT_OPTIONS_FIELD_CONFIG {
  url: string;
  nameKey: string;
  valueKey: string;
  parentIdName?: string;
}

export interface I_DIALOG_CODE_CONDITION {
  dialogCode?: string;
  recordStatus?: string;
  configValueEqual?: string;
}
      