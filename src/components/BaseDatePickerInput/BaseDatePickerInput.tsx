import React, { useState, useEffect, useLayoutEffect } from "react";
import { useStyles } from "@/src/components/BuiltFormComponent/BuiltFormComponent.styles";
import useTranslation from "next-translate/useTranslation";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Import AdapterDayjs
import dayjs from "dayjs"; // Import Day.js
import { ValidationErrorTootip } from "../BuiltFormComponent/ValidationErrorTootip";
import { Box } from "@mui/material";
interface Props {
  value?: any;
  label?: string;
  required?: boolean;
  onChange?: Function;
  onBlur?: Function;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: any;
  minDate?: any;
  maxDate?: any;
}
const BaseDatePickerInputComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    value,
    label,
    required,
    onChange,
    onBlur,
    error,
    errorMessage,
    disabled,
    fullWidth,
    className,
    minDate,
    maxDate,
  } = props;

  const [formatedValue, setFormatedValue] = useState<any>(null);

  const handleChange = newValue => {
    if (onChange) {
      const isoDate = dayjs(newValue).format("YYYY-MM-DD");
      onChange(isoDate);
    }
  };

  useLayoutEffect(() => {
    setFormatedValue(!!value ? dayjs(value) : null);
  }, [value]);

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
      <Box sx={{ position: "relative" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={formatedValue}
            onChange={handleChange}
            minDate={minDate || dayjs().subtract(200, "years")}
            maxDate={maxDate || dayjs().add(200, "years")}
            format="DD/MM/YYYY"
            disabled={disabled}
            className={className || classes.datePicker}
            slotProps={{
              textField: {
                onBlur: () => {
                  if (onBlur) {
                    onBlur();
                  }
                },
                fullWidth: fullWidth,
                error: !!error,
              },
            }}
          />
        </LocalizationProvider>
        <ValidationErrorTootip
          error={error}
          errorMessage={errorMessage}
          className={classes.datepickerValidateTootip}
        />
      </Box>
    </>
  );
};
const BaseDatePickerInput = React.memo(BaseDatePickerInputComponent);
export { BaseDatePickerInput };
