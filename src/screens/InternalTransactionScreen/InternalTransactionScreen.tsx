import React, { useState, useEffect, useRef } from "react";
import { useStyles } from "./InternalTransactionScreen.styles";
import useTranslation from "next-translate/useTranslation";
import { BaseDynamicTable } from "@/src/components/BaseTable/BaseDynamicTable";
import {
  PARAM_INTERFACE,
  SEARCH_TERMS_INTERFACE,
  TABLE_OPTIONS_INTERFACE,
} from "@/src/types";
import { dispatch, useSelector } from "@/src/store";
import {
  getTableConfigStore,
  setTableConfig,
} from "@/src/store/reducers/tableConfig";
import Page from "@/src/components/third-party/Page";
import { RootStateProps } from "@/src/types/root";
import { Box, Tab, Tabs } from "@mui/material";
import { BaseAccountingEntryDetailsTable } from "@/src/components/BaseTable/BaseAccountingEntryDetailsTable";
import { useRouter } from "next/router";

interface Props {
  routeName: string;
}

const InternalTransactionScreenComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const globalFundId = useSelector(
    (state: RootStateProps) => state.general.globalFundId,
  );
  const { routeName } = props;

  const [mainTableConfig, setMainTableConfig] =
    useState<TABLE_OPTIONS_INTERFACE | null>(null);
  const [detailedTableConfig, setDetailedTableConfig] =
    useState<TABLE_OPTIONS_INTERFACE | null>(null);

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
    setMainTableConfig(res || null);

    if (!!obj.accountingEntryDetailTableCode) {
      const res2 = await dispatch(
        getTableConfigStore(obj.accountingEntryDetailTableCode),
      );
      setDetailedTableConfig(res2 || null);
    } else {
      setDetailedTableConfig(null);
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
        setMainTableConfig(null);
        setDetailedTableConfig(null);
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
      title={`Giao dịch nội bộ${
        CONFIG[routeName] && !!CONFIG[routeName].title
          ? ` - ${CONFIG[routeName].title}`
          : ""
      }`}
    >
      <Box
        sx={{
          height: "100%",
          overflow: "hidden",
        }}
      >
        {!!CONFIG[routeName] && !!CONFIG[routeName].title ? (
          <Box
            sx={{
              fontSize: "20px",
              fontWeight: "700",
              lineHeight: "32px",
              marginBottom: "12px",
            }}
          >
            {CONFIG[routeName].title}
          </Box>
        ) : (
          <></>
        )}
        {CONFIG[routeName] && CONFIG[routeName].listOfTab ? (
          <Tabs
            value={activeTab}
            onChange={(_event, newValue) => setActiveTab(newValue)}
            sx={{
              marginBottom: "16px",
              borderBottom: "1px solid #E2E6EA",
            }}
          >
            {CONFIG[routeName].listOfTab.map((ele, index) => (
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
                fundId: globalFundId,
              }}
            />
          </Box>
        ) : (
          <></>
        )}
        {detailedTableConfig && CONFIG[routeName] ? (
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
                  CONFIG[routeName].listOfTab[activeTab].configGetData || {
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
    </Page>
  );
};
const InternalTransactionScreen = React.memo(
  InternalTransactionScreenComponent,
);
export { InternalTransactionScreen };

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
      };
    }[];
  };
} = {
  "management-of-service-contract-fees": {
    title: "Quản lý phí hợp đồng dịch vụ",
    listOfTab: [
      {
        title: "Danh sách hợp đồng",
        mainTableCode:
          "INTERNAL-TRANSACTION/MANAGEMENT-OF-SERVICE-CONTRACT-FEES/LIST-0F-CONTRACT/MAIN",
        accountingEntryDetailTableCode: "",
      },
      {
        title: "Dự chi hợp đồng",
        mainTableCode:
          "INTERNAL-TRANSACTION/MANAGEMENT-OF-SERVICE-CONTRACT-FEES/PROJECTED-CONTRACT-EXPENSES/MAIN",
        accountingEntryDetailTableCode:
          "INTERNAL-TRANSACTION/MANAGEMENT-OF-SERVICE-CONTRACT-FEES/PROJECTED-CONTRACT-EXPENSES/ACCOUNTING-ENTRY-DETAILS",
        configGetData: {
          url: "fund-contract-fee-api/accounting-details",
        },
      },
    ],
  },
  "update-capital-price-of-securities": {
    title: "",
    listOfTab: [
      {
        title: "Cập nhật giá vốn",
        mainTableCode:
          "INTERNAL-TRANSACTION/UPDATE-CAPITAL-PRICE-SECURITIES/MAIN",
      },
    ],
  },
};
