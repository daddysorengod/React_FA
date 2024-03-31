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
import { BaseDatePickerInput } from "@/src/components/BaseDatePickerInput";
import { IFormType } from "@/src/types/general";
import { TableHead } from "@mui/material";
import { TableRow } from "@mui/material";
import { SEARCH_CONDITIONS } from "@/src/constants";
interface Props {
  currentId?: string;
  parentId?: string;
  onlyShow?: boolean;
  formType?: IFormType;
}
const AccountingMoneyTransDetailComponent = forwardRef(
  (props: Props, ref): JSX.Element => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { currentId, parentId, onlyShow, formType } = props;

    const globalFundId = useSelector(
      (state: RootStateProps) => state.general.globalFundId,
    );

    const [formData, setFormData] = useState<any>({});

    const [fundInfo, setFundInfo] = useState<any>({});
    const [tradingDate, setTradingDate] = useState<any>("");
    const [tradingType, setTradingType] = useState<any>("");
    const [transType, setTransType] = useState<any>("");
    const [debitFundAccountId, setDebitFundAccountId] = useState<string>("");
    const [creditFundAccountId, setCreditFundAccountId] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [distributionAgent, setDistributionAgent] = useState<string>("");

    const [accountingEntryName, setAccountingEntryName] = useState<string>("");
    const [fundAccountingPlanDebitId, setFundAccountingPlanDebitId] =
      useState<string>("");
    const [fundAccountingPlanCreditId, setFundAccountingPlanCreditId] =
      useState<string>("");
    const [debitAccountNumber, setDebitAccountNumber] = useState<string>("");
    const [creditAccountNumber, setCreditAccountNumber] = useState<string>("");
    const [amount, setAmount] = useState<string>("0");

    const [validationErrors, setValidationErrors] = useState<{
      [key: string]: string;
    }>({});

    const [listOfTradingType, setListOfTradingType] = useState<any[]>([]);
    const [listOfTransType, setListOfTransType] = useState<any[]>([]);
    const [listOfDebitFundAccount, setListOfDebitFundAccount] = useState<any[]>(
      [],
    );
    const [listOfCreditFundAccount, setListOfCreditFundAccount] = useState<
      any[]
    >([]);
    const [listOfFundAccountingPlanDebit, setListOfFundAccountingPlanDebit] =
      useState<any[]>([]);
    const [listOfFundAccountingPlanCredit, setListOfFundAccountingPlanCredit] =
      useState<any[]>([]);

    const [hasMediateAccount, setHasMediateAccount] = useState<boolean>(false);

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
      const submitData = {
        ...{
          fundId: globalFundId,
          tradingType,
          tradingDate,
          transType: transType || null,
          debitFundAccountId: debitFundAccountId || null,
          creditFundAccountId: creditFundAccountId || null,
          description,
          fundAccountingPlanDebitId,
          fundAccountingPlanCreditId,
          amount: formatNumberStringToNumber(amount),
          accountingEntryName,
        },
        ...([
          TRADING_TYPE.CHUYEN_TIEN_SANG_TK_TG,
          TRADING_TYPE.THANH_TOAN_TIEN_THUA,
        ].includes(tradingType)
          ? {
              transType,
            }
          : {}),
        ...(!!currentId ? { id: currentId } : {}),
      };
      return submitData;
    };

    const getFormData = async (): Promise<any> => {
      if (!currentId) return;
      const res = await getItemById(
        currentId,
        "fund-raising-api/money/find-by-id",
      );
      if (res) {
        setFormData(res);
        setTradingDate(res.tradingDate || "");
        setTransType(res.transType || "");
        setTradingType(res.tradingType || "");
        setDescription(res.description || "");
        setDebitFundAccountId(res.debitFundAccountId || "");
        setCreditFundAccountId(res.creditFundAccountId || "");

        const res1 = await getListOfFundAccountingPlan(
          res.debitAccountNumber || "",
          SEARCH_CONDITIONS.EQUAL,
        );
        const res2 = await getListOfFundAccountingPlan(
          res.creditAccountNumber || "",
          SEARCH_CONDITIONS.EQUAL,
        );
        setListOfFundAccountingPlanDebit(res1);
        setListOfFundAccountingPlanCredit(res2);

        setAccountingEntryName(res.accountingEntryName || "");
        setFundAccountingPlanDebitId(res.accountingPlanDebitId || "");
        setFundAccountingPlanCreditId(res.accountingPlanCreditId || "");
        setDebitAccountNumber(res.debitAccountNumber || "");
        setCreditAccountNumber(res.creditAccountNumber || "");

        setAmount(formatNumberValueToString(res.amount || 0));
      }

      return res;
    };

    const getFundInfo = async (): Promise<any> => {
      const res = await getItemById(
        globalFundId,
        "fund-information-api/find-by-id",
      );
      if (res) {
        setFundInfo(res);
      }

      return res;
    };

    const getListOfTradingType = async () => {
      const config: FETCH_DATA_API_CONFIG_INTERFACE = {
        url: "all-code-api/find-by-cd-type?cdType=FUND_RAISING_MONEY&cdName=TRADING_TYPE&pageIndex=1&pageSize=20",
      };
      const res = await getListDataBase(config);
      setListOfTradingType([...res.source]);
    };

    const getListOfTransType = async () => {
      const config: FETCH_DATA_API_CONFIG_INTERFACE = {
        url: "all-code-api/find-by-cd-type?cdType=FUND_RAISING_MONEY&cdName=TRANS_TYPE&pageIndex=1&pageSize=20",
      };
      const res = await getListDataBase(config);
      setListOfTransType([...res.source]);
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

      const res = await getListDataBase(config);
      // setListOfDebitFundAccount(res.source);
      // setListOfCreditFundAccount(res.source);
    };

    const getListOfBankAccountNumber = async (
      searchStr?: string,
      condition?: SEARCH_CONDITIONS.CONTAINS | SEARCH_CONDITIONS.EQUAL,
    ): Promise<any[]> => {
      if (!globalFundId) {
        return [];
      }
      const config: FETCH_DATA_API_CONFIG_INTERFACE = {
        url: "fund-account-api/find?pageIndex=1&pageSize=20",
        searchTerms: [
          {
            fieldName: "fundId",
            fieldValue: globalFundId,
          },
          {
            fieldName: "accountType",
            fieldValue: "1",
          },
          {
            fieldName: "bankAccountNumber",
            fieldValue: searchStr || "",
            condition: condition || SEARCH_CONDITIONS.CONTAINS,
          },
        ],
      };
      const res = await getListDataBase(config);
      return res.source;
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

    //    Handle Validate
    const handleValidateField = (
      value: any,
      key: string,
    ): VALIDATION_ERROR_INTERFACE => {
      const fieldConfig: FieldConfig = fieldsConfig[key];

      const res = {
        error: false,
        errorMessage: "",
      };

      const listAcountNumber = ["1121", "1151", "11411"];

      if (key === "debitFundAccountId") {
        let item = listOfFundAccountingPlanDebit.find(
          e => (e.id = fundAccountingPlanDebitId),
        );
        if (!listAcountNumber.includes(item?.bankAccountNumber)) {
          return res;
        }
      }

      if (key === "creditFundAccountId") {
        let item = listOfFundAccountingPlanCredit.find(
          e => (e.id = fundAccountingPlanCreditId),
        );
        if (!listAcountNumber.includes(item?.bankAccountNumber)) {
          return res;
        }
      }

      const formatValue =
        fieldsConfig[key]?.formatConfig?.type === INPUT_FORMAT_TYPE.NUMBER_VALUE
          ? formatNumberStringToNumber(value)
          : value;

      if (
        key === "transType" &&
        ![
          TRADING_TYPE.CHUYEN_TIEN_SANG_TK_TG,
          TRADING_TYPE.THANH_TOAN_TIEN_THUA,
        ].includes(tradingType)
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
        tradingType,
        tradingDate,
        transType,
        debitFundAccountId,
        creditFundAccountId,
        accountingEntryName,
        fundAccountingPlanDebitId,
        fundAccountingPlanCreditId,
        amount,
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

    const handleValidateTradingType = (value): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "tradingType");
    };
    const handleValidateTradingDate = (value): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "tradingDate");
    };
    const handleValidateTransType = (value): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "transType");
    };
    const handleValidateDebitFundAccountId = (
      value,
    ): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "debitFundAccountId");
    };
    const handleValidateCreditFundAccountId = (
      value,
    ): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "creditFundAccountId");
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
    const handleValidateDescription = (value): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "description");
    };

    // Handle on Change
    const handleTradingTypeChange = async (value: any) => {
      setTradingType(value);

      const suggestion = suggestions.find(
        ele =>
          (value === TRADING_TYPE.GOM_TIEN_PHONG_TOA_VE_TK_TONG &&
            ele.tradingType === value &&
            ele.transType ===
              (hasMediateAccount
                ? TRANS_TYPE.CO_TK_TRUNG_GIAN
                : TRANS_TYPE.KO_CO_TK_TRUNG_GIAN)) ||
          (value !== TRADING_TYPE.GOM_TIEN_PHONG_TOA_VE_TK_TONG &&
            ele.tradingType === value),
      );
      if (!!value && !!suggestion) {
        const tempValidationError = { ...validationErrors };
        setTransType(suggestion.transType || "");
        if (suggestion.transType) {
          tempValidationError["transType"] = "";
        }
        tempValidationError["tradingType"] = "";
        await handleFillDataBySuggestion(suggestion, tempValidationError);
      } else {
        setTransType("");
        setAccountingEntryName("");
        setFundAccountingPlanDebitId("");
        setFundAccountingPlanCreditId("");
        setDebitAccountNumber("");
        setCreditAccountNumber("");
        handleValidateTradingType(value);
      }
    };

    const handleFillDataBySuggestion = async (suggestion: any, errors: any) => {
      const tempValidationError = { ...errors };
      setAccountingEntryName(suggestion?.description || "");

      const listOfDebitAccount = await getListOfFundAccountingPlan(
        suggestion?.debitAccount || "",
        SEARCH_CONDITIONS.EQUAL,
      );
      const listOfCreditAccount = await getListOfFundAccountingPlan(
        suggestion?.creditAccount || "",
        SEARCH_CONDITIONS.EQUAL,
      );

      if (listOfDebitAccount.length) {
        setListOfFundAccountingPlanDebit(listOfDebitAccount);
      }

      setFundAccountingPlanDebitId(listOfDebitAccount[0]?.id || "");
      setDebitAccountNumber(listOfDebitAccount[0]?.accountNumber || "");
      tempValidationError["fundAccountingPlanDebitId"] = !!listOfDebitAccount[0]
        ?.id
        ? ""
        : tempValidationError["fundAccountingPlanDebitId"] || "";

      if (listOfCreditAccount.length) {
        setListOfFundAccountingPlanCredit(listOfCreditAccount);
      }
      setFundAccountingPlanCreditId(listOfCreditAccount[0]?.id || "");
      setCreditAccountNumber(listOfCreditAccount[0]?.accountNumber || "");
      tempValidationError["fundAccountingPlanCreditId"] =
        !!listOfCreditAccount[0]?.id
          ? ""
          : tempValidationError["fundAccountingPlanCreditId"] || "";
      setValidationErrors({ ...tempValidationError });
    };

    const handleTradingDateChange = (value: any) => {
      setTradingDate(value || "");
      handleValidateTradingDate(value);
    };
    const handleTransTypeChange = async (value: any) => {
      setTransType(value);

      if (tradingType) {
        const suggestion = suggestions.find(
          ele => ele.tradingType === tradingType && ele.transType === value,
        );
        if (!!value && !!suggestion) {
          const tempValidationError = { ...validationErrors };
          tempValidationError["transType"] = "";
          await handleFillDataBySuggestion(suggestion, tempValidationError);
        } else {
          setAccountingEntryName("");
          setFundAccountingPlanDebitId("");
          setFundAccountingPlanCreditId("");
          setDebitAccountNumber("");
          setCreditAccountNumber("");
          handleValidateTransType(value);
        }
      }
    };
    const handleDebitFundAccountIdChange = (value: any) => {
      setDebitFundAccountId(value || "");
      handleValidateDebitFundAccountId(value);
    };
    const handleCreditFundAccountIdChange = (value: any) => {
      setCreditFundAccountId(value || "");
      handleValidateCreditFundAccountId(value);
    };
    const handleDescriptionChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setDescription(event.target.value);
      handleValidateDescription(event.target.value);
    };
    const handleFundAccountingPlanCreditIdChange = async (value: any) => {
      const item = listOfFundAccountingPlanCredit.find(e => e.id === value);
      const listAcountNumber = ["1121", "1151", "11411"];
      if (!listAcountNumber.includes(item?.bankAccountNumber)) {
        setCreditFundAccountId("");
      }

      //set value Fund Account
      if (item?.accountNumber === "1121") {
        const listBank = await getListOfBankAccountNumber();
        const newFundAccountId = listBank.filter(
          obj => obj.isDefaultMoneyAccount === true,
        );
        if (newFundAccountId.length !== 0) {
          setCreditFundAccountId(newFundAccountId[0]?.id);
        }
      }

      setCreditAccountNumber(item?.accountNumber);
      setFundAccountingPlanCreditId(value);
      handleValidateFundAccountingPlanCreditId(value);
    };
    const handleFundAccountingPlanDebitIdChange = async (value: any) => {
      const item = listOfFundAccountingPlanDebit.find(e => e.id === value);
      const listAcountNumber = ["1121", "1151", "11411"];
      if (!listAcountNumber.includes(item?.bankAccountNumber)) {
        setDebitFundAccountId("");
      }

      //set value Fund Account
      if (item?.accountNumber === "1121") {
        const listBank = await getListOfBankAccountNumber();
        const newFundAccountId = listBank.filter(
          obj => obj.isDefaultMoneyAccount === true,
        );
        if (newFundAccountId.length !== 0) {
          setDebitFundAccountId(newFundAccountId[0]?.id);
        }
      }

      setDebitAccountNumber(item?.accountNumber);
      setFundAccountingPlanDebitId(value || "");
      handleValidateFundAccountingPlanDebitId(value);
    };
    const handleAccountingEntryNameChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setAccountingEntryName(event.target.value);
      handleValidateAccountingEntryName(event.target.value);
    };
    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = formatOnChangeNumberValueToString(event, amount);
      setAmount(value);
      handleValidateAmount(value);
    };

    const handleDebitAccountInputChange = async (value: string) => {
      const res = await getListOfFundAccountingPlan(value || "");
      setListOfFundAccountingPlanDebit(res);
    };

    const handleCreditAccountInputChange = async (value: string) => {
      const res = await getListOfFundAccountingPlan(value || "");
      setListOfFundAccountingPlanCredit(res);
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

      const res = await getListDataBase(config);
      setHasMediateAccount(res.source.length ? true : false);
    };

    useEffect(() => {
      const asyncFunction = async () => {
        if (!globalFundId) {
          return;
        }
        getFundInfo();
        checkHasMediateAccount();
        getListOfFundAccount();
        getListOfBankAccountNumber(), getListOfTradingType();
        getListOfTransType();
        if (currentId) {
          getFormData();
        } else {
          const res = await getListOfFundAccountingPlan();
          setListOfFundAccountingPlanDebit(res);
          setListOfFundAccountingPlanCredit(res);
          const bankCode = await getListOfBankAccountNumber();
          setListOfDebitFundAccount(bankCode);
          setListOfCreditFundAccount(bankCode);
        }
      };

      asyncFunction();
    }, [currentId, parentId]);

    useEffect(() => {
      const item = listOfDebitFundAccount.find(
        ele => ele.id === debitFundAccountId,
      );
      if (item) {
        if (item.distributionAgentVal?.name) {
          setDistributionAgent(item.distributionAgentVal?.name || "");
        }
      }
    }, [debitFundAccountId, listOfDebitFundAccount]);

    useEffect(() => {
      const item = listOfCreditFundAccount.find(
        ele => ele.id === creditFundAccountId,
      );
      if (item) {
        if (item.distributionAgentVal?.name) {
          setDistributionAgent(item.distributionAgentVal?.name || "");
        }
      }
    }, [creditFundAccountId, listOfCreditFundAccount]);

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
                label={fieldsConfig.custodyAccount.label}
                value={fundInfo?.custodyAccount || ""}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={2}>
              <BaseAutocomplete
                label={fieldsConfig.tradingType.label}
                required
                options={listOfTradingType.filter(
                  ele =>
                    (ele.cdVal === TRADING_TYPE.THANH_TOAN_TIEN_CHENH &&
                      formData.typeOfFund === "2") ||
                    (ele.cdVal !== TRADING_TYPE.THANH_TOAN_TIEN_CHENH &&
                      formData.typeOfFund !== "2"),
                )}
                value={tradingType}
                valueKey={fieldsConfig.tradingType.valueKey || ""}
                labelKey={fieldsConfig.tradingType.nameKey || ""}
                onChange={handleTradingTypeChange}
                onBlur={() => {
                  handleValidateTradingType(tradingType);
                }}
                disabled={!!onlyShow}
                error={!!validationErrors.tradingType}
                errorMessage={validationErrors.tradingType}
              />
            </Grid>
            {[
              TRADING_TYPE.CHUYEN_TIEN_SANG_TK_TG,
              TRADING_TYPE.THANH_TOAN_PHI_THUE_SUB_RED,
              TRADING_TYPE.THANH_TOAN_TIEN_CHENH,
            ].includes(tradingType) && (
              <Grid item xs={2}>
                <BaseAutocomplete
                  label={fieldsConfig.transType.label}
                  required
                  options={listOfTransType.filter(
                    ele =>
                      ([
                        TRANS_TYPE.CTT_TK_PHONG_TOA_DI,
                        TRANS_TYPE.CTT_TK_HOAT_DONG_DI,
                      ].includes(ele.cdVal) &&
                        tradingType === TRADING_TYPE.CHUYEN_TIEN_SANG_TK_TG) ||
                      ([
                        TRANS_TYPE.TT_PHI_DLPP,
                        TRANS_TYPE.TT_PHI_FMC,
                        TRANS_TYPE.TT_PHI_FUND,
                        TRANS_TYPE.TT_PHI_TNCN,
                      ].includes(ele.cdVal) &&
                        tradingType ===
                          TRADING_TYPE.THANH_TOAN_PHI_THUE_SUB_RED) ||
                      ([TRANS_TYPE.THANH_TOAN_TIEN_CHENH].includes(ele.cdVal) &&
                        formData.typeOfFund === "2" &&
                        tradingType === TRADING_TYPE.THANH_TOAN_TIEN_CHENH),
                  )}
                  value={transType}
                  valueKey={fieldsConfig.transType.valueKey || ""}
                  labelKey={fieldsConfig.transType.nameKey || ""}
                  onChange={handleTransTypeChange}
                  onBlur={() => {
                    handleValidateTransType(transType);
                  }}
                  disabled={!!onlyShow}
                  error={!!validationErrors.transType}
                  errorMessage={validationErrors.transType}
                />
              </Grid>
            )}
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
            <Grid item xs={2}>
              <BaseAutocomplete
                label={fieldsConfig.debitFundAccountId.label}
                required
                options={listOfDebitFundAccount}
                value={debitFundAccountId}
                valueKey={fieldsConfig.debitFundAccountId.valueKey || ""}
                labelKey={fieldsConfig.debitFundAccountId.nameKey || ""}
                onChange={handleDebitFundAccountIdChange}
                onBlur={() => {
                  handleValidateDebitFundAccountId(debitFundAccountId);
                }}
                disabled={
                  !!onlyShow ||
                  (!(debitAccountNumber || "").startsWith("1121") &&
                    !(debitAccountNumber || "").startsWith("1151") &&
                    !(debitAccountNumber || "").startsWith("11411"))
                }
                error={!!validationErrors.debitFundAccountId}
                errorMessage={validationErrors.debitFundAccountId}
              />
            </Grid>
            <Grid item xs={2}>
              <BaseAutocomplete
                label={fieldsConfig.creditFundAccountId.label}
                required
                options={listOfCreditFundAccount}
                value={creditFundAccountId}
                valueKey={fieldsConfig.creditFundAccountId.valueKey || ""}
                labelKey={fieldsConfig.creditFundAccountId.nameKey || ""}
                onChange={handleCreditFundAccountIdChange}
                onBlur={() => {
                  handleValidateCreditFundAccountId(creditFundAccountId);
                }}
                disabled={
                  !!onlyShow ||
                  (!(creditAccountNumber || "").startsWith("1121") &&
                    !(creditAccountNumber || "").startsWith("1151") &&
                    !(creditAccountNumber || "").startsWith("11411"))
                }
                error={!!validationErrors.creditFundAccountId}
                errorMessage={validationErrors.creditFundAccountId}
              />
            </Grid>
            <Grid item xs={2}>
              <BaseTextField
                label={fieldsConfig.distributionAgent.label}
                value={distributionAgent}
                fullWidth
                disabled
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
                      className={classes.cellEditInput}
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
                      className={classes.cellEditAutocomplete}
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
                      className={classes.cellEditAutocomplete}
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
                      <>{amount}</>
                    ) : (
                      <BaseTextField
                        value={amount}
                        onChange={handleAmountChange}
                        onBlur={() => {
                          handleValidateAmount(amount);
                        }}
                        error={!!validationErrors.amount}
                        errorMessage={validationErrors.amount}
                        fullWidth
                        className={classes.cellEditInput}
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
                    {!!amount ? amount : "0"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    );
  },
);
const AccountingMoneyTransDetail = React.memo(
  AccountingMoneyTransDetailComponent,
);
export { AccountingMoneyTransDetail };

