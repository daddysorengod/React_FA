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
import { TableHead, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import { TableRow } from "@mui/material";
import { SEARCH_CONDITIONS } from "@/src/constants";
import { BaseDatePickerInput } from "@/src/components/BaseDatePickerInput";
import { Tooltip } from "@mui/material";
import { IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
interface Props {
  currentId?: string;
  parentId?: string;
  onlyShow?: boolean;
  formType?: IFormType;
}
const SetManualAccountingFormImportComponent = forwardRef(
  (props: Props, ref): JSX.Element => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { currentId, parentId, onlyShow, formType } = props;

    const globalFundId = useSelector(
      (state: RootStateProps) => state.general.globalFundId,
    );

    const globalFundData = useSelector(
      (state: RootStateProps) => state.general.globalFundData,
    );

    const [formData, setFormData] = useState<any>({});

    const [fundInfo, setFundInfo] = useState<any>({});
    const [tradingDate, setTradingDate] = useState<any>("");
    const [description, setDescription] = useState<string>("");

    const [accountingEntryName, setAccountingEntryName] = useState<string>("");
    const [fundAccountingPlanDebitId, setFundAccountingPlanDebitId] =
      useState<string>("");
    const [fundAccountingPlanCreditId, setFundAccountingPlanCreditId] =
      useState<string>("");
    const [debitFundAccountId, setDebitFundAccountId] = useState<string>("");
    const [creditFundAccountId, setCreditFundAccountId] = useState<string>("");
    const [amount, setAmount] = useState<any>("");
    const [securityId, setSecurityId] = useState<string>("");

    const [sumAmount, setSumAmount] = useState<any>(0);

    const [validationErrors, setValidationErrors] = useState<{
      [key: string]: object;
    }>({});

    const [validationBaseErrors, setValidationBaseErrors] = useState<{
      [key: string]: string;
    }>({});

    const [listOfFundAccountingPlanDebit, setListOfFundAccountingPlanDebit] =
      useState<any[]>([]);
    const [listOfFundAccountingPlanCredit, setListOfFundAccountingPlanCredit] =
      useState<any[]>([]);
    const [listOfSecurity, setListOfSecurity] = useState<any[]>([]);
    const [listOfDebitFundAccount, setListOfDebitFundAccount] = useState<any[]>(
      [],
    );
    const [listOfCreditFundAccount, setListOfCreditFundAccount] = useState<
      any[]
    >([]);
    //   Function

    const [dataTable, setDataTable] = useState<any[]>([]);

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

      const source = dataTable.map((ele: any) => {
        //delete id
        const { id, ...rest } = ele;

        rest.securityId = ele?.securityId || null;
        rest.debitFundAccountId = ele?.debitFundAccountId || null;
        rest.creditFundAccountId = ele?.creditFundAccountId || null;
        return rest;
      });
      // let tmpAmount = formatNumberStringToNumber(amount);
      const submitData = {
        ...{
          fundId: globalFundId,
          transDate: tradingDate,
          description,
          trans: source,
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
        const res1 = await getListOfFundAccountingPlan(
          res.debitAccountNumber || "",
          SEARCH_CONDITIONS.EQUAL,
        );
        const res2 = await getListOfFundAccountingPlan(
          res.creditAccountNumber || "",
          SEARCH_CONDITIONS.EQUAL,
        );
        const res3 = await getListOfSecurity(
          res.symbol || "",
          SEARCH_CONDITIONS.EQUAL,
        );
        const res4 = await getListOfBankAccountNumber(
          res.debitFundAccount || "",
          SEARCH_CONDITIONS.EQUAL,
        );
        const res5 = await getListOfBankAccountNumber(
          res.creditFundAccount || "",
          SEARCH_CONDITIONS.EQUAL,
        );

        setListOfFundAccountingPlanDebit(res1);
        setListOfFundAccountingPlanCredit(res2);
        setListOfSecurity(res3);
        setListOfDebitFundAccount(res4);
        setListOfCreditFundAccount(res5);

        setAccountingEntryName(resTable.accountingEntryName || "");
        setFundAccountingPlanDebitId(resTable.fundAccountingPlanDebitId || "");
        setFundAccountingPlanCreditId(
          resTable.fundAccountingPlanCreditId || "",
        );
        setDebitFundAccountId(resTable.debitFundAccountId || "");
        setCreditFundAccountId(resTable.creditFundAccountId || "");
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

    //add newId
    function generateUniqueId() {
      const randomId = "new-item-" + Math.random().toString(36).substr(2, 9);
      const existingIds = (dataTable || []).map(item => item.id);
      if (existingIds.includes(randomId)) {
        return generateUniqueId();
      }
      return randomId;
    }

    //check amount change
    function isNumericString(value) {
      // Sử dụng biểu thức chính quy để kiểm tra xem chuỗi chỉ chứa số hoặc không
      const regex = /^[0-9]+$/;
      return regex.test(value);
    }

    //    Handle Validate
    const handleValidateField = (
      value: any,
      key: string,
      rowId: any,
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
      let errorInField = false;
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
        if (info.error) {
          errorInField = true;
        }
        const fieldErrors = Object.assign({}, validationErrors[key]);
        if (errorInField) {
          fieldErrors[key] = info;
          validationErrors[rowId] = fieldErrors;
          setValidationErrors({
            ...validationErrors,
            [rowId]: info,
          });
        } else {
          delete fieldErrors[rowId];
          validationErrors[rowId] = fieldErrors;
          setValidationErrors({
            ...validationErrors,
            [rowId]: info,
          });
        }
        return info;
      }
      return res;
    };

    const handleValidateNotFeild = (
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
        setValidationBaseErrors({
          ...validationBaseErrors,
          [key]: info.errorMessage,
        });
        return info;
      }
      return res;
    };

    const validateAll = (): boolean => {
      const formData = dataTable;
      let valid = true;
      let validation: any = {};
      dataTable.map((item, index) => {
        Object.keys(item).forEach(key => {
          const info = handleValidateField(item[key], key, index);
          if (info.error) {
            validation[key] = info.errorMessage;
            valid = false;
          }
        });
      });
      setValidationErrors(validation);
      return valid;
    };
    const handleValidateTradingDate = (value): VALIDATION_ERROR_INTERFACE => {
      return handleValidateNotFeild(value, "tradingDate");
    };
    const handleValidateDescription = (value): VALIDATION_ERROR_INTERFACE => {
      return handleValidateNotFeild(value, "description");
    };
    const handleValidateAmount = (value, rowId): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "amount", rowId);
    };
    const handleValidateAccountingEntryName = (
      value,
    ): VALIDATION_ERROR_INTERFACE => {
      return handleValidateNotFeild(value, "accountingEntryName");
    };
    const handleValidateFundAccountingPlanDebitId = (
      value,
      rowId,
    ): VALIDATION_ERROR_INTERFACE => {
      const res = getListOfFundAccountingPlan(value || "");
      return handleValidateField(value, "fundAccountingPlanDebitId", rowId);
    };
    const handleValidateFundAccountingPlanCreditId = (
      value,
      rowId,
    ): VALIDATION_ERROR_INTERFACE => {
      const res = getListOfFundAccountingPlan(value || "");
      return handleValidateField(value, "fundAccountingPlanCreditId", rowId);
    };
    const handleValidateSecurityId = (value): VALIDATION_ERROR_INTERFACE => {
      return handleValidateNotFeild(value, "securityId");
    };
    const handleValidateDebitFundAccountId = (
      value,
      rowId,
    ): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "debitFundAccountId", rowId);
    };
    const handleValidateCreditFundAccountId = (
      value,
      rowId,
    ): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "creditFundAccountId", rowId);
    };
    // Handle on Change

    const handleFundAccountingPlanCreditIdChange = async (
      value: any,
      rowIndex: number,
      rowId: any,
    ) => {
      const source = [...dataTable];

      const item = listOfFundAccountingPlanCredit.find(e => e.id === value);

      const listAcountNumber = ["1121", "1151", "11411"];
      if (!listAcountNumber.includes(item?.accountNumber)) {
        source[rowIndex].creditFundAccountId = null;
      }

      source[rowIndex].fundAccountingPlanCreditId = value;
      source[rowIndex].creditAccountNumber = item?.accountNumber || "";
      source[rowIndex].creditAccountName = item?.fullName || "";

      if (item?.accountNumber === "1121") {
        const listBank = await getListOfBankAccountNumber();
        const newFundAccountId = listBank.filter(
          obj => obj.isDefaultMoneyAccount === true,
        );
        if (newFundAccountId.length !== 0) {
          source[rowIndex].debitFundAccountId = newFundAccountId[0]?.id;
        }
      }

      setDataTable(source);
      setFundAccountingPlanCreditId(value || "");
      handleValidateFundAccountingPlanCreditId(value, rowId);
    };

    // TK no change
    const handleFundAccountingPlanDebitIdChange = async (
      value: any,
      rowIndex: number,
      rowId: any,
    ) => {
      const source = [...dataTable];

      const item = listOfFundAccountingPlanDebit.find(e => e.id === value);

      const listAcountNumber = ["1121", "1151", "11411"];
      if (!listAcountNumber.includes(item?.accountNumber)) {
        source[rowIndex].debitFundAccountId = null;
      }

      source[rowIndex].fundAccountingPlanDebitId = value;
      source[rowIndex].debitAccountNumber = item?.accountNumber || "";
      source[rowIndex].debitAccountName = item?.fullName || "";

      if (item?.accountNumber === "1121") {
        const listBank = await getListOfBankAccountNumber();
        const newFundAccountId = listBank.filter(
          obj => obj.isDefaultMoneyAccount === true,
        );
        if (newFundAccountId.length !== 0) {
          source[rowIndex].debitFundAccountId = newFundAccountId[0]?.id;
        }
      }

      setDataTable(source);
      setFundAccountingPlanDebitId(value || "");
      handleValidateFundAccountingPlanDebitId(value, rowId);
    };

    const handleAccountingEntryNameChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      rowIndex: number,
    ) => {
      const updatedAccountingEntryName = [...dataTable];
      updatedAccountingEntryName[rowIndex].accountingEntryName =
        event.target.value;
      setDataTable(updatedAccountingEntryName);
    };

    const handleDebitFundAccountIdChange = (
      value: any,
      rowIndex: number,
      rowId: any,
    ) => {
      const updatedDebitFundAccountId = [...dataTable];
      updatedDebitFundAccountId[rowIndex].debitFundAccountId = value;
      setDataTable(updatedDebitFundAccountId);
      setDebitFundAccountId(value || "");
      handleValidateDebitFundAccountId(value, rowId);
    };

    const handleCreditFundAccountIdChange = (
      value: any,
      rowIndex: number,
      rowId: any,
    ) => {
      const updatedCreditFundAccountId = [...dataTable];
      updatedCreditFundAccountId[rowIndex].creditFundAccountId = value;
      setDataTable(updatedCreditFundAccountId);
      setCreditFundAccountId(value || "");
      handleValidateCreditFundAccountId(value, rowId);
    };

    const handleSecurityIdChange = (value: any, rowIndex: number) => {
      const updatedSecurityId = [...dataTable];
      updatedSecurityId[rowIndex].securityId = value;
      setDataTable(updatedSecurityId);
      setSecurityId(value || "");
      handleValidateSecurityId(value);
    };

    const handleAmountChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      rowIndex: number,
      rowId: any,
    ) => {
      let inputValue = event.target.value;
      if (isNumericString(inputValue)) {
        // Giá trị chỉ chứa số, thực hiện các hành động
        const value = formatOnChangeNumberValueToString(event, amount);
        let updateSumAmount = sumAmount - dataTable[rowIndex].amount;
        const updatedAmount = [...dataTable];
        updatedAmount[rowIndex].amount = inputValue;
        setDataTable(updatedAmount);
        updateSumAmount = updateSumAmount + Number(inputValue);
        setSumAmount(updateSumAmount);
        setAmount(value);
        handleValidateAmount(value, rowId);
      }
    };

    const handleDebitAccountInputChange = async (value: string) => {
      const res = await getListOfFundAccountingPlan(value || "");
      setListOfFundAccountingPlanDebit(res);
    };

    const handleCreditAccountInputChange = async (value: string) => {
      const res = await getListOfFundAccountingPlan(value || "");
      setListOfFundAccountingPlanCredit(res);
    };

    const handleSecurityInputChange = async (value: string) => {
      const res = await getListOfSecurity(value || "");
      setListOfSecurity(res);
    };

    const handleDebitFundAccountInputChange = async (value: string) => {
      const res = await getListOfBankAccountNumber(value || "");
      setListOfDebitFundAccount(res);
    };

    const handleCreditFundAccountInputChange = async (value: string) => {
      const res = await getListOfBankAccountNumber(value || "");
      setListOfCreditFundAccount(res);
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
        } else {
          const res1 = await getListOfFundAccountingPlan();
          setListOfFundAccountingPlanDebit(res1);
          setListOfFundAccountingPlanCredit(res1);
          const res2 = await getListOfSecurity();
          setListOfSecurity(res2);
          const res3 = await getListOfBankAccountNumber();
          setListOfDebitFundAccount(res3);
          setListOfCreditFundAccount(res3);
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

    const handleDeleteRow = (rowDeleteIndex: any) => {
      if (typeof rowDeleteIndex === "string") {
        const updatedDataTable = dataTable.filter(
          (item: any) => item.id !== rowDeleteIndex,
        );
        setDataTable(updatedDataTable);
        let tmpSum = 0;
        if (updatedDataTable) {
          updatedDataTable.map((item: any, rowIndex: number) => {
            tmpSum += item.amount;
          });
        } else tmpSum = 0;
        setSumAmount(tmpSum);
      } else if (typeof rowDeleteIndex === "number") {
        const updatedDataTableIndex = [...dataTable];
        updatedDataTableIndex.splice(rowDeleteIndex, 1);
        setDataTable(updatedDataTableIndex);
        let tmpSumIndex = 0;
        if (updatedDataTableIndex) {
          updatedDataTableIndex.map((item: any, rowIndex: number) => {
            tmpSumIndex += item.amount;
          });
        } else tmpSumIndex = 0;
        setSumAmount(tmpSumIndex);
      }
    };

    const handleOpenAddNewFormDialog = () => {
      const newId = generateUniqueId();
      const newRowDataTable = {
        id: newId,
        accountingEntryName: "",
        fundAccountingPlanDebitId: "",
        debitAccountName: "",
        fundAccountingPlanCreditId: "",
        creditAccountName: "",
        amount: "0",
        securityId: "",
        debitFundAccountId: "",
        creditFundAccountId: "",
      };
      setDataTable([...dataTable, newRowDataTable]);
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
                fullWidth={true}
                disabled
              />
            </Grid>
            <Grid item xs={2}>
              <BaseTextField
                label={fieldsConfig.fullName.label}
                value={fundInfo?.fullName || ""}
                fullWidth={true}
                disabled
              />
            </Grid>
            <Grid item xs={2}>
              <BaseTextField
                label={fieldsConfig.custodyAccount.label}
                value={fundInfo?.custodyAccount || ""}
                fullWidth={true}
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
                error={!!validationBaseErrors.tradingDate}
                errorMessage={validationBaseErrors.tradingDate}
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
                error={!!validationBaseErrors.description}
                errorMessage={validationBaseErrors.description}
                disabled={!!onlyShow}
                fullWidth={true}
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
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {"Chi tiết bút toán"}
            <Button
              startIcon={<AddIcon />}
              onClick={() => {
                handleOpenAddNewFormDialog();
              }}
              variant="contained"
            >
              Thêm mới
            </Button>
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
                    className={`${classes.tableHeadCell} ${classes.stickyAmount}`}
                  >
                    {fieldsConfig.amount.label}
                  </TableCell>
                  <TableCell
                    className={`${classes.tableHeadCell} ${classes.stickyTableCell}`}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataTable.map((item: any, rowIndex: number) => (
                  <TableRow key={rowIndex} className={classes.tableBodyRow}>
                    <TableCell className={classes.tableBodyEditCell}>
                      <BaseTextField
                        value={item.accountingEntryName}
                        onChange={event =>
                          handleAccountingEntryNameChange(event, rowIndex)
                        }
                        onBlur={() => {
                          handleValidateAccountingEntryName(
                            accountingEntryName,
                          );
                        }}
                        disabled={!!onlyShow}
                        fullWidth={true}
                        className={classes.cellEditTextManual}
                      />
                    </TableCell>
                    <TableCell className={classes.tableBodyEditCell}>
                      <BaseAutocomplete
                        options={listOfFundAccountingPlanDebit}
                        value={item.fundAccountingPlanDebitId}
                        valueKey={
                          fieldsConfig.fundAccountingPlanDebitId.valueKey || ""
                        }
                        labelKey={
                          fieldsConfig.fundAccountingPlanDebitId.nameKey || ""
                        }
                        onChange={(value: any) => {
                          handleFundAccountingPlanDebitIdChange(
                            value,
                            rowIndex,
                            item.id,
                          );
                        }}
                        onBlur={() => {
                          handleValidateFundAccountingPlanDebitId(
                            item.fundAccountingPlanDebitId,
                            item.id,
                          );
                        }}
                        onInputChange={(value: any) =>
                          handleDebitAccountInputChange(value)
                        }
                        disabled={!!onlyShow}
                        error={
                          !!validationErrors[item.id]?.[
                            fundAccountingPlanDebitId
                          ] || item.fundAccountingPlanDebitId === undefined
                        }
                        errorMessage={
                          fieldsConfig.fundAccountingPlanDebitId.label +
                          " không được để trống"
                        }
                        className={classes.cellEditManual}
                        fullWidth={true}
                      />
                    </TableCell>
                    <TableCell className={classes.tableBodyEditCell}>
                      <BaseTextField
                        value={item.debitAccountName}
                        disabled
                        fullWidth={true}
                        className={classes.cellEditNameManual}
                      />
                    </TableCell>
                    <TableCell className={classes.tableBodyEditCell}>
                      <BaseAutocomplete
                        options={listOfDebitFundAccount}
                        value={item.debitFundAccountId}
                        valueKey={
                          fieldsConfig.debitFundAccountId.valueKey || ""
                        }
                        labelKey={fieldsConfig.debitFundAccountId.nameKey || ""}
                        onChange={(value: any) => {
                          handleDebitFundAccountIdChange(
                            value,
                            rowIndex,
                            item.id,
                          );
                        }}
                        onBlur={() => {
                          handleValidateDebitFundAccountId(
                            item.debitFundAccountId,
                            item.id,
                          );
                        }}
                        onInputChange={handleDebitFundAccountInputChange}
                        disabled={
                          !!onlyShow ||
                          (!(item?.debitAccountNumber || "").startsWith(
                            "1121",
                          ) &&
                            !(item?.debitAccountNumber || "").startsWith(
                              "1151",
                            ) &&
                            !(item?.debitAccountNumber || "").startsWith(
                              "11411",
                            ))
                        }
                        error={
                          !!validationErrors[item.id]?.[debitFundAccountId] ||
                          item.debitFundAccountId === undefined
                        }
                        errorMessage={
                          fieldsConfig.debitFundAccountId.label +
                          " không được để trống"
                        }
                        className={classes.cellEditManual}
                        fullWidth={true}
                      />
                    </TableCell>
                    <TableCell className={classes.tableBodyEditCell}>
                      <BaseAutocomplete
                        options={listOfFundAccountingPlanCredit}
                        value={item.fundAccountingPlanCreditId}
                        valueKey={
                          fieldsConfig.fundAccountingPlanCreditId.valueKey || ""
                        }
                        labelKey={
                          fieldsConfig.fundAccountingPlanCreditId.nameKey || ""
                        }
                        onChange={(value: any) => {
                          handleFundAccountingPlanCreditIdChange(
                            value,
                            rowIndex,
                            item.id,
                          );
                        }}
                        onBlur={() => {
                          handleValidateFundAccountingPlanCreditId(
                            fundAccountingPlanCreditId,
                            item.id,
                          );
                        }}
                        onInputChange={(value: any) =>
                          handleCreditAccountInputChange(value)
                        }
                        disabled={!!onlyShow}
                        error={
                          !!validationErrors[item.id]?.[
                            fundAccountingPlanCreditId
                          ] || item.fundAccountingPlanCreditId === undefined
                        }
                        errorMessage={
                          fieldsConfig.fundAccountingPlanCreditId.label +
                          " không được để trống"
                        }
                        className={classes.cellEditManual}
                        fullWidth={true}
                      />
                    </TableCell>
                    <TableCell className={classes.tableBodyEditCell}>
                      <BaseTextField
                        value={item.creditAccountName}
                        disabled
                        fullWidth={true}
                        className={classes.cellEditNameManual}
                      />
                    </TableCell>
                    <TableCell className={classes.tableBodyEditCell}>
                      <BaseAutocomplete
                        options={listOfCreditFundAccount}
                        value={item.creditFundAccountId}
                        valueKey={
                          fieldsConfig.creditFundAccountId.valueKey || ""
                        }
                        labelKey={
                          fieldsConfig.creditFundAccountId.nameKey || ""
                        }
                        onChange={(value: any) => {
                          handleCreditFundAccountIdChange(
                            value,
                            rowIndex,
                            item.id,
                          );
                        }}
                        onBlur={() => {
                          handleValidateCreditFundAccountId(
                            item.creditFundAccountId,
                            item.id,
                          );
                        }}
                        onInputChange={handleCreditFundAccountInputChange}
                        disabled={
                          !!onlyShow ||
                          (!(item?.creditAccountNumber || "").startsWith(
                            "1121",
                          ) &&
                            !(item?.creditAccountNumber || "").startsWith(
                              "1151",
                            ) &&
                            !(item?.creditAccountNumber || "").startsWith(
                              "11411",
                            ))
                        }
                        error={
                          !!validationErrors[item.id]?.[creditFundAccountId] ||
                          item.creditFundAccountId === undefined
                        }
                        errorMessage={
                          fieldsConfig.creditFundAccountId.label +
                          " không được để trống"
                        }
                        className={classes.cellEditManual}
                        fullWidth={true}
                      />
                    </TableCell>
                    <TableCell className={classes.tableBodyEditCell}>
                      <BaseAutocomplete
                        options={listOfSecurity}
                        value={
                          !(item?.debitAccountNumber || "").startsWith("121") &&
                          !(item?.creditAccountNumber || "").startsWith("121")
                            ? ""
                            : item.securityId
                        }
                        valueKey={fieldsConfig.securityId.valueKey || ""}
                        labelKey={fieldsConfig.securityId.nameKey || ""}
                        onChange={(value: any) => {
                          handleSecurityIdChange(value, rowIndex);
                        }}
                        onBlur={() => {
                          handleValidateSecurityId(item.securityId);
                        }}
                        onInputChange={handleSecurityInputChange}
                        disabled={
                          !!onlyShow ||
                          (!(item?.debitAccountNumber || "").startsWith(
                            "121",
                          ) &&
                            !(item?.creditAccountNumber || "").startsWith(
                              "121",
                            ))
                        }
                        className={classes.cellEditManual}
                        fullWidth={true}
                      />
                    </TableCell>
                    <TableCell
                      align={onlyShow ? "right" : "left"}
                      className={
                        !!onlyShow
                          ? `${classes.tableBodyCell} ${classes.stickyAmount}`
                          : `${classes.tableBodyEditCell} ${classes.stickyAmount} `
                      }
                    >
                      {!!onlyShow ? (
                        <>{item.amount}</>
                      ) : (
                        <BaseTextField
                          value={item.amount}
                          onChange={event =>
                            handleAmountChange(event, rowIndex, item.id)
                          }
                          onBlur={() => {
                            handleValidateAmount(item.amount, item.id);
                          }}
                          error={
                            !!validationErrors[item.id]?.[amount] ||
                            item.amount === "0"
                          }
                          errorMessage={
                            fieldsConfig.amount.label + " phải lớn hơn 0"
                          }
                          fullWidth={true}
                          className={classes.cellEditManual}
                        />
                      )}
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor: "#fff",
                        borderBottom: "1px solid #CFD6DD",
                        padding: "0 16px !important",
                      }}
                      className={classes.stickyTableCell}
                    >
                      <Tooltip title={"Xóa"} arrow>
                        <IconButton
                          size="small"
                          aria-label="delete"
                          color="error"
                          onClick={() => {
                            const idToDelete =
                              item.id !== undefined ? item.id : rowIndex;
                            handleDeleteRow(idToDelete);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
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
      </Box>
    );
  },
);
const SetManualAccountingFormImport = React.memo(
  SetManualAccountingFormImportComponent,
);
export { SetManualAccountingFormImport };

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
    //   // maxLength: 255,
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
    // validationConfig: {
    //   requiredValidate: true,
    // },
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
