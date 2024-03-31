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
  CLOSE_DIALOG_ACTION_TYPE,
  CO_ALIGN,
  CO_TYPE,
  SEARCH_CONDITIONS,
} from "@/src/constants";
import {
  AUTOCOMPLETE_WITH_HEADER_COLUMN_CONFIG,
  BaseWithHeaderAutocomplete,
} from "@/src/components/BaseWithHeaderAutocomplete";
import {
  formatNumberStringToNumber,
  formatNumberValueToString,
  formatOnChangeNumberValueToString,
  generateSubRowsArray,
  getItemById,
  getListDataBase,
  getValidateInfo,
} from "@/src/helpers";
import {
  FETCH_DATA_API_CONFIG_INTERFACE,
  TABLE_OPTIONS_INTERFACE,
  VALIDATION_ERROR_INTERFACE,
  VALIDATION_INTERFACE,
} from "@/src/types";
import { BaseDynamicTable } from "@/src/components/BaseTable/BaseDynamicTable";
import { getTableConfigStore } from "@/src/store/reducers/tableConfig";
import { dispatch, useSelector } from "@/src/store";
import {
  INPUT_FORMAT_TYPE,
  IN_RANGE_VALIDATE_TYPE,
} from "@/src/constants/built-form";
import { IFormType } from "@/src/types/general";
import { BaseTextField } from "@/src/components/BaseTextField";
import { GroupApprovedButtons } from "@/src/components/GroupApprovedButtons";

