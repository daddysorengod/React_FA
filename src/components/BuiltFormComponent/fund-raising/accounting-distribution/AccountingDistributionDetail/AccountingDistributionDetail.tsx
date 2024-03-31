import React, { useEffect, useState, useRef } from "react";
import { useStyles } from "@/src/components/BuiltFormComponent/BuiltFormComponent.styles";
import useTranslation from "next-translate/useTranslation";
import { Box, Tabs, Tab, Grid } from "@mui/material";
import { BaseTextField } from "@/src/components/BaseTextField";
import { TABLE_OPTIONS_INTERFACE } from "@/src/types";
import { BaseDynamicTable } from "@/src/components/BaseTable/BaseDynamicTable";
import { BaseAccountingEntryDetailsTable } from "@/src/components/BaseTable/BaseAccountingEntryDetailsTable";
import { dispatch } from "@/src/store";
import { getTableConfigStore } from "@/src/store/reducers/tableConfig";
import { formatDate, getItemById } from "@/src/helpers";
interface Props {
  currentId?: string;
}
const AccountingDistributionDetailComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { currentId } = props;

  const [tableConfigData, setTableConfigData] = useState<{
    [key: number]: TABLE_OPTIONS_INTERFACE | undefined;
  }>({});
  const [tableConfigDataDetails, setTableConfigDataDetails] = useState<
    TABLE_OPTIONS_INTERFACE | undefined
  >(undefined);

  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string>("");
  const [formData, setFormData] = useState<any>({});
  const detailTableComponentRef = useRef<any>(null);

  const getTableConfigs = async () => {
    const subscriptionTableCode =
      "FUND-RAISING/ACCOUNTING-DISTRIBITION/SUBSCRIPTION";
    const redemptionTableCode =
      "FUND-RAISING/ACCOUNTING-DISTRIBITION/REDEMPTION";
    const res1 = await dispatch(getTableConfigStore(subscriptionTableCode));
    const res2 = await dispatch(getTableConfigStore(redemptionTableCode));
    setTableConfigData({
      0: res1,
      1: res2,
    });

    const detailTableCode = "ACCOUNTING-ENTRY-DETAILS";
    const res3 = await dispatch(getTableConfigStore(detailTableCode));
    setTableConfigDataDetails(res3);
  };

  const getFormData = async () => {
    if (!currentId) {
      return;
    }
    const res = await getItemById(
      currentId || "",
      "fund-raising-api/find-by-id",
    );
    if (res) {
      setFormData(res);
    }
  };

  useEffect(() => {
    const asyncFunction = async () => {
      await getTableConfigs();
      await getFormData();
    };

    asyncFunction();
  }, [currentId]);

  return (
    <Box
      sx={{
        marginTop: "20px",
      }}
    >
      <Box sx={{ marginBottom: "20px" }}>
        <Grid container columns={12} columnSpacing={2.5}>
          <Grid item xs={2}>
            <BaseTextField
              label={"Mã quỹ"}
              value={formData?.fund?.code || ""}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={2}>
            <BaseTextField
              label={"STK TVLK"}
              value={formData?.fund?.custodyAccount || ""}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={4}>
            <BaseTextField
              label={"Tên kết quả giao dịch CCQ"}
              value={formData?.name || ""}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={2}>
            <BaseTextField
              label={"Ngày tạo"}
              value={formatDate(formData?.tradingDate || "")}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={2}>
            <BaseTextField
              label={"Ngày hạch toán"}
              value={formatDate(formData?.txDate || "")}
              fullWidth
              disabled
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{}}>
        <Box
          sx={{
            marginBottom: "20px",
          }}
        >
          <Box sx={{}}>
            <Tabs
              value={activeTab}
              onChange={(_event, newValue) => setActiveTab(newValue)}
              sx={{
                marginBottom: "8px",
                borderBottom: "1px solid #E2E6EA",
              }}
            >
              <Tab label={"Phân bổ phát hành"} />
              <Tab label={"Phân bổ mua lại"} />
            </Tabs>
            <Box sx={{ height: "360px" }}>
              {tableConfigData[0] !== undefined ? (
                <Box
                  sx={{
                    height: "100%",
                    display: activeTab === 0 ? "block" : "none",
                  }}
                >
                  <BaseDynamicTable
                    tableOptions={tableConfigData[0]}
                    parentId={currentId}
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
              {tableConfigData[1] !== undefined ? (
                <Box
                  sx={{
                    height: "100%",
                    display: activeTab === 1 ? "block" : "none",
                  }}
                >
                  <BaseDynamicTable
                    tableOptions={tableConfigData[1]}
                    parentId={currentId}
                    onClickRow={id => setSelectedId(id)}
                    selectedId={selectedId}
                  />
                </Box>
              ) : (
                <></>
              )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ height: "35%" }}>
          {!!tableConfigDataDetails ? (
            <>
              <Box className={classes.title}>{"Chi tiết bút toán"}</Box>
              <BaseAccountingEntryDetailsTable
                tableOptions={tableConfigDataDetails as TABLE_OPTIONS_INTERFACE}
                currentId={selectedId}
                onlyShow={true}
                configGetData={{
                  url: "fund-raising-api/cert/cert-accounting-trans-detail",
                }}
                ref={detailTableComponentRef}
              />
            </>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </Box>
  );
};
const AccountingDistributionDetail = React.memo(
  AccountingDistributionDetailComponent,
);
export { AccountingDistributionDetail };
