import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useStyles } from "@/src/components/BuiltFormComponent/BuiltFormComponent.styles";
import useTranslation from "next-translate/useTranslation";
import { Box, Grid } from "@mui/material";
import {
  formatNoSpace,
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
import { BaseAccountingEntryDetailsTable } from "@/src/components/BaseTable/BaseAccountingEntryDetailsTable";
import { dispatch, useSelector } from "@/src/store";
import { getTableConfigStore } from "@/src/store/reducers/tableConfig";
import { LoadingButton } from "@mui/lab";
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
const TDExpriredFormComponent = forwardRef((props: Props, ref): JSX.Element => {
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

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const [listOfSelectionObject, setListOfSelectionObject] = useState<{
    [key: string]: any[];
  }>({});
  const [listOfFundBankAccount, setListOfBankFundBankAccount] = useState<any[]>(
    [],
  );

  const [detailedTableConfig, setDetailedTableConfig] = useState<
    TABLE_OPTIONS_INTERFACE | undefined
  >(undefined);

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

  //   Function
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
    const res = await getItemById(parentId, "fund-information-api/find-by-id");
    if (res) {
      setFundInfo({
        fundFullname: res.fullName,
        fundCode: res.code,
        custodyAccount: res.custodyAccount,
      });
    }
    return res;
  };

  const getTableConfig = async () => {
    const res = await dispatch(
      getTableConfigStore("INVESTMENT/TIME-DEPOSIT/ACCOUNTING-ENTRY-DETAILS"),
    );

    if (res) {
      setDetailedTableConfig(res);
    }
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
    const arr = [
      "fundFullname",
      "fundCode",
      "custodyAccount",
      "actualDepositDay",
      "remainContractAmount",
      "remainContractAmountConvert",
      "recentProfitDate",
      "latestEstimatedNAVDate",
      "estimateProfitAmount",
      "estimateProfitAmountConvert",
      "nextNavProfitAmount",
      "paidProfitAmount",
      "paidProfitAmountConvert",
      "principalConvert",
    ];
    let valid = true;
    const validation: any = {};
    fieldsConfig.forEach(field => {
      if (!arr.includes(field.key) && !!field.key) {
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
          "fundFullname",
          "fundCode",
          "custodyAccount",
          "actualDepositDay",
          "remainContractAmount",
          "remainContractAmountConvert",
          "recentProfitDate",
          "latestEstimatedNAVDate",
          "estimateProfitAmount",
          "estimateProfitAmountConvert",
          "nextNavProfitAmount",
          "paidProfitAmount",
          "paidProfitAmountConvert",
          "principalConvert",
        ].includes(fieldConfig.key)
      ) {
        return true;
      }
    }

    return res;
  };

  const getValueProperty = (fieldConfig: FieldConfig): any => {
    const arr = ["fundFullname", "fundCode", "custodyAccount"];

    if (!arr.includes(fieldConfig.key)) {
      if (
        fieldConfig.formatConfig?.type === INPUT_FORMAT_TYPE.NUMBER_VALUE &&
        !formData[fieldConfig.key]
      ) {
        return "0,00";
      }
      return formData[fieldConfig.key] || "";
    } else {
      if (
        ["fundFullname", "fundCode", "custodyAccount"].includes(fieldConfig.key)
      ) {
        return fundInfo[fieldConfig.key] || "";
      }
      return "";
    }
  };

  const getOptionsProperty = (fieldConfig: FieldConfig): any[] => {
    if (fieldConfig.key === "fundBankAccountId") {
      return listOfFundBankAccount;
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
    const asyncFunction = async () => {
      getListOfSelectionObject();
      getListOfFundBankAccountByFundId();
      getTableConfig();
      if (currentId) {
        await getRecordById();
      } else {
        await getFundInfoByFundId();
      }
    };

    asyncFunction();
  }, [currentId]);

  return (
    <Box sx={{ backgroundColor: "#f4f7fa", height: "100%" }}>
      <Grid
        container
        columns={12}
        columnSpacing={4}
        sx={{
          height: "100%",
          "& .MuiGrid-item": {
            height: "100%",
          },
        }}
      >
        <Grid item xs={10}>
          <Box
            sx={{
              padding: "20px 0 20px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "calc(100% - 40px)",
            }}
          >
            <Box>
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
              {detailedTableConfig && currentId ? (
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
                  <BaseAccountingEntryDetailsTable
                    tableOptions={detailedTableConfig}
                    currentId={currentId || ""}
                    onlyShow={true}
                    configGetData={{
                      url: "fund-deposit-contract-api/contract-deposit-accounting",
                      params: [
                        { paramKey: "accountingType", paramValue: "MATURITY" },
                      ],
                    }}
                  />
                </Box>
              ) : (
                <></>
              )}
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
});
const TDExpriredForm = React.memo(TDExpriredFormComponent);
export { TDExpriredForm };

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
  },
  {
    label: "Ngân hàng",
    key: "orgProviderFullname",
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "STK Ngân hàng",
    key: "bankAccountNumber",
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "Số hợp đồng",
    key: "contractNumber",
    type: FIELD_TYPE.TEXTFIELD,
    formatConfig: {
      type: INPUT_FORMAT_TYPE.UPPERCASE_AND_NO_SPACE,
    },
  },
  {
    label: "Loại tiền tệ",
    key: "currencyCode",
    valueKey: "value",
    nameKey: "text",
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "Tỷ giá HĐ",
    key: "exchangeRate",
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "Giá trị HĐ",
    key: "principal",
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "Giá trị HĐ quy đổi",
    key: "principalConvert",
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "Tỷ giá thực tế",
    key: "fundExchangeRate",
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
    type: FIELD_TYPE.TEXTFIELD,
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
    label: "Diễn giải",
    key: "description",
    type: FIELD_TYPE.TEXTFIELD,
    position: {
      cols: 4,
    },
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
