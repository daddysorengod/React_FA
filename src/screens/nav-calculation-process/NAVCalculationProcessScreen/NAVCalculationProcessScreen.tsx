import React, { useState, useEffect, useRef } from "react";
import { useStyles } from "./NAVCalculationProcessScreen.styles";
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
import { useRouter } from "next/router";

interface Props {}

const AssetValuationProcessComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const globalFundId = useSelector(
    (state: RootStateProps) => state.general.globalFundId,
  );

  const route = useRouter().asPath.split("?")[0];

  const [mainTableConfig, setMainTableConfig] = useState<
    TABLE_OPTIONS_INTERFACE | undefined
  >(undefined);
  const [detailedTableConfig, setDetailedTableConfig] = useState<
    TABLE_OPTIONS_INTERFACE | undefined
  >(undefined);

  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string>("");
  const detailTableComponentRef = useRef<any>(null);

  useEffect(() => {
    const refreshTab = () => {
      setActiveTab(0);
    };
    refreshTab();
  }, [route]);

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
      if (!route || !CONFIG[route] || !CONFIG[route].listOfTab[activeTab]) {
        return;
      }
      await getTableConfigByTab(CONFIG[route].listOfTab[activeTab]);
    };

    asyncFunction();
  }, [activeTab, route]);

  useEffect(() => {
    const refreshTab = () => {
      setActiveTab(0);
    };
    refreshTab();
  }, [route]);

  return (
    <Page
      title={`Quy trình tính NAV${
        CONFIG[route] && !!CONFIG[route].title
          ? ` - ${CONFIG[route].title}`
          : ""
      }`}
    >
      <Box
        sx={{
          height: "100%",
          overflow: "hidden",
        }}
      >
        {!!CONFIG[route] && !!CONFIG[route].title ? (
          <Box
            sx={{
              fontSize: "20px",
              fontWeight: "700",
              lineHeight: "32px",
              marginBottom: "12px",
            }}
          >
            {CONFIG[route].title}
          </Box>
        ) : (
          <></>
        )}
        {CONFIG[route] && CONFIG[route].listOfTab ? (
          <Tabs
            value={activeTab}
            onChange={(_event, newValue) => setActiveTab(newValue)}
            sx={{
              marginBottom: "16px",
              borderBottom: "1px solid #E2E6EA",
            }}
          >
            {CONFIG[route].listOfTab.map((ele, index) => (
              <Tab
                label={ele.title}
                sx={{
                  fontWeight: "600",
                }}
                key={index}
              />
            ))}
          </Tabs>
        ) : (
          <></>
        )}
        {mainTableConfig ? (
          <Box
            sx={{
              height: !!detailedTableConfig ? "50%" : "85%",
              marginBottom: "20px",
            }}
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
              onRefreshRecord={() => {
                if (detailTableComponentRef.current?.onRefresh) {
                  detailTableComponentRef.current.onRefresh();
                }
              }}
              entryProp={{
                ...{ fundId: globalFundId },
              }}
            />
          </Box>
        ) : (
          <></>
        )}
        {detailedTableConfig ? (
          <Box sx={{ height: "35%" }}>
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: "700",
                lineHeight: "24px",
                marginBottom: "8px",
              }}
            >
              {"Chi tiết bút toán"}
            </Box>
            <Box>
              <BaseAccountingEntryDetailsTable
                tableOptions={detailedTableConfig}
                currentId={selectedId}
                onlyShow={true}
                configGetData={
                  CONFIG[route].listOfTab[activeTab]?.configGetData || {
                    url: "",
                  }
                }
                customDetailEntryStyle=""
                ref={detailTableComponentRef}
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
const NAVCalculationProcessScreen = React.memo(AssetValuationProcessComponent);
export { NAVCalculationProcessScreen };

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
      };
    }[];
  };
} = {
  "/nav-calculation-process/asset-valuation-process": {
    title: "Quy trình định giá tài sản",
    listOfTab: [
      {
        title: "Nhập giá chứng khoán",
        mainTableCode:
          "NAV-CAL-PROCESS/ASSET-VALUATION-PROCESS/ENTER-STOCK-PRICE/MAIN",
        accountingEntryDetailTableCode: "",
      },
      {
        title: "Định giá chứng khoán",
        mainTableCode:
          "NAV-CAL-PROCESS/ASSET-VALUATION-PROCESS/SECURITIES-VALUATION/MAIN",
      },
      {
        title: "Đánh giá chênh lệch tài sản",
        mainTableCode:
          "NAV-CAL-PROCESS/ASSET-VALUATION-PROCESS/ASSET-IMPAIRMENT-ASSESSMENT/MAIN",
        accountingEntryDetailTableCode: "ACCOUNTING-ENTRY-DETAILS",
        configGetData: {
          url: "fund-accounting-api/stock-valuation-accounting",
          idName: "fundNavBatchStockId",
        },
      },
    ],
  },
  "/nav-calculation-process/balance-reconciliation": {
    title: "Đối chiếu số dư",
    listOfTab: [
      {
        title: "Danh sách số dư",
        mainTableCode: "NAV-CAL-PROCESS/BALANCE-RECONCILIATION/MAIN",
        accountingEntryDetailTableCode: "",
      },
      {
        title: "Đối chiếu",
        mainTableCode: "NAV-CAL-PROCESS/BALANCE-COMPARE/MAIN",
        accountingEntryDetailTableCode: "",
      },
    ],
  },
};
