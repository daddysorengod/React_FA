import React, {
  useState,
  useEffect,
  memo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useStyles } from "./AccountingEntryDetailTableDeposit.styles";
import useTranslation from "next-translate/useTranslation";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  COLUMN_OPTIONS_INTERFACE,
  DynamicObject,
  FETCH_DATA_API_CONFIG_INTERFACE,
  PARAM_INTERFACE,
  SEARCH_TERMS_INTERFACE,
  TABLE_OPTIONS_INTERFACE,
  TABLE_SELECT_OPTIONS,
  VALIDATION_ERROR_INTERFACE,
  VALIDATION_INTERFACE,
} from "@/src/types";
import {
  CO_ALIGN,
  CO_EDIT_TYPE,
  CO_TYPE,
  SEARCH_CONDITIONS,
} from "@/src/constants";
import {
  formatDate,
  formatNumberStringToNumber,
  formatNumberValueToString,
  formatOnChangeNumberValueToString,
  formatValueNameObject,
  getItemById,
  getListDataBase,
  getValidateInfo,
} from "@/src/helpers";

import { getTableSelectOptions } from "@/src/store/reducers/tableSelectOptions";
import { BaseTextField } from "@/src/components/BaseTextField";
import { BaseAutocomplete } from "@/src/components/BaseAutocomplete";
import {
  INPUT_FORMAT_TYPE,
  IN_RANGE_VALIDATE_TYPE,
} from "@/src/constants/built-form";
/// import store
import { useDispatch } from "react-redux";
import { dispatch, useSelector } from "@store/store";
import { RootStateProps } from "@app/types/root";
import { formatMoney, isValidMoney } from "@/src/helpers/formatMoney";
/// end import store

interface Props {
  currentId?: string;
  tableOptions: TABLE_OPTIONS_INTERFACE;
  onlyShow: boolean;
  configGetData: {
    url: string;
    params?: PARAM_INTERFACE[];
    searchTerms?: SEARCH_TERMS_INTERFACE[];
    idName?: string;
  };
  customDetailEntryStyle: string;
  updateData: any;
  onChange: (value) => void;
  initialState: DynamicObject;
}

