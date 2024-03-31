import React, { useState, useEffect, useRef } from "react";
import { useStyles } from "./InvestmentScreen.styles";
import { BaseDynamicTable } from "@/src/components/BaseTable/BaseDynamicTable";
import {
  PARAM_INTERFACE,
  SEARCH_TERMS_INTERFACE,
  TABLE_OPTIONS_INTERFACE,
} from "@/src/types";
import { dispatch, useSelector } from "@/src/store";
import { getTableConfigStore } from "@/src/store/reducers/tableConfig";
import Page from "@/src/components/third-party/Page";
import { RootStateProps } from "@/src/types/root";
import { Box, Tab, Tabs } from "@mui/material";
import { BaseAccountingEntryDetailsTable } from "@/src/components/BaseTable/BaseAccountingEntryDetailsTable";
import { tabsClasses } from "@mui/material/Tabs";

interface Props {
  pageTitle?: string;
  routeName: string;
}

const InvestmentScreenComponent = (props: Props): JSX.Element => {
  const classes = useStyles();
  const globalFundId = useSelector(
    (state: RootStateProps) => state.general.globalFundId,
  );
  const { routeName } = props;

  const [mainTableConfig, setMainTableConfig] = useState<
    TABLE_OPTIONS_INTERFACE | undefined
  >(undefined);
  const [detailedTableConfig, setDetailedTableConfig] = useState<
    TABLE_OPTIONS_INTERFACE | undefined
  >(undefined);

  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string>("");
  const detailTableComponentRef = useRef<any>(null);

  const getTableConfigByTab = async (obj: {
    title: string;
    mainTableCode: string;
    accountingEntryDetailTableCode?: string;
    configGetData?: {
      url: string;
      params?: PARAM_INTERFACE[];
      searchTerms?: SEARCH_TERMS_INTERFACE[];
    };
  }) => {
    const res = await dispatch(getTableConfigStore(obj.mainTableCode));
    setMainTableConfig(res || undefined);

    if (!!obj.accountingEntryDetailTableCode) {
      const res2 = await dispatch(
        getTableConfigStore(obj.accountingEntryDetailTableCode),
      );
      setDetailedTableConfig(res2 || undefined);
    } else {
      setDetailedTableConfig(undefined);
    }
  };

  useEffect(() => {
    const asyncFunction = async () => {
      setSelectedId("");
      if (
        !routeName ||
        !CONFIG[routeName] ||
        !CONFIG[routeName].listOfTab[activeTab]
      ) {
        return;
      }
      await getTableConfigByTab(CONFIG[routeName].listOfTab[activeTab]);
    };

    asyncFunction();
  }, [activeTab, routeName]);

  useEffect(() => {
    const refreshTab = () => {
      setActiveTab(0);
    };
    refreshTab();
  }, [routeName]);

  return (
    <Page
      title={`Hoạt động đầu tư${
        CONFIG[routeName] && !!CONFIG[routeName].title
          ? ` - ${CONFIG[routeName].title}`
          : ""
      }`}
    >
      <Box className={classes.titleContainer}>
        {!!CONFIG[routeName] && !!CONFIG[routeName].title ? (
          <Box className={classes.title}>{CONFIG[routeName].title}</Box>
        ) : (
          <></>
        )}
        {CONFIG[routeName] && CONFIG[routeName].listOfTab ? (
          <Tabs
            value={activeTab}
            onChange={(_event, newValue) => setActiveTab(newValue)}
            className={classes.tabContainer}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              [`& .${tabsClasses.scrollButtons}`]: {
                "&.Mui-disabled": { display: "none" },
              },
            }}
          >
            {CONFIG[routeName].listOfTab.map((ele, index) => (
              <Tab label={ele.title} key={index} className={classes.tabLabel} />
            ))}
          </Tabs>
        ) : (
          <></>
        )}
        {mainTableConfig ? (
          <Box
            className={`${classes.mgB} ${
              !!detailedTableConfig ? classes.halfHeight : classes.fullHeight
            }`}
          >
            <BaseDynamicTable
              tableOptions={mainTableConfig}
              parentId={globalFundId}
              onClickRow={
                !!detailedTableConfig
                  ? rowData =>
                      setSelectedId(
                        rowData[
                          `${
                            CONFIG[routeName].listOfTab[activeTab]
                              ?.configGetData?.idNameVal || "id"
                          }`
                        ],
                      )
                  : undefined
              }
              selectedId={!!detailedTableConfig ? selectedId : undefined}
              onRefreshRecord={() => {
                if (detailTableComponentRef.current?.onRefresh) {
                  detailTableComponentRef.current.onRefresh();
                }
              }}
            />
          </Box>
        ) : (
          <></>
        )}
        {detailedTableConfig ? (
          <Box className={classes.detailEntry}>
            <Box className={classes.detailEntryLabel}>
              {"Chi tiết bút toán"}
            </Box>
            <Box>
              <BaseAccountingEntryDetailsTable
                tableOptions={detailedTableConfig}
                currentId={selectedId}
                onlyShow={true}
                configGetData={
                  routeName === "term-deposit-investment" && activeTab === 3
                    ? {
                        url:
                          CONFIG[routeName].listOfTab[activeTab]?.configGetData
                            ?.url || "",
                        searchTerms: [
                          {
                            fieldName: "id",
                            fieldValue: selectedId || "",
                          },
                          {
                            fieldName: "fundId",
                            fieldValue: globalFundId || "",
                          },
                        ],
                      } || {
                        url: "",
                      }
                    : CONFIG[routeName].listOfTab[activeTab]?.configGetData || {
                        url: "",
                      }
                }
                ref={detailTableComponentRef}
                customDetailEntryStyle={`${classes.customDetailEntry}`}
              />
            </Box>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Page>
  );
};
const InvestmentScreen = React.memo(InvestmentScreenComponent);
export { InvestmentScreen };

