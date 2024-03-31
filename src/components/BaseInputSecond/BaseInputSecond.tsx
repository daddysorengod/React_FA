import React, { useEffect } from "react";
import "jquery"; ///
import {
  OutlinedInput,
  InputAdornment,
  Select,
  Box,
  Tooltip,
  Typography,
  Paper,
} from "@mui/material";
import { useStyles } from "./BaseInputSecond.styles";
import { ImagesSvg } from "@/src/constants/images";
import { DynamicObject, IField, TextFieldType } from "@/src/types/field";
/// import store
import { useDispatch } from "react-redux";
import { dispatch, useSelector } from "@store/store";
import { RootStateProps } from "@app/types/root";
import { IFormType } from "@/src/types/general";
import { formatMoney, isValidMoney } from "@/src/helpers/formatMoney";
import { formatNumber } from "@/src/helpers";
/// end import store

interface Props {
  initialValue: string;
  fieldName?: string;
  type: string;
  onChange: (event) => void;
  isDisabled?: boolean;
  fieldIndex?: number;
  label?: string;
  isRequired?: boolean;
  errorField?: string | null;
  customAttrs?: DynamicObject | null;
  formCode?: String;
  fieldSet?: IField;
  formType?: IFormType;
  initialState?: DynamicObject;
}
const BaseInputSecondComponent = (props: Props): JSX.Element => {
  const {
    initialValue,
    onChange,
    fieldName,
    isDisabled,
    type,
    fieldIndex,
    label,
    isRequired,
    errorField,
    customAttrs,
    formCode,
    fieldSet,
    formType,
    initialState,
  } = props;
  const classes = useStyles();
  const { autoFill } = useSelector((state: RootStateProps) => state.general);
  const generalData = useSelector((state: RootStateProps) => state.general);

  const renderValue = initialValue => {
    if (
      fieldSet?.fieldType === TextFieldType.numberFloat ||
      fieldSet?.fieldType === TextFieldType.numberInt
    ) {
      return formatMoney(initialValue, {
        decimal: customAttrs?.decimal ? customAttrs?.decimal : 2,
        negative: customAttrs?.negative && customAttrs?.negative === "NEGATIVE",
        offFormat: customAttrs?.offFormat && customAttrs?.offFormat === "OFF",
      });
    }
    if (typeof initialValue === "object") {
      return initialValue?.name;
    } else {
      return initialValue;
    }
  };

  const onChangeValue = event => {
    switch (fieldSet?.fieldType) {
      case TextFieldType.textBox: {
        if (customAttrs && customAttrs?.overriding === "UPPER") {
          onChange(event.target.value.toUpperCase());
          break;
        }
        onChange(event.target.value);
        break;
      }
      case TextFieldType.numberFloat: {
        if (!isValidMoney(event.target.value)) {
          return;
        }
        onChange(
          formatMoney(event.target.value, {
            decimal: customAttrs?.decimal ? customAttrs?.decimal : 2,
            negative:
              customAttrs?.negative && customAttrs?.negative === "NEGATIVE",
            offFormat:
              customAttrs?.offFormat && customAttrs?.offFormat === "OFF",
          }),
        );
        break;
      }
      case TextFieldType.numberInt: {
        if (!isValidMoney(event.target.value)) {
          return;
        }
        onChange(
          formatMoney(event.target.value, {
            decimal: customAttrs?.decimal ? customAttrs?.decimal : 2,
            negative:
              customAttrs?.negative && customAttrs?.negative === "NEGATIVE",
            offFormat:
              customAttrs?.offFormat && customAttrs?.offFormat === "OFF",
          }),
        );
        break;
      }
      default: {
        break;
      }
    }
  };

  useEffect(() => {
    const autoFillValue = () => {
      if (
        !customAttrs?.fillFrom
        // && formType === "show"
      ) {
        return;
      }
      try {
        const storeObj = autoFill[`${formCode}_${customAttrs?.fillFrom}`];
        if (storeObj && Object.keys(storeObj)?.length < 1) {
          if (formType === "show") {
            return;
          }
          onChange(
            renderValue(initialValue) ? renderValue(initialValue) : null,
          );
          return;
        }
        const fillValue = storeObj[`${customAttrs?.fillValue}`]
          ? storeObj[`${customAttrs?.fillValue}`]
          : null;
        onChange(fillValue);
      } catch (err) {
        // console.log("autoFillValue", err);
      }
    };
    autoFillValue();
  }, [autoFill]);

  useEffect(() => {
    const autoFillValueFromGeneral = () => {
      if (
        !customAttrs?.autoFillFromGeneral ||
        typeof customAttrs?.autoFillFromGeneral !== "string"
      ) {
        return;
      }
      try {
        const key = customAttrs?.autoFillFromGeneral.split("/");
        if (key.length !== 2) {
          return;
        }
        const storeObj = generalData[`${key[0]}`][`${key[1]}`];
        if (!storeObj) {
          return;
        }
        const fillValue = storeObj ? storeObj : initialValue ?? null;
        onChange(fillValue);
      } catch (err) {
        console.log("autoFillValue global field", err);
      }
    };
    autoFillValueFromGeneral();
  }, [customAttrs]);

  const disabledTextBox = () => {
    try {
      if (isDisabled && !customAttrs?.type) {
        return true;
      } else if (
        customAttrs?.type &&
        initialState &&
        customAttrs?.enableCaseWhen !==
          initialState[customAttrs?.fieldName]?.toString() &&
        customAttrs?.selectType &&
        customAttrs?.selectType === "DEPEND"
      ) {
        if (initialValue) {
          onChange(null);
        }
        return true;
      } else if (
        customAttrs?.selectType &&
        customAttrs?.selectType === "DEPEND"
      ) {
        return false;
      } else if (
        fieldSet?.validateAttribute?.isReadOnly ||
        fieldSet?.validateAttribute?.isDisabled ||
        customAttrs?.type === "DISABLED"
      ) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  return (
    <Paper className={classes.root}>
      {label ? (
        <label className={classes.inputLabel}>
          {label}
          {!isDisabled && !disabledTextBox() && isRequired ? (
            <span style={{ color: "red" }}> *</span>
          ) : (
            ""
          )}
        </label>
      ) : (
        <div className={classes.spacing}></div>
      )}
      <div
        className={classes.displayFlex}
        key={`${fieldName?.replace(/\s+/g, "_")}-${fieldIndex}`}
      >
        <OutlinedInput
          sx={{ m: 1, width: "100%", margin: 0 }}
          name={fieldName ?? ""}
          className={
            isDisabled || disabledTextBox()
              ? classes.commonInputReadOnly
              : classes.commonInput
          }
          // color={errorField ? "error" : "primary"}
          error={errorField ? true : false}
          type={"text"}
          value={renderValue(initialValue) ?? ""}
          disabled={isDisabled || disabledTextBox()}
          onChange={onChangeValue}
          endAdornment={
            <InputAdornment position="end">
              {errorField ? (
                <Tooltip
                  placement="bottom-end"
                  title={
                    <React.Fragment>
                      <Typography color="inherit">{errorField}</Typography>
                    </React.Fragment>
                  }
                >
                  <img src={ImagesSvg.textFieldErrorIcon} />
                </Tooltip>
              ) : (
                <></>
              )}
            </InputAdornment>
          }
        />
      </div>
    </Paper>
  );
};
const BaseInputSecond = React.memo(BaseInputSecondComponent);
export { BaseInputSecond };
