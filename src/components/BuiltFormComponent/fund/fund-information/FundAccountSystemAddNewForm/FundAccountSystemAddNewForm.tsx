import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useStyles } from "@/src/components/BuiltFormComponent/BuiltFormComponent.styles";
import useTranslation from "next-translate/useTranslation";
import {
  Autocomplete,
  Box,
  Checkbox,
  Grid,
  MenuItem,
  Tooltip,
  TextField,
} from "@mui/material";
import { CO_ALIGN, CO_TYPE, SEARCH_CONDITIONS, api } from "@/src/constants";
import {
  AUTOCOMPLETE_WITH_HEADER_COLUMN_CONFIG,
  BaseWithHeaderAutocomplete,
} from "@/src/components/BaseWithHeaderAutocomplete";
import {
  generateSubRowsArray,
  getListDataBase,
  getValidateInfo,
} from "@/src/helpers";
import {
  FETCH_DATA_API_CONFIG_INTERFACE,
  VALIDATION_ERROR_INTERFACE,
  VALIDATION_INTERFACE,
} from "@/src/types";
import axios from "@/src/helpers/axios";
import { ITabConfig } from "@/src/constants/formConfigFiles";
import { IFormType } from "@/src/types/general";
import {
  ACCOUNT_TYPE_OPTIONS_API_URL,
  FOLLOW_BY_OPTIONS_API_URL,
} from "./constants";
import { ValidationErrorTootip } from "../../../ValidationErrorTootip";
import { BaseTextField } from "@/src/components/BaseTextField";
import { BaseAutocomplete } from "@/src/components/BaseAutocomplete";
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

interface Props {
  parentId?: string;
  parentIdName?: string;
  currentId?: string;
  onlyShow: boolean;
}

const fieldLabels = {
  parentAccountId: "TK mẹ",
  accountNumber: "STK kế toán",
  accountType: "Tính chất TK",
  vietnameseName: "Tên TK (VN)",
  englishName: "Tên TK (EN)",
  description: "Diễn giải",
  followBy: "Đối tượng",
  enabled: "Active",
};

const validationConfig: {
  [key: string]: VALIDATION_INTERFACE;
} = {
  parentAccountId: {
    requiredValidate: true,
  },
  accountNumber: {
    requiredValidate: true,
    noBetweenSpace: true,
  },
  accountType: {
    requiredValidate: true,
  },
  vietnameseName: {
    requiredValidate: true,
    noSpecialCharacterValidate: true,
    lengthValidate: true,
    maxLength: 255,
  },
  englishName: {
    requiredValidate: true,
    noSpecialCharacterValidate: true,
    lengthValidate: true,
    maxLength: 255,
  },
  description: {
    lengthValidate: true,
    maxLength: 255,
  },
  followBy: {
    requiredValidate: true,
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
    label: "Tên tài khoản",
    width: 40,
    type: CO_TYPE.TEXT,
    align: CO_ALIGN.LEFT,
    showOnTextField: false,
  },
];

