import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useStyles } from "@/src/components/BuiltFormComponent/BuiltFormComponent.styles";
import useTranslation from "next-translate/useTranslation";
import {
  Box,
  Grid,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
} from "@mui/material";
import {
  formatNoSpace,
  formatNumberStringToNumber,
  formatNumberValueToString,
  formatOnChangeNumberValueToString,
  formatOnlyNumberAndNoSpace,
  formatStringOnlyNumber,
  formatUpperCase,
  formatUppercaseAndNoSpace,
  formatValue,
  formatValueFromAPI,
  getItemById,
  getListDataBase,
  getValidateInfo,
} from "@/src/helpers";
import {
  ContractInfoFieldConfig,
  FETCH_DATA_API_CONFIG_INTERFACE,
  TABLE_OPTIONS_INTERFACE,
  VALIDATION_ERROR_INTERFACE,
  VALIDATION_INTERFACE,
} from "@/src/types";
import {
  INPUT_FORMAT_TYPE,
  IN_RANGE_VALIDATE_TYPE,
} from "@/src/constants/built-form";
import { BaseTextField } from "@/src/components/BaseTextField";
import { BaseAutocomplete } from "@/src/components/BaseAutocomplete";
import { BaseDatePickerInput } from "@/src/components/BaseDatePickerInput";
import { ContractInformation } from "@/src/components/ContractInformation";
import { LoadingButton } from "@mui/lab";
import { dispatch, useSelector } from "@/src/store";
import { insertOrUpdateRecord } from "@/src/store/reducers/general";
import { GroupApprovedButtons } from "@/src/components/GroupApprovedButtons";
import { SEARCH_CONDITIONS } from "@/src/constants";
interface Props {
  onlyShow: boolean;
  parentId?: string;
  currentId?: string;
  onCloseDialog: Function;
  workFollowStatus?: string;
  checkerAPI?: {
    approve?: string;
    deny?: string;
    cancelApprove?: string;
  };
  checkerApprove?: boolean;
}
const TDManualDepositCollectionFormComponent = forwardRef(
  (props: Props, ref): JSX.Element => {
    const { t } = useTranslation();
    const classes = useStyles();
    const {
      onlyShow,
      parentId,
      currentId,
      onCloseDialog,
      workFollowStatus,
      checkerAPI,
      checkerApprove,
    } = props;

    const userRole = useSelector(state => state.auth.role);

    const [formData, setFormData] = useState<{
      [key: string]: string | number | boolean | null;
    }>({});
    const [record, setRecord] = useState<any>({});
    const [fundInfo, setFundInfo] = useState<{
      [key: string]: string | number | boolean | null;
    }>({});
    const [accountingEntryDetail, setAccountingEntryDetail] = useState<any>({});

    const [validationErrors, setValidationErrors] = useState<{
      [key: string]: string;
    }>({});

    const [listOfSelectionObject, setListOfSelectionObject] = useState<{
      [key: string]: any[];
    }>({});
    const [listOfFundBankAccount, setListOfBankFundBankAccount] = useState<
      any[]
    >([]);
    const [listOfBank, setListOfBank] = useState<any[]>([]);
    const [rate, setRate] = useState<number>(0);

    //   Function
    const generateSubmitForm = (): any => {
      if (validateAll()) {
        const dataSubmit: any = { ...formData };

        fieldsConfig.forEach(field => {
          if (
            ["fundFullname", "fundCode", "custodyAccount"].includes(field.key)
          ) {
          } else if (field.key && field.formatConfig?.type) {
            dataSubmit[field.key] = formatValue(
              formData[field.key] || "",
              field.formatConfig.type,
            );
          }
        });

        dataSubmit["fundId"] = parentId;

        return dataSubmit;
      }
      return false;
    };

    useImperativeHandle(ref, () => ({
      async onSubmitRef() {
        return false;
      },
      async onSaveValueRef() {
        const payload = generateSubmitForm();

        if (payload) {
          return payload;
        } else return null;
      },
      handleUnFocus() {},
    }));

    const handleSubmit = async () => {
      if (validateAll()) {
        const submitData = generateSubmitForm();
        const response = await dispatch(
          insertOrUpdateRecord({
            url: "",
            params: submitData,
          }),
        );
        if (response) {
          onCloseDialog();
        }
      }
    };

    const getListOfSelectionObject = async () => {
      const obj = {
        currencyId:
          "currency-api/currency-select-options?pageIndex=1&pageSize=200",
        dayBasic:
          "all-code-api/find-by-cd-type?cdType=FUND_CONTRACT_DEPOSIT&cdName=DAY_BASIC&pageIndex=1&pageSize=20",
        interestPeriod:
          "all-code-api/find-by-cd-type?cdType=FUND_CONTRACT_DEPOSIT&cdName=INTEREST_PERIOD&pageIndex=1&pageSize=20",
        accrualOfInterest:
          "all-code-api/find-by-cd-type?cdType=FUND_CONTRACT_DEPOSIT&cdName=ACCRUAL_OF_INTEREST&pageIndex=1&pageSize=20",
        interestFrequency:
          "all-code-api/find-by-cd-type?cdType=FUND_CONTRACT_DEPOSIT&cdName=INTEREST_FREQUENCY&pageIndex=1&pageSize=20",
      };

      const data: any = {};

      for (const key in obj) {
        const config: FETCH_DATA_API_CONFIG_INTERFACE = {
          url: obj[key],
        };
        const res = await getListDataBase(config);
        data[key] = res.source;
      }

      setListOfSelectionObject({ ...data });
    };

    const getListOfFundBankAccountByFundId = async () => {
      if (parentId) {
        const config: FETCH_DATA_API_CONFIG_INTERFACE = {
          url: "fund-account-api/find",
          searchTerms: [
            {
              fieldName: "fundId",
              fieldValue: parentId,
            },
            {
              fieldName: "bankType",
              fieldValue: "4",
            },
          ],
          params: [
            { paramKey: "fieldOrderBy", paramValue: "createdDate" },
            { paramKey: "isDescending", paramValue: true },
          ],
        };

        const res = await getListDataBase(config);
        setListOfBankFundBankAccount(
          res.source.filter(ele => !!ele.bankAccountNumber),
        );
      }
    };

    const getListOfBank = async () => {
      if (parentId) {
        const config: FETCH_DATA_API_CONFIG_INTERFACE = {
          url: "bank-api/bank-select-options",
          params: [
            { paramKey: "pageIndex", paramValue: 1 },
            { paramKey: "pageSize", paramValue: 9999 },
          ],
        };

        const res = await getListDataBase(config);
        setListOfBank(res.source);
      }
    };

    const getListOfFundAccountingPlan = async (
      searchStr?: string,
    ): Promise<any[]> => {
      if (!parentId) {
        return [];
      }
      const config: FETCH_DATA_API_CONFIG_INTERFACE = {
        url: "fund-accounting-plan-api/last-childs-mini?pageIndex=1&pageSize=20",
        searchTerms: [
          {
            fieldName: "fundId",
            fieldValue: parentId || "",
          },
          {
            fieldName: "accountNumber",
            fieldValue: searchStr || "",
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

    const getFormAccountingEntryDetail = async () => {
      const res1 = await getListOfFundAccountingPlan("1321505");
      const res2 = await getListOfFundAccountingPlan("51520505");
      setAccountingEntryDetail({
        fundAccountingPlanDebitId: res1.length ? res1[0].id : "",
        fundAccountingPlanDebit: res1.length ? "1321505" : "",
        fundAccountingPlanCreditId: res2.length ? res2[0].id : "",
        fundAccountingPlanCredit: res2.length ? "51520505" : "",
        accountingEntryName: "Dự thu tiền gửi",
      });
    };

    const getRecordById = async () => {
      if (!currentId) {
        return false;
      }
      const res = await getItemById(
        currentId,
        "fund-deposit-contract-api/find-by-id",
      );
      if (res) {
        const temp: any = { ...res };
        fieldsConfig
          .filter(ele => !!ele.key)
          .forEach(field => {
            if (field.formatConfig?.type) {
              temp[field.key] =
                res[field.key] !== undefined
                  ? formatValueFromAPI(res[field.key], field.formatConfig.type)
                  : "";
            }
          });
        setFormData(temp);
        setRecord(temp);
        setFundInfo({
          fundFullname: res.fundFullname,
          fundCode: res.fundCode,
          custodyAccount: res.custodyAccount,
        });
      }
      return res;
    };

    const getFundInfoByFundId = async (): Promise<any> => {
      if (!parentId) {
        return false;
      }
      const res = await getItemById(
        parentId,
        "fund-information-api/find-by-id",
      );
      if (res) {
        setFundInfo({
          fundFullname: res.fullName,
          fundCode: res.code,
          custodyAccount: res.custodyAccount,
        });
      }
      return res;
    };

    const formatOnChangeValue = (
      event: React.ChangeEvent<HTMLInputElement>,
      fieldConfig: FieldConfig,
    ): string => {
      if (!fieldConfig.formatConfig) {
        return event.target.value;
      }

      switch (fieldConfig.formatConfig.type) {
        case INPUT_FORMAT_TYPE.UPPERCASE: {
          return formatUpperCase(event.target.value);
        }
        case INPUT_FORMAT_TYPE.ONLY_NUMBER: {
          return formatStringOnlyNumber(event.target.value);
        }
        case INPUT_FORMAT_TYPE.NUMBER_VALUE: {
          return formatOnChangeNumberValueToString(
            event,
            (formData[fieldConfig.key] as string) || "",
          );
        }
        case INPUT_FORMAT_TYPE.NO_SPACE: {
          return formatNoSpace(event.target.value);
        }
        case INPUT_FORMAT_TYPE.ONLY_NUMBER_AND_NO_SPACE: {
          return formatOnlyNumberAndNoSpace(event.target.value);
        }
        case INPUT_FORMAT_TYPE.UPPERCASE_AND_NO_SPACE: {
          return formatUppercaseAndNoSpace(event.target.value);
        }
        default: {
          return event.target.value;
        }
      }
    };

    const getRateByFundId = async () => {
      const config: FETCH_DATA_API_CONFIG_INTERFACE = {
        url: "fund-exchange-rate-api/find",
        searchTerms: [
          { fieldName: "fundId", fieldValue: parentId || "" },
          { fieldName: "currencyId", fieldValue: formData["currencyId"] || "" },
        ],
        params: [
          { paramKey: "pageIndex", paramValue: 1 },
          { paramKey: "pageSize", paramValue: 1 },
        ],
      };

      const res = await getListDataBase(config);
      setRate(res.source.length ? res.source[0]?.rate : 0);
    };

    // Handle Validate
    const handleValidateField = (
      value: any,
      fieldConfig: FieldConfig,
    ): VALIDATION_ERROR_INTERFACE => {
      const res = {
        error: false,
        errorMessage: "",
      };
      const formattedValue = formatValue(value, fieldConfig.formatConfig?.type);

      if (fieldConfig && fieldConfig.validationConfig) {
        const info = getValidateInfo(
          formattedValue,
          fieldConfig.label,
          fieldConfig.validationConfig,
        );
        setValidationErrors({
          ...validationErrors,
          [fieldConfig.key]: info.errorMessage,
        });
        return info;
      }
      return res;
    };

    const validateAll = (): boolean => {
      const arr = ["transDate", "amount", "description"];
      let valid = true;
      const validation: any = {};
      [...fieldsConfig, ...tableFieldsConfig].forEach(field => {
        if (arr.includes(field.key)) {
          const info = handleValidateField(formData[field.key], field);
          if (info.error) {
            validation[field.key] = info.errorMessage;
            valid = false;
          }
        }
      });
      setValidationErrors(validation);
      return valid;
    };

    // Handle Change

    const handleTextFieldChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      fieldConfig: FieldConfig,
    ) => {
      const value = formatOnChangeValue(event, fieldConfig);

      setFormData({
        ...formData,
        [fieldConfig.key]: value,
      });

      handleValidateField(value, fieldConfig);
    };

    const handleValueChange = (value: any, fieldConfig: FieldConfig) => {
      setFormData({
        ...formData,
        [fieldConfig.key]: value,
      });

      handleValidateField(value, fieldConfig);
    };

    const getDisabledProperty = (fieldConfig: FieldConfig): boolean => {
      let res = !!onlyShow;
      if (!!onlyShow) {
        res = true;
      } else {
        // Luôn disabled
        if (
          [
            "transDate",
            "description",
            "amount",
            "remainContractAmount",
          ].includes(fieldConfig.key)
        ) {
          return false;
        } else {
          return true;
        }
      }

      return res;
    };

    const getValueProperty = (fieldConfig: FieldConfig): any => {
      if (
        ["fundFullname", "fundCode", "custodyAccount"].includes(fieldConfig.key)
      ) {
        return fundInfo[fieldConfig.key] || "";
      } else if (
        [
          "accountingEntryName",
          "fundAccountingPlanDebit",
          "fundAccountingPlanCredit",
        ].includes(fieldConfig.key)
      ) {
        return accountingEntryDetail[fieldConfig.key] || "";
      } else {
        if (
          fieldConfig.formatConfig?.type === INPUT_FORMAT_TYPE.NUMBER_VALUE &&
          !formData[fieldConfig.key]
        ) {
          return "0,00";
        }
        return formData[fieldConfig.key] || "";
      }
    };

    const getOptionsProperty = (fieldConfig: FieldConfig): any[] => {
      if (fieldConfig.key === "fundBankAccountId") {
        return listOfFundBankAccount;
      } else if (fieldConfig.key === "bankId") {
        return listOfBank;
      } else {
        return listOfSelectionObject[fieldConfig.key] || [];
      }
    };

    const getProps = (
      fieldConfig: FieldConfig,
    ): {
      value: any;
      label: string | undefined;
      required: boolean | undefined;
      disabled: boolean | undefined;
      error: boolean | undefined;
      errorMessage: string | undefined;
      onBlur: Function | undefined;
      options: any[];
      minDate?: any;
      maxDate?: any;
      nameKey: string | undefined;
    } => {
      let label = fieldConfig.label;
      let required = !!fieldConfig.validationConfig?.requiredValidate;
      let disabled = getDisabledProperty(fieldConfig);
      let error = !disabled && !!validationErrors[fieldConfig.key];
      let errorMessage = disabled ? "" : validationErrors[fieldConfig.key];
      let onBlur = !!fieldConfig.validationConfig
        ? () => {
            handleValidateField(formData[fieldConfig.key], fieldConfig);
          }
        : undefined;

      const value = getValueProperty(fieldConfig);
      const options: any[] = getOptionsProperty(fieldConfig);
      const unit = "";
      const nameKey = fieldConfig.nameKey;

      const res = {
        ...{
          label,
          required,
          disabled,
          error,
          errorMessage,
          onBlur,
          value,
          unit,
          nameKey,
        },
        ...{ options },
      };
      return res;
    };

    useEffect(() => {
      const res =
        (formatNumberStringToNumber((formData["amount"] as string) || "") ||
          0) *
        (rate | 0);
      setFormData({
        ...formData,
        ["convertedAmount"]: formatNumberValueToString(res),
      });
    }, [formData["amount"]]);

    useEffect(() => {
      const asyncFunction = async () => {
        getListOfSelectionObject();
        getListOfFundBankAccountByFundId();
        getListOfBank();
        getFormAccountingEntryDetail();
        if (currentId) {
          await getRecordById();
        } else {
          await getFundInfoByFundId();
        }
        getRateByFundId();
      };

      asyncFunction();
    }, [currentId]);

    return (
      <Box sx={{ backgroundColor: "#f4f7fa", height: "775px" }}>
        <Grid
          container
          columns={12}
          columnSpacing={4}
          sx={{
            height: "775px",
            "& .MuiGrid-item": {
              height: "100%",
            },
          }}
        >
          <Grid item xs={10}>
            <Box
              sx={{
                margin: "20px 0 0 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "calc(100% - 40px)",
              }}
            >
              <Box sx={{ marginBottom: "16px" }}>
                <Grid
                  container
                  columns={10}
                  columnSpacing={4}
                  rowSpacing={2.5}
                  sx={{ marginBottom: "40px" }}
                >
                  {fieldsConfig.map((field, index) => {
                    switch (field.type) {
                      case FIELD_TYPE.DATEPICKER: {
                        return (
                          <Grid item xs={field.position?.cols || 2} key={index}>
                            <BaseDatePickerInput
                              {...getProps(field)}
                              onChange={value => {
                                handleValueChange(value, field);
                              }}
                            />
                          </Grid>
                        );
                      }
                      case FIELD_TYPE.AUTOCOMPLETE: {
                        return (
                          <Grid item xs={field.position?.cols || 2} key={index}>
                            <BaseAutocomplete
                              {...getProps(field)}
                              onChange={value => {
                                handleValueChange(value, field);
                              }}
                              valueKey={field.valueKey || ""}
                              labelKey={field.nameKey || ""}
                            />
                          </Grid>
                        );
                      }
                      case FIELD_TYPE.TEXTFIELD: {
                        return (
                          <Grid item xs={field.position?.cols || 2} key={index}>
                            <BaseTextField
                              {...getProps(field)}
                              onChange={event => {
                                handleTextFieldChange(event, field);
                              }}
                              onBlur={() => {
                                handleValidateField(formData[field.key], field);
                              }}
                            />
                          </Grid>
                        );
                      }
                      case FIELD_TYPE.LINE: {
                        return (
                          <Grid item xs={10} key={index}>
                            <Box
                              sx={{
                                borderBottom: "1px solid #E2E6EA",
                              }}
                            />
                          </Grid>
                        );
                      }
                      case FIELD_TYPE.NONE: {
                        return (
                          <Grid
                            item
                            xs={field.position?.cols || 2}
                            key={index}
                          ></Grid>
                        );
                      }
                      default: {
                        return (
                          <Grid
                            item
                            xs={field.position?.cols || 2}
                            key={index}
                          ></Grid>
                        );
                      }
                    }
                  })}
                </Grid>

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
                          {tableFieldsConfig.map((field, index) => {
                            const align =
                              onlyShow &&
                              ["amount, convertedAmount"].includes(field.key)
                                ? "right"
                                : "left";
                            return (
                              <TableCell
                                className={classes.tableHeadCell}
                                align={align}
                                key={index}
                              >
                                {field.label}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow className={classes.tableBodyRow}>
                          {tableFieldsConfig.map((field, index) => {
                            switch (field.type) {
                              case FIELD_TYPE.TEXTFIELD: {
                                return (
                                  <TableCell
                                    className={classes.tableBodyEditCell}
                                  >
                                    <BaseTextField
                                      {...getProps(field)}
                                      label=""
                                      onChange={event => {
                                        handleTextFieldChange(event, field);
                                      }}
                                      onBlur={() => {
                                        handleValidateField(
                                          formData[field.key],
                                          field,
                                        );
                                      }}
                                      className={classes.cellEditInput}
                                    />
                                  </TableCell>
                                );
                              }
                              case FIELD_TYPE.AUTOCOMPLETE: {
                                return (
                                  <TableCell
                                    className={classes.tableBodyEditCell}
                                  >
                                    <BaseAutocomplete
                                      {...getProps(field)}
                                      label=""
                                      onChange={value => {
                                        handleValueChange(value, field);
                                      }}
                                      valueKey={field.valueKey || ""}
                                      labelKey={field.nameKey || ""}
                                      className={classes.cellEditAutocomplete}
                                    />
                                  </TableCell>
                                );
                              }
                            }
                          })}
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
                            {formData["amount"] || "0,00"}
                          </TableCell>
                          <TableCell
                            align={onlyShow ? "right" : "left"}
                            className={classes.tableBodyCell}
                            sx={{ fontWeight: "600 !important" }}
                          >
                            {formData["convertedAmount"] || "0,00"}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {!!checkerApprove && userRole == 1 && (
                  <GroupApprovedButtons
                    workFollowStatus={workFollowStatus}
                    checkerAPI={checkerAPI}
                    currentId={currentId}
                    onCloseDialog={onCloseDialog}
                  />
                )}
                {(!checkerApprove || userRole != 1) && (
                  <Box ml={1}>
                    <LoadingButton
                      onClick={() => {
                        onCloseDialog();
                      }}
                      className={classes.common_button}
                      // loading={isLoading}
                      loadingPosition={"start"}
                    >
                      {"Xong"}
                    </LoadingButton>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={2}>
            <ContractInformation
              config={contractInfoFieldsConfig}
              data={record}
            />
          </Grid>
        </Grid>
      </Box>
    );
  },
);
const TDManualDepositCollectionForm = React.memo(
  TDManualDepositCollectionFormComponent,
);
export { TDManualDepositCollectionForm };

enum FIELD_TYPE {
  TEXTFIELD = "TEXTFIELD",
  DATEPICKER = "DATEPICKER",
  AUTOCOMPLETE = "AUTOCOMPLETE",
  NONE = "NONE",
  LINE = "LINE",
}

const fieldsConfig: FieldConfig[] = [
  {
    label: "Tên quỹ",
    key: "fundFullname",
    type: FIELD_TYPE.TEXTFIELD,
    position: {
      cols: 6,
    },
  },
  {
    label: "Mã quỹ",
    key: "fundCode",
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "STK TVLK",
    key: "custodyAccount",
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "",
    key: "",
    type: FIELD_TYPE.NONE,
  },
  {
    label: "",
    key: "",
    type: FIELD_TYPE.LINE,
  },
  {
    label: "Ngày chứng từ",
    key: "transDate",
    type: FIELD_TYPE.DATEPICKER,
    validationConfig: {
      requiredValidate: true,
    },
  },
  {
    label: "Ngân hàng",
    key: "bankId",
    validationConfig: {
      requiredValidate: true,
    },
    valueKey: "value",
    nameKey: "text",
    type: FIELD_TYPE.AUTOCOMPLETE,
  },
  {
    label: "STK Ngân hàng",
    key: "fundBankAccountId",
    validationConfig: {
      requiredValidate: true,
    },
    valueKey: "id",
    nameKey: "bankAccountNumber",
    type: FIELD_TYPE.AUTOCOMPLETE,
  },
  {
    label: "Số hợp đồng",
    key: "contractNumber",
    validationConfig: {
      requiredValidate: true,
      lengthValidate: true,
      maxLength: 50,
    },
    type: FIELD_TYPE.TEXTFIELD,
    formatConfig: {
      type: INPUT_FORMAT_TYPE.UPPERCASE_AND_NO_SPACE,
    },
  },
  {
    label: "Trạng thái hợp đồng",
    key: "contractStatus",
    validationConfig: {
      requiredValidate: true,
    },
    type: FIELD_TYPE.AUTOCOMPLETE,
  },
  {
    label: "Giá trị HĐ",
    key: "principal",
    validationConfig: {
      requiredValidate: true,
      inRangeValidate: true,
      inRangeValidateType: IN_RANGE_VALIDATE_TYPE.NUMBER,
      minNumberValue: 0,
    },
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "Giá trị HĐ quy đổi",
    key: "principalConvert",
    validationConfig: {
      requiredValidate: true,
      inRangeValidate: true,
      inRangeValidateType: IN_RANGE_VALIDATE_TYPE.NUMBER,
      minNumberValue: 0,
    },
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "Lãi suất/Năm",
    key: "interestRate",
    validationConfig: {
      requiredValidate: true,
      inRangeValidate: true,
      inRangeValidateType: IN_RANGE_VALIDATE_TYPE.NUMBER,
      minNumberValue: 0,
    },
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "Loại tiền tệ",
    key: "currencyId",
    validationConfig: {
      requiredValidate: true,
    },
    valueKey: "value",
    nameKey: "text",
    type: FIELD_TYPE.AUTOCOMPLETE,
  },
  {
    label: "Tỷ giá HĐ",
    key: "exchangeRate",
    validationConfig: {
      requiredValidate: true,
      inRangeValidate: true,
      inRangeValidateType: IN_RANGE_VALIDATE_TYPE.NUMBER,
      minNumberValue: 0,
    },
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "Ngày hiệu lực",
    key: "valueDate",
    validationConfig: {
      requiredValidate: true,
    },
    type: FIELD_TYPE.DATEPICKER,
  },
  {
    label: "Ngày đáo hạn",
    key: "maturityDate",
    validationConfig: {
      requiredValidate: true,
    },
    type: FIELD_TYPE.DATEPICKER,
  },
  {
    label: "Số ngày thực gửi",
    key: "actualDepositDay",
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "Ngày dự thu kỳ NAV gần nhất",
    key: "accrualDate",
    type: FIELD_TYPE.DATEPICKER,
  },
  {
    label: "Ngày dự thu kỳ NAV tới",
    key: "nextAccrualDate",
    type: FIELD_TYPE.DATEPICKER,
  },
  {
    label: "Lãi đã dự thu",
    key: "accruedAmount",
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "Lãi đã dự thu quy đổi",
    key: "accruedAmountConvert",
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "Giá trị dự thu kỳ Nav tới",
    key: "nextAccruedAmount",
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "Tỷ giá hiện tại",
    key: "rate",
    validationConfig: {
      requiredValidate: true,
      inRangeValidate: true,
      inRangeValidateType: IN_RANGE_VALIDATE_TYPE.NUMBER,
      minNumberValue: 0,
    },
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "Diễn giải",
    key: "description",
    validationConfig: {
      lengthValidate: true,
      maxLength: 500,
    },
    type: FIELD_TYPE.TEXTFIELD,
    position: {
      cols: 4,
    },
  },
];

const tableFieldsConfig: FieldConfig[] = [
  {
    label: "Diễn giải",
    key: "accountingEntryName",
    validationConfig: {
      lengthValidate: true,
      maxLength: 5000,
    },
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "TK Nợ",
    key: "fundAccountingPlanDebit",
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "TK có",
    key: "fundAccountingPlanCredit",
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "Giá trị",
    key: "amount",
    validationConfig: {
      requiredValidate: true,
      inRangeValidate: true,
      inRangeValidateType: IN_RANGE_VALIDATE_TYPE.NUMBER,
      minNumberValue: 0,
    },
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "Giá trị quy đổi",
    key: "convertedAmount",
    validationConfig: {
      requiredValidate: true,
      inRangeValidate: true,
      inRangeValidateType: IN_RANGE_VALIDATE_TYPE.NUMBER,
      minNumberValue: 0,
    },
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
    type: FIELD_TYPE.TEXTFIELD,
  },
];

interface FieldConfig {
  label: string;
  key: string;
  validationConfig?: VALIDATION_INTERFACE;
  formatConfig?: {
    type: INPUT_FORMAT_TYPE;
  };
  valueKey?: string;
  nameKey?: string;
  type: FIELD_TYPE;
  position?: {
    cols: number;
  };
}

const contractInfoFieldsConfig: ContractInfoFieldConfig[] = [
  { label: "Mã quỹ", key: "fundCode" },
  { label: "Tên quỹ", key: "fundFullname" },
  { label: "Số TK TVLK", key: "custodyAccount" },
  {
    label: "Ngày chứng từ",
    key: "transDate",
    formatType: "DATE",
  },
  { label: "", key: "", type: "LINE" },
  {
    label: "Số hợp đồng",
    key: "contractNumber",
  },
  {
    label: "Ngày ký hợp đồng",
    key: "createdDate",
    formatType: "DATE",
  },
  {
    label: "Ngày hiệu lực HĐ",
    key: "valueDate",
    formatType: "DATE",
  },
  {
    label: "ID Hợp đồng",
    key: "a",
  },
  {
    label: "Ngày đáo hạn",
    key: "maturityDate",
    formatType: "DATE",
  },
  { label: "", key: "", type: "LINE" },

  {
    label: "Ngân hàng",
    key: "orgProviderFullname",
  },
  { label: "Loại tiền tệ", key: "currencyCode" },
  {
    label: "Tỷ giá HĐ",
    key: "exchangeRate",
  },
  {
    label: "Giá trị HĐ",
    key: "principal",
  },
  {
    label: "Giá trị HĐ quy đổi",
    key: "principalConvert",
  },

  { label: "Kỳ hạn", key: "e" },

  {
    label: "Lãi suất/Năm",
    key: "interestRate",
    formatType: "PERCENT",
  },
  {
    label: "Ngày hiệu lực",
    key: "valueDate",
    formatType: "DATE",
  },
  {
    label: "Ngày đáo hạn",
    key: "maturityDate",
    formatType: "DATE",
  },
  {
    label: "Số ngày thực gửi",
    key: "actualDepositDay",
  },
  {
    label: "Số ngày cơ sở",
    key: "dayBasicVal.name",
  },
  {
    label: "Chu kỳ trả lãi",
    key: "interestPeriodVal.name",
  },
  {
    label: "Tần suất trả lãi",
    key: "interestFrequencytVal.name",
  },
  {
    label: "Diễn giải",
    key: "description",
  },
];

const contractInfo = {
  fundCode: "ERTRETGE",
  fundName:
    "Chowt vst dsfds dfg sddf dt ret dsf ewt vcsw etewt dtretretretret dfsger",
  custadyAccount: "34654756867876",
  value: 3453452354235634634,
  a: "dfghdf sdfgdf",
  b: "dfghdf sdfgdf",
  c: "dfghdf sdfgdf",
  d: "dfghdf sdfgdf",
  e: "dfghdf sdfgdf",
  h: 23.456,
  f: "dfghdf sdfgdf",
  g: "dfghdf sdfgdf",
};
