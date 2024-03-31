import { TABLE_TYPE } from "./generic-table";

export enum ITypeSubmit {
  SINGLE = "SINGLE",
  ALL = "ALL",
  NONE = "NONE",
}

export enum ICustomTypeTabHeader {
  onlyTab = "onlyTab",
  onlyStep = "onlyStep",
}

export enum ICustomTypeBottomButton {
  submitAll = "submitAll",
  submitSingleThenTurnOff = "submitSingleThenTurnOff",
  none = "none",
  lockNav = "lockNav",
}

export enum ITypeComponent {
  DYNAMIC = "DYNAMIC",
  BUILD = "BUILD",
  TABLE = "TABLE",
}

export enum ISizeDialog {
  SUBMIT_IFRAME = "SUBMIT_IFRAME",
  SUBMIT_IFRAME_LARGE = "SUBMIT_IFRAME_LARGE",
  SUBMIT_IFRAME_XLARGE = "SUBMIT_IFRAME_XLARGE",
}

export enum DIALOG_TYPE {
  NORMAL = "NORMAL",
  IMPORT_EXCEL = "IMPORT_EXCEL",
  FULL_SCREEN = "FULL_SCREEN",
  HIDE_BOTTOM_BTN = "HIDE_BOTTOM_BTN",
}

export interface IDialogConfig {
  [key: string]: IDialog;
}
export interface IDialog {
  title: string;
  isCustomTitle?: boolean;
  size:
    | ISizeDialog.SUBMIT_IFRAME
    | ISizeDialog.SUBMIT_IFRAME_LARGE
    | ISizeDialog.SUBMIT_IFRAME_XLARGE | string;
  submitType: ITypeSubmit.SINGLE | ITypeSubmit.ALL | ITypeSubmit.NONE;
  customTabHeader?:
    | ICustomTypeTabHeader.onlyStep
    | ICustomTypeTabHeader.onlyTab;
  customBottomButton?:
    | ICustomTypeBottomButton.submitAll
    | ICustomTypeBottomButton.submitSingleThenTurnOff
    | ICustomTypeBottomButton.lockNav
    | ICustomTypeBottomButton.none;

  apiSubmit: {
    url: string;
    idName?: string;
    overriding?: string;
    approveUrl?: string;
    denyUrl?: string;
    cancelApproveUrl?: string;
    cancelAccountingEntry?: {
      url?: string;
      id?: string;
    };
  };
  children: ITabConfig[];
  type?: DIALOG_TYPE;
  importExcelConfig?: IMPORT_EXCEL_CONFIG;
}

export interface ITabConfig {
  title: string;
  apiSubmit: {
    url: string;
    idName?: string;
  };
  children: ITabChildrenConfig[];
  fieldName: string;
}
export interface ITabChildrenConfig {
  title: string;
  type: string;
  code: string;
  fieldName?: string;
  dialogCode?: string;
  fetchUrl?: string;
  tableType?: TABLE_TYPE;
  fetchByFundId?: boolean;
  customView?: CustomView.viewContractDetail | CustomView.none;
  customViewFetchId?: string;
}

export enum CustomView {
  viewContractDetail = "viewContractDetail",
  none = "none",
}

export interface IMPORT_EXCEL_CONFIG {
  routes: {
    getMappedFieldsData: string;
    getHeaderExcelFile: string;
    getDataReadFromExcelFile: string;
    addManyRecordsImportFromExcel: string;
  };
  fixDataTableCode: string;
  templateFileUrl?: string;
  partentIdName?: string;
  nameKey?: string;
  labelNameKey?: string;
  listOfRecordKey: string;
}
export class DialogBuilder implements IDialog {
  constructor({
    title,
    size,
    submitType,
    code,
  }: {
    title?: string;
    size?:
      | ISizeDialog.SUBMIT_IFRAME
      | ISizeDialog.SUBMIT_IFRAME_LARGE
      | ISizeDialog.SUBMIT_IFRAME_XLARGE;
    submitType?: ITypeSubmit.SINGLE | ITypeSubmit.ALL | ITypeSubmit.NONE;
    code?: string;
  }) {
    (this.title = title ?? ""),
      (this.size = size ?? ISizeDialog.SUBMIT_IFRAME_XLARGE),
      (this.apiSubmit = {
        url: "",
        idName: "",
      }),
      (this.submitType = submitType ?? ITypeSubmit.NONE),
      (this.children = [{ ...new TabConfig(code) }]);
  }
  title: string;
  size:
    | ISizeDialog.SUBMIT_IFRAME
    | ISizeDialog.SUBMIT_IFRAME_LARGE
    | ISizeDialog.SUBMIT_IFRAME_XLARGE;
  apiSubmit: {
    url: string;
    idName?: string | undefined;
    overriding?: string | undefined;
  };
  children: ITabConfig[];
  submitType: ITypeSubmit.SINGLE | ITypeSubmit.ALL | ITypeSubmit.NONE;
}
export class TabConfig implements ITabConfig {
  constructor(code?: string) {
    (this.title = ""),
      (this.apiSubmit = {
        url: "",
        idName: "",
      }),
      (this.children = [{ ...new TabChildrenConfig(code) }]),
      (this.fieldName = "");
  }
  title: string;
  apiSubmit: { url: string; idName?: string | undefined };
  children: ITabChildrenConfig[];
  fieldName: string;
}

export class TabChildrenConfig implements ITabChildrenConfig {
  constructor(code?: string) {
    (this.title = ""),
      (this.type = ""),
      (this.code = code ?? ""),
      (this.fieldName = ""),
      (this.dialogCode = "");
  }
  title: string;
  type: string;
  code: string;
  fieldName?: string | undefined;
  dialogCode?: string | undefined;
  fetchUrl?: string | undefined;
}