interface Props {
  currentId?: string;
  parentId: string;
  onlyShow: boolean;
  formType: IFormType;
  detailed?: "bank" | "organize" | "investor";
  onCloseDialog?: Function;
  workFollowStatus?: string;
  checkerAPI?: {
    approve?: string;
    deny?: string;
    cancelApprove?: string;
  };
  checkerApprove?: boolean;
}
const AddBalanceComponent = forwardRef((props: Props, ref): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    currentId,
    parentId,
    onlyShow,
    formType,
    detailed,
    onCloseDialog,
    workFollowStatus,
    checkerAPI,
    checkerApprove,
  } = props;

  const userRole = useSelector(state => state.auth.role);

  const [options, setOptions] = useState<any[]>([]);

  const [fundAccountingPlanId, setFundAccountingPlanId] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [creditAmount, setCreditAmount] = useState<string>("");
  const [debitAmount, setDebitAmount] = useState<string>("");
  const [type, setType] = useState<any>("");
  const [isBankAccount, setIsBankAccount] = useState<boolean>(false);
  const [followBy, setFollowBy] = useState("");

  const [fundAccountingPlanIdTextInput, setFundAccountingPlanIdTextInput] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Validation error
  const [validationErrors, setValidationErrors] = useState<any>({});

  const [tableConfigs, setTableConfigs] = useState<{
    [key: string]: TABLE_OPTIONS_INTERFACE;
  }>({});
  const [tableConfigKey, setTableConfigKey] = useState<string>("");

  const [formData, setFormData] = useState<any>({});

  //   Function
  useImperativeHandle(ref, () => ({
    async onSubmitRef() {
      return false;
    },
    async onSaveValueRef() {
      const payload = generateSubmitForm();

      if (isBankAccount || !!followBy) {
        return CLOSE_DIALOG_ACTION_TYPE.ONLY_CLOSE;
      } else if (payload) {
        return payload;
      } else return null;
    },
    handleUnFocus() {},
  }));

  // Get TABLE Config
  const getTableConfigs = async () => {
    let configs: {
      [key: string]: TABLE_OPTIONS_INTERFACE;
    } = {};

    await Object.keys(TABLE_CONFIG_CODE).forEach(async key => {
      const config = await dispatch(
        getTableConfigStore(TABLE_CONFIG_CODE[key]),
      );
      if (config) {
        configs[key] = config;
      }
    });
    setTableConfigs(configs);
  };

  //    Handle Validate
  const handleValidateField = (
    value: any,
    key: string,
  ): VALIDATION_ERROR_INTERFACE => {
    const fieldConfig = fieldsConfig[key];
    const res = {
      error: false,
      errorMessage: "",
    };

    const formatValue = ["creditAmount", "debitAmount"].includes(key)
      ? formatNumberStringToNumber(value)
      : value;

    if (
      type === ACCOUNT_TYPE.LUONG_TINH &&
      (key === "creditAmount" || key === "debitAmount")
    ) {
      if (
        formatNumberStringToNumber(
          key === "creditAmount" ? debitAmount : creditAmount,
        ) > 0 &&
        formatValue > 0
      ) {
        const msg = "Dư nợ và Dư có không được đồng thời lớn hơn 0";
        setValidationErrors({
          ...validationErrors,
          creditAmount: msg,
          debitAmount: msg,
        });

        return {
          error: true,
          errorMessage: msg,
        };
      }
      const x = getValidateInfo(
        key === "creditAmount"
          ? formatNumberStringToNumber(debitAmount)
          : formatNumberStringToNumber(creditAmount),
        key === "creditAmount"
          ? fieldsConfig.debitAmount.label
          : fieldsConfig.creditAmount.label,
        fieldConfig.validationConfig,
      );
      const y = getValidateInfo(
        formatValue,
        fieldConfig.label,
        fieldConfig.validationConfig,
      );
      if (!x.error || !y.error) {
        setValidationErrors({
          ...validationErrors,
          creditAmount: "",
          debitAmount: "",
        });

        return res;
      }
    }

    if (
      (key === "creditAmount" &&
        (type === ACCOUNT_TYPE.DU_NO || isBankAccount || !!followBy)) ||
      type === ACCOUNT_TYPE.DU_CO ||
      (key === "debitAmount" && (isBankAccount || !!followBy))
    ) {
      return res;
    }

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
      fundAccountingPlanId,
      debitAmount,
      creditAmount,
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

  const handleValidateFundAccountingPlanId = (
    value,
  ): VALIDATION_ERROR_INTERFACE => {
    return handleValidateField(value, "fundAccountingPlanId");
  };

  const handleValidateCreditAmount = (value): VALIDATION_ERROR_INTERFACE => {
    return handleValidateField(value, "creditAmount");
  };

  const handleValidateDebitAmount = (value): VALIDATION_ERROR_INTERFACE => {
    return handleValidateField(value, "debitAmount");
  };

  //   Handle onChange
  const handleFundAccountingPlanIdChange = (value: any) => {
    setFundAccountingPlanId(value);
    handleValidateFundAccountingPlanId(value);

    const item = options.find(ele => ele.id === value);
    handleFillDataByAccountLastChild(item, true);
  };

  const getBalanceTransPlanByFundAccountingPlanId = async (id: string) => {
    const config: FETCH_DATA_API_CONFIG_INTERFACE = {
      url: "fund-accounting-balance-api/balance-trans/find-by-account-plan-id",
      params: [
        {
          paramKey: "pageIndex",
          paramValue: 1,
        },
        {
          paramKey: "pageSize",
          paramValue: 1,
        },
      ],
      searchTerms: [{ fieldName: "fundAccountingPlanId", fieldValue: id }],
    };
    const res = await getListDataBase(config);
    if (res.source.length) {
      const item = res.source[0];
      setDebitAmount(formatNumberValueToString(item?.parentDebitAmount || 0));
      setCreditAmount(formatNumberValueToString(item?.parentCreditAmount || 0));
    }
    const item = await getItemById(id, "fund-accounting-plan-api/find-by-id");
    handleFillDataByAccountLastChild(item);
  };
  const handleFillDataByAccountLastChild = (item: any, validate?: boolean) => {
    setFundAccountingPlanIdTextInput(item?.accountNumber || "");
    setFullName(item?.fullName || "");

    setType(item?.type || "");

    setIsBankAccount(!!item?.isBankAccount);
    setFollowBy(item?.followBy || "");

    if (!!item?.isBankAccount) {
      setTableConfigKey("bankAccount");
    } else if (item?.followBy === FOLLOW_BY_OPTIONS.ORGANIZE) {
      setTableConfigKey("organize");
    } else if (item?.followBy === FOLLOW_BY_OPTIONS.INVESTOR) {
      setTableConfigKey("investor");
    } else {
      setTableConfigKey("");
    }

    if (!!validate) {
      const infoValidata = handleValidateFundAccountingPlanId(item?.id);

      setValidationErrors({
        ...validationErrors,
        creditAmount: "",
        debitAmount: "",
        fundAccountingPlanId: infoValidata.error
          ? infoValidata.errorMessage
          : "",
      });
    }
  };

  const handleCreditAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = formatOnChangeNumberValueToString(event, creditAmount);
    setCreditAmount(value);
    handleValidateCreditAmount(value);
  };

  const handleDebitAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = formatOnChangeNumberValueToString(event, debitAmount);
    setDebitAmount(value);
    handleValidateDebitAmount(value);
  };

  const handleFundAccountingPlanIdInputChange = async (value: string) => {
    setIsLoading(true);
    await getAccountsByString(value);
  };

  const getAccountsByString = async (searchStr?: string) => {
    const config: FETCH_DATA_API_CONFIG_INTERFACE = {
      url: "fund-accounting-plan-api/last-childs?pageIndex=1&pageSize=20",
      searchTerms: [
        {
          fieldName: "fundId",
          fieldValue: parentId || "",
        },
        {
          fieldName: "accountNumber",
          fieldValue: searchStr || "",
          condition: SEARCH_CONDITIONS.CONTAINS,
        },
        {
          fieldName: "debitAmount",
          fieldValue: 0,
        },
        {
          fieldName: "creditAmount",
          fieldValue: 0,
        },
        {
          fieldName: "isBankAccount",
          fieldValue: detailed === "bank" ? true : "",
        },
        {
          fieldName: "followBy",
          fieldValue:
            detailed === "organize" ? "1" : detailed === "investor" ? "2" : "",
        },
      ],
    };

    const res = await getListDataBase(config);
    const arr = generateSubRowsArray(res.source);
    setOptions(arr);
    setIsLoading(false);
  };

  const getFundAccountingBalanceById = async (id: string) => {
    const item = await getItemById(
      id,
      "fund-accounting-balance-api/find-by-id",
    );
    if (item) {
      setFormData(item);
      setFundAccountingPlanId(item.fundAccountingPlanId);
      await getBalanceTransPlanByFundAccountingPlanId(
        item.fundAccountingPlanId,
      );
    }
  };

  const generateSubmitForm = () => {
    if (!validateAll()) {
      return;
    }
    let dataSubmit = {
      id: currentId || null,
      fundId: parentId,
      fundAccountingPlanId: fundAccountingPlanId,
      creditAmount: formatNumberStringToNumber(creditAmount),
      debitAmount: formatNumberStringToNumber(debitAmount),
    };
    return dataSubmit;
  };

  useEffect(() => {
    const asyncFunction = async () => {
      await getTableConfigs();
      if (currentId) {
        await getFundAccountingBalanceById(currentId);
      } else {
        setIsLoading(true);
        await getAccountsByString();
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
      <Box
        sx={{
          marginBottom: "20px",
        }}
      >
        <Grid container columns={12} columnSpacing={4}>
          <Grid item xs={2}>
            <label className={classes.requiredInputLabel}>
              {fieldsConfig.fundAccountingPlanId.label}
              {detailed === "bank"
                ? " (TK Ngân hàng)"
                : detailed === "organize"
                ? " (Tổ chức cung cấp DV)"
                : detailed === "investor"
                ? " (Nhà đầu tư)"
                : ""}
            </label>
            <BaseWithHeaderAutocomplete
              value={fundAccountingPlanId}
              apiDefaultTextValue={fundAccountingPlanIdTextInput}
              apiFilter
              valueKey={"id"}
              options={options}
              columnConfigs={columnConfigs}
              onChange={handleFundAccountingPlanIdChange}
              onInputChange={handleFundAccountingPlanIdInputChange}
              className={classes.autocompleteWithHeader}
              listHeight={340}
              listWidth={410}
              isLoading={isLoading}
              disabled={onlyShow || formType === "update"}
              error={(validationErrors.fundAccountingPlanId || "").length > 0}
              errorMessage={validationErrors.fundAccountingPlanId || ""}
            />
          </Grid>
          <Grid item xs={4}>
            <BaseTextField
              label={fieldsConfig.fullName.label}
              value={fullName}
              disabled={true}
              fullWidth
              className={classes.textFieldInput}
            />
          </Grid>
          <Grid item xs={2}>
            <BaseTextField
              label={fieldsConfig.debitAmount.label}
              required={true}
              value={debitAmount}
              onChange={handleDebitAmountChange}
              onBlur={event => {
                handleValidateDebitAmount(event.target.value);
              }}
              disabled={
                onlyShow ||
                type === ACCOUNT_TYPE.DU_CO ||
                !fundAccountingPlanId ||
                isBankAccount ||
                !!followBy
              }
              error={
                !!validationErrors.debitAmount &&
                type !== ACCOUNT_TYPE.DU_CO &&
                !!fundAccountingPlanId
              }
              errorMessage={validationErrors.debitAmount}
              fullWidth
              className={classes.textFieldInput}
            />
          </Grid>
          <Grid item xs={2}>
            <BaseTextField
              label={fieldsConfig.creditAmount.label}
              required={true}
              value={creditAmount}
              onChange={handleCreditAmountChange}
              onBlur={event => {
                handleValidateCreditAmount(event.target.value);
              }}
              disabled={
                onlyShow ||
                type === ACCOUNT_TYPE.DU_NO ||
                !fundAccountingPlanId ||
                isBankAccount ||
                !!followBy
              }
              error={
                !!validationErrors.creditAmount &&
                type !== ACCOUNT_TYPE.DU_NO &&
                !!fundAccountingPlanId
              }
              errorMessage={validationErrors.creditAmount}
              fullWidth
              className={classes.textFieldInput}
            />
          </Grid>
        </Grid>
      </Box>
      <Box>
        {tableConfigKey &&
        tableConfigs[tableConfigKey] &&
        (isBankAccount || !!followBy) ? (
          <BaseDynamicTable
            tableOptions={tableConfigs[tableConfigKey]}
            parentId={fundAccountingPlanId}
            onRefreshRecord={async () => {
              await getBalanceTransPlanByFundAccountingPlanId(
                fundAccountingPlanId,
              );
            }}
          />
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
});
const AddBalance = React.memo(AddBalanceComponent);
export { AddBalance };

interface FieldConfig {
  label: string;
  validationConfig?: VALIDATION_INTERFACE;
  formatConfig?: {
    type: INPUT_FORMAT_TYPE;
  };
}

const fieldsConfig: {
  fundAccountingPlanId: FieldConfig;
  fullName: FieldConfig;
  debitAmount: FieldConfig;
  creditAmount: FieldConfig;
} = {
  fundAccountingPlanId: {
    label: "Số tài khoản",
    validationConfig: {
      requiredValidate: true,
    },
  },
  fullName: {
    label: "Tên tài khoản",
  },
  debitAmount: {
    label: "Dư nợ",
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
  creditAmount: {
    label: "Dư có",
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

const columnConfigs: AUTOCOMPLETE_WITH_HEADER_COLUMN_CONFIG[] = [
  {
    key: "accountNumber",
    label: "STK",
    width: 10,
    type: CO_TYPE.TEXT,
    align: CO_ALIGN.LEFT,
    showOnTextField: true,
    boldText: true,
  },
  {
    key: "fullName",
    label: "Tên TK (VN)",
    width: 40,
    type: CO_TYPE.TEXT,
    align: CO_ALIGN.LEFT,
    showOnTextField: false,
  },
];

const TABLE_CONFIG_CODE = {
  bankAccount: "FUND-BALANCE/BANK-ACCOUNT/BALANCE-TRANS",
  organize: "FUND-BALANCE/ORGANIZE/BALANCE-TRANS",
  investor: "FUND-BALANCE/INVESTOR/BALANCE-TRANS",
};

const ACCOUNT_TYPE = {
  DU_NO: "1",
  LUONG_TINH: "2",
  DU_CO: "3",
};

const FOLLOW_BY_OPTIONS = {
  ORGANIZE: "1",
  INVESTOR: "2",
};
