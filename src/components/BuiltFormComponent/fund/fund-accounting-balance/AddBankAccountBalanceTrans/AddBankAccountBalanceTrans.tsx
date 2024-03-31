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
  getProperty,
  getValidateInfo,
} from "@/src/helpers";
import { INPUT_FORMAT_TYPE } from "@/src/constants/built-form";
import {
  FETCH_DATA_API_CONFIG_INTERFACE,
  VALIDATION_ERROR_INTERFACE,
  VALIDATION_INTERFACE,
} from "@/src/types";
import { ValidationErrorTootip } from "../../../ValidationErrorTootip";
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
const AddBankAccountBalanceTransComponent = forwardRef(
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

    const [organizeProviderId, setOrganizeProviderId] = useState<string>("");
    const [fundAccountId, setFundAccountId] = useState<string>("");
    const [distributionAgent, setDistributionAgent] = useState<string>("");
    const [debitAmount, setDebitAmount] = useState<string>("");
    const [creditAmount, setCreditAmount] = useState<string>("");

    const [listOfOrganizeProvider, setListOfOrganizeProvider] = useState<any[]>(
      [],
    );
    const [listOfFundAccount, setListOfFundAccount] = useState<any[]>([]);
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
        fundAccountId: fundAccountId,
        fundOrganizeMapId: null,
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

    const getListOfFundAccount = async () => {
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
          {
            fieldName: "roleCode",
            fieldValue: "NHLK",
          },
        ],
      };

      const res = await getListDataBase(config);
      setListOfFundAccount([...res.source]);
      getListOfOrganizeProvider(res.source);
    };

    const getListOfOrganizeProvider = (listOfFundAccount: any[]) => {
      const groupedObjectsMap = new Map<string, any>();

      listOfFundAccount.forEach(obj => {
        const organizeProviderId = obj.organizeProviderId;
        if (!groupedObjectsMap.has(organizeProviderId)) {
          groupedObjectsMap.set(organizeProviderId, obj.organizeProviderVal);
        }
      });

      const res = Array.from(groupedObjectsMap.values());
      setListOfOrganizeProvider(res);
    };
    //   End Get List ------------

    // On change --------------
    const handleOrganizeProviderIdChange = async (value: any) => {
      setOrganizeProviderId(value ? value : "");
      setFundAccountId("");
      setDistributionAgent("");
      setDebitAmount("");
      setCreditAmount("");
      handleValidateOrganizeProviderId(value);
    };

    const handleFundAccountIdChange = (value: any) => {
      setFundAccountId(value ? value : "");
      handleValidateFundAccountId(value);
      const item = listOfFundAccount.find(
        ele =>
          getProperty(ele, fieldsConfig.fundAccountId.valueKey || "") === value,
      );
      if (item && item.distributionAgentVal?.name) {
        const d = getProperty(item, "distributionAgentVal.name", "");
        setDistributionAgent(d);
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

    const handleValidateOrganizeProviderId = (
      value: any,
    ): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "organizeProviderId");
    };

    const handleValidateFundAccountId = (
      value: any,
    ): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "fundAccountId");
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
        await getListOfFundAccount();
        if (currentId) {
          const item = await getBalanceTransById(currentId);

          if (item) {
            setFormDataFundAccountingPlan(item.fundAccountingPlan);
            setCreditAmount(formatNumberValueToString(item.creditAmount));
            setDebitAmount(formatNumberValueToString(item.debitAmount));
            setOrganizeProviderId(item.fundAccount?.organizeProviderId || "");
            setFundAccountId(item.fundAccount?.id || "");
            setDistributionAgent(
              item.fundAccount?.distributionAgentVal?.name || "",
            );
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
              label={fieldsConfig.organizeProviderId.label}
              required={true}
              options={listOfOrganizeProvider}
              value={organizeProviderId}
              onChange={handleOrganizeProviderIdChange}
              onBlur={() => {
                handleValidateOrganizeProviderId(organizeProviderId);
              }}
              valueKey={fieldsConfig.organizeProviderId.valueKey || ""}
              labelKey={fieldsConfig.organizeProviderId.nameKey || ""}
              fullWidth
              disabled={onlyShow}
              className={classes.select}
              error={(validationErrors.organizeProviderId || "").length > 0}
              errorMessage={validationErrors.organizeProviderId || ""}
            />
          </Grid>
          <Grid item xs={2}>
            <BaseAutocomplete
              label={fieldsConfig.fundAccountId.label}
              required={true}
              options={listOfFundAccount.filter(
                item => item.organizeProviderId === organizeProviderId,
              )}
              value={fundAccountId}
              onChange={handleFundAccountIdChange}
              onBlur={() => {
                handleValidateFundAccountId(fundAccountId);
              }}
              valueKey={fieldsConfig.fundAccountId.valueKey || ""}
              labelKey={fieldsConfig.fundAccountId.nameKey || ""}
              fullWidth
              disabled={onlyShow}
              className={classes.select}
              error={(validationErrors.fundAccountId || "").length > 0}
              errorMessage={validationErrors.fundAccountId || ""}
            />
          </Grid>
          <Grid item xs={2}>
            <BaseTextField
              label={fieldsConfig.distributionAgent.label}
              value={distributionAgent}
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
              required={true}
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
const AddBankAccountBalanceTrans = React.memo(
  AddBankAccountBalanceTransComponent,
);
export { AddBankAccountBalanceTrans };

const fieldsConfig: {
  accountNumber: FieldConfig;
  organizeProviderId: FieldConfig;
  fundAccountId: FieldConfig;
  distributionAgent: FieldConfig;
  debitAmount: FieldConfig;
  creditAmount: FieldConfig;
} = {
  accountNumber: {
    label: "STK",
  },
  organizeProviderId: {
    label: "Tên ngân hàng",
    validationConfig: {
      requiredValidate: true,
    },
    valueKey: "value",
    nameKey: "name",
  },
  fundAccountId: {
    label: "STK ngân hàng",
    validationConfig: {
      requiredValidate: true,
    },
    valueKey: "id",
    nameKey: "bankAccountNumber",
  },
  distributionAgent: {
    label: "Đại lý phân phối",
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