const CONFIG: {
  [key: string]: {
    title: string;
    listOfTab: {
      title: string;
      mainTableCode: string;
      accountingEntryDetailTableCode?: string;
      configGetData?: {
        url: string;
        params?: PARAM_INTERFACE[];
        searchTerms?: SEARCH_TERMS_INTERFACE[];
        idName?: string;
        idNameVal?: string;
      };
    }[];
  };
} = {
  "term-deposit-investment": {
    title: "Đầu tư tiền gửi có kì hạn TD",
    listOfTab: [
      {
        title: "Danh sách hợp đồng",
        mainTableCode: "INVESTMENT/TIME-DEPOSIT/CONTRACT-LIST/MAIN",
        accountingEntryDetailTableCode: "",
      },
      {
        title: "Đặt tiền gửi",
        mainTableCode: "INVESTMENT/TIME-DEPOSIT/SET-DEPOSIT/MAIN",
        accountingEntryDetailTableCode:
          "INVESTMENT/TIME-DEPOSIT/ACCOUNTING-ENTRY-DETAILS",
        configGetData: {
          url: "fund-deposit-contract-api/contract-deposit-accounting",
          params: [{ paramKey: "accountingType", paramValue: "APPROVED" }],
        },
      },
      {
        title: "Dự thu tiền gửi",
        mainTableCode:
          "INVESTMENT/TIME-DEPOSIT/EXPECTED-DEPOSIT-COLLECTION/MAIN",
        accountingEntryDetailTableCode:
          "INVESTMENT/TIME-DEPOSIT/ACCOUNTING-ENTRY-DETAILS",
        configGetData: {
          url: "fund-deposit-contract-api/contract-deposit-accounting",
          params: [{ paramKey: "accountingType", paramValue: "ACCRUED" }],
        },
      },
      {
        title: "Nhận lãi",
        mainTableCode: "INVESTMENT/TIME-DEPOSIT/PERIODIC-INTEREST-PAYMENT/MAIN",
        accountingEntryDetailTableCode:
          "INVESTMENT/TIME-DEPOSIT/ACCOUNTING-ENTRY-DETAILS/PERIODIC-INTEREST-PAYMENT",
        configGetData: {
          url: "fund-deposit-contract-get-profit-accounting-api/find",
        },
      },
      {
        title: "Rút một phần",
        mainTableCode: "INVESTMENT/TIME-DEPOSIT/WITHDRAW-ONE-PART/MAIN",
        accountingEntryDetailTableCode:
          "INVESTMENT/TIME-DEPOSIT/ACCOUNTING-ENTRY-DETAILS",
        configGetData: {
          url: "fund-deposit-contract-tran-api/accounting-detail",
          idName: "fundDepositContractTranId",
        },
      },
      {
        title: "Đáo hạn",
        mainTableCode: "INVESTMENT/TIME-DEPOSIT/EXPIRED/MAIN",
        accountingEntryDetailTableCode:
          "INVESTMENT/TIME-DEPOSIT/ACCOUNTING-ENTRY-DETAILS",
        configGetData: {
          url: "fund-deposit-contract-tran-api/accounting-detail",
          searchTerms: [
            {
              fieldName: "status",
              fieldValue: "4",
            },
          ],
        },
      },
      {
        title: "Tất toán HĐ",
        mainTableCode: "INVESTMENT/TIME-DEPOSIT/CONTRACT-SETTLEMENT/MAIN",
        accountingEntryDetailTableCode:
          "INVESTMENT/TIME-DEPOSIT/ACCOUNTING-ENTRY-DETAILS",
        configGetData: {
          url: "fund-deposit-contract-tran-api/accounting-detail",
          idName: "fundDepositContractTranId",
          searchTerms: [
            {
              fieldName: "transType",
              fieldValue: "2",
            },
          ],
        },
      },
      {
        title: "Tái tục HĐ",
        mainTableCode: "INVESTMENT/TIME-DEPOSIT/CONTRACT-RENEWAL/MAIN",
        accountingEntryDetailTableCode:
          "INVESTMENT/TIME-DEPOSIT/ACCOUNTING-ENTRY-DETAILS",
        configGetData: {
          url: "fund-deposit-contract-tran-api/accounting-detail",
          idName: "fundDepositContractTranId",
          searchTerms: [
            {
              fieldName: "status",
              fieldValue: "4",
            },
          ],
        },
      },
    ],
  },
  "invest-in-CD-certificates-of-deposit": {
    title: "Giao dịch CD - Chứng chỉ tiền gửi",
    listOfTab: [
      {
        title: "Danh sách hợp đồng",
        mainTableCode: "INVESTMENT/CERTIFICATES_DEPOSIT/CONTRACT-LIST/MAIN",
      },
      {
        title: "Xác nhận hợp đồng mua/bán",
        mainTableCode:
          "INVESTMENT/CERTIFICATES_DEPOSIT/CONFIRM_SALE_PURCHASE/MAIN",
        accountingEntryDetailTableCode:
          "INVESTMENT/TIME-DEPOSIT/ACCOUNTING-ENTRY-DETAILS",
        configGetData: {
          url: "fund-certificate-deposit/accounting-details",
          // params: [{ paramKey: "accountingType", paramValue: "APPROVED" }],
        },
      },
      {
        title: "Trả tiền mua CD",
        mainTableCode: "INVESTMENT/CERTIFICATES_DEPOSIT/PAY_PURCHASE/MAIN",
      },
      {
        title: "Nhận tiền bán CD",
        mainTableCode:
          "INVESTMENT/CERTIFICATES_DEPOSIT/RECEIVE_MONEY_FROM_SALE/MAIN",
      },
      // {
      //   title: "Trả tiền phí thuế",
      //   mainTableCode: "INVESTMENT/CERTIFICATES_DEPOSIT/PAY_FEE_TAX/MAIN",
      // },
      {
        title: "Dự thu CD",
        mainTableCode: "INVESTMENT/CERTIFICATES_DEPOSIT/ESTIMATED_REVENUE/MAIN",
        accountingEntryDetailTableCode:
          "INVESTMENT/TIME-DEPOSIT/ACCOUNTING-ENTRY-DETAILS",
        configGetData: {
          url: "fund-certificate-deposit/accounting-details",
          idName: "fundStockBalanceId",
          idNameVal: "fundStockBalanceId",
        },
      },
      {
        title: "Xử lý lãi dự thu",
        mainTableCode:
          "INVESTMENT/CERTIFICATES_DEPOSIT/PROCESSING_ACCRUED_INTEREST/MAIN",
      },
      {
        title: "Nhận lãi",
        mainTableCode: "INVESTMENT/CERTIFICATES_DEPOSIT/GET_PROFIT/MAIN",
      },
      {
        title: "Tất toán trước hạn",
        mainTableCode:
          "INVESTMENT/CERTIFICATES_DEPOSIT/PREMATURE_SETTLEMENT/MAIN",
      },
      {
        title: "Đáo hạn",
        mainTableCode: "INVESTMENT/CERTIFICATES_DEPOSIT/EXPIRE/MAIN",
      },
      {
        title: "Tất toán HĐ",
        mainTableCode:
          "INVESTMENT/CERTIFICATES_DEPOSIT/CONTRACT_SETTLEMENT/MAIN",
      },
    ],
  },
  "stock-investment-OTC": {
    title: "Đầu tư chứng khoán OTC",
    listOfTab: [
      {
        title: "Khai báo hợp đồng",
        mainTableCode: "INVESTMENT/STOCK-OTC/CONTRACT-LIST/MAIN",
        accountingEntryDetailTableCode: "",
      },
      {
        title: "Xác nhận hợp đồng mua/bán OTC",
        mainTableCode: "INVESTMENT/STOCK-OTC/CONFIRM_SALE_PURCHASE/MAIN",
        accountingEntryDetailTableCode: "",
      },
      {
        title: "Trả tiền mua/bán OTC",
        mainTableCode: "INVESTMENT/STOCK-OTC/PAY_PURCHASE_SALE/MAIN",
        accountingEntryDetailTableCode: "",
      },
    ],
  },
};
