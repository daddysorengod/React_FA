import React, { useState, useEffect, useRef } from "react";
import { useStyles } from "@/src/components/BuiltFormComponent/BuiltFormComponent.styles";
import useTranslation from "next-translate/useTranslation";
import { Box, Grid } from "@mui/material";
import {
  formatNumberStringToNumber,
  getItemById,
  getValidateInfo,
} from "@/src/helpers";
import {
  TABLE_OPTIONS_INTERFACE,
  VALIDATION_ERROR_INTERFACE,
  VALIDATION_INTERFACE,
} from "@/src/types";
import { BaseDynamicTable } from "@/src/components/BaseTable/BaseDynamicTable";
import { getTableConfigStore } from "@/src/store/reducers/tableConfig";
import { dispatch } from "@/src/store";
import { INPUT_FORMAT_TYPE } from "@/src/constants/built-form";
import { BaseTextField } from "@/src/components/BaseTextField";
import { BaseDatePickerInput } from "@/src/components/BaseDatePickerInput";
import { BaseEditableTable } from "@/src/components/BaseTable/BaseEditableTable";
import { DynamicObject } from "@/src/types/field";

interface Props {
  currentId?: string;
  parentId: string;
  onlyShow?: boolean;
  entryProp: DynamicObject;
  isRefresh?: boolean;
}
const ManualAccountingFormComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { currentId, parentId, onlyShow, entryProp, isRefresh } = props;

  const [fundCode, setFundCode] = useState<string>("");
  const [custodyAccount, setCustodyAccount] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [tradingDate, setTradingDate] = useState<any>("");
  const [description, setDescription] = useState<string>("");

  const [tableConfigData, setTableConfigData] = useState<
    TABLE_OPTIONS_INTERFACE | undefined
  >(undefined);

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const handleChildForm = useRef() as any;
  useEffect(() => {
    try {
      if (typeof isRefresh !== "undefined" && !isRefresh) {
        return;
      }
      handleChildForm?.current?.handleRefreshRef();
    } catch (error) {
      console.log(error);
    }
  }, [isRefresh]);

  const getFundInfoByFundId = async (): Promise<any> => {
    if (!parentId) {
      return false;
    }
    const res = await getItemById(parentId, "fund-information-api/find-by-id");
    if (res) {
      setFullName(res.fullName);
      setFundCode(res.code);
      setCustodyAccount(res.custodyAccount);
    }
    return res;
  };

  const getTableConfig = async () => {
    const res = await dispatch(
      getTableConfigStore("INTERNAL_TRANSACTION/MANUAL_ACCOUNTING/DETAIL"),
    );
    setTableConfigData(res || undefined);
  };

  useEffect(() => {
    const asyncFunction = async () => {
      await getFundInfoByFundId();
    };
    asyncFunction();
  }, [currentId]);

  useEffect(() => {
    const asyncFunction = async () => {
      await getTableConfig();
    };
    asyncFunction();
  }, []);

  const handleValidateTradingDate = (value): VALIDATION_ERROR_INTERFACE => {
    return handleValidateField(value, "tradingDate");
  };
  const handleValidateDescription = (value): VALIDATION_ERROR_INTERFACE => {
    return handleValidateField(value, "description");
  };

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

  //    Handle Validate
  const handleValidateField = (
    value: any,
    key: string,
  ): VALIDATION_ERROR_INTERFACE => {
    const fieldConfig: FieldConfig = fieldsConfig[key];

    const formatValue =
      fieldsConfig[key]?.formatConfig?.type === INPUT_FORMAT_TYPE.NUMBER_VALUE
        ? formatNumberStringToNumber(value)
        : value;

    const res = {
      error: false,
      errorMessage: "",
    };
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

  return (
    <Box
      sx={{
        marginTop: "20px",
      }}
    >
      <Box
        sx={{
          marginBottom: "20px",
          height: "100%",
        }}
      >
        <Grid
          container
          columns={12}
          columnSpacing={4}
          sx={{ marginBottom: "20px" }}
        >
          <Grid item xs={2}>
            <BaseTextField
              label={fieldsConfig.fundCode.label}
              value={fundCode}
              disabled={true}
              fullWidth
              className={classes.textFieldInput}
            />
          </Grid>
          <Grid item xs={2}>
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
              label={fieldsConfig.custodyAccount.label}
              value={custodyAccount}
              disabled={true}
              fullWidth
              className={classes.textFieldInput}
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
              error={!!validationErrors.tradingDate}
              errorMessage={validationErrors.tradingDate}
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
      <Box
        sx={{
          height: "calc(90% - 100px)",
        }}
      >
        {tableConfigData ? (
          <BaseEditableTable
            onlyShow={onlyShow ?? false}
            tableOptions={tableConfigData}
            parentId={parentId}
            entryProp={{ ...entryProp }}
            ref={handleChildForm}
          />
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};
const ManualAccountingForm = React.memo(ManualAccountingFormComponent);
export { ManualAccountingForm };

interface FieldConfig {
  label: string;
  validationConfig?: VALIDATION_INTERFACE;
  formatConfig?: {
    type: INPUT_FORMAT_TYPE;
  };
}

const fieldsConfig: {
  fundCode: FieldConfig;
  fullName: FieldConfig;
  custodyAccount: FieldConfig;
  tradingDate: FieldConfig;
  description: FieldConfig;
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
    validationConfig: {
      lengthValidate: true,
      maxLength: 255,
    },
  },
};
