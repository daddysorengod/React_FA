import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useStyles } from "@/src/components/BuiltFormComponent/BuiltFormComponent.styles";
import useTranslation from "next-translate/useTranslation";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
} from "@mui/material";
import { BaseTextField } from "@/src/components/BaseTextField";
import {
  FETCH_DATA_API_CONFIG_INTERFACE,
  VALIDATION_ERROR_INTERFACE,
  VALIDATION_INTERFACE,
} from "@/src/types";
import { useSelector } from "@/src/store";
import {
  formatNumberStringToNumber,
  formatNumberValueToString,
  formatOnChangeNumberValueToString,
  getItemById,
  getListDataBase,
  getValidateInfo,
} from "@/src/helpers";
import { RootStateProps } from "@/src/types/root";
import {
  INPUT_FORMAT_TYPE,
  IN_RANGE_VALIDATE_TYPE,
} from "@/src/constants/built-form";
import { BaseAutocomplete } from "@/src/components/BaseAutocomplete";
import { IFormType } from "@/src/types/general";
import { TableHead } from "@mui/material";
import { TableRow } from "@mui/material";
import { SEARCH_CONDITIONS } from "@/src/constants";
import { BaseDatePickerInput } from "@/src/components/BaseDatePickerInput";
import { Tooltip } from "@mui/material";
import { IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { GroupApprovedButtons } from "@/src/components/GroupApprovedButtons";
interface Props {
  currentId?: string;
  parentId?: string;
  onlyShow?: boolean;
  formType?: IFormType;
  workFollowStatus?: string;
  onCloseDialog: Function;
}
const SetManualAccountingFormDetailComponent = forwardRef(
  (props: Props, ref): JSX.Element => {
    const { t } = useTranslation();
    const classes = useStyles();
    const {
      currentId,
      parentId,
      onlyShow,
      formType,
      workFollowStatus,
      onCloseDialog,
    } = props;

    const globalFundId = useSelector(
      (state: RootStateProps) => state.general.globalFundId,
    );

    const globalFundData = useSelector(
      (state: RootStateProps) => state.general.globalFundData,
    );
    const userRole = useSelector(state => state.auth.role);
    const [formData, setFormData] = useState<any>({});

    const [fundInfo, setFundInfo] = useState<any>({});
    const [tradingDate, setTradingDate] = useState<any>("");
    const [description, setDescription] = useState<string>("");

    const [accountingEntryName, setAccountingEntryName] = useState<string>("");
    const [debitAccountName, setDebitAccountName] = useState<string>("");
    const [creditAccountName, setCreditAccountName] = useState<string>("");
    const [fundAccountingPlanDebitId, setFundAccountingPlanDebitId] =
      useState<string>("");
    const [fundAccountingPlanCreditId, setFundAccountingPlanCreditId] =
      useState<string>("");
    const [amount, setAmount] = useState<string>("0");
    const [securityId, setSecurityId] = useState<string>("");

    const [validationErrors, setValidationErrors] = useState<{
      [key: string]: string;
    }>({});

    const [dataTable, setDataTable] = useState<any[]>([]);
    const [sumAmount, setSumAmount] = useState<any>(0);

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
      if (!validateAll()) {
        return null;
      }
      let tmpAmount = formatNumberStringToNumber(amount);
      const submitData = {
        ...{
          fundId: globalFundId,
          transDate: tradingDate,
          description,
          trans: [
            {
              fundAccountingPlanDebitId,
              fundAccountingPlanCreditId,
              accountingEntryName,
              amount: tmpAmount,
              securityId,
              debitAccountName,
              creditAccountName,
            },
          ],
        },
        ...(!!currentId ? { id: currentId } : {}),
      };
      return submitData;
    };

    const getFormData = async (): Promise<any> => {
      if (!currentId) return;
      const res = await getItemById(
        currentId,
        "fund-manual-accounting-api/find-by-id",
      );
      let responseData = await getItemById(
        currentId,
        "fund-manual-accounting-api/find-trans",
        "fundManualAccountingBatchId",
      );
      const resTable = responseData.source[0];
      setDataTable(responseData.source);
      if (resTable) {
        let tmpSum = 0;
        responseData.source.map((item: any, rowIndex: number) => {
          tmpSum += item.amount;
        });
        setSumAmount(tmpSum);
        setFormData(res);
        setTradingDate(res.transDate || "");
        setDescription(res.description || "");

        setAccountingEntryName(resTable.accountingEntryName || "");
        setDebitAccountName(resTable.debitAccountName || "");
        setCreditAccountName(resTable.creditAccountName || "");
        setFundAccountingPlanDebitId(resTable.fundAccountingPlanDebitId || "");
        setFundAccountingPlanCreditId(
          resTable.fundAccountingPlanCreditId || "",
        );
        setAmount(formatNumberValueToString(resTable.amount || 0));
        setSecurityId(formatNumberValueToString(resTable.securityId || ""));
      }
      return resTable;
    };

    const getListOfFundAccount = async () => {
      if (!globalFundId) {
        return;
      }
      const config: FETCH_DATA_API_CONFIG_INTERFACE = {
        url: "fund-account-api/find",
        params: [
          { paramKey: "pageIndex", paramValue: "1" },
          { paramKey: "pageSize", paramValue: "100" },
          { paramKey: "fieldOrderBy", paramValue: "createdDate" },
          { paramKey: "isDescending", paramValue: true },
        ],
        searchTerms: [
          {
            fieldName: "fundId",
            fieldValue: globalFundId,
          },
        ],
      };
    };

    const getListOfFundAccountingPlan = async (
      searchStr?: string,
      condition?: SEARCH_CONDITIONS.CONTAINS | SEARCH_CONDITIONS.EQUAL,
    ): Promise<any[]> => {
      if (!globalFundId) {
        return [];
      }
      const config: FETCH_DATA_API_CONFIG_INTERFACE = {
        url: "fund-accounting-plan-api/last-childs-mini?pageIndex=1&pageSize=20",
        searchTerms: [
          {
            fieldName: "fundId",
            fieldValue: globalFundId || "",
          },
          {
            fieldName: "accountNumber",
            fieldValue: searchStr || "",
            condition: condition || SEARCH_CONDITIONS.CONTAINS,
          },
        ],
        params: [
          { paramKey: "fieldOrderBy", paramValue: "createdDate" },
          { paramKey: "isDescending", paramValue: true },
        ],
      };
      const res = await getListDataBase(config);
      return res.source;
    };

    const getListOfSecurity = async (
      searchStr?: string,
      condition?: SEARCH_CONDITIONS.CONTAINS | SEARCH_CONDITIONS.EQUAL,
    ): Promise<any[]> => {
      if (!globalFundId) {
        return [];
      }
      const config: FETCH_DATA_API_CONFIG_INTERFACE = {
        url: "security-api/find?pageIndex=1&pageSize=20",
        searchTerms: [
          {
            fieldName: "fundId",
            fieldValue: globalFundId || "",
          },
          {
            fieldName: "symbol",
            fieldValue: searchStr || "",
            condition: condition || SEARCH_CONDITIONS.CONTAINS,
          },
        ],
        params: [
          { paramKey: "fieldOrderBy", paramValue: "createdDate" },
          { paramKey: "isDescending", paramValue: true },
        ],
      };
      const res = await getListDataBase(config);
      return res.source;
    };

    //    Handle Validate
    const handleValidateField = (
      value: any,
      key: string,
    ): VALIDATION_ERROR_INTERFACE => {
      const fieldConfig: FieldConfig = fieldsConfig[key];

      const formatValue =
        fieldsConfig[key]?.formatConfig?.type === INPUT_FORMAT_TYPE.NUMBER_VALUE
          ? formatNumberStringToNumber(value)
          : value;

      const res = {
        error: false,
        errorMessage: "",
      };
      if (fieldConfig && fieldConfig.validationConfig) {
        const info = getValidateInfo(
          formatValue,
          fieldConfig.label,
          fieldConfig.validationConfig,
        );
        setValidationErrors({
          ...validationErrors,
          [key]: info.errorMessage,
        });
        return info;
      }
      return res;
    };

    const validateAll = (): boolean => {
      const formData = {
        tradingDate,
        accountingEntryName,
        fundAccountingPlanDebitId,
        fundAccountingPlanCreditId,
        amount,
        securityId,
        debitAccountName,
        creditAccountName,
      };
      let valid = true;
      let validation: any = {};
      Object.keys(formData).forEach(key => {
        const info = handleValidateField(formData[key], key);
        if (info.error) {
          validation[key] = info.errorMessage;
          valid = false;
        }
      });
      setValidationErrors(validation);
      return valid;
    };
    const handleValidateTradingDate = (value): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "tradingDate");
    };
    const handleValidateDescription = (value): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "description");
    };

    const checkHasMediateAccount = async () => {
      if (!globalFundId) {
        return;
      }
      const config: FETCH_DATA_API_CONFIG_INTERFACE = {
        url: "fund-account-api/find",
        searchTerms: [
          {
            fieldName: "fundId",
            fieldValue: globalFundId,
          },
          {
            fieldName: "bankType",
            fieldValue: '["2", "3"]',
            condition: SEARCH_CONDITIONS.IN_ARRAY,
          },
        ],
      };
    };

    useEffect(() => {
      const asyncFunction = async () => {
        if (!globalFundId) {
          return;
        }
        setFundInfo(globalFundData);
        checkHasMediateAccount();
        getListOfFundAccount();
        if (currentId) {
          getFormData();
        }
      };

      asyncFunction();
    }, [currentId, parentId]);

    const handleTradingDateChange = (value: any) => {
      setTradingDate(value || "");
      handleValidateTradingDate(value);
    };
    const handleDescriptionChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setDescription(event.target.value);
      handleValidateDescription(event.target.value);
    };

    return (
      <Box
        sx={{
          marginTop: "20px",
        }}
      >
        <Box sx={{ marginBottom: "48px" }}>
          <Grid
            container
            columns={12}
            columnSpacing={4}
            sx={{ marginBottom: "20px" }}
          >
            <Grid item xs={2}>
              <BaseTextField
                label={fieldsConfig.fundCode.label}
                value={fundInfo?.code || ""}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={2}>
              <BaseTextField
                label={fieldsConfig.fullName.label}
                value={fundInfo?.fullName || ""}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={2}>
              <BaseTextField
                label={fieldsConfig.custodyAccount.label}
                value={fundInfo?.custodyAccount || ""}
                fullWidth
                disabled
              />
            </Grid>
          </Grid>
          <Grid container columns={12} columnSpacing={4}>
            <Grid item xs={2}>
              <BaseDatePickerInput
                label={fieldsConfig.tradingDate.label}
                required
                value={tradingDate}
                onChange={handleTradingDateChange}
                onBlur={() => {
                  handleValidateTradingDate(tradingDate);
                }}
                disabled={!!onlyShow}
                error={!!validationErrors.tradingDate}
                errorMessage={validationErrors.tradingDate}
              />
            </Grid>
            <Grid item xs={4}>
              <BaseTextField
                label={fieldsConfig.description.label}
                value={description}
                onChange={handleDescriptionChange}
                onBlur={() => {
                  handleValidateDescription(description);
                }}
                error={!!validationErrors.description}
                errorMessage={validationErrors.description}
                disabled={!!onlyShow}
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Box
            sx={{
              fontSize: "16px",
              fontWeight: "700",
              lineHeight: "24px",
              marginBottom: "16px",
            }}
          >
            {"Chi tiết bút toán"}
          </Box>
          <TableContainer className={classes.tableContainer}>
            <Table stickyHeader>
              <TableHead>
                <TableRow className={classes.tableBodyRow}>
                  <TableCell className={classes.tableHeadCell}>
                    {fieldsConfig.accountingEntryName.label}
                  </TableCell>
                  <TableCell className={classes.tableHeadCell}>
                    {fieldsConfig.fundAccountingPlanDebitId.label}
                  </TableCell>
                  <TableCell className={classes.tableHeadCell}>
                    {fieldsConfig.debitAccountName.label}
                  </TableCell>
                  <TableCell className={classes.tableHeadCell}>
                    {fieldsConfig.debitFundAccountId.label}
                  </TableCell>
                  <TableCell className={classes.tableHeadCell}>
                    {fieldsConfig.fundAccountingPlanCreditId.label}
                  </TableCell>
                  <TableCell className={classes.tableHeadCell}>
                    {fieldsConfig.creditAccountName.label}
                  </TableCell>
                  <TableCell className={classes.tableHeadCell}>
                    {fieldsConfig.creditFundAccountId.label}
                  </TableCell>
                  <TableCell className={classes.tableHeadCell}>
                    {fieldsConfig.securityId.label}
                  </TableCell>
                  <TableCell
                    align={onlyShow ? "right" : "left"}
                    className={`${classes.tableHeadCell} ${classes.stickyTableCell}`}
                  >
                    {fieldsConfig.amount.label}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataTable.map((item: any, rowIndex: number) => (
                  <TableRow className={classes.tableBodyRow}>
                    <TableCell className={classes.tableBodyEditCell}>
                      <BaseTextField
                        value={item.accountingEntryName}
                        disabled={!!onlyShow}
                        fullWidth
                        className={classes.cellEditTextManual}
                      />
                    </TableCell>
                    <TableCell className={classes.tableBodyEditCell}>
                      <BaseTextField
                        value={item.debitAccountNumber}
                        disabled={!!onlyShow}
                        fullWidth
                        className={classes.cellEditManual}
                      />
                    </TableCell>
                    <TableCell className={classes.tableBodyEditCell}>
                      <BaseTextField
                        value={item.debitAccountName}
                        disabled={!!onlyShow}
                        fullWidth
                        className={classes.cellEditNameManual}
                      />
                    </TableCell>
                    <TableCell className={classes.tableBodyEditCell}>
                      <BaseTextField
                        value={item.debitFundAccountNumber}
                        disabled={!!onlyShow}
                        fullWidth
                        className={classes.cellEditManual}
                      />
                    </TableCell>
                    <TableCell className={classes.tableBodyEditCell}>
                      <BaseTextField
                        value={item.creditAccountNumber}
                        disabled={!!onlyShow}
                        fullWidth
                        className={classes.cellEditManual}
                      />
                    </TableCell>
                    <TableCell className={classes.tableBodyEditCell}>
                      <BaseTextField
                        value={item.creditAccountName}
                        disabled={!!onlyShow}
                        fullWidth
                        className={classes.cellEditNameManual}
                      />
                    </TableCell>
                    <TableCell className={classes.tableBodyEditCell}>
                      <BaseTextField
                        value={item.creditFundAccountNumber}
                        disabled={!!onlyShow}
                        fullWidth
                        className={classes.cellEditManual}
                      />
                    </TableCell>
                    <TableCell className={classes.tableBodyEditCell}>
                      <BaseTextField
                        value={item.securitySymbol}
                        disabled={!!onlyShow}
                        fullWidth
                        className={classes.cellEditManual}
                      />
                    </TableCell>
                    <TableCell
                      align={onlyShow ? "right" : "left"}
                      className={
                        !!onlyShow
                          ? `${classes.tableBodyCell} ${classes.stickyTableCell}`
                          : `${classes.tableBodyEditCell} ${classes.stickyTableCell} `
                      }
                    >
                      {!!onlyShow ? (
                        <>{formatNumberValueToString(item.amount)}</>
                      ) : (
                        <BaseTextField
                          value={formatNumberValueToString(item.amount)}
                          disabled={!!onlyShow}
                          fullWidth
                          className={classes.cellEditManual}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow className={classes.tableBodyRow}>
                  <TableCell
                    colSpan={8}
                    className={classes.tableBodyCell}
                    sx={{ fontWeight: "600 !important" }}
                  >
                    {"Tổng"}
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    align={onlyShow ? "right" : "left"}
                    className={`${classes.tableBodyCell} ${classes.stickyTableCell}`}
                    sx={{ fontWeight: "600 !important" }}
                  >
                    {!!formatNumberValueToString(sumAmount)
                      ? formatNumberValueToString(sumAmount)
                      : "0"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          {userRole == 1 && (
            <GroupApprovedButtons
              workFollowStatus={workFollowStatus}
              checkerAPI={{
                approve: "fund-manual-accounting-api/approve",
                deny: "fund-manual-accounting-api/approve",
                cancelApprove: "fund-manual-accounting-api/cancel",
              }}
              currentId={currentId}
              onCloseDialog={onCloseDialog}
            />
          )}
        </Box>
      </Box>
    );
  },
);
const SetManualAccountingFormDetail = React.memo(
  SetManualAccountingFormDetailComponent,
);
export { SetManualAccountingFormDetail };

const fieldsConfig: {
  fundCode: FieldConfig;
  tradingDate: FieldConfig;
  description: FieldConfig;
  fullName: FieldConfig;
  custodyAccount: FieldConfig;
  accountingEntryName: FieldConfig;
  transType: FieldConfig;
  fundAccountingPlanDebitId: FieldConfig;
  debitAccountName: FieldConfig;
  debitFundAccountId: FieldConfig;
  fundAccountingPlanCreditId: FieldConfig;
  creditAccountName: FieldConfig;
  creditFundAccountId: FieldConfig;
  amount: FieldConfig;
  securityId: FieldConfig;
  action: FieldConfig;
} = {
  fundCode: {
    label: "Mã quỹ",
  },
  fullName: {
    label: "Tên quỹ",
  },
  custodyAccount: {
    label: "STK TVLK",
  },
  tradingDate: {
    label: "Ngày chứng từ",
    validationConfig: {
      requiredValidate: true,
    },
  },
  description: {
    label: "Diễn giải",
    // validationConfig: {
    //   lengthValidate: true,
    //   maxLength: 255,
    // },
  },
  accountingEntryName: {
    label: "Diễn giải",
    // validationConfig: {
    //   // requiredValidate: true,
    // },
  },
  transType: {
    label: "Loại giao dịch",
    validationConfig: {
      requiredValidate: true,
    },
    valueKey: "cdVal",
    nameKey: "vnCdContent",
  },
  fundAccountingPlanDebitId: {
    label: "TK nợ",
    validationConfig: {
      requiredValidate: true,
    },
    valueKey: "id",
    nameKey: "accountNumber",
  },
  debitAccountName: {
    label: "Tên TK nợ",
  },
  debitFundAccountId: {
    label: "STK ngân hàng nợ",
    validationConfig: {
      requiredValidate: true,
    },
    valueKey: "id",
    nameKey: "bankAccountNumber",
  },
  fundAccountingPlanCreditId: {
    label: "TK có",
    validationConfig: {
      requiredValidate: true,
    },
    valueKey: "id",
    nameKey: "accountNumber",
  },
  creditAccountName: {
    label: "Tên TK có",
  },
  creditFundAccountId: {
    label: "STK ngân hàng có",
    validationConfig: {
      requiredValidate: true,
    },
    valueKey: "id",
    nameKey: "bankAccountNumber",
  },
  amount: {
    label: "Giá trị",
    validationConfig: {
      requiredValidate: true,
      inRangeValidate: true,
      inRangeValidateType: IN_RANGE_VALIDATE_TYPE.NUMBER,
      minNumberValue: 0,
    },
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
  },
  securityId: {
    label: "Mã CK",
    validationConfig: {
      requiredValidate: true,
    },
    valueKey: "id",
    nameKey: "symbol",
  },
  action: {
    label: "Thao tác",
    validationConfig: {
      // requiredValidate: true,
    },
  },
};

interface FieldConfig {
  label: string;
  validationConfig?: VALIDATION_INTERFACE;
  formatConfig?: {
    type: INPUT_FORMAT_TYPE;
  };
  valueKey?: string;
  nameKey?: string;
}
