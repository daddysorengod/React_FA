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
  getNextNAVDate,
  getValidateInfo,
} from "@/src/helpers";
import {
  FETCH_DATA_API_CONFIG_INTERFACE,
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
import dayjs from "dayjs";
import { SEARCH_CONDITIONS } from "@/src/constants";
interface Props {
  onlyShow: boolean;
  parentId?: string;
  currentId?: string;
}
const TimeDepositContractFormComponent = forwardRef(
  (props: Props, ref): JSX.Element => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { onlyShow, parentId, currentId } = props;

    const [formData, setFormData] = useState<{
      [key: string]: string | number | boolean | null;
    }>({});
    const [fundInfo, setFundInfo] = useState<{
      [key: string]: string | number | boolean | null;
    }>({});

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

    const [isDescriptionChanged, setIsDescriptionChanged] =
      useState<boolean>(false);

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

      // Ngày Hiệu lực luôn phải nhỏ hơn Ngày đáo hạn
      if (["valueDate", "maturityDate"].includes(fieldConfig.key)) {
        if (
          (fieldConfig.key === "valueDate" &&
            formData["maturityDate"] &&
            value &&
            dayjs(value).diff(
              dayjs(formData["maturityDate"] as string),
              "days",
            ) >= 0) ||
          (fieldConfig.key === "maturityDate" &&
            formData["valueDate"] &&
            value &&
            dayjs(value).diff(dayjs(formData["valueDate"] as string), "days") <=
              0)
        ) {
          setValidationErrors({
            ...validationErrors,
            valueDate: "Ngày hiệu lực phải nhỏ hơn Ngày đáo hạn.",
            maturityDate: "Ngày hiệu lực phải nhỏ hơn Ngày đáo hạn.",
          });
          return {
            error: true,
            errorMessage: "Ngày hiệu lực phải nhỏ hơn Ngày đáo hạn.",
          };
        } else {
          if (
            value &&
            !!(fieldConfig.key === "valueDate"
              ? formData["maturityDate"]
              : formData["valueDate"])
          ) {
            setValidationErrors({
              ...validationErrors,
              valueDate: "",
              maturityDate: "",
            });
            return res;
          }
        }
      }

      // Khi "Loại tiền tệ" là VND thì không validate Giá trị HĐ Quy đổi và Tỷ giá HĐ
      if (
        ["exchangeRate", "principalConvert"].includes(fieldConfig.key) &&
        checkCurrencyIsVND(formData["currencyId"])
      ) {
        setValidationErrors({
          ...validationErrors,
          exchangeRate: "",
          principalConvert: "",
        });
        return res;
      }

      // Khi "Chu kỳ trả lãi" là Đầu kỳ hoặc Cuối kỳ, thì không validate Tần suất trả lãi
      if (
        fieldConfig.key === "interestFrequency" &&
        ["1", "3"].includes(formData["interestPeriod"] as string)
      ) {
        setValidationErrors({
          ...validationErrors,
          [fieldConfig.key]: "",
        });
        return res;
      }

      if (fieldConfig.key === "interestPeriod" && ["1", "3"].includes(value)) {
        setValidationErrors({
          ...validationErrors,
          [fieldConfig.key]: "",
          ["interestFrequency"]: "",
        });
        return res;
      }

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
        "accrualDate",
        "nextAccrualDate",
        "accruedAmount",
        "accruedAmountConvert",
        "nextAccruedAmount",
        "nextAccruedAmountConvert",
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
      if (fieldConfig.key === "description") {
        setIsDescriptionChanged(true);
      }
      const value = formatOnChangeValue(event, fieldConfig);

      setFormData({
        ...formData,
        [fieldConfig.key]: value,
      });

      handleValidateField(value, fieldConfig);
    };

    const handleValueChange = (value: any, fieldConfig: FieldConfig) => {
      // Khi "Chu kỳ trả lãi" là Đầu kỳ hoặc Cuối kỳ thì set Tần suất trả lãi = ""
      if (fieldConfig.key == "interestPeriod" && ["1", "3"].includes(value)) {
        setFormData({
          ...formData,
          [fieldConfig.key]: value,
          ["interestFrequency"]: "",
        });
      } else if (fieldConfig.key === "valueDate" && !isDescriptionChanged) {
        const tempDes = generateDescription(value, formData["bankId"]);
        setFormData({
          ...formData,
          [fieldConfig.key]: value,
          description: tempDes,
        });
      } else {
        setFormData({
          ...formData,
          [fieldConfig.key]: value,
        });
      }

      handleValidateField(value, fieldConfig);
    };

    const getTheNextNAVDate = async (
      fundId: string,
      fromDate: string,
      toDate: string,
    ): Promise<string | null> => {
      const res = await getNextNAVDate(fundId, fromDate, toDate);
      return res;
    };

    const checkCurrencyIsVND = (id): boolean => {
      const item = (listOfSelectionObject["currencyId"] || []).find(
        ele => ele.text === "VND" && ele.value === id,
      );
      return !!item;
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
            "accrualDate",
            "nextAccrualDate",
            "accruedAmount",
            "accruedAmountConvert",
            "nextAccruedAmount",
            "nextAccruedAmountConvert",
            "paidProfitAmount",
            "paidProfitAmountConvert",
            "principalConvert",
            "leftPrincipal",
            "convertedLeftPrincipal",
            "paidInterest",
            "convertedPaidInterest",
          ].includes(fieldConfig.key)
        ) {
          return true;
        }
        if (["exchangeRate", "principalConvert"].includes(fieldConfig.key)) {
          // Disable "Gía trị HD quy đổi", "Tỷ giá HĐ" khi loại tiền là VND
          return checkCurrencyIsVND(formData["currencyId"]);
        }
        // Disable "Tần suất trả lãi" khi "Chu kỳ trả lãi" là Đầu kì hoặc Cuối kì
        if (
          fieldConfig.key === "interestFrequency" &&
          ["1", "3"].includes(formData["interestPeriod"] as string)
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
          ["fundFullname", "fundCode", "custodyAccount"].includes(
            fieldConfig.key,
          )
        ) {
          return fundInfo[fieldConfig.key] || "";
        }
        return "";
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
      const unit = fieldConfig.key === "interestRate" ? "%" : "";

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
        },
        ...{ options },
      };
      return res;
    };

    const generateDescription = (valueDate, bankId): string => {
      const date = valueDate
        ? dayjs(valueDate as string).format("DD-MM-YYYY")
        : "";
      const bankName =
        listOfBank.find(ele => ele.id === bankId)?.fullName || "";

      const res =
        bankName || date
          ? `TD${bankName ? ` ${bankName}` : ""}${date ? ` ${date}` : ""}`
          : "";

      return res;
    };

    useEffect(() => {
      // Giá trị HĐ quy đổi khi Loại tiền tệ là VND
      if (!checkCurrencyIsVND(formData["currencyId"]) && !onlyShow) {
        const temp =
          formatNumberStringToNumber(formData["exchangeRate"] as string) *
          formatNumberStringToNumber(formData["principal"] as string);

        setFormData({
          ...formData,
          principalConvert: formatNumberValueToString(temp),
        });
      }
    }, [
      formData["currencyId"],
      formData["exchangeRate"],
      formData["principal"],
    ]);

    useEffect(() => {
      // Fill vào trường Diễn giải: TD + {Ngân hàng} + {Ngày hiệu lực}
      if (!isDescriptionChanged) {
        const res = generateDescription(
          formData["valueDate"],
          formData["bankId"],
        );

        setFormData({
          ...formData,
          description: res,
        });
      }
    }, [formData["valueDate"], formData["bankId"]]);

    useEffect(() => {
      const asyncFunction = async () => {
        if (!onlyShow) {
          const term = { ...formData };

          // Số ngày thực gửi
          const diffInDays =
            formData["valueDate"] && formData["maturityDate"]
              ? dayjs(formData["maturityDate"] as string).diff(
                  dayjs(formData["valueDate"] as string),
                  "day",
                )
              : 0;
          term["actualDepositDay"] = (
            diffInDays >= 0 ? diffInDays : 0
          ).toString();

          // Tính Ngày dự thu kỳ NAV tới
          if (parentId) {
            const nextNAVDate = await getTheNextNAVDate(
              parentId,
              (formData["valueDate"] as string) || "",
              (formData["maturityDate"] as string) || "",
            );
            term["nextAccrualDate"] = nextNAVDate;
          }

          setFormData({ ...term });
        }
      };

      asyncFunction();
    }, [formData["valueDate"], formData["maturityDate"]]);

    useEffect(() => {
      const asyncFunction = async () => {
        getListOfSelectionObject();
        getListOfFundBankAccountByFundId();
        getListOfBank();
        if (currentId) {
          await getRecordById();
        } else {
          await getFundInfoByFundId();
        }
      };

      asyncFunction();
    }, [currentId]);

    return (
      <Box
        sx={{
          marginTop: "20px",
        }}
      >
        <Grid container columns={12} columnSpacing={4} rowSpacing={2.5}>
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
                  <Grid item xs={12} key={index}>
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
                  <Grid item xs={field.position?.cols || 2} key={index}></Grid>
                );
              }
              default: {
                return (
                  <Grid item xs={field.position?.cols || 2} key={index}></Grid>
                );
              }
            }
          })}
        </Grid>
      </Box>
    );
  },
);
const TimeDepositContractForm = React.memo(TimeDepositContractFormComponent);
export { TimeDepositContractForm };

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
    key: "tradingDate",
    type: FIELD_TYPE.DATEPICKER,
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
  // --------
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
    label: "Số ngày cơ sở",
    key: "dayBasic",
    validationConfig: {
      requiredValidate: true,
    },
    valueKey: "cdVal",
    nameKey: "vnCdContent",
    type: FIELD_TYPE.AUTOCOMPLETE,
  },
  {
    label: "Chu kỳ trả lãi",
    key: "interestPeriod",
    validationConfig: {
      requiredValidate: true,
    },
    valueKey: "cdVal",
    nameKey: "vnCdContent",
    type: FIELD_TYPE.AUTOCOMPLETE,
  },
  {
    label: "Phương pháp cộng dồn lãi suất",
    key: "accrualOfInterest",
    validationConfig: {
      requiredValidate: true,
    },
    valueKey: "cdVal",
    nameKey: "vnCdContent",
    type: FIELD_TYPE.AUTOCOMPLETE,
  },
  {
    label: "Tần suất trả lãi",
    key: "interestFrequency",
    validationConfig: {
      requiredValidate: true,
    },
    valueKey: "cdVal",
    nameKey: "vnCdContent",
    type: FIELD_TYPE.AUTOCOMPLETE,
  },
  // -------------
  {
    label: "Giá trị HĐ còn lại",
    key: "leftPrincipal",
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "Giá trị HĐ còn lại quy đổi",
    key: "convertedLeftPrincipal",
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
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
    label: "Giá trị dự thu kỳ Nav tới quy đổi",
    key: "nextAccruedAmountConvert",
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "Giá trị lãi đã trả",
    key: "paidInterest",
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "Giá trị lãi đã trả quy đổi",
    key: "convertedPaidInterest",
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
      cols: 6,
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
