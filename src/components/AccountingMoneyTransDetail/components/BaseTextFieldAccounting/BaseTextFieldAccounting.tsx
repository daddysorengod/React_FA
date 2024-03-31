import React from "react";
import { useStyles } from "./BaseTextFieldAccounting.styles";
import useTranslation from "next-translate/useTranslation";
import { TextField } from "@mui/material";
import { ValidationErrorTootip } from "@/src/components/BuiltFormComponent/ValidationErrorTootip";
interface Props {
  label?: string;
  value?: any;
  onChange?: Function;
  onBlur?: Function;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: any;
  required?: boolean;
  unit?: string;
}

const BaseTextFieldAccountingComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();

  const {
    label,
    value,
    onChange,
    onBlur,
    error,
    errorMessage,
    disabled,
    fullWidth,
    className,
    required,
    unit,
  } = props;
  
  return (
    <>
      {!!label ? (
        <label
          className={required ? classes.requiredInputLabel : classes.inputLabel}
        >
          {label}
        </label>
      ) : (
        <></>
      )}
      <TextField
        value={value}
        onChange={event => {
          if (onChange) {
            onChange(event);
          }
        }}
        onBlur={event => {
          if (onBlur) {
            onBlur(event);
          }
        }}
        disabled={disabled}
        fullWidth={fullWidth}
        className={className ? `${className}` : classes.textFieldInput}
        error={error}
        InputProps={{
          startAdornment: !!unit ? <>{unit}</> : null,
          endAdornment: (
            <ValidationErrorTootip
              error={!!error}
              errorMessage={errorMessage || ""}
              className={null}
            />
          ),
        }}
      />
    </>
  );
};
const BaseTextFieldAccounting = React.memo(BaseTextFieldAccountingComponent);
export { BaseTextFieldAccounting };
