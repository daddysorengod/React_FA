import {
  FormatListBulleted as FormatListBulletedIcon,
  AccountBalance as AccountBalanceIcon,
  PaidOutlined as PaidOutlinedIcon,
  PivotTableChart as PivotTableChartIcon,
  AlignVerticalCenter as AlignVerticalCenterIcon,
  CurrencyExchangeOutlined as CurrencyExchangeOutlinedIcon,
  Leaderboard as LeaderboardIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import SummarizeIcon from "@mui/icons-material/Summarize";

// type
import { NavItemType } from "@app/types/menu";

// icons
const icons = {
  FormatListBulletedIcon,
  AccountBalanceIcon,
  PaidOutlinedIcon,
  PivotTableChartIcon,
  AlignVerticalCenterIcon,
  CurrencyExchangeOutlinedIcon,
  LeaderboardIcon,
  SettingsOutlinedIcon,
  SummarizeIcon,
  GroupIcon,
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

export const pages: NavItemType = {
  id: "group-pages",
  // title: <FormattedMessage id="pages" />,
  type: "group",
  children: [
    {
      id: "general",
      title: "Tham số chung",
      type: "collapse",
      icon: icons.FormatListBulletedIcon,
      dialogCode: [
        "BANK_ADD_OR_UPDATE",
        "ORGANIZE_PROVIDER_ADD_OR_UPDATE",
        "ISSUER_DETAIL",
        "SECURITY_ADD_OR_UPDATE",
        "ASSET_POLIC_ADD_OR_UPDATE",
        "CUSTOMER_MASTER_ADD_OR_UPDATE",
        "SECURITY_INTEREST_RATE",
      ],
      search: "general",
      children: [
        {
          id: "BankApi",
          title: "Ngân hàng",
          type: "item",
          url: "/general/bank-api",
          breadcrumbs: true,
          search: "bank-api",
        },
        {
          id: "OrganizeApi",
          title: "Tổ chức cung cấp dịch vụ",
          type: "item",
          url: "/general/organize-api",
          breadcrumbs: true,
          search: "organize-api",
        },
        {
          id: "IssuerApi",
          title: "Tổ chức phát hành",
          type: "item",
          url: "/general/issuer-api",
          breadcrumbs: true,
          search: "issuer-api",
        },
        {
          id: "SecurityApi",
          title: "Tài sản",
          type: "item",
          url: "/general/security-api",
          breadcrumbs: true,
          search: "security-api",
        },
        {
          id: "CustomerMasterApi",
          title: "Khách hàng master",
          type: "item",
          url: "/general/customer-master-api",
          breadcrumbs: true,
          search: "customer-master-api",
        },
        {
          id: "AssetPolicyApi",
          title: "Chính sách định giá tài sản",
          type: "item",
          url: "/general/asset-policy-api",
          breadcrumbs: true,
          search: "asset-policy-api",
        },
      ],
    },
    {
      id: "fund",
      title: "Quỹ",
      type: "collapse",
      icon: icons.AccountBalanceIcon,
      search: "fund",
      dialogCode: [
        "FUND_INFORMATION_ADD_OR_UPDATE",
        "FUND_MANAGER_ADD_OR_UPDATE",
        "FUND_NAV_CONFIG_ADD_OR_UPDATE",
        "FUND_EXCHANGE_RATE_ADD_OR_UPDATE",
        "FUND_ASSET_POLICY_ADD_OR_UPDATE",
        "FUND_ACCOUNTING_PLAN_ADD_OR_UPDATE",
        "FUND_EXCHANGE_RATE_ADD_OR_UPDATE",
        "FUND_RECORDING_TRANSACTIONS_UPDATE",
        "FUND_ACCOUNT_ADD_OR_UPDATE",
        "FUND_ORG_PROVIDER_ADD_OR_UPDATE",
      ],
      children: [
        {
          id: "fundInformationApi",
          title: "Thông tin quỹ",
          type: "item",
          url: "/fund/fund-information-api",
          breadcrumbs: true,
          search: "fund-information-api",
        },
        {
          id: "fundExchangeRate",
          title: "Tỷ giá",
          type: "item",
          url: "/fund/fund-exchange-rate-api",
          breadcrumbs: true,
          search: "fund-exchange-rate-api",
        },
      ],
    },
    {
      id: "fund-balance",
      title: "Số dư ban đầu",
      type: "collapse",
      icon: icons.PaidOutlinedIcon,
      search: "fund-balance",
      dialogCode: [""],
      children: [
        {
          id: "fund-accounting-balance-api",
          title: "Số dư tài khoản",
          type: "item",
          url: "/fund-balance/fund-accounting-balance-api",
          breadcrumbs: true,
          search: "fund-accounting-balance-api",
        },
        {
          id: "fund-accounting-balance-api/bank-account",
          title: "Số dư tài khoản ngân hàng",
          type: "item",
          url: "/fund-balance/bank-account",
          breadcrumbs: true,
          search: "bank-account",
        },
        {
          id: "fund-accounting-balance-api/organize-api",
          title: "Công nợ tổ chức cung cấp dịch vụ",
          type: "item",
          url: "/fund-balance/organize-api",
          breadcrumbs: true,
          search: "organize-api",
        },
        {
          id: "fund-accounting-balance-api/investor-api",
          title: "Công nợ nhà đầu tư",
          type: "item",
          url: "/fund-balance/investor-api",
          breadcrumbs: true,
          search: "investor-api",
        },
      ],
    },
    {
      id: "fund-raising",
      title: "Huy động vốn",
      type: "collapse",
      icon: icons.PivotTableChartIcon,
      search: "fund-raising",
      dialogCode: [""],
      children: [
        {
          id: "fund-raising-trans-result",
          title: "Kết quả giao dịch CCQ",
          type: "item",
          url: "/fund-raising/trans-result",
          breadcrumbs: true,
          search: "trans-result",
        },
        {
          id: "fund-raising-accounting-distribution",
          title: "Hạch toán phân bổ CCQ",
          type: "item",
          url: "/fund-raising/accounting-distribution",
          breadcrumbs: true,
          search: "accounting-distribution",
        },
        {
          id: "fund-raising-accounting-money-trans",
          title: "Hạch toán giao dịch tiền",
          type: "item",
          url: "/fund-raising/accounting-money-trans",
          breadcrumbs: true,
          search: "accounting-money-trans",
        },
      ],
    },
    {
      id: "investment",
      title: "Hoạt động đầu tư",
      type: "collapse",
      search: "investment",
      icon: icons.LeaderboardIcon,
      dialogCode: [],
      children: [
        {
          id: "term-deposit-investment",
          title: "Đầu tư tiền gửi có kỳ hạn TD",
          type: "item",
          url: "/investment/term-deposit-investment",
          breadcrumbs: true,
          search: "term-deposit-investment",
          dialogCode: [
            "INVESTMENT/PARTIAL_WITHDRAWAL",
            "PERIODIC_INTEREST_PAYMENT",
            "PERIODIC_INTEREST_PAYMENT_CREATE",
            "INVESTMENT/PARTIAL_WITHDRAWAL_CREATE",
            "INVESTMENT/MONEY_TRANSACTION/PAY_BROKERAGE_FEES",
            "INVESTMENT/MONEY_TRANSACTION/PAY_TAXES",
            "INVESTMENT/MONEY_TRANSACTION/PAY_TO_BUY",
            "INVESTMENT/MONEY_TRANSACTION/RECEIVE_SALE_MONEY",
            "INVESTMENT/MONEY_TRANSACTION/PAY_TRANSACTION_PROCESS_FEES",
            "INVESTMENT/CONTRACT_SETTLEMENT_PREMATURE",
            "INVESTMENT/LISTED-SECURITIES/COLLECTION-BOND",
            "PERIODIC_INTEREST_LISTED_SECURITIES_COLLECTION_MANUAL",
            "PERIODIC_INTEREST_LISTED_SECURITIES_COLLECTION_AUTOMATIC",
            "INVESTMENT/CONTRACT_RENEWED",
          ],
        },
        {
          id: "invest-in-CD-certificates-of-deposit",
          title: "Đầu tư chứng chỉ tiền gửi CD",
          type: "item",
          url: "/investment/invest-in-CD-certificates-of-deposit",
          breadcrumbs: true,
          search: "invest-in-CD-certificates-of-deposit",
          dialogCode: [
            "INVESTMENT/CERTIFICATES_DEPOSIT/CONTRACT_LIST",
            "INVESTMENT/CERTIFICATES_DEPOSIT/CONFIRM_SALE_PURCHASE/FORM_CREATE",
            "INVESTMENT/CERTIFICATES_DEPOSIT/CONFIRM_SALE_PURCHASE/FORM_SHOW",
            "INVESTMENT/CERTIFICATES_DEPOSIT/ESTIMATED_REVENUE/FORM_CREATE",
            "INVESTMENT/CERTIFICATES_DEPOSIT/PROCESSING_ACCRUED_INTEREST/FORM_CREATE",
            "INVESTMENT/CERTIFICATES_DEPOSIT/GET_PROFIT/FORM_CREATE",
            "INVESTMENT/CERTIFICATES_DEPOSIT/PAY_PURCHASE/FORM_CREATE",
            "INVESTMENT/CERTIFICATES_DEPOSIT/RECEIVE_MONEY_FROM_SALE/FORM_CREATE",
          ],
        },
        {
          id: "listed-securities",
          title: "Đầu tư chứng khoán NY",
          type: "item",
          url: "/investment/listed-securities",
          breadcrumbs: true,
          search: "listed-securities",
          dialogCode: [
            "INVESTMENT/MONEY_TRANSACTION/PAY_BROKERAGE_FEES",
            "INVESTMENT/MONEY_TRANSACTION/PAY_TAXES",
            "INVESTMENT/MONEY_TRANSACTION/PAY_TO_BUY",
            "INVESTMENT/MONEY_TRANSACTION/RECEIVE_SALE_MONEY",
            "INVESTMENT/MONEY_TRANSACTION/PAY_TRANSACTION_PROCESS_FEES",
          ],
        },
        {
          id: "stock-investment-OTC",
          title: "Đầu tư chứng khoán OTC",
          type: "item",
          url: "/investment/stock-investment-OTC",
          breadcrumbs: true,
          search: "stock-investment-OTC",
          dialogCode: [
            "INVESTMENT/STOCK-OTC/CONTRACT-LIST/DETAIL",
            "PERIODIC_INTEREST_PAYMENT",
            "PERIODIC_INTEREST_PAYMENT_CREATE",
            "INVESTMENT/CONTRACT_SETTLEMENT_PREMATURE",
            "INVESTMENT/LISTED-SECURITIES/COLLECTION-BOND",
            "PERIODIC_INTEREST_LISTED_SECURITIES_COLLECTION_MANUAL",
            "PERIODIC_INTEREST_LISTED_SECURITIES_COLLECTION_AUTOMATIC",
          ],
        },
        // {
        //   id: "stock-investment-derivative",
        //   title: "Đầu tư phái sinh",
        //   type: "item",
        //   url: "/investment/stock-investment-derivative",
        //   breadcrumbs: true,
        //   search: "stock-investment-derivative",
        // },
        // {
        //   id: "investment-CCQ",
        //   title: "Đầu tư CCQ",
        //   type: "item",
        //   url: "/investment/investment-CCQ",
        //   breadcrumbs: true,
        //   search: "investment-CCQ",
        // },
        // {
        //   id: "stock-investment-odd-lot",
        //   title: "Đầu tư chứng khoán lô lẻ",
        //   type: "item",
        //   url: "/investment/stock-investment-odd-lot",
        //   breadcrumbs: true,
        //   search: "stock-investment-odd-lot",
        // },
        // {
        //   id: "real-estate-investment",
        //   title: "Đầu tư BĐS",
        //   type: "item",
        //   url: "/investment/real-estate-investment",
        //   breadcrumbs: true,
        //   search: "real-estate-investment",
        // },
      ],
    },
    {
      id: "internal-transaction",
      title: "Giao dịch nội bộ",
      type: "collapse",
      search: "internal-transaction",
      icon: icons.CurrencyExchangeOutlinedIcon,
      dialogCode: [
        "INTERNAL_TRANSACTION/LIST_OF_CONTRACT",
        "INTERNAL_TRANSACTION/CONTRACT_EXPENSE",
        "INTERNAL_TRANSACTION/UPDATE_CAPITAL_PRICE_SECURITIES/FORM_UPDATE",
      ],
      children: [
        {
          id: "internal-transaction-management-of-service-contract-fees",
          title: "Quản lý phí hợp đồng dịch vụ",
          type: "item",
          url: "/internal-transaction/management-of-service-contract-fees",
          breadcrumbs: true,
          search: "management-of-service-contract-fees",
        },
        // {
        //   id: "internal-transaction-estimated-contract-cost-expenditure",
        //   title: "Dự chi hợp đồng chi phí",
        //   type: "item",
        //   url: "/internal-transaction/estimated-contract-cost-expenditure",
        //   breadcrumbs: true,
        //   search: "estimated-contract-cost-expenditure",
        // },
        {
          id: "internal-transaction-adjustment-of-budgeted-expenses",
          title: "Điều chỉnh phí đã dự chi",
          type: "item",
          url: "/internal-transaction/adjustment-of-budgeted-expenses",
          breadcrumbs: true,
          search: "adjustment-of-budgeted-expenses",
        },
        {
          id: "internal-transaction-manual-accounting",
          title: "Bút toán thủ công",
          type: "item",
          url: "/internal-transaction/manual-accounting",
          breadcrumbs: true,
          search: "manual-accounting",
        },
        {
          id: "internal-transaction-update-capital-price-of-securities",
          title: "Cập nhật giá vốn chứng khoán",
          type: "item",
          url: "/internal-transaction/update-capital-price-of-securities",
          breadcrumbs: true,
          search: "update-capital-price-of-securities",
        },
      ],
    },
    {
      id: "nav-calculation-process",
      title: "Quy trình tính NAV",
      type: "collapse",
      search: "nav-calculation-process",
      icon: icons.AlignVerticalCenterIcon,
      dialogCode: ["INTERNAL_TRANSACTION/CONTRACT_EXPENSE"],
      children: [
        {
          id: "nav-calculation-process-asset-valuation-process",
          title: "Quy trình định giá tài sản",
          type: "item",
          url: "/nav-calculation-process/asset-valuation-process",
          breadcrumbs: true,
          search: "asset-valuation-process",
        },
        {
          id: "nav-calculation-process-balance-reconciliation",
          title: "Đối chiếu số dư",
          type: "item",
          url: "/nav-calculation-process/balance-reconciliation",
          breadcrumbs: true,
          search: "balance-reconciliation",
        },
        {
          id: "nav-calculation-process-nav-determination",
          title: "Xác định NAV",
          type: "open-form",
          dialogConfig: {
            dialogCode: "nav-cal-process/nav-determination",
            formCode: [
              "NAV_CALCULATION_PROCESS/DEFINE_NAV/DETAIL",
              "NAV_CALCULATION_PROCESS/DEFINE_NAV/DETAIL/CAP_FEE",
            ],
          },
          // url: "/nav-calculation-process/nav-determination",
          url: "",
          breadcrumbs: true,
          search: "nav-determination",
        },
      ],
    },
    {
      id: "nav-reports",
      title: "Báo cáo NAV",
      type: "collapse",
      search: "nav-reports",
      icon: icons.SummarizeIcon,
      children: [
        // {
        //   id: "nav-reports-accounting",
        //   title: "Báo cáo kế toán",
        //   type: "collapse",
        //   search: "nav-reports",

        //   children: [

        //   ],
        // },
        // {
        //   id: "nav-reports-financial-open-fund",
        //   title: "Báo cáo tài chính quỹ mở",
        //   type: "collapse",
        //   search: "nav-reports-financial-fund",

        //   children: [

        //   ],
        // },
        // {
        //   id: "nav-reports-financial-etf-fund",
        //   title: "Báo cáo tài chính quỹ ETF",
        //   type: "collapse",
        //   search: "nav-reports-financial-etf-fund",

        //   children: [

        //   ],
        // },
        {
          id: "nav-reports-statistical",
          title: "Báo cáo thống kê",
          type: "collapse",
          search: "nav-reports-statistical",
          children: [
            {
              id: "nav-reports-statistical-history",
              title: "Báo cáo lịch sử NAV",
              type: "open-form",
              dialogConfig: {
                dialogCode: "nav-reports-statistical-history",
                formCode: ["REPORT_NAV/STATISTICAL/NAV_HISTORY"],
              },
              // url: "/nav-calculation-process/nav-determination",
              url: "",
              breadcrumbs: true,
              search: "nav-determination",
            },
            {
              id: "nav-reports-statistical-history",
              title: "Báo cáo danh mục đầu tư",
              type: "open-form",
              dialogConfig: {
                dialogCode: "nav-reports-statistical-investment",
                formCode: ["REPORT_NAV/STATISTICAL/INVESTMENT_PORTFOLIO"],
              },
              // url: "/nav-calculation-process/nav-determination",
              url: "",
              breadcrumbs: true,
              search: "nav-determination",
            },
          ],
        },
      ],
    },
    {
      //menu phân quyền
      id: "decentralization",
      title: "Tài khoản & nhóm quyền",
      type: "collapse",
      icon: icons.GroupIcon,
      dialogCode: [
        "DECENTRALIZATION/GROUP_FUNCTION/FORM_SHOW",
        "DECENTRALIZATION/GROUP_FUNCTION/FORM_CREAT",
        "DECENTRALIZATION_ADD_OR_UPDATE",
      ],
      search: "decentralization",
      children: [
        {
          id: "decentralization-decentralization-group-function",
          title: "Tài khoản & nhóm quyền",
          type: "item",
          url: "/decentralization/decentralization-group-function",
          breadcrumbs: true,
          search: "decentralization-group-function",
        },
      ],
    },
    {
      //menu sự kiện quyền
      id: "event-THQ",
      title: "Sự kiện quyền",
      type: "collapse",
      icon: icons.GroupIcon,
      dialogCode: [
        "EVENT_THQ/EVENT_THQ_INFO"
      ],
      search: "event-THQ",
      children: [
        {
          id: "eventTHQ-event-list",
          title: "Sự kiện quyền",
          type: "item",
          url: "/event-THQ/event-list",
          breadcrumbs: true,
          search: "event-list",
        },
      ],
    },
    {
      id: "setting",
      title: "Cấu hình",
      type: "collapse",
      icon: icons.SettingsOutlinedIcon,
      children: [
        {
          id: "form-setting",
          title: "Form Setting",
          type: "item",
          url: "/form-builder",
        },
        {
          id: "table-setting",
          title: "Table Builder",
          type: "item",
          url: "/table-builder",
        },
      ],
    },
  ],
};