const FundAccountSystemAddNewFormComponent = forwardRef(
  (props: Props, ref): JSX.Element => {
    const { t } = useTranslation();
    const classes = useStyles();

    const { parentId, parentIdName, currentId, onlyShow } = props;

    // Data submit
    const [parentAccountId, setParentAccountId] = useState<any>("");
    const [accountNumber, setAccountNumber] = useState<any>("");
    const [accountType, setAccountType] = useState<any>("");
    const [vietnameseName, setVietNameseName] = useState<any>("");
    const [englishName, setEnglishName] = useState<any>("");
    const [description, setDescription] = useState<any>("");
    const [enabled, setEnabled] = useState<boolean>(false);
    const [isBankAccount, setIsBankAccount] = useState<boolean>(false);
    const [isObject, setIsObject] = useState<boolean>(false);
    const [followBy, setFollowBy] = useState<any>("");
    // ---------

    // List option select
    const [parentAccountIdOptions, setParentAccountIdOptions] = useState<any[]>(
      [],
    );
    const [accountTypeOptions, setAccountTypeOptions] = useState<any[]>([]);
    const [followByOptions, setFollowByOptions] = useState<any[]>([]);
    // ---------
    const [isParentAccountOptionsLoading, setIsParentAccountOptionsLoading] =
      useState<boolean>(false);
    const [
      parentAccountIdDefaultTextValue,
      setParentAccountIdDefaultTextValue,
    ] = useState<any>("");

    // Validation error
    const [validationErrors, setValidationErrors] = useState<any>({});

    const [isParent, setIsParent] = useState<boolean>(false);
    const [parentAccountNumber, setParentAccountNumber] = useState<string>("");
    const [childHasTransaction, setChildHasTransaction] =
      useState<boolean>(false);

    // FUNCTION
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
      handleUnFocus() {
        // setFormErrors({});
      },
    }));

    const onSaveValue = async () => {
      return false;
    };

    // Get Data Here <=========
    const getFormData = async () => {
      try {
        const res = await axios.get(
          `${publicRuntimeConfig.ORIGIN_URL}/fund-accounting-plan-api/find-by-id?id=${currentId}`,
        );
        if (res?.data?.data) {
          const dataAPI = res?.data?.data;
          setParentAccountId(dataAPI.parentId);
          setParentAccountIdDefaultTextValue(
            dataAPI.parentId ? dataAPI?.parentVal?.name : "",
          );
          setAccountNumber(dataAPI.accountNumber);
          setAccountType(
            dataAPI.type !== null && dataAPI.type !== "" ? dataAPI.type : "",
          );
          setVietNameseName(dataAPI.fullName);
          setEnglishName(dataAPI.englishName);
          setDescription(dataAPI.description);
          setIsBankAccount(dataAPI.isBankAccount);
          setIsObject(dataAPI.followBy !== null && dataAPI.followBy !== "");
          setFollowBy(() => {
            return dataAPI.followBy !== null && dataAPI.followBy !== ""
              ? dataAPI.followBy
              : "";
          });
          setEnabled(dataAPI.enabled);

          // set Is Parent
          if (dataAPI.parentId) {
            setIsParent(false);
          } else {
            setIsParent(true);
          }
          // set Parent Account Number
          const item = parentAccountIdOptions.find(
            ele => ele.id === dataAPI.parentId,
          );
          if (item) {
            setParentAccountNumber(item?.accountNumber || "");
          }
          // set Child Has Transaction
          setChildHasTransaction(dataAPI.hasTransaction ? true : false);
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    // Submit Here <==========
    const generateSubmitForm = async () => {
      if (handleValidateAll()) {
        const submitData = {
          // parentAccountId,
          accountNumber: accountNumber,
          fullName: vietnameseName,
          englishName: englishName,
          description: description,
          type: accountType,
          followBy: followBy,
          isBankAccount: isBankAccount,
          parentId: parentAccountId,
          enabled: enabled,
          id: currentId || null,
          [`${parentIdName}`]: parentId,
        };
        return { ...submitData };
      } else return false;
    };

    const getParentAccountIdOptions = async (searchString?: string) => {
      try {
        const config: FETCH_DATA_API_CONFIG_INTERFACE = {
          url: "fund-accounting-plan-api/find",
          params: [
            {
              paramKey: "pageIndex",
              paramValue: "1",
            },
            {
              paramKey: "pageSize",
              paramValue: "40",
            },
          ],
          searchTerms: [
            {
              fieldName: "fundId",
              fieldValue: parentId,
            },
            {
              fieldName: "accountNumber",
              fieldValue: searchString || "",
              condition: SEARCH_CONDITIONS.CONTAINS,
            },
          ],
        };
        const res = await getListDataBase(config);
        if (res.source) {
          const arr = generateSubRowsArray(res.source);
          setParentAccountIdOptions(arr);
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    const getAccountTypeOptions = async () => {
      try {
        const res = await getListDataBase({
          url: ACCOUNT_TYPE_OPTIONS_API_URL,
        });
        if (res.source) {
          setAccountTypeOptions(res.source);
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    const getFollowByOptions = async () => {
      try {
        const res = await getListDataBase({ url: FOLLOW_BY_OPTIONS_API_URL });
        if (res.source) {
          setFollowByOptions(res.source);
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    const handleParentAccountIdChange = (
      value: any,
      checkValidate: boolean,
    ) => {
      setParentAccountId(value);
      const item = parentAccountIdOptions.find(ele => ele.id === value);
      if (item) {
        setParentAccountNumber(item?.accountNumber || "");
      }
      if (checkValidate) {
        handleValidateParentAccountId(value);
      }
    };

    const handleParentAccountIdInputChange = async (value: string) => {
      setIsParentAccountOptionsLoading(true);
      await getParentAccountIdOptions(value);
      setIsParentAccountOptionsLoading(false);
    };

    const handleAccountNumberChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      if (childHasTransaction) {
        return;
      }
      setAccountNumber(event.target.value);
      handleValidateAccountNumber(event.target.value);
    };

    const handleVietNameseNameChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setVietNameseName(event.target.value);
      handleValidateVietNameseName(event.target.value);
    };

    const handleEnglishNameChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setEnglishName(event.target.value);
      handleValidateEnglishName(event.target.value);
    };

    const handleDescriptionChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setDescription(event.target.value);
      handleValidateDescription(event.target.value);
    };

    const handleAccountTypeChange = (value: any) => {
      setAccountType(value);
      handleValidateAccountType(value);
    };

    const handleFollowByChange = (value: any) => {
      setFollowBy(value);
      handleValidateFollowBy(value);
    };

    // VALIDATION
    const handleValidateAll = (): boolean => {
      let validation: any = {};
      let valid = true;

      const obj = {
        parentAccountId,
        accountNumber,
        vietnameseName,
        englishName,
        description,
        accountType,
        followBy,
      };

      for (const key in fieldLabels) {
        if (
          (isParent && key === "parentAccountId") ||
          (childHasTransaction && key === "parentAccountId") ||
          (childHasTransaction && key === "accountNumber") ||
          (!isObject && key == "followBy")
        ) {
          continue;
        }

        if (
          key === "accountNumber" &&
          !isAccountNumberStartWithParentAccountNumber(obj[key]) &&
          obj[key] &&
          !isParent
        ) {
          const info: VALIDATION_ERROR_INTERFACE = {
            error: true,
            errorMessage:
              "Số tài khoản kế toán phải bắt đầu bằng số tài khoản mẹ",
          };

          if (info.error) {
            validation[key] = info.errorMessage;
            valid = false;
          }
        }
        if (
          key === "accountNumber" &&
          obj[key] === parentAccountNumber &&
          !isParent
        ) {
          const info: VALIDATION_ERROR_INTERFACE = {
            error: true,
            errorMessage: "Số tài khoản kế toán phải khác số tài khoản mẹ",
          };

          if (info.error) {
            validation[key] = info.errorMessage;
            valid = false;
          }
        }

        if (validationConfig[key]) {
          const info: VALIDATION_ERROR_INTERFACE = getValidateInfo(
            obj[key],
            fieldLabels[key],
            validationConfig[key],
          );

          if (info.error) {
            validation[key] = info.errorMessage;
            valid = false;
          }
        }
      }
      setValidationErrors({ ...validation });
      return valid;
    };

    const handleValidateField = (
      value: any,
      key: string,
    ): VALIDATION_ERROR_INTERFACE => {
      if (
        key === "accountNumber" &&
        !isAccountNumberStartWithParentAccountNumber(value) &&
        value &&
        !isParent
      ) {
        const info: VALIDATION_ERROR_INTERFACE = {
          error: true,
          errorMessage:
            "Số tài khoản kế toán phải bắt đầu bằng số tài khoản mẹ",
        };
        setValidationErrors({
          ...validationErrors,
          [key]: info.errorMessage,
        });
        return info;
      }
      if (
        key === "accountNumber" &&
        value === parentAccountNumber &&
        !isParent
      ) {
        const info: VALIDATION_ERROR_INTERFACE = {
          error: true,
          errorMessage: "Số tài khoản kế toán phải khác số tài khoản mẹ",
        };
        setValidationErrors({
          ...validationErrors,
          [key]: info.errorMessage,
        });
        return info;
      }
      if (validationConfig[key] && fieldLabels[key]) {
        const info = getValidateInfo(
          value,
          fieldLabels[key],
          validationConfig[key],
        );
        setValidationErrors({
          ...validationErrors,
          [key]: info.errorMessage,
        });
        return info;
      }
      return {
        error: false,
        errorMessage: "",
      };
    };

    const handleValidateParentAccountId = (
      value,
    ): VALIDATION_ERROR_INTERFACE => {
      return isParent
        ? {
            error: false,
            errorMessage: "",
          }
        : handleValidateField(value, "parentAccountId");
    };

    const handleValidateAccountNumber = (value): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "accountNumber");
    };

    const handleValidateVietNameseName = (
      value,
    ): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "vietnameseName");
    };

    const handleValidateEnglishName = (value): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "englishName");
    };

    const handleValidateDescription = (value): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "description");
    };

    const handleValidateAccountType = (value): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "accountType");
    };

    const handleValidateFollowBy = (value): VALIDATION_ERROR_INTERFACE => {
      return handleValidateField(value, "followBy");
    };

    const isAccountNumberStartWithParentAccountNumber = (
      value: string,
    ): boolean => {
      return value.startsWith(parentAccountNumber);
    };

    useEffect(() => {
      if (!followBy) {
        setValidationErrors({
          ...validationErrors,
          followBy: "",
        });
        setFollowBy("");
      }
    }, [isObject]);

    // END VALIDATION ------------------
    // END FUNCTION ------------------

    useEffect(() => {
      const fetchData = async () => {
        setValidationErrors({});
        getParentAccountIdOptions();
        getAccountTypeOptions();
        getFollowByOptions();

        if (!currentId) {
          setParentAccountId("");
          setParentAccountIdDefaultTextValue("");
          setAccountNumber("");
          setAccountType("");
          setVietNameseName("");
          setEnglishName("");
          setDescription("");
          setIsBankAccount(false);
          setIsObject(false);
          setFollowBy("");
          setParentAccountNumber("");
          setEnabled(false);
          setIsParent(false);
          setChildHasTransaction(false);
          return;
        } else {
          await getFormData();
        }
      };

      fetchData();
    }, [currentId]);

    useEffect(() => {
      const item = accountTypeOptions.find(
        option => option.cdVal === accountType,
      );
      if (!item) {
        setAccountType("");
      }
    }, [accountTypeOptions]);

    useEffect(() => {
      const item = followByOptions.find(option => option.cdVal === followBy);
      if (!item) {
        setFollowBy("");
      }
    }, [followByOptions]);

    return (
      <Box className={classes.root}>
        <Box className={classes.form}>
          <Box className={classes.topForm}>
            <Grid container columns={6} columnSpacing={4} rowSpacing={3}>
              <Grid item md={2}>
                <label className={classes.requiredInputLabel}>
                  {fieldLabels.parentAccountId}
                </label>
                <BaseWithHeaderAutocomplete
                  value={parentAccountId}
                  valueKey={"id"}
                  options={parentAccountIdOptions}
                  showHeader={true}
                  columnConfigs={columnConfigs}
                  className={classes.autocompleteWithHeader}
                  horizontalPosition={"right"}
                  onChange={handleParentAccountIdChange}
                  onInputChange={handleParentAccountIdInputChange}
                  error={(validationErrors.parentAccountId || "").length > 0}
                  errorMessage={validationErrors.parentAccountId || ""}
                  listHeight={300}
                  listWidth={410}
                  apiFilter
                  apiDefaultTextValue={parentAccountIdDefaultTextValue}
                  isLoading={isParentAccountOptionsLoading}
                  disabled={onlyShow || isParent || childHasTransaction}
                />
              </Grid>
              <Grid item md={2}>
                <BaseTextField
                  label={fieldLabels.accountNumber}
                  required={true}
                  value={accountNumber}
                  onChange={handleAccountNumberChange}
                  onBlur={event => {
                    handleValidateAccountNumber(event.target.value);
                  }}
                  disabled={onlyShow || childHasTransaction}
                  error={!!validationErrors.accountNumber}
                  errorMessage={validationErrors.accountNumber}
                  className={classes.textFieldInput}
                  fullWidth
                />
              </Grid>
              <Grid item md={2}>
                <BaseAutocomplete
                  label={fieldLabels.accountType}
                  required={true}
                  options={accountTypeOptions || []}
                  value={accountType}
                  onChange={handleAccountTypeChange}
                  onBlur={() => {
                    handleValidateAccountType(accountType);
                  }}
                  valueKey={"cdVal"}
                  labelKey={"vnCdContent"}
                  fullWidth
                  disabled={onlyShow}
                  error={!!validationErrors.accountType}
                  errorMessage={validationErrors.accountType}
                />
              </Grid>
              <Grid item md={6}>
                <BaseTextField
                  label={fieldLabels.vietnameseName}
                  required={true}
                  value={vietnameseName}
                  onChange={handleVietNameseNameChange}
                  onBlur={event => {
                    handleValidateVietNameseName(event.target.value);
                  }}
                  disabled={onlyShow}
                  error={!!validationErrors.vietnameseName}
                  errorMessage={validationErrors.vietnameseName}
                  className={classes.textFieldInput}
                  fullWidth
                />
              </Grid>
              <Grid item md={6}>
                <BaseTextField
                  label={fieldLabels.englishName}
                  required={true}
                  value={englishName}
                  onChange={handleEnglishNameChange}
                  onBlur={event => {
                    handleValidateEnglishName(event.target.value);
                  }}
                  disabled={onlyShow}
                  error={!!validationErrors.englishName}
                  errorMessage={validationErrors.englishName}
                  className={classes.textFieldInput}
                  fullWidth
                />
              </Grid>
              <Grid item md={6}>
                <BaseTextField
                  label={fieldLabels.description}
                  value={description}
                  onChange={handleDescriptionChange}
                  onBlur={event => {
                    handleValidateDescription(event.target.value);
                  }}
                  disabled={onlyShow}
                  error={!!validationErrors.description}
                  errorMessage={validationErrors.description}
                  className={classes.textFieldInput}
                  fullWidth
                />
              </Grid>
              <Grid item md={6}>
                <Box>
                  <span className={classes.label}>
                    {"Theo dõi chi tiết theo"}
                  </span>
                </Box>
                <Grid
                  sx={{
                    alignItems: "center",
                  }}
                  container
                  rowSpacing={1}
                  columns={6}
                >
                  <Grid
                    item
                    sx={{
                      marginRight: "16px",
                    }}
                    className={classes.checkBox}
                  >
                    <Checkbox
                      id={`FundAccountSystemAddNewForm-object`}
                      checked={isObject}
                      disabled={onlyShow}
                      onChange={event => {
                        setIsObject(event.target.checked);
                      }}
                    />
                    <label htmlFor={`FundAccountSystemAddNewForm-object`}>
                      {"Đối tượng"}
                    </label>
                  </Grid>
                  <Grid
                    item
                    md={1.5}
                    sx={{
                      marginRight: "80px",
                    }}
                  >
                    <BaseAutocomplete
                      options={followByOptions || []}
                      value={followBy}
                      onChange={handleFollowByChange}
                      onBlur={() => {
                        handleValidateFollowBy(followBy);
                      }}
                      valueKey={"cdVal"}
                      labelKey={"vnCdContent"}
                      fullWidth
                      disabled={!isObject || onlyShow}
                      error={!!validationErrors.followBy && isObject}
                      errorMessage={validationErrors.followBy}
                    />
                  </Grid>
                  <Grid item className={classes.checkBox}>
                    <Checkbox
                      id={`FundAccountSystemAddNewForm-account`}
                      checked={isBankAccount}
                      disabled={onlyShow}
                      onChange={event => {
                        setIsBankAccount(event.target.checked);
                      }}
                    />
                    <label htmlFor={`FundAccountSystemAddNewForm-account`}>
                      {"Tài khoản ngân hàng"}
                    </label>
                  </Grid>
                  <Grid item md={6} className={classes.checkBox}>
                    <Checkbox
                      id={`FundAccountSystemAddNewForm-active`}
                      checked={enabled}
                      disabled={onlyShow}
                      onChange={event => {
                        setEnabled(event.target.checked);
                      }}
                    />
                    <label htmlFor={`FundAccountSystemAddNewForm-active`}>
                      {fieldLabels.enabled}
                    </label>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    );
  },
);
const FundAccountSystemAddNewForm = React.memo(
  FundAccountSystemAddNewFormComponent,
);
export { FundAccountSystemAddNewForm };