export const formConfigFiles: IDialogConfig = {
  // Tham số chung - Ngân hàng
  "bank-api": {
    title: "ngân hàng",
    size: ISizeDialog.SUBMIT_IFRAME_LARGE,
    submitType: ITypeSubmit.SINGLE,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "Ngân hàng",
        apiSubmit: {
          url: "bank-api/add-or-update-record",
          idName: "bankId",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "BANK_ADD_OR_UPDATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/bank-api/find-by-id",
          },
        ],
        fieldName: "",
      },
      {
        title: "Chi nhánh ngân hàng",
        apiSubmit: {
          url: "bank-branch-api/add-or-update-many-records",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.TABLE,
            code: "GENERAL/BANK/BANK-BRANCH",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/bank-api/find-by-id",
            tableType: TABLE_TYPE.EDITABLE,
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Tham số chung - Tổ chức cung cấp dịch vụ
  "organize-api": {
    title: "tổ chức cung cấp dịch vụ",
    size: ISizeDialog.SUBMIT_IFRAME_LARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "organize-api/add-or-update-record",
    },
    children: [
      {
        title: "Tổ chức cung cấp dịch vụ",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "ORGANIZE_PROVIDER_ADD_OR_UPDATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/organize-api/find-by-id",
          },
        ],
        fieldName: "",
      },
      {
        title: "Chọn vai trò",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.TABLE,
            code: "GENERAL/ORGANIZE/ROLE",
            fieldName: "organizeProviderRoles",
            dialogCode: "",
            fetchUrl: "/organize-api/find-by-id",
            tableType: TABLE_TYPE.EDITABLE,
          },
        ],
        fieldName: "organizeProviderRoles",
      },
    ],
  },
  // Tham số chung - Tổ chức phát hành
  "issuer-api": {
    title: "tổ chức phát hành",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.NONE,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "Thông tin chung",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "ISSUER_DETAIL",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/issuer-api/find-by-id",
          },
        ],
        fieldName: "",
      },
      {
        title: "Mã CK",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.TABLE,
            code: "GENERAL/ISSUER/STOCK-CODE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/issuer-api/find-by-id",
            tableType: TABLE_TYPE.EDITABLE,
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Tham số chung - Tài sản
  "security-api": {
    title: "tài sản",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "security-api/add-or-update-record",
    },
    children: [
      {
        title: "Thông tin chung",
        apiSubmit: {
          url: "security-api/add-or-update-record",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "SECURITY_ADD_OR_UPDATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/security-api/find-by-id",
          },
        ],
        fieldName: "",
      },
      {
        title: "Lãi suất",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "SECURITY_INTEREST_RATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/security-api/find-by-id",
          },
          {
            title: "",
            type: ITypeComponent.TABLE,
            code: "GENERAL/SECURITY/INTEREST-RATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/security-api/find-by-id",
            tableType: TABLE_TYPE.EDITABLE,
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Tham số chung - Khách hàng master
  "customer-master-api": {
    title: "khách hàng master",
    size: ISizeDialog.SUBMIT_IFRAME,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "customer-master-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "CUSTOMER_MASTER_ADD_OR_UPDATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/customer-master-api/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Tham số chung - Chính sách định giá tài sản
  "asset-policy-api": {
    title: "chính sách định giá tài sản",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "asset-policy-api/add-or-update-record",
      idName: "id",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "id",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "ASSET_POLIC_ADD_OR_UPDATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/asset-policy-api/find-by-id",
          },
        ],
        fieldName: "asset-policy-api",
      },
    ],
  },
  // Quỹ - Thông tin quỹ
  "fund-information-api": {
    title: "quỹ",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.SINGLE,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "Thông tin chung",
        apiSubmit: {
          url: "fund-information-api/add-or-update-record",
          idName: "fundId",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "FUND_INFORMATION_ADD_OR_UPDATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-information-api/find-by-id",
          },
        ],
        fieldName: "",
      },
      {
        title: "Tổ chức cung cấp dịch vụ",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.TABLE,
            code: "FUND/INFORMATION/ORGANIZE",
            fieldName: "",
            dialogCode: "fund-organize-provider",
            fetchUrl: "/fund-information-api/find-by-id",
            tableType: TABLE_TYPE.BASE,
          },
        ],
        fieldName: "",
      },
      {
        title: "TK ngân hàng và TK giao dịch CK",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.TABLE,
            code: "FUND/INFORMATION/ACOUNT",
            fieldName: "",
            dialogCode: "fund-account",
            fetchUrl: "/fund-information-api/find-by-id",
            tableType: TABLE_TYPE.BASE,
          },
        ],
        fieldName: "",
      },
      {
        title: "NAV",
        apiSubmit: {
          url: "fund-nav-config-api/add-or-update-record",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "NAVCycle",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-nav-config-api/find-by-id",
          },
        ],
        fieldName: "",
      },
      {
        title: "Chính sách giá",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.TABLE,
            code: "FUND/INFORMATION/PRICE-POLICY",
            fieldName: "",
            dialogCode: "fund-asset-policy",
            fetchUrl: "/fund-information-api/find-by-id",
            tableType: TABLE_TYPE.BASE,
          },
        ],
        fieldName: "",
      },
      {
        title: "Kế toán đồ",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.TABLE,
            code: "FUND/INFORMATION/ACCOUNTING-CHART",
            fieldName: "",
            dialogCode: "fund-fund-information-account-system",
            fetchUrl: "",
            tableType: TABLE_TYPE.EXPANDABLE,
          },
        ],
        fieldName: "",
      },
      {
        title: "Quy tắc định khoản",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.TABLE,
            code: "FUND/INFORMATION/RECORDING-TRANSACTIONS",
            fieldName: "",
            dialogCode: "fund-fund-information-recording-transactions",
            fetchUrl: "",
            tableType: TABLE_TYPE.BASE,
          },
        ],
        fieldName: "",
      },
      {
        title: "Ban đại diện quỹ",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.TABLE,
            code: "FUND/INFORMATION/FUND-REPRESENTATIVE-BOARD",
            fieldName: "",
            dialogCode: "fund-manager",
            fetchUrl: "/fund-information-api/find-by-id",
            tableType: TABLE_TYPE.BASE,
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Quỹ - Thông tin quỹ - tổ chức cung cấp dịch vụ
  "fund-organize-provider": {
    title: "tổ chức cung cấp dịch vụ",
    size: ISizeDialog.SUBMIT_IFRAME,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-organize-provider-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "FUND_ORG_PROVIDER_ADD_OR_UPDATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-organize-provider-api/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Quỹ - Thông tin quỹ - TK ngân hàng và TK giao dịch CK
  "fund-account": {
    title: "TK ngân hàng và TK giao dịch CK",
    isCustomTitle: true,
    size: ISizeDialog.SUBMIT_IFRAME,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-account-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "FUND_ACCOUNT_ADD_OR_UPDATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-account-api/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Quỹ - Thông tin quỹ - chính sách giá
  "fund-asset-policy": {
    title: "chính sách giá",
    size: ISizeDialog.SUBMIT_IFRAME,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-asset-policy-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "fund-asset-policy-api/add-or-update-record",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "FUND_ASSET_POLICY_ADD_OR_UPDATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-asset-policy-api/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Quỹ - Thông tin quỹ - ban đại diện quỹ
  "fund-manager": {
    title: "ban đại diện quỹ",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-manager-api/add-or-update-record",
      overriding: "FORM_DATA",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "FUND_MANAGER_ADD_OR_UPDATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-manager-api/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Quỹ - Thông tin quỹ - Kế toán đồ
  "fund-fund-information-account-system": {
    title: "tài khoản",
    size: ISizeDialog.SUBMIT_IFRAME,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-accounting-plan-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "fund-accounting-plan-api/add-or-update-record",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "FundAccountSystemAddNewForm",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Quỹ - Thông tin quỹ - Quy tắc định khoản
  "fund-fund-information-recording-transactions": {
    title: "quy tắc định khoản",
    size: ISizeDialog.SUBMIT_IFRAME,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-recording-trans-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "fund-recording-trans-api/add-or-update-record",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "FUND_RECORDING_TRANSACTIONS_UPDATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-recording-trans-api/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Quỹ - Tỷ giá quỹ
  "fund-exchange-rate-api": {
    title: "tỷ giá quỹ",
    size: ISizeDialog.SUBMIT_IFRAME,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-exchange-rate-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "FUND_EXCHANGE_RATE_ADD_OR_UPDATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-exchange-rate-api/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Table Builder Form
  "table-builder": {
    title: "table builder",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "TableBuilderForm",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Số dư ban đầu
  "fund-accounting-balance-api": {
    title: "Thêm số dư",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-accounting-balance-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "fund-accounting-balance-api/add-or-update-record",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "AddBalance",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Số dư ban đầu - Ngân hàng
  "add-bank-account-balance": {
    title: "Thêm số dư tài khoản ngân hàng",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-accounting-balance-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "fund-accounting-balance-api/add-or-update-record",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "AddBankAccountBalance",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Số dư ban đầu - Tổ chức cung cấp dịch vụ
  "add-organize-balance": {
    title: "Thêm số dư công nợ tổ chức cung cấp dịch vụ",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-accounting-balance-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "fund-accounting-balance-api/add-or-update-record",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "AddOrganizeBalance",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Số dư ban đầu - Nhà đầu tư
  "add-investor-balance": {
    title: "Thêm số dư công nợ nhà đầu tư",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-accounting-balance-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "fund-accounting-balance-api/add-or-update-record",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "AddInvestorBalance",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Số dư ban đầu - Ngân hàng - Số dư
  "add-bank-account-balance-trans": {
    title: "Số dư tài khoản ngân hàng",
    size: ISizeDialog.SUBMIT_IFRAME,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-accounting-balance-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "fund-accounting-balance-api/add-or-update-record",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "AddBankAccountBalanceTrans",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Số dư ban đầu - Tổ chức cung cấp dịch vụ - Số dư
  "add-organize-balance-trans": {
    title: "Số dư công nợ tổ chức cung cấp dịch vụ",
    size: ISizeDialog.SUBMIT_IFRAME,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-accounting-balance-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "fund-accounting-balance-api/add-or-update-record",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "AddOrganizeBalanceTrans",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Số dư ban đầu - Nhà đầu tư - Số dư
  "add-investor-balance-trans": {
    title: "Số dư công nợ nhà đầu tư",
    size: ISizeDialog.SUBMIT_IFRAME,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-accounting-balance-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "fund-accounting-balance-api/add-or-update-record",
          idName: "",
        },
        children: [],
        fieldName: "",
      },
    ],
  },
  // Huy động vốn - Kết quả giao dịch CCQ - Import excel
  "add-new-fund-raising-trans-result": {
    type: DIALOG_TYPE.IMPORT_EXCEL,
    title: "Nhập file excel",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    customBottomButton: ICustomTypeBottomButton.none,
    apiSubmit: {
      url: "",
    },
    children: [],
    importExcelConfig: {
      routes: {
        getMappedFieldsData: "fund-raising-api/cert/entity-excel-map",
        getHeaderExcelFile: "fund-raising-api/read-header-excel-file",
        getDataReadFromExcelFile: "fund-raising-api/cert/read-from-excel-file",
        addManyRecordsImportFromExcel:
          "fund-raising-api/cert/add-or-update-record",
      },
      fixDataTableCode: "FUND-RAISING/TRANS-RESULT/FIX-DATA",
      partentIdName: "fundId",
      nameKey: "name",
      labelNameKey: "Tên kết quả giao dịch CCQ",
      templateFileUrl: "Ket_qua_giao_dich_CCQ_File_Mau.xlsx",
      listOfRecordKey: "certTrans",
    },
  },
  // Huy động vốn - Kết quả giao dịch CCQ - Chi tiết
  "show-fund-raising-trans-result": {
    title: "Chi tiết kết quả giao dịch CCQ",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "FundRaisingTransResultForm",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Huy động vốn - Hạch toán phân bổ CCQ -Chi tiết hạch toán
  "fund-raising-accounting-distribution": {
    title: "Chi tiết hạch toán",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "AccountingDistributionDetail",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Huy động vốn - Hạch toán giao dịch tiền - Chi tiết hạch toán
  "fund-raising-accounting-money-trans": {
    title: "Chi tiết hạch toán giao dịch tiền",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-raising-api/money/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "fund-raising-api/money/add-or-update-record",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "AccountingMoneyTransDetail",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Hoạt động đầu tư - TD - Danh sách hợp đồng - Chi tiết hợp đồng
  "investment-time-deposit-list-of-contract": {
    title: "hợp đồng",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-deposit-contract-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "fund-deposit-contract-api/add-or-update-record",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "TimeDepositContractForm",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Hoạt động đầu tư - TD - Nhận lãi - Khởi tạo
  "investment-time-deposit-periodic-interest-payments-create": {
    title: "Nhận lãi hợp đồng",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    isCustomTitle: true,
    apiSubmit: {
      url: "fund-deposit-contract-get-profit-accounting-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "fundDepositContractId",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            customView: CustomView.viewContractDetail,
            code: "PERIODIC_INTEREST_PAYMENT_CREATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-deposit-contract-api/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Hoạt động đầu tư - TD - Nhận lãi - Chi tiết
  "investment-time-deposit-periodic-interest-payments": {
    title: "nhận lãi định kỳ",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-deposit-contract-get-profit-accounting-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            customView: CustomView.viewContractDetail,
            code: "PERIODIC_INTEREST_PAYMENT",
            fieldName: "",
            dialogCode: "",
            fetchUrl:
              "/fund-deposit-contract-get-profit-accounting-api/find-by-id",
            customViewFetchId: "fundDepositContractId",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Hoạt động đầu tư - TD - Rút 1 phần - Chi tiết
  "investment-partial-withdrawal-interest-payments": {
    title: "rút một phần",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-deposit-contract-tran-api/withdraw/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            customView: CustomView.viewContractDetail,
            code: "INVESTMENT/PARTIAL_WITHDRAWAL",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-deposit-contract-tran-api/find-by-id",
            customViewFetchId: "fundDepositContractId",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Hoạt động đầu tư - TD - Rút 1 phần - Khởi tạo
  "investment-partial-withdrawal-interest-payments-create": {
    title: "rút một phần",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-deposit-contract-tran-api/withdraw/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "fundDepositContractId",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            customView: CustomView.viewContractDetail,
            code: "INVESTMENT/PARTIAL_WITHDRAWAL_CREATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-deposit-contract-api/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Hoạt động đầu tư - TD - Đặt tiền gửi - Chi tiết
  "investment-td-set-deposit": {
    title: "đặt tiền gửi",
    type: DIALOG_TYPE.FULL_SCREEN,
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "TimeDepositSetDepositForm",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // // Hoạt động đầu tư - TD - Dự thu tiền gửi thủ công
  // "investment-time-set-deposit-manual": {
  //   title: "dự thu tiền gửi thủ công",
  //   size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
  //   submitType: ITypeSubmit.ALL,
  //   apiSubmit: {
  //     url: "",
  //   },
  //   children: [
  //     {
  //       title: "",
  //       apiSubmit: {
  //         url: "",
  //         idName: "",
  //       },
  //       children: [
  //         {
  //           title: "",
  //           type: ITypeComponent.DYNAMIC,
  //           code: "",
  //           fieldName: "",
  //           dialogCode: "",
  //           fetchUrl: "",
  //         },
  //       ],
  //       fieldName: "",
  //     },
  //   ],
  // },
  // Hoạt động đầu tư - TD - Dự thu tiền gửi tự động
  "investment-time-automatic-deposit-collection": {
    title: "dự thu",
    type: DIALOG_TYPE.FULL_SCREEN,
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "TDAutomaticDepositCollectionForm",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Hoạt động đầu tư - TD - Dự thu tiền gửi thủ công
  "investment-time-manual-deposit-collection": {
    title: "dự thu tiền gửi thủ công",
    type: DIALOG_TYPE.FULL_SCREEN,
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "TDManualDepositCollectionForm",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Hoạt động đầu tư - TD - Đáo hạn
  "investment-td-expired": {
    title: "đáo hạn",
    type: DIALOG_TYPE.FULL_SCREEN,
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "TDExpriredForm",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  //Hoạt động đầu tư - TD - Danh sách hợp đồng - Tất toán trước hạn
  "investment-td-contract-settlement-premature": {
    title: "tất toán hợp đồng",
    // type: DIALOG_TYPE.FULL_SCREEN,
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-deposit-contract-tran-api/terminate/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "fundDepositContractId",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            // code: "TDContractSettlementPrematureForm",
            customView: CustomView.viewContractDetail,
            code: "INVESTMENT/CONTRACT_SETTLEMENT_PREMATURE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-deposit-contract-api/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Hoạt động đầu tư - TD - Tất toán HD
  "investment-td-contract-settlement": {
    title: "tất toán hợp đồng",
    // type: DIALOG_TYPE.FULL_SCREEN,
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-deposit-contract-tran-api/terminate/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            // code: "TDContractSettlementForm",
            customView: CustomView.viewContractDetail,
            // code: "INVESTMENT/CONTRACT_SETTLEMENT",
            code: "INVESTMENT/CONTRACT_SETTLEMENT_PREMATURE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-deposit-contract-tran-api/find-by-id",
            customViewFetchId: "fundDepositContractId",
          },
        ],
        fieldName: "",
      },
    ],
  },
  //Hoạt động đầu tư - TD - Danh sách hợp đồng - Tái tục hợp đồng - Khởi tạo
  "investment-td-contract-renewed-import": {
    title: "tái tục hợp đồng",
    // type: DIALOG_TYPE.FULL_SCREEN,
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-deposit-contract-api/renewed/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "rootFundDepositContractId",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            // code: "TDContractSettlementPrematureForm",
            customView: CustomView.viewContractDetail,
            code: "INVESTMENT/CONTRACT_RENEWED",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-deposit-contract-api/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Hoạt động đầu tư - TD - Tái tục hợp đồng
  "investment-td-contract-renewed": {
    title: "tái tục hợp đồng",
    // type: DIALOG_TYPE.FULL_SCREEN,
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-deposit-contract-api/renewed/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            // code: "TDContractSettlementForm",
            customView: CustomView.viewContractDetail,
            // code: "INVESTMENT/CONTRACT_SETTLEMENT",
            code: "INVESTMENT/CONTRACT_RENEWED",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-deposit-contract-api/renewed/find-by-id",
            customViewFetchId:"rootFundDepositContractId"
          },
        ],
        fieldName: "",
      },
    ],
  },
  // HĐĐT - Đầu tư chứng khoán niêm yết - Kết quả giao dịch - Chi tiết giao dịch
  "show-investment-td-listed-securities-trans-result": {
    title: "kết quả giao dịch chứng khoán niêm yết",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "LSTransResultForm",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // HĐĐT - Đầu tư chứng khoán niêm yết - Kết quả giao dịch - Import excel
  "investment-td-listed-securities-trans-result-import-excel": {
    type: DIALOG_TYPE.IMPORT_EXCEL,
    title: "Nhập file excel",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    customBottomButton: ICustomTypeBottomButton.none,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "",
    },
    children: [],
    importExcelConfig: {
      routes: {
        getMappedFieldsData: "fund-stock-invest/trans/entity-excel-map",
        getHeaderExcelFile: "fund-stock-invest/read-header-excel-file",
        getDataReadFromExcelFile:
          "fund-stock-invest/trans/read-from-excel-file",
        addManyRecordsImportFromExcel:
          "fund-stock-invest/trans/add-or-update-record",
      },
      fixDataTableCode: "INVESTMENT/LISTED-SECURITIES/TRANS-RESULT/FIX-DATA",
      partentIdName: "fundId",
      nameKey: "name",
      labelNameKey: "Tên đợt giao dịch",
      templateFileUrl: "Template_Import_CKNY.xlsx",
      listOfRecordKey: "transactions",
    },
  },
  // HĐĐT - Đầu tư chứng khoán niêm yết - Hạch toán phân bổ
  "investment-td-listed-securities-accounting-distribution": {
    title: "Chi tiết hạch toán",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "LSAccountingDistribution",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  "investment-money-transaction-pay-brokerage-fees": {
    title: "trả phí môi giới",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-deposit-contract-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "INVESTMENT/MONEY_TRANSACTION/PAY_BROKERAGE_FEES",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-stock-invest/trans/accounting-details",
          },
        ],
        fieldName: "",
      },
    ],
  },
  "investment-money-transaction-receive-sale-money": {
    title: "nhận tiền bán",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-deposit-contract-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "INVESTMENT/MONEY_TRANSACTION/RECEIVE_SALE_MONEY",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-stock-invest/trans/accounting-details",
          },
        ],
        fieldName: "",
      },
    ],
  },
  "investment-money-transaction-pay-to-buy": {
    title: "trả tiền mua",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-deposit-contract-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "INVESTMENT/MONEY_TRANSACTION/PAY_TO_BUY",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-stock-invest/trans/accounting-details",
          },
        ],
        fieldName: "",
      },
    ],
  },
  "investment-money-transaction-pay-taxes": {
    title: "trả thuế bán",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-deposit-contract-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "INVESTMENT/MONEY_TRANSACTION/PAY_TAXES",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-stock-invest/trans/accounting-details",
          },
        ],
        fieldName: "",
      },
    ],
  },
  "investment-money-transaction-process-fees": {
    title: "trả phí xử lý giao dịch",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-deposit-contract-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "INVESTMENT/MONEY_TRANSACTION/PAY_TRANSACTION_PROCESS_FEES",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-stock-invest/trans/accounting-details",
          },
        ],
        fieldName: "",
      },
    ],
  },

  // HĐĐT - Đầu tư chứng khoán niêm yết - Dự thu trái tức - Quản lý dự thu trái tức
  "investment-listed-securities-collection-bond": {
    title: "dự thu trái tức",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "INVESTMENT/LISTED-SECURITIES/COLLECTION-BOND",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-stock-invest/trans/accounting-details",
          },
        ],
        fieldName: "",
      },
    ],
  },
  //HĐĐT - Đầu tư chứng khoán niêm yết - Dự thu trái tức - Dự thu thủ công
  "investment-listed-securities-collection-manual": {
    title: "Dự thu thủ công",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    isCustomTitle: true,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "collectionId",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,

            code: "PERIODIC_INTEREST_LISTED_SECURITIES_COLLECTION_MANUAL",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-stock-invest/trans/accounting-details",
          },
        ],
        fieldName: "",
      },
    ],
  },
  //HĐĐT - Đầu tư chứng khoán niêm yết - Dự thu trái tức - Dự thu tự động
  "investment-listed-securities-collection-automatic": {
    title: "Dự thu tự động",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    isCustomTitle: true,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,

            code: "PERIODIC_INTEREST_LISTED_SECURITIES_COLLECTION_AUTOMATIC",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-stock-invest/trans/accounting-details",
          },
        ],
        fieldName: "",
      },
    ],
  },

  // HĐĐT - Đầu tư chứng khoán OTC - Khai báo hợp đồng - Chi tiết
  "investment-stock-otc-contract-list-detail": {
    title: "Hợp đồng chứng khoán OTC",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    isCustomTitle: true,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "INVESTMENT/STOCK-OTC/CONTRACT-LIST/DETAIL",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  
  // Quy trình tính NAV - Quy trình định giá tài sản - Import Excel Nhập giá chứng khoán
  "nav-cal-process/asset-valuation-process/enter-stock-price/import-excel": {
    type: DIALOG_TYPE.IMPORT_EXCEL,
    title: "Nhập file excel",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    customBottomButton: ICustomTypeBottomButton.none,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "",
    },
    children: [],
    importExcelConfig: {
      routes: {
        getMappedFieldsData: "fund-stock-price-api/entity-excel-map",
        getHeaderExcelFile: "fund-stock-price-api/read-header-excel-file",
        getDataReadFromExcelFile: "fund-stock-price-api/read-from-excel-file",
        addManyRecordsImportFromExcel:
          "fund-stock-price-api/add-or-update-record",
      },
      fixDataTableCode:
        "NAV-CAL-PROCESS/ASSET-VALUATION-PROCESS/ENTER-STOCK-PRICE/FIX-DATA",
      partentIdName: "fundId",
      // nameKey: "name",
      // labelNameKey: "Tên đợt giao dịch",
      templateFileUrl: "Nhap_gia_chung_khoan_File_Mau.xlsx",
      listOfRecordKey: "transactions",
    },
  },
  // Quy trình tính NAV - Quy trình định giá tài sản - Nhập giá chứng khoán (Chi tiết)
  "nav-cal-process/asset-valuation-process/enter-stock-price/detailed": {
    title: "kết quả nhập giá chứng khoán",
    size: ISizeDialog.SUBMIT_IFRAME_LARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "NAV_CALCULATION_PROCESS/ASSET_VALUATION_PROCESS/DETAIL",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-stock-price-api/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Quy trình tính NAV - Quy trình định giá tài sản - Định giá chứng khoán
  "nav-cal-process/asset-valuation-process/securities-valuation": {
    title: "Định giá chứng khoán",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.SINGLE,
    customTabHeader: ICustomTypeTabHeader.onlyTab,
    customBottomButton: ICustomTypeBottomButton.submitSingleThenTurnOff,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "Thông tin chung",
        apiSubmit: {
          url: "fund-stock-price-api/update-final-price-many-records",
          idName: "detailStock",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "NAV_CALCULATION_PROCESS/ASSET_VALUATION_PROCESS/INFORMATION",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
      {
        title: "Tổng hợp chính sách giá",
        apiSubmit: {
          url: "fund-stock-price-api/update-final-price-many-records",
          idName: "detailStock",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.TABLE,
            code: "NAV-CALCULATION-PROCESS/ASSET-VALUATION-PROCESS/SUMMARY-OF-PRICE-POLICY",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
            tableType: TABLE_TYPE.EDITABLE,
          },
        ],
        fieldName: "",
      },
      {
        title: "Lịch sử chốt giá",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.TABLE,
            code: "NAV-CALCULATION-PROCESS/ASSET-VALUATION-PROCESS/PRICE-CLOSING-HISTORY",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
            tableType: TABLE_TYPE.EDITABLE,
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Quy trình tính NAV - Đối chiếu số dư
  "nav-cal-process/balance-reconciliation": {
    type: DIALOG_TYPE.IMPORT_EXCEL,
    title: "Nhập file excel",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    customBottomButton: ICustomTypeBottomButton.none,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "",
    },
    children: [],
    importExcelConfig: {
      routes: {
        getMappedFieldsData: "fund-money-statement-api/entity-excel-map",
        getHeaderExcelFile: "fund-money-statement-api/read-header-excel-file",
        getDataReadFromExcelFile:
          "fund-money-statement-api/read-from-excel-file",
        addManyRecordsImportFromExcel:
          "fund-money-statement-api/imported-batch/add-or-update-record",
      },
      fixDataTableCode:
        "NAV-CAL-PROCESS/BALANCE-RECONCILIATION/ENTER-BALANCE/FIX-DATA",
      partentIdName: "fundId",
      nameKey: "name",
      labelNameKey: "Tên đợt giao dịch",
      templateFileUrl: "Mau_Doi_Chieu_So_du.xlsx",
      listOfRecordKey: "records",
    },
  },
  // Quy trình tính NAV - Đối chiếu số dư (Chi tiết)
  "nav-cal-process/balance-reconciliation/detailed": {
    title: "Danh sách số dư",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "BalanceCompareDetailForm",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Quy trình tính NAV - Đối chiếu số dư - Đối chiếu
  "nav-cal-process/balance-compare": {
    title: "Đối chiếu số dư",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-money-statement-api/set-money-statement-by-nav-batch",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "fund-money-statement-api/set-money-statement-by-nav-batch",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "BalanceCompareForm",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Quy trình tính NAV - Xác định tính NAV
  "nav-cal-process/nav-determination": {
    title: "Xác định NAV",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.SINGLE,
    customTabHeader: ICustomTypeTabHeader.onlyTab,
    customBottomButton: ICustomTypeBottomButton.lockNav,
    isCustomTitle: true,
    apiSubmit: {
      url: "",
      approveUrl: "fund-accounting-api/approved-nav",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "fund-accounting-api/lock-nav",
          idName: "fundId",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "NAV_CALCULATION_PROCESS/DEFINE_NAV/DETAIL",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-nav-accounting-plan-api/nav-asset",
            fetchByFundId: true,
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Giao dịch nội bộ - Quản lý hợp đồng dịch vụ - Danh sách hợp đồng
  "internal-transaction/management-of-contract-fees": {
    title: "Danh sách hợp đồng",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.SINGLE,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "Hợp đồng",
        apiSubmit: {
          url: "fund-contract-fee-api/add-or-update-record",
          idName: "fundContractFeeId",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "INTERNAL_TRANSACTION/LIST_OF_CONTRACT",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-contract-fee-api/find-by-id",
          },
        ],
        fieldName: "",
      },
      {
        title: "Khai báo bậc thang phí",
        apiSubmit: {
          url: "fund-contract-fee-api/fee-setting/add-or-update-many-records",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.TABLE,
            code: "INTERNAL_TRANSACTION/MANAGEMENT_OF_SERVICE_CONTRACT_FEES",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
            tableType: TABLE_TYPE.EDITABLE,
          },
        ],
        fieldName: "",
      },
    ],
  },
  "internal-transaction/estimated-contract-cost-expenditure": {
    title: "Dự chi hợp đồng",
    size: ISizeDialog.SUBMIT_IFRAME_LARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "INTERNAL_TRANSACTION/CONTRACT_EXPENSE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-contract-fee-api/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Giao dịch nội bộ - Bút toán thủ công - thêm mới
  "internal-transaction/manual-accounting/import": {
    title: "bút toán thủ công",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-manual-accounting-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "fund-manual-accounting-api/add-or-update-record",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "SetManualAccountingFormImport",
            // code: "ManualAccountingForm",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Giao dịch nội bộ - Bút toán thủ công - Xem chi tiết
  "internal-transaction/manual-accounting/detail": {
    title: "bút toán thủ công",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-manual-accounting-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "fund-manual-accounting-api/add-or-update-record",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "SetManualAccountingFormDetail",
            // code: "ManualAccountingForm",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Giao dịch nội bộ - Cập nhật giá vốn chứng khoán
  "internal-transaction/update-capital-price-securities": {
    title: "Cập nhật giá vốn chứng khoán",
    isCustomTitle: true,
    size: ISizeDialog.SUBMIT_IFRAME,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-stock-balances-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "INTERNAL_TRANSACTION/UPDATE_CAPITAL_PRICE_SECURITIES/FORM_UPDATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-stock-balances-api/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Quy trình tính NAV - Định giá chứng khoán
  "asset-valuation-process": {
    title: "định giá chứng khoán",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.SINGLE,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "Thông tin chung",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
      {
        title: "Tổng hợp chính sách giá",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
      {
        title: "lịch sử chốt giá",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Báo cáo NAV - Báo cáo thống kê - Lịch sử nav
  "nav-reports-statistical-history": {
    title: "Báo cáo lịch sử NAV",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    customTabHeader: ICustomTypeTabHeader.onlyTab,
    customBottomButton: ICustomTypeBottomButton.none,
    isCustomTitle: true,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "Báo cáo lịch sử NAV",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "ReportStaticNavScreen",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Báo cáo NAV - Báo cáo thống kê - Danh mục đầu tư
  "nav-reports-statistical-investment": {
    title: "Báo cáo hoạt động đầu tư",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    customTabHeader: ICustomTypeTabHeader.onlyTab,
    customBottomButton: ICustomTypeBottomButton.none,
    isCustomTitle: true,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "Báo cáo hoạt động đầu tư",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "ReportStaticInvestmentScreen",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "",
          },
        ],
        fieldName: "",
      },
    ],
  },

  // Hoạt động đầu tư - CD - Danh sách hợp đồng - Chi tiết
  "investment-certificate-deposit-list-of-contract": {
    title: "hợp đồng",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "fund-certificate-deposit/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,

            code: "INVESTMENT/CERTIFICATES_DEPOSIT/CONTRACT_LIST",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-certificate-deposit/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },

  // Hoạt động đầu tư - CD - Xác nhận hợp đồng mua/ban
  "investment-certificate-deposit-confirm-purchase-sale-create": {
    title: "Xác nhận hợp đồng mua",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,

            code: "INVESTMENT/CERTIFICATES_DEPOSIT/CONFIRM_SALE_PURCHASE/FORM_CREATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-certificate-deposit/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },

  // Hoạt động đầu tư - CD - Xác nhận hợp đồng mua/ban
  "investment-certificate-deposit-confirm-purchase-sale-show": {
    title: "Xác nhận hợp đồng mua",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,

            code: "INVESTMENT/CERTIFICATES_DEPOSIT/CONFIRM_SALE_PURCHASE/FORM_SHOW",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-certificate-deposit/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },

  // Hoạt động đầu tư - CD - Trả tiền mua CD
  "investment-certificate-deposit-pay-purchase": {
    title: "Trả tiền mua chứng chỉ CD",
    isCustomTitle:true,
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "INVESTMENT/CERTIFICATES_DEPOSIT/PAY_PURCHASE/FORM_CREATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-certificate-deposit/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },

  // Hoạt động đầu tư - CD - Nhận tiền bán CD
  "investment-certificate-deposit-receive-moneny-from-sale": {
    title: "Nhận tiền bán CD",
    isCustomTitle:true,
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "INVESTMENT/CERTIFICATES_DEPOSIT/RECEIVE_MONEY_FROM_SALE/FORM_CREATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-certificate-deposit/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },

  // Hoạt động đầu tư - CD - Dự thu
  "investment-certificate-deposit-estimated-revenue-create": {
    title: "Dự thu",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    isCustomTitle: true,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,

            code: "INVESTMENT/CERTIFICATES_DEPOSIT/ESTIMATED_REVENUE/FORM_CREATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-certificate-deposit/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },

  // Hoạt động đầu tư - CD - Xử lý lãi dự thu
  "investment-certificate-deposit-processing-accrued-interest-create": {
    title: "Xử lý lãi dự thu",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    isCustomTitle: true,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,

            code: "INVESTMENT/CERTIFICATES_DEPOSIT/PROCESSING_ACCRUED_INTEREST/FORM_CREATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-certificate-deposit/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },

  // Hoạt động đầu tư - CD - Nhận lãi
  "investment-certificate-deposit-get-profit-create": {
    title: "Nhận lãi",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    isCustomTitle: true,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "INVESTMENT/CERTIFICATES_DEPOSIT/GET_PROFIT/FORM_CREATE",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/fund-certificate-deposit/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // Tài khoản và nhóm quyền - Tài khoản - chi tiết
  "decentralization-account": {
    title: "Tài khoản",
    size: ISizeDialog.SUBMIT_IFRAME,
    submitType: ITypeSubmit.ALL,
    apiSubmit: {
      url: "identity-user-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "identity-user-api/add-or-update-record",
          idName: "accountId",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "AccountAdd",
            fieldName: "",
            dialogCode: "",
            // fetchUrl: "",
            fetchUrl: "/identity-user-api/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },
  // "decentralization-account-create": {
  //   title: "Tài khoản",
  //   size: ISizeDialog.SUBMIT_IFRAME_LARGE,
  //   submitType: ITypeSubmit.ALL,
  //   apiSubmit: {
  //     url: "account-api/add-or-update-record",
  //   },
  //   children: [
  //     {
  //       title: "Thông tin tài khoản",
  //       apiSubmit: {
  //         url: "account-api/add-or-update-record",
  //         idName: "accountId",
  //       },
  //       children: [
  //         {
  //           title: "",
  //           type: ITypeComponent.DYNAMIC,
  //           code: "DECENTRALIZATION_ADD_OR_UPDATE",
  //           fieldName: "",
  //           dialogCode: "",
  //           fetchUrl: "/account-api/find-by-id",
  //         },
  //       ],
  //       fieldName: "",
  //     }
  //   ],
  // },

  //Tài khoản và nhóm quyền - Nhóm quyền - thêm mới
  "decentralization-group-function-create": {
    title: "Thêm mới nhóm quyền",
    size: ISizeDialog.SUBMIT_IFRAME,
    submitType: ITypeSubmit.ALL,
    // isCustomTitle:true,
    apiSubmit: {
      url: "group-privileges-api/add-or-update-record",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "group-privileges-api/add-or-update-record",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "DecentralizationFormImport",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/group-privileges-api/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },

  //Tài khoản và nhóm quyền - Nhóm quyền - chi tiết
  "decentralization-group-function-detail": {
    title: "Chi tiết nhóm quyền",
    size: ISizeDialog.SUBMIT_IFRAME,
    submitType: ITypeSubmit.ALL,
    isCustomTitle: true,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.BUILD,
            code: "DecentralizationFormDetail",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/group-privileges-api/find-by-id",
          },
        ],
        fieldName: "",
      },
    ],
  },
  //sự kiện quyền - thong tin chi tiết sự kiện quyền của quỹ
  "event-thq-detail": {
    title: "chi tiết sự kiện quyền của quỹ",
    size: ISizeDialog.SUBMIT_IFRAME_XLARGE,
    submitType: ITypeSubmit.ALL,
    isCustomTitle: true,
    apiSubmit: {
      url: "",
    },
    children: [
      {
        title: "",
        apiSubmit: {
          url: "",
          idName: "",
        },
        children: [
          {
            title: "",
            type: ITypeComponent.DYNAMIC,
            code: "EVENT_THQ/EVENT_THQ_INFO",
            fieldName: "",
            dialogCode: "",
            fetchUrl: "/aloalo123-1234",
          },
        ],
        fieldName: "",
      },
    ],
  },
};