const AccountingEntryDetailTableDepositComponent = forwardRef(
  (props: Props, ref): JSX.Element => {
    const { t } = useTranslation();
    const classes = useStyles();

    const {
      currentId,
      tableOptions,
      onlyShow,
      configGetData,
      customDetailEntryStyle,
      updateData,
      initialState,
      onChange,
    } = props;
    const globalFundId = useSelector(
      (state: RootStateProps) => state.general.globalFundId,
    );
    const detailContractInterestRate =
      useSelector((state: RootStateProps) => state.general.detailContract)
        ?.interestPeriod || "";
    const contractNumber =
      useSelector((state: RootStateProps) => state.general.detailContract)
        ?.contractNumber || "";
    const [dataTable, setDataTable] = useState<any[]>([]);
    const [sumData, setSumData] = useState<{
      [key: string]: any;
    }>({});
    const accountingEntryName = initialState?.accountingEntryName;
    const fundAccountingPlanDebitId = initialState?.fundAccountingPlanDebitId;
    const fundAccountingPlanCreditId = initialState?.fundAccountingPlanCreditId;
    const fundAccountingPlanDebitNumber = initialState?.debitAccountNumber;
    const fundAccountingPlanCreditNumber = initialState?.creditAccountNumber;
    const amount = initialState?.totalAmount;
    const [listOfFundAccountingPlanCredit, setListOfFundAccountingPlanCredit] =
      useState<any[]>([]);

    const [listOfFundAccountingPlanDebit, setListOfFundAccountingPlanDebit] =
      useState<any[]>([]);
    const [validationErrors, setValidationErrors] = useState<{
      [key: string]: string;
    }>({});

    //   Function
    useImperativeHandle(ref, () => ({
      async onRefresh() {
        getData();
        return true;
      },
    }));

    const getData = async () => {
      if (!configGetData || !currentId) {
        setDataTable([]);
        return;
      }
      const config: FETCH_DATA_API_CONFIG_INTERFACE = {
        url: configGetData.url,
        params: [
          {
            paramKey: configGetData.idName || "id",
            paramValue: currentId,
          },
          ...(configGetData.params ? configGetData.params : []),
        ],
        searchTerms: [
          ...(configGetData.searchTerms ? configGetData.searchTerms : []),
        ],
      };
      const res = await getListDataBase(config);
      if (!res || !res.source) {
        return;
      }
      const newList = res.source.map(item => {
        const newFormatItem = { ...item };

        tableOptions.listColumn.forEach(columnOption => {
          if (columnOption.editType === CO_EDIT_TYPE.NUMBER) {
            newFormatItem[columnOption.key] = formatNumberValueToString(
              item?.[columnOption.key] || 0,
            );
          }
        });

        return newFormatItem;
      });
      setDataTable(newList);

      const obj: any = {};
      tableOptions.listColumn.forEach(columnOption => {
        if (!columnOption.hasSummary || columnOption.type !== CO_TYPE.NUMBER) {
          return "";
        }
        const sumReducer = (accumulator: number, currentValue: any) => {
          return (
            accumulator +
            (!currentValue?.[columnOption.key] ||
              isNaN(currentValue?.[columnOption.key]) ||
              currentValue.isNotAddedToSum
              ? 0
              : currentValue[columnOption.key])
          );
        };
        const totalSum = res.source.reduce(sumReducer, 0);
        obj[columnOption.key] = formatNumberValueToString(totalSum);
      });
      setSumData({ ...obj });
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

    useEffect(() => {
      const asyncFunction = async () => {
        await getData();
      };

      asyncFunction();
    }, [currentId, tableOptions, configGetData]);

    useEffect(() => {
      const asyncFunction = async () => {
        if (!globalFundId) {
          return;
        }
        if (currentId) {
          getFormData();
        }
      };

      asyncFunction();
    }, [currentId]);

    const getFormData = async (): Promise<any> => {
      return;
    };

    useEffect(() => {
      const autoFillAccountingByInterestPeriod = async () => {
        try {
          if (!detailContractInterestRate) {
            return;
          }
          if (fundAccountingPlanDebitId && fundAccountingPlanCreditId) {
            return;
          }

          onChange({
            value: `Nhận tiền lãi theo HĐ số ${contractNumber}`,
            keyName: "accountingEntryName",
          });
          onChange({
            value: `Nhận tiền lãi theo HĐ số ${contractNumber}`,
            keyName: "description",
          });
          if (detailContractInterestRate === "1") {
            const debit = await getListOfFundAccountingPlan("1121");
            const credit = await getListOfFundAccountingPlan("51520505");
            setListOfFundAccountingPlanDebit(debit);
            setListOfFundAccountingPlanCredit(credit);
            onChange({
              value: debit[0]?.id,
              keyName: "fundAccountingPlanDebitId",
            });
            onChange({
              value: credit[0]?.id,
              keyName: "fundAccountingPlanCreditId",
            });
          } else if (detailContractInterestRate === "2") {
            const debit = await getListOfFundAccountingPlan("1121");
            const credit = await getListOfFundAccountingPlan("1321505");
            setListOfFundAccountingPlanDebit(debit);
            setListOfFundAccountingPlanCredit(credit);
            onChange({
              value: debit[0]?.id,
              keyName: "fundAccountingPlanDebitId",
            });
            onChange({
              value: credit[0]?.id,
              keyName: "fundAccountingPlanCreditId",
            });
          }
        } catch (error) { }
      };
      autoFillAccountingByInterestPeriod();
    }, [detailContractInterestRate]);

    useEffect(() => {
      const getDebitListAccount = async () => {
        if (fundAccountingPlanDebitNumber) {
          onChange({
            value: fundAccountingPlanDebitId,
            keyName: "fundAccountingPlanDebitId",
          });
          const res = await getListOfFundAccountingPlan(
            fundAccountingPlanDebitNumber,
          );
          setListOfFundAccountingPlanDebit(res);
        }
      };
      getDebitListAccount();
    }, [fundAccountingPlanDebitNumber]);

    useEffect(() => {
      const getDebitListAccount = async () => {
        if (fundAccountingPlanCreditNumber) {
          const res = await getListOfFundAccountingPlan(
            fundAccountingPlanCreditNumber,
          );
          // console.log("rerender")
          onChange({
            value: fundAccountingPlanCreditId,
            keyName: "fundAccountingPlanCreditId",
          });
          setListOfFundAccountingPlanCredit(res);
        }
      };
      getDebitListAccount();
    }, [fundAccountingPlanCreditNumber]);

    const handleValidateField = (
      value: any,
      key: string,
    ): VALIDATION_ERROR_INTERFACE => {
      const fieldConfig: FieldConfig = fieldsConfig[key];

      const res = {
        error: false,
        errorMessage: "",
      };

      const formatValue =
        fieldsConfig[key]?.formatConfig?.type === INPUT_FORMAT_TYPE.NUMBER_VALUE
          ? formatNumberStringToNumber(value)
          : value;
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

    const handleFundAccountingPlanCreditIdChange = (value: any) => {
      onChange({
        value: value,
        keyName: "fundAccountingPlanCreditId",
      });
      handleValidateFundAccountingPlanCreditId(value);
    };
    const handleFundAccountingPlanDebitIdChange = (value: any) => {
      onChange({
        value: value,
        keyName: "fundAccountingPlanDebitId",
      });
      handleValidateFundAccountingPlanDebitId(value);
    };
    const handleAccountingEntryNameChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      onChange({
        value: event.target.value,
        keyName: "accountingEntryName",
      });
      handleValidateAccountingEntryName(event.target.value);
    };

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
          value: (event.target.value),
          keyName: "totalAmount",
        });
    };
    const handleValidateAccountingEntryName = (
      value,
    ): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "accountingEntryName");
    };
    const handleValidateFundAccountingPlanDebitId = (
      value,
    ): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "fundAccountingPlanDebitId");
    };
    const handleValidateFundAccountingPlanCreditId = (
      value,
    ): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "fundAccountingPlanCreditId");
    };
    const handleValidateAmount = (value): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "amount");
    };

    const handleDebitAccountInputChange = async (value: string) => {
      const res = await getListOfFundAccountingPlan(value || "");
      setListOfFundAccountingPlanDebit(res);
    };

    const handleCreditAccountInputChange = async (value: string) => {
      const res = await getListOfFundAccountingPlan(value || "");
      setListOfFundAccountingPlanCredit(res);
    };

    return (
      <Box className={classes.container}>
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
                  {fieldsConfig.fundAccountingPlanCreditId.label}
                </TableCell>
                <TableCell
                  align={onlyShow ? "right" : "left"}
                  className={classes.tableHeadCell}
                >
                  {fieldsConfig.amount.label}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow className={classes.tableBodyRow}>
                <TableCell className={classes.tableBodyEditCell}>
                  <BaseTextField
                    value={accountingEntryName}
                    onChange={handleAccountingEntryNameChange}
                    onBlur={() => {
                      handleValidateAccountingEntryName(accountingEntryName);
                    }}
                    disabled={!!onlyShow}
                    error={!!validationErrors.accountingEntryName}
                    errorMessage={validationErrors.accountingEntryName}
                    fullWidth
                    className={`${classes.cellEditInput} ${classes.textColor}`}
                  />
                </TableCell>
                <TableCell className={classes.tableBodyEditCell}>
                  <BaseAutocomplete
                    options={listOfFundAccountingPlanDebit}
                    value={fundAccountingPlanDebitId}
                    valueKey={
                      fieldsConfig.fundAccountingPlanDebitId.valueKey || ""
                    }
                    labelKey={
                      fieldsConfig.fundAccountingPlanDebitId.nameKey || ""
                    }
                    onChange={handleFundAccountingPlanDebitIdChange}
                    onBlur={() => {
                      handleValidateFundAccountingPlanDebitId(
                        fundAccountingPlanDebitId,
                      );
                    }}
                    onInputChange={handleDebitAccountInputChange}
                    disabled={!!onlyShow}
                    error={!!validationErrors.fundAccountingPlanDebitId}
                    errorMessage={validationErrors.fundAccountingPlanDebitId}
                    className={`${classes.cellEditAutocomplete} ${classes.textColor}`}
                  />
                </TableCell>
                <TableCell className={classes.tableBodyEditCell}>
                  <BaseAutocomplete
                    options={listOfFundAccountingPlanCredit}
                    value={fundAccountingPlanCreditId}
                    valueKey={
                      fieldsConfig.fundAccountingPlanCreditId.valueKey || ""
                    }
                    labelKey={
                      fieldsConfig.fundAccountingPlanCreditId.nameKey || ""
                    }
                    onChange={handleFundAccountingPlanCreditIdChange}
                    onBlur={() => {
                      handleValidateFundAccountingPlanCreditId(
                        fundAccountingPlanCreditId,
                      );
                    }}
                    onInputChange={handleCreditAccountInputChange}
                    disabled={!!onlyShow}
                    error={!!validationErrors.fundAccountingPlanCreditId}
                    errorMessage={validationErrors.fundAccountingPlanCreditId}
                    className={`${classes.cellEditAutocomplete} ${classes.textColor}`}
                  />
                </TableCell>
                <TableCell
                  align={onlyShow ? "right" : "left"}
                  className={
                    !!onlyShow
                      ? classes.tableBodyCell
                      : classes.tableBodyEditCell
                  }
                >
                  {!!onlyShow ? (
                    <>{formatMoney(amount)}</>
                  ) : (
                    <BaseTextField
                      value={formatMoney(amount)}
                      onChange={handleAmountChange}
                      onBlur={() => {
                        // handleValidateAmount(amount);
                      }}
                      error={!!validationErrors.amount}
                      errorMessage={validationErrors.amount}
                      fullWidth
                      className={`${classes.cellEditInput} ${classes.textColor}`}
                    />
                  )}
                </TableCell>
              </TableRow>
              <TableRow className={classes.tableBodyRow}>
                <TableCell
                  colSpan={3}
                  className={classes.tableBodyCell}
                  sx={{ fontWeight: "600 !important" }}
                >
                  {"Tổng"}
                </TableCell>
                <TableCell
                  align={onlyShow ? "right" : "left"}
                  className={classes.tableBodyCell}
                  sx={{ fontWeight: "600 !important" }}
                >
                  {!!amount ? formatMoney(amount) : "0"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  },
);
const AccountingEntryDetailTableDeposit = React.memo(
  AccountingEntryDetailTableDepositComponent,
);
export { AccountingEntryDetailTableDeposit };

const fieldsConfig: {
  description: FieldConfig;
  accountingEntryName: FieldConfig;
  fundAccountingPlanDebitId: FieldConfig;
  fundAccountingPlanCreditId: FieldConfig;
  amount: FieldConfig;
} = {
  description: {
    label: "Diễn giải",
    validationConfig: {
      lengthValidate: true,
      maxLength: 255,
    },
  },
  accountingEntryName: {
    label: "Diễn giải",
    validationConfig: {
      // requiredValidate: true,
    },
  },
  fundAccountingPlanDebitId: {
    label: "TK nợ",
    validationConfig: {
      requiredValidate: true,
    },
    valueKey: "id",
    nameKey: "accountNumber",
  },
  fundAccountingPlanCreditId: {
    label: "TK có",
    validationConfig: {
      requiredValidate: true,
    },
    valueKey: "id",
    nameKey: "accountNumber",
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