const fieldsConfig: {
  fundCode: FieldConfig;
  custodyAccount: FieldConfig;
  tradingType: FieldConfig;
  tradingDate: FieldConfig;
  debitFundAccountId: FieldConfig;
  creditFundAccountId: FieldConfig;
  description: FieldConfig;
  distributionAgent: FieldConfig;
  accountingEntryName: FieldConfig;
  transType: FieldConfig;
  fundAccountingPlanDebitId: FieldConfig;
  fundAccountingPlanCreditId: FieldConfig;
  amount: FieldConfig;
} = {
  fundCode: {
    label: "Mã quỹ",
  },
  custodyAccount: {
    label: "STK TVLK",
  },
  tradingType: {
    label: "Loại chứng từ",
    validationConfig: {
      requiredValidate: true,
    },
    valueKey: "cdVal",
    nameKey: "vnCdContent",
  },
  tradingDate: {
    label: "Ngày chứng từ",
    validationConfig: {
      requiredValidate: true,
    },
  },
  debitFundAccountId: {
    label: "STK ngân hàng nợ",
    // validationConfig: {
    //   requiredValidate: true,
    // },
    valueKey: "id",
    nameKey: "bankAccountNumber",
  },
  creditFundAccountId: {
    label: "STK ngân hàng có",
    // validationConfig: {
    //   requiredValidate: true,
    // },
    valueKey: "id",
    nameKey: "bankAccountNumber",
  },
  distributionAgent: {
    label: "Đại lý phân phối",
  },
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

enum TRADING_TYPE {
  NOP_TIEN_VAO_TK_PT = "1",
  CHUYEN_TIEN_SANG_TK_TG = "2",
  GOM_TIEN_PHONG_TOA_VE_TK_TONG = "3",
  THANH_TOAN_PHI_THUE_SUB_RED = "4",
  THANH_TOAN_TIEN_BAN_REDEMPTION = "5",
  THANH_TOAN_TIEN_THUA = "6",
  THANH_TOAN_TIEN_CHENH = "7",
}

const TRANS_TYPE = {
  // Chuyển tiền sang tài khoản trung gian
  CTT_TK_PHONG_TOA_DI: "1",
  CTT_TK_HOAT_DONG_DI: "2",

  // Thanh toán tiền thừa/tiền chênh
  THANH_TOAN_TIEN_BAN: "3",
  THANH_TOAN_TIEN_THUA: "4",
  THANH_TOAN_TIEN_CHENH: "5",

  // Thanh toán phí , thuế
  TT_PHI_DLPP: "6",
  TT_PHI_FMC: "7",
  TT_PHI_FUND: "8",
  TT_PHI_TNCN: "9",

  // Gom tiền phong tỏa về tài khoản tổng
  CO_TK_TRUNG_GIAN: "10",
  KO_CO_TK_TRUNG_GIAN: "11",
};

const suggestions = [
  {
    tradingType: TRADING_TYPE.NOP_TIEN_VAO_TK_PT,
    description: "Nộp tiền vào TK phong tỏa",
    debitAccount: "11411",
    creditAccount: "336",
  },
  {
    tradingType: TRADING_TYPE.CHUYEN_TIEN_SANG_TK_TG,
    transType: TRANS_TYPE.CTT_TK_PHONG_TOA_DI,
    description: "Chuyển từ TK phong tỏa sang tài khoản trung gian",
    debitAccount: "1151",
    creditAccount: "11411",
  },
  {
    tradingType: TRADING_TYPE.CHUYEN_TIEN_SANG_TK_TG,
    transType: TRANS_TYPE.CTT_TK_HOAT_DONG_DI,
    description: "Chuyển từ TK hoạt động sang tài khoản trung gian",
    debitAccount: "1151",
    creditAccount: "1121",
  },
  {
    tradingType: TRADING_TYPE.GOM_TIEN_PHONG_TOA_VE_TK_TONG,
    transType: TRANS_TYPE.CO_TK_TRUNG_GIAN,
    description: "Gom tiền từ TK trung gian về tài khoản tổng",
    debitAccount: "1121",
    creditAccount: "1151",
  },
  {
    tradingType: TRADING_TYPE.GOM_TIEN_PHONG_TOA_VE_TK_TONG,
    transType: TRANS_TYPE.KO_CO_TK_TRUNG_GIAN,
    description: "Gom tiền từ TK phong tỏa về tài khoản tổng",
    debitAccount: "1121",
    creditAccount: "11411",
  },
  // {
  //   tradingType: TRADING_TYPE.THANH_TOAN_PHI_THUE_SUB_RED,
  //   description: "Thanh toán phí, thuế",
  //   debitAccount: "3321",
  //   creditAccount: "1121",
  // },
  {
    tradingType: TRADING_TYPE.THANH_TOAN_TIEN_BAN_REDEMPTION,
    transType: TRANS_TYPE.THANH_TOAN_TIEN_BAN,
    description: "Thanh toán tiền bán",
    debitAccount: "337",
    creditAccount: "1121",
  },
  {
    tradingType: TRADING_TYPE.THANH_TOAN_TIEN_THUA,
    transType: TRANS_TYPE.THANH_TOAN_TIEN_THUA,
    description: "Thanh toán tiền thừa",
    debitAccount: "336",
    creditAccount: "1151",
  },
  {
    tradingType: TRADING_TYPE.THANH_TOAN_PHI_THUE_SUB_RED,
    transType: TRANS_TYPE.TT_PHI_DLPP,
    description: "Thanh toán phí ĐLPP",
    debitAccount: "3321",
    creditAccount: "1121",
  },
  {
    tradingType: TRADING_TYPE.THANH_TOAN_PHI_THUE_SUB_RED,
    transType: TRANS_TYPE.TT_PHI_FMC,
    description: "Thanh toán phí FMC",
    debitAccount: "3322",
    creditAccount: "1121",
  },
  {
    tradingType: TRADING_TYPE.THANH_TOAN_PHI_THUE_SUB_RED,
    transType: TRANS_TYPE.TT_PHI_FUND,
    description: "Thanh toán phí Fund",
    debitAccount: "51199",
    creditAccount: "1121",
  },
  {
    tradingType: TRADING_TYPE.THANH_TOAN_PHI_THUE_SUB_RED,
    transType: TRANS_TYPE.TT_PHI_TNCN,
    description: "Thanh toán thuế TNCN",
    debitAccount: "3335",
    creditAccount: "1121",
  },
];
