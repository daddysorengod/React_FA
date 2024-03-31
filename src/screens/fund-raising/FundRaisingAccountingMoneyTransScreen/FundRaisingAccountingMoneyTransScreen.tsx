import React, { useState, useEffect, useRef } from "react";
import { useStyles } from "./FundRaisingAccountingMoneyTransScreen.styles";
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
const FundRaisingAccountingMoneyTransScreenComponent = (
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

  const [selectedId, setSelectedId] = useState<string>("");
  const detailTableComponentRef = useRef<any>(null);

  const getTableConfigByRouter = async () => {
    const mainTableCode = "FUND-RAISING/ACCOUNTING-MONEY-TRANS/MAIN";
    const res = await dispatch(getTableConfigStore(mainTableCode));
    if (res) {
      setTableConfigData(res);
    }
    const detailTableCode = "ACCOUNTING-ENTRY-DETAILS-FUND-RASING-MONEY";
    const res2 = await dispatch(getTableConfigStore(detailTableCode));

    setTableConfigDataDetail(res2);
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
    <Page title={pageTitle || "Huy Động Vốn - Hạch toán giao dịch tiền"}>
      <Box
        sx={{
          height: "100%",
          overflow: "hidden",
        }}
      >
        {tableConfigData ? (
          <Box sx={{ height: "70%", marginBottom: "30px" }}>
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
        <Box sx={{ height: "calc(25% - 20px)" }}>
          {tableConfigDataDetail !== undefined ? (
            <>
              <Box
                sx={{
                  fontWeight: "700",
                  fontSize: "16px",
                  lineHeight: "24px",
                  marginBottom: "16px",
                }}
              >
                {"Chi tiết bút toán"}
              </Box>
              <BaseAccountingEntryDetailsTable
                tableOptions={tableConfigDataDetail}
                currentId={selectedId}
                onlyShow={true}
                configGetData={{
                  url: "fund-raising-api/money/find",
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
                }}
                ref={detailTableComponentRef}
                customDetailEntryStyle=""
              />
            </>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </Page>
  );
};
const FundRaisingAccountingMoneyTransScreen = React.memo(
  FundRaisingAccountingMoneyTransScreenComponent,
);
export { FundRaisingAccountingMoneyTransScreen };
