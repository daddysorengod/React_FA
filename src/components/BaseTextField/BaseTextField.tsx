import React, { useRef } from "react";
import { useStyles } from "@/src/components/BuiltFormComponent/BuiltFormComponent.styles";
import useTranslation from "next-translate/useTranslation";
import { ValidationErrorTootip } from "../BuiltFormComponent/ValidationErrorTootip";
import { TextField } from "@mui/material";
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
  nameKey?: string;
}
const BaseTextFieldComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const inputRef = useRef<HTMLInputElement>(null);

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
    nameKey,
  } = props;

  return (
    <>
      {!!label ? (
        <label
          className={required ? classes.requiredInputLabel : classes.inputLabel}
          onClick={() => {
            if (inputRef.current) inputRef.current.focus();
          }}
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
        className={className || classes.textFieldInput}
        error={error}
        inputRef={inputRef}
        name={nameKey}
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
const BaseTextField = React.memo(BaseTextFieldComponent);
export { BaseTextField };
