import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useStyles } from "@/src/components/BuiltFormComponent/BuiltFormComponent.styles";
import useTranslation from "next-translate/useTranslation";
import { Box, Grid, TextField } from "@mui/material";
import {
  formatNumberStringToNumber,
  formatNumberValueToString,
  formatOnChangeNumberValueToString,
  getItemById,
  getListDataBase,
  getValidateInfo,
} from "@/src/helpers";
import { INPUT_FORMAT_TYPE } from "@/src/constants/built-form";
import {
  FETCH_DATA_API_CONFIG_INTERFACE,
  VALIDATION_ERROR_INTERFACE,
  VALIDATION_INTERFACE,
} from "@/src/types";
import { BaseAutocomplete } from "@/src/components/BaseAutocomplete";
import { RootStateProps } from "@/src/types/root";
import { useSelector } from "@/src/store";
import { BaseTextField } from "@/src/components/BaseTextField";
import { GroupApprovedButtons } from "@/src/components/GroupApprovedButtons";
interface Props {
  currentId?: string;
  parentId: string;
  onlyShow: boolean;
  onCloseDialog: Function;
  workFollowStatus?: string;
  checkerAPI?: {
    approve?: string;
    deny?: string;
    cancelApprove?: string;
  };
  checkerApprove?: boolean;
}
const AddOrganizeBalanceTransComponent = forwardRef(
  (props: Props, ref): JSX.Element => {
    const { t } = useTranslation();
    const classes = useStyles();
    const {
      currentId,
      onlyShow,
      onCloseDialog,
      workFollowStatus,
      checkerAPI,
      checkerApprove,
    } = props;

    const userRole = useSelector(state => state.auth.role);

    const fundAccountingPlanId = props.parentId;

    const globalFundId = useSelector(
      (state: RootStateProps) => state.general.globalFundId,
    );

    const [formDataFundAccountingPlan, setFormDataFundAccountingPlan] =
      useState<any>({});

    const [fundOrganizeMapId, setFundOrganizeMapId] = useState<string>("");
    const [debitAmount, setDebitAmount] = useState<string>("");
    const [creditAmount, setCreditAmount] = useState<string>("");

    const [listOfFundOrganize, setListOfFundOrganize] = useState<any[]>([]);
    // Validation error
    const [validationErrors, setValidationErrors] = useState<any>({});

    // Function
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

    // Get Form Data --------------
    const generateSubmitForm = () => {
      let submitData: any = {
        fundId: globalFundId,
        fundAccountingPlanId: fundAccountingPlanId,
        fundAccountId: null,
        fundOrganizeMapId: fundOrganizeMapId,
        creditAmount: formatNumberStringToNumber(creditAmount),
        debitAmount: formatNumberStringToNumber(debitAmount),
      };
      if (currentId) {
        submitData = {
          ...submitData,
          fundAccountingBalanceTransId: currentId,
        };
      }

      return submitData;
    };

    const getBalanceTransById = async (id: string): Promise<any> => {
      const item = await getItemById(
        id,
        "fund-accounting-balance-api/find-balance-trans-by-id",
        "balanceTransId",
      );
      return item;
    };

    const getFundAccountingPlanAccountNumberById = async () => {
      const item = await getItemById(
        fundAccountingPlanId,
        "fund-accounting-plan-api/find-by-id",
        "id",
      );
      if (item) {
        setFormDataFundAccountingPlan(item);
      }
    };
    // End Get Form Data --------------

    //   Get List ------------
    const getListOfFundOrganize = async () => {
      const config: FETCH_DATA_API_CONFIG_INTERFACE = {
        url: "fund-organize-provider-api/find",
        params: [
          { paramKey: "pageIndex", paramValue: "1" },
          { paramKey: "pageSize", paramValue: "100" },
        ],
        searchTerms: [
          {
            fieldName: "fundId",
            fieldValue: globalFundId,
          },
        ],
      };

      const res = await getListDataBase(config);
      setListOfFundOrganize([...res.source]);
    };
    //   End Get List ------------

    // On change --------------
    const handleFundOrganizeMapIdChange = async (value: any) => {
      setFundOrganizeMapId(value ? value : "");
      setDebitAmount("");
      setCreditAmount("");
      handleValidateFundOrganizeMapId(value);
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
    //  End On change --------------

    //  Validate -----------------
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
        formDataFundAccountingPlan?.type === ACCOUNT_TYPE.LUONG_TINH &&
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

        if (
          !getValidateInfo(
            key === "creditAmount"
              ? formatNumberStringToNumber(debitAmount)
              : formatNumberStringToNumber(creditAmount),
            key === "creditAmount"
              ? fieldsConfig.debitAmount.label
              : fieldsConfig.creditAmount.label,
            fieldConfig.validationConfig,
          ).error ||
          !getValidateInfo(
            formatValue,
            fieldConfig.label,
            fieldConfig.validationConfig,
          ).error
        ) {
          setValidationErrors({
            ...validationErrors,
            creditAmount: "",
            debitAmount: "",
          });

          return res;
        }
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
      }

      return res;
    };

    const handleValidateFundOrganizeMapId = (
      value: any,
    ): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "fundOrganizeMapId");
    };

    const handleValidateCreditAmount = (value): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "creditAmount");
    };

    const handleValidateDebitAmount = (value): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "debitAmount");
    };
    //  End Validate -----------------

    useEffect(() => {
      const asyncFunction = async () => {
        await getListOfFundOrganize();
        if (currentId) {
          const item = await getBalanceTransById(currentId);

          if (item) {
            setFormDataFundAccountingPlan(item.fundAccountingPlan);
            const x = formatNumberValueToString(item.creditAmount);
            setCreditAmount(x);
            const y = formatNumberValueToString(item.debitAmount);
            setDebitAmount(y);
            setFundOrganizeMapId(item.fundOrgProviderMap?.value || "");
          }
        } else {
          await getFundAccountingPlanAccountNumberById();
        }
      };

      asyncFunction();
    }, [globalFundId, fundAccountingPlanId, currentId]);

    return (
      <Box
        sx={{
          marginTop: "20px",
        }}
      >
        <Grid container columns={6} columnSpacing={4} rowSpacing={2}>
          <Grid item xs={2}>
            <BaseTextField
              label={fieldsConfig.accountNumber.label}
              value={formDataFundAccountingPlan?.accountNumber || ""}
              disabled={true}
              fullWidth
              className={classes.textFieldInput}
            />
          </Grid>
          <Grid item xs={2}>
            <BaseAutocomplete
              label={fieldsConfig.fundOrganizeMapId.label}
              required={true}
              options={listOfFundOrganize}
              value={fundOrganizeMapId}
              onChange={handleFundOrganizeMapIdChange}
              onBlur={() => {
                handleValidateFundOrganizeMapId(fundOrganizeMapId);
              }}
              valueKey={fieldsConfig.fundOrganizeMapId.valueKey || ""}
              labelKey={fieldsConfig.fundOrganizeMapId.nameKey || ""}
              fullWidth
              disabled={onlyShow}
              error={(validationErrors.fundOrganizeMapId || "").length > 0}
              errorMessage={validationErrors.fundOrganizeMapId || ""}
            />
          </Grid>
          <Grid item xs={2}>
            <BaseTextField
              label={fieldsConfig.debitAmount.label}
              value={debitAmount}
              onChange={handleDebitAmountChange}
              onBlur={event => {
                handleValidateDebitAmount(event.target.value);
              }}
              disabled={
                onlyShow ||
                formDataFundAccountingPlan?.type === ACCOUNT_TYPE.DU_CO
              }
              error={!!validationErrors.debitAmount}
              errorMessage={validationErrors.debitAmount}
              fullWidth
              className={classes.textFieldInput}
            />
          </Grid>
          <Grid item xs={2}>
            <BaseTextField
              label={fieldsConfig.creditAmount.label}
              value={creditAmount}
              onChange={handleCreditAmountChange}
              onBlur={event => {
                handleValidateCreditAmount(event.target.value);
              }}
              disabled={
                onlyShow ||
                formDataFundAccountingPlan?.type === ACCOUNT_TYPE.DU_NO
              }
              error={!!validationErrors.creditAmount}
              errorMessage={validationErrors.creditAmount}
              fullWidth
              className={classes.textFieldInput}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          {!!checkerApprove && userRole == 1 && (
            <GroupApprovedButtons
              workFollowStatus={workFollowStatus}
              checkerAPI={checkerAPI}
              currentId={currentId}
              onCloseDialog={onCloseDialog}
            />
          )}
        </Box>
      </Box>
    );
  },
);
const AddOrganizeBalanceTrans = React.memo(AddOrganizeBalanceTransComponent);
export { AddOrganizeBalanceTrans };

const fieldsConfig: {
  accountNumber: FieldConfig;
  fundOrganizeMapId: FieldConfig;
  debitAmount: FieldConfig;
  creditAmount: FieldConfig;
} = {
  accountNumber: {
    label: "STK",
  },
  fundOrganizeMapId: {
    label: "Tổ chức cung cấp dịch vụ",
    validationConfig: {
      requiredValidate: true,
    },
    valueKey: "id",
    nameKey: "fundOrgProviderVal.name",
  },
  debitAmount: {
    label: "Dư nợ",
    validationConfig: {
      requiredValidate: true,
    },
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
  },
  creditAmount: {
    label: "Dư có",
    validationConfig: {
      requiredValidate: true,
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

const ACCOUNT_TYPE = {
  DU_NO: "1",
  LUONG_TINH: "2",
  DU_CO: "3",
};
