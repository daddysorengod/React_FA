import React, { useState, useEffect, useRef } from "react";
import { useStyles } from "./InvestmentListedSecuritiesScreen.styles";
import useTranslation from "next-translate/useTranslation";
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
import { BaseAutocomplete } from "@/src/components/BaseAutocomplete";
import { getListDataBase } from "@/src/helpers";

interface Props {
  pageTitle?: string;
}

const InvestmentListedSecuritiesScreenComponent = (
  props: Props,
): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const globalFundId = useSelector(
    (state: RootStateProps) => state.general.globalFundId,
  );

  const [mainTableConfig, setMainTableConfig] = useState<
    TABLE_OPTIONS_INTERFACE | undefined
  >(undefined);
  const [detailedTableConfig, setDetailedTableConfig] = useState<
    TABLE_OPTIONS_INTERFACE | undefined
  >(undefined);

  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string>("");
  const [transPeriod, setTransPeriod] = useState<string>("");
  const [listOfTransPeriod, setListOfTransPeriod] = useState<any[]>([]);
  const detailTableComponentRef = useRef<any>(null);

  const handleChangeTransPeriod = (value: any) => {
    setTransPeriod(value);
  };

  const getListOfTransPeriod = async () => {
    if (!globalFundId) {
      setListOfTransPeriod([]);
    }
    const res = await getListDataBase({
      url: "fund-stock-invest/find",
      searchTerms: [{ fieldName: "fundId", fieldValue: globalFundId }],
    });

    setListOfTransPeriod(res?.source || []);
  };

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

  const handleOnMainTableRefreshRecord = () => {
    if (activeTab == 0) {
      getListOfTransPeriod();
    } else {
      if (detailTableComponentRef.current?.onRefresh) {
        detailTableComponentRef.current.onRefresh();
      }
    }
  };

  useEffect(() => {
    const asyncFunction = async () => {
      setSelectedId("");
      if (!CONFIG || !CONFIG.listOfTab[activeTab]) {
        return;
      }
      await getTableConfigByTab(CONFIG.listOfTab[activeTab]);
    };

    asyncFunction();
  }, [activeTab]);

  useEffect(() => {
    const asyncFunction = async () => {
      await getListOfTransPeriod();
    };

    asyncFunction();
  }, [globalFundId]);

  const heightTable = {
    0: {
      mainTable: "90%",
      detailedTable: "0%",
    },
    1: {
      mainTable: "55%",
      detailedTable: "45%",
    },
    2: {
      mainTable: "70%",
      detailedTable: "30%",
    },
    3: {
      mainTable: "70%",
      detailedTable: "30%",
    },
  };

  return (
    <Page
      title={`Hoạt động đầu tư${
        CONFIG && !!CONFIG.title ? ` - ${CONFIG.title}` : ""
      }`}
    >
      <Box className={classes.container}>
        {!!CONFIG && !!CONFIG.title ? (
          <Box className={classes.pageTitle}>{CONFIG.title}</Box>
        ) : (
          <></>
        )}
        <Box className={classes.top}>
          {CONFIG && CONFIG.listOfTab ? (
            <Tabs
              value={activeTab}
              onChange={(_event, newValue) => setActiveTab(newValue)}
              className={classes.tabs}
            >
              {CONFIG.listOfTab.map((ele, index) => (
                <Tab
                  label={ele.title}
                  className={classes.tabTitle}
                  key={index}
                />
              ))}
            </Tabs>
          ) : (
            <></>
          )}
          <Box className={classes.topLeft}>
            <BaseAutocomplete
              options={listOfTransPeriod}
              value={transPeriod}
              onChange={handleChangeTransPeriod}
              valueKey={"id"}
              labelKey={"name"}
              fullWidth
              placeholder="Đợt giao dịch"
            />
          </Box>
        </Box>
        <Box className={classes.mainTable}>
          {mainTableConfig ? (
            <Box
              sx={{
                height: `calc(${heightTable[activeTab].mainTable} - 20px)`,
              }}
              className={classes.mgB}
            >
              <BaseDynamicTable
                tableOptions={mainTableConfig}
                parentId={globalFundId}
                onClickRow={
                  !!detailedTableConfig
                    ? rowData => setSelectedId(rowData["id"])
                    : undefined
                }
                selectedId={!!detailedTableConfig ? selectedId : undefined}
                onRefreshRecord={handleOnMainTableRefreshRecord}
                entryProp={{
                  ...{
                    stockInvestBatchId: transPeriod,
                  },
                  ...(activeTab === 2 ? { fundId: globalFundId } : {}),
                  ...(activeTab === 3 ? { fundId: globalFundId } : {}),
                }}
              />
            </Box>
          ) : (
            <></>
          )}
          {detailedTableConfig ? (
            <Box
              sx={{
                height: heightTable[activeTab].detailedTable,
              }}
            >
              <Box className={classes.detailEntry}>{"Chi tiết bút toán"}</Box>
              <Box className={classes.detailEntryTable}>
                <BaseAccountingEntryDetailsTable
                  tableOptions={detailedTableConfig as TABLE_OPTIONS_INTERFACE}
                  currentId={selectedId}
                  onlyShow={true}
                  configGetData={
                    CONFIG.listOfTab[activeTab]?.configGetData || {
                      url: "",
                    }
                  }
                  ref={detailTableComponentRef}
                />
              </Box>
            </Box>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </Page>
  );
};
const InvestmentListedSecuritiesScreen = React.memo(
  InvestmentListedSecuritiesScreenComponent,
);
export { InvestmentListedSecuritiesScreen };

const CONFIG: {
  title: string;
  listOfTab: {
    title: string;
    mainTableCode: string;
    accountingEntryDetailTableCode?: string;
    configGetData?: {
      url: string;
      params?: PARAM_INTERFACE[];
      searchTerms?: SEARCH_TERMS_INTERFACE[];
    };
  }[];
} = {
  title: "Đầu tư chứng khoán niêm yết",
  listOfTab: [
    {
      title: "Kết quả giao dịch",
      mainTableCode: "INVESTMENT/LISTED-SECURITIES/TRANS-RESULT/MAIN",
      accountingEntryDetailTableCode: "",
    },
    {
      title: "Hạch toán phân bổ",
      mainTableCode:
        "INVESTMENT/LISTED-SECURITIES/ACCOUNTING-DISTRIBITION/MAIN",
      accountingEntryDetailTableCode:
        "INVESTMENT/LISTED-SECURITIES/ACCOUNTING-DISTRIBITION/ACCOUNTING-ENTRY-DETAILS",
      configGetData: {
        url: "fund-stock-invest/trans/accounting-details-by-trans",
      },
    },
    {
      title: "Giao dịch tiền",
      mainTableCode: "INVESTMENT/LISTED-SECURITIES/ACCOUNTING-MONEY-TRANS/MAIN",
      accountingEntryDetailTableCode:
        "INVESTMENT/LISTED-SECURITIES/ACCOUNTING-MONEY-TRANS/ACCOUNTING-ENTRY-DETAILS",
      configGetData: {
        url: "fund-stock-invest/trans/accounting-details",
      },
    },
    {
      title: "Dự thu trái tức",
      mainTableCode: "INVESTMENT/LISTED-SECURITIES/COLLECTION-BOND/MAIN",
      accountingEntryDetailTableCode:
        "INVESTMENT/LISTED-SECURITIES/ACCOUNTING-MONEY-TRANS/ACCOUNTING-ENTRY-DETAILS",
      configGetData: {
        url: "fund-stock-invest/trans/accounting-details",
      },
    },
  ],
};
