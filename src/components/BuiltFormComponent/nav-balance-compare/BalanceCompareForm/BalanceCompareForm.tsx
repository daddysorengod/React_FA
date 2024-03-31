import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useStyles } from "@/src/components/BuiltFormComponent/BuiltFormComponent.styles";
import useTranslation from "next-translate/useTranslation";
import { Box, Tabs, Tab, Grid } from "@mui/material";
import { BaseTextField } from "@/src/components/BaseTextField";
import { TABLE_OPTIONS_INTERFACE } from "@/src/types";
import { BaseAccountingEntryDetailsTable } from "@/src/components/BaseTable/BaseAccountingEntryDetailsTable";
import { dispatch, useSelector } from "@/src/store";
import { getTableConfigStore } from "@/src/store/reducers/tableConfig";
import { formatDate, getItemById } from "@/src/helpers";
import { BaseInputSecond } from "../../../BaseInputSecond";
import { AriseDetailTable } from "../component/AriseDetailTable";
import { BaseDynamicTable } from "@/src/components/BaseTable/BaseDynamicTable";
import { RootStateProps } from "@app/types/root";
interface Props {
  currentId?: string;
  onlyShow?: boolean;
}
const BalanceCompareFormComponent = forwardRef(
  (props: Props, ref): JSX.Element => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { currentId, onlyShow } = props;

    const globalFundId = useSelector(
      (state: RootStateProps) => state.general.globalFundId,
    );

    const globalFundData = useSelector(
      (state: RootStateProps) => state.general.globalFundData,
    );

    const [tableConfigData, setTableConfigData] = useState<{
      [key: number]: TABLE_OPTIONS_INTERFACE | undefined;
    }>({});
    const [tableConfigDataDetails, setTableConfigDataDetails] = useState<
      TABLE_OPTIONS_INTERFACE | undefined
    >(undefined);

    const [fundInfo, setFundInfo] = useState<any>({});

    const [activeTab, setActiveTab] = useState<number>(0);
    const [selectedId, setSelectedId] = useState<string>("");
    const [formData, setFormData] = useState<any>({});
    const detailTableComponentRef = useRef<any>(null);

    //   Function
    useImperativeHandle(ref, () => ({
      async onSubmitRef() {
        return false;
      },
      async onSaveValueRef() {
        const payload = await generateSubmitForm();
        if (payload) {
          return payload;
        }
        return null;
      },
      handleUnFocus() {},
    }));

    const generateSubmitForm = (): any => {
      let submitData: any = {
        fundId: globalFundId,
      };

      return submitData;
    };

    const getTableConfigs = async () => {
      // const ariseTableCode = "QTTN-BALANCE-COMPARE/ARISE";
      const statementTableCode = "QTTN-BALANCE-COMPARE/STATEMENT";
      const eventTableCode = "QTTN-BALANCE-COMPARE/EVENT";
      const categoryTableCode = "QTTN-BALANCE-COMPARE/CATEGORY";
      // const res1 = await dispatch(getTableConfigStore(ariseTableCode));
      const res1 = await dispatch(getTableConfigStore(statementTableCode));
      const res2 = await dispatch(getTableConfigStore(eventTableCode));
      const res3 = await dispatch(getTableConfigStore(categoryTableCode));
      setTableConfigData({
        0: res1,
        1: res2,
        2: res3,
      });

      const detailTableCode = "ACCOUNTING-ENTRY-DETAILS";
      const res5 = await dispatch(getTableConfigStore(detailTableCode));
      setTableConfigDataDetails(res5);
    };

    const getFormData = async () => {
      if (!currentId) {
        return;
      }
      const res = await getItemById(
        currentId || "",
        "fund-money-statement-api/find-by-id",
      );
      if (res) {
        setFormData(res);
      }
    };

    useEffect(() => {
      const asyncFunction = async (): Promise<any> => {
        await getFormData();
        await getTableConfigs();
        setFundInfo(globalFundData);
      };

      asyncFunction();
    }, [currentId]);

    const onChangeValue = () => {};

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
                value={fundInfo?.code || ""}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={4}>
              <BaseTextField
                label={"Tên quỹ"}
                value={fundInfo?.fullName || ""}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={2}>
              <BaseTextField
                label={"STK TVLK"}
                value={fundInfo?.custodyAccount || ""}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={2}>
              <BaseTextField
                label={"Ngày NAV gần nhất"}
                value={formatDate(fundInfo?.nextNavDate || "")}
                fullWidth
                disabled
              />
            </Grid>
          </Grid>

          {!!onlyShow && (
            <Grid
              container
              columns={12}
              columnSpacing={2.5}
              className={classes.marginGrid}
            >
              <Grid item xs={2}>
                <BaseInputSecond
                  label="Số bản ghi đối chiếu Fail"
                  type="text"
                  fieldName=""
                  initialValue={formData.noOfFailedRecord}
                  onChange={onChangeValue}
                  isDisabled={true}
                />
              </Grid>
              <Grid item xs={2}>
                <BaseInputSecond
                  label="Trạng thái đối chiếu FA"
                  type="text"
                  fieldName=""
                  initialValue={
                    (formData.workFollowStatus = 1 ? "NEW" : "APPROVED")
                  }
                  onChange={onChangeValue}
                  isDisabled={true}
                />
              </Grid>
              <Grid item xs={2}>
                <BaseInputSecond
                  label="Trạng thái đối chiếu SB"
                  type="text"
                  fieldName=""
                  initialValue={(formData.cbStatusVal = 1 ? "NEW" : "APPROVED")}
                  onChange={onChangeValue}
                  isDisabled={true}
                />
              </Grid>
            </Grid>
          )}
        </Box>
        <Box>
          <Box className={classes.styleTabTable}>
            <Box className={classes.styleTabName}>{"Chi tiết đối chiếu"}</Box>
            <Box className={classes.styleTabOption}>
              <Tabs
                value={activeTab}
                onChange={(_event, newValue) => setActiveTab(newValue)}
                className={classes.styleTab}
              >
                {/* <Tab label={"Phát sinh trong kỳ"} /> */}
                <Tab label={"Sao kê tiền"} />
                <Tab label={"Sự kiện quyền"} />
                <Tab label={"Danh mục đầu tư"} />
              </Tabs>
              <Box className={classes.styleTabContent}>
                {/* {tableConfigData[0] !== undefined ? (
                  <Box
                    // sx={{
                    //   height: "100%",
                    //   marginTop: "30px",
                    //   display: activeTab === 0 ? "block" : "none",
                    // }}
                    className={`${classes.ariseDetailTable} ${
                      activeTab !== 0 ? classes.displayNone : ""
                    }`}
                  >
                    <AriseDetailTable
                      name=""
                      formCode=""
                      onChange={onChangeValue}
                      customAttrs={null}
                      value={[]}
                    />
                  </Box>
                ) : (
                  <></>
                )} */}
                {tableConfigData[0] !== undefined ? (
                  <Box
                    className={`${classes.ariseDetailTable} ${
                      activeTab !== 0 ? classes.displayNone : ""
                    }`}
                  >
                    <BaseDynamicTable
                      tableOptions={tableConfigData[0]}
                      // onClickRow={id => setSelectedId(id)}
                      // selectedId={selectedId}
                      onlyShow
                      entryProp={{
                        fundId: globalFundId,
                        fundMoneyStatementByNavBatchId: currentId,
                      }}
                    />
                  </Box>
                ) : (
                  <></>
                )}
                {tableConfigData[1] !== undefined ? (
                  <Box
                    className={`${classes.ariseDetailTable} ${
                      activeTab !== 1 ? classes.displayNone : ""
                    }`}
                  >
                    <Box className={classes.styleTabEvent}>
                      <BaseDynamicTable
                        tableOptions={tableConfigData[1]}
                        parentId={currentId}
                        // onClickRow={id => setSelectedId(id)}
                        // selectedId={selectedId}
                        onlyShow
                      />
                    </Box>

                    <Box className={classes.eventAccounting}>
                      {!!tableConfigDataDetails ? (
                        <>
                          <Box className={classes.title}>
                            {"Chi tiết hạch toán"}
                          </Box>
                          <BaseAccountingEntryDetailsTable
                            tableOptions={
                              tableConfigDataDetails as TABLE_OPTIONS_INTERFACE
                            }
                            currentId={selectedId}
                            onlyShow={true}
                            configGetData={{
                              url: "",
                            }}
                            ref={detailTableComponentRef}
                            customDetailEntryStyle={`${classes.customDetailEntry}`}
                          />
                        </>
                      ) : (
                        <></>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <></>
                )}
                {tableConfigData[2] !== undefined ? (
                  <Box
                    className={`${classes.ariseDetailTable} ${
                      activeTab !== 2 ? classes.displayNone : ""
                    }`}
                  >
                    <BaseDynamicTable
                      tableOptions={tableConfigData[2]}
                      parentId={currentId}
                      entryProp={{
                        fundId: globalFundId,
                        fundMoneyStatementByNavBatchId: currentId,
                      }}
                      onlyShow
                    />
                  </Box>
                ) : (
                  <></>
                )}
                {/* {tableConfigData[3] !== undefined ? (
                  <Box
                     className={`${classes.ariseDetailTable} ${
                      activeTab !== 3 ? classes.displayNone : ""
                    }`}
                  >
                    <CategoryDetailTable
                      name=""
                      formCode=""
                      onChange={onChangeValue}
                      customAttrs={null}
                      value={[]}
                      currentId={currentId || ""}
                    />
                  </Box>
                ) : (
                  <></>
                )} */}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  },
);
const BalanceCompareForm = React.memo(BalanceCompareFormComponent);
export { BalanceCompareForm };
