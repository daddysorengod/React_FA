import React, { useState, useEffect, useRef } from "react";
import { useStyles } from "./FundRaisingAccountingDistributionScreen.styles";
import useTranslation from "next-translate/useTranslation";
import { BaseDynamicTable } from "@/src/components/BaseTable/BaseDynamicTable";
import { TABLE_OPTIONS_INTERFACE } from "@/src/types";
import { dispatch, useSelector } from "@/src/store";
import { getTableConfigStore } from "@/src/store/reducers/tableConfig";
import Page from "@/src/components/third-party/Page";
import { RootStateProps } from "@/src/types/root";
import { Box, Tab, Tabs } from "@mui/material";
import { BaseAccountingEntryDetailsTable } from "@/src/components/BaseTable/BaseAccountingEntryDetailsTable";

interface Props {
  pageTitle?: string;
}

const getDataDetailUrlConfigs = {
  0: {
    url: "fund-raising-api/cert/batch-accounting-detail?pageIndex=1&pageSize=20",
    searchTerms: [
      {
        fieldName: "tradingType",
        fieldValue: "2",
      },
    ],
  },
  1: {
    url: "fund-raising-api/cert/batch-accounting-detail?pageIndex=1&pageSize=20",
    searchTerms: [
      {
        fieldName: "tradingType",
        fieldValue: "1",
      },
    ],
  },
};
const FundRasingAccountingDistributionScreenComponent = (
  props: Props,
): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { pageTitle } = props;
  const globalFundId = useSelector(
    (state: RootStateProps) => state.general.globalFundId,
  );
  const [tableConfigData, setTableConfigData] = useState<
    TABLE_OPTIONS_INTERFACE | undefined
  >(undefined);
  const [tableConfigDataDetail, setTableConfigDataDetail] = useState<
    TABLE_OPTIONS_INTERFACE | undefined
  >(undefined);
  const [activeTab, setActiveTab] = useState<number>(0);

  const [selectedId, setSelectedId] = useState<string>("");
  const detailTableComponentRef = useRef<any>(null);

  const getTableConfigByRouter = async () => {
    const mainTableCode = "FUND-RAISING/ACCOUNTING-DISTRIBITION/MAIN";
    const res = await dispatch(getTableConfigStore(mainTableCode));
    if (res) {
      setTableConfigData(res);
    }
    const detailTableCode = "ACCOUNTING-ENTRY-DETAILS";
    const res1 = await dispatch(getTableConfigStore(detailTableCode));

    setTableConfigDataDetail(res1);
  };

  useEffect(() => {
    const asyncFunction = async () => {
      await getTableConfigByRouter();
    };

    asyncFunction();
  }, []);

  useEffect(() => {
    setSelectedId("");
  }, [globalFundId]);

  return (
    <Page title={pageTitle || "Huy Động Vốn - Hạch toán phân bổ CCQ"}>
      <Box
        sx={{
          height: "100%",
          overflow: "hidden",
        }}
      >
        {tableConfigData ? (
          <Box sx={{ height: "45%", marginBottom: "20px" }}>
            <BaseDynamicTable
              tableOptions={tableConfigData}
              parentId={globalFundId}
              onClickRow={rowData => setSelectedId(rowData?.id)}
              selectedId={selectedId}
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
        <Box sx={{ height: "calc(55% - 20px)" }}>
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

          <Tabs
            value={activeTab}
            onChange={(_event, newValue) => setActiveTab(newValue)}
            sx={{
              marginBottom: "16px",
              borderBottom: "1px solid #E2E6EA",
            }}
          >
            <Tab label={"Phân bổ phát hành"} />
            <Tab label={"Phân bổ mua lại"} />
          </Tabs>
          <Box
            sx={{
              height: "calc(100% - 97px)",
            }}
          >
            {!!tableConfigDataDetail && !!getDataDetailUrlConfigs[activeTab] ? (
              <BaseAccountingEntryDetailsTable
                tableOptions={tableConfigDataDetail}
                currentId={selectedId}
                onlyShow={true}
                configGetData={getDataDetailUrlConfigs[activeTab]}
                ref={detailTableComponentRef}
              />
            ) : (
              <></>
            )}
          </Box>
        </Box>
      </Box>
    </Page>
  );
};
const FundRasingAccountingDistributionScreen = React.memo(
  FundRasingAccountingDistributionScreenComponent,
);
export { FundRasingAccountingDistributionScreen };
