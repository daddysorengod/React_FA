import React, { useState, useEffect, useRef } from "react";
import { useStyles } from "@/src/components/BuiltFormComponent/BuiltFormComponent.styles";
import useTranslation from "next-translate/useTranslation";
import { Autocomplete, MenuItem, TextField } from "@mui/material";
import { ValidationErrorTootip } from "../BuiltFormComponent/ValidationErrorTootip";
import { getProperty } from "@/src/helpers";
interface Props {
  options: any[];
  label?: string;
  value: any;
  onChange: Function;
  onBlur?: Function;
  onInputChange?: (newValue: string) => any | void;
  valueKey: string;
  labelKey: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: any;
  required?: boolean;
  placeholder?: string;
}
const BaseAutocompleteComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    options,
    label,
    value,
    onChange,
    onBlur,
    onInputChange,
    valueKey,
    labelKey,
    error,
    errorMessage,
    disabled,
    fullWidth,
    className,
    required,
    placeholder,
  } = props;

  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [oldOptions, setOldOptions] = useState<any[]>([]);
  const [isOptionChanged, setIsOptionChanged] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isObject = !(valueKey.length === 0 || labelKey.length === 0);

  const handleChange = (e: any, v: any) => {
    if (!isObject) {
      onChange(v);
      return;
    }
    const value = getProperty(v, valueKey);
    onChange(value);
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  const getSelectedOption = () => {
    if (!isObject) {
      const item = options.find(ele => ele === value);
      setSelectedOption(item || null);
      return;
    }
    const item = options.find(ele => getProperty(ele, valueKey) === value);
    setSelectedOption(item ? item : null);
  };

  useEffect(() => {
    getSelectedOption();
  }, [value]);

  useEffect(() => {
    if (!isOptionChanged) {
      getSelectedOption();

      if (JSON.stringify(options) !== JSON.stringify(oldOptions)) {
        setIsOptionChanged(true);
      }
      setOldOptions(options);
    }
  }, [options]);

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
      <Autocomplete
        options={options}
        value={selectedOption}
        onChange={handleChange}
        onBlur={handleBlur}
        getOptionLabel={option =>
          isObject ? getProperty(option, labelKey, "") : option
        }
        renderOption={(props, option) => {
          return (
            <MenuItem {...props}>
              {isObject ? getProperty(option, labelKey, "") : option}
            </MenuItem>
          );
        }}
        isOptionEqualToValue={(option, value) =>
          isObject
            ? getProperty(option, valueKey) == getProperty(value, valueKey)
            : option === value
        }
        onInputChange={(_e, value) => {
          if (onInputChange) {
            onInputChange(value);
          }
        }}
        disabled={disabled}
        fullWidth={fullWidth}
        className={className || classes.select}
        renderInput={params => (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  <ValidationErrorTootip
                    error={!!error}
                    errorMessage={errorMessage || ""}
                    className={classes.autoValidateTootip}
                  />
                  {params.InputProps.endAdornment}
                </>
              ),
              error: !!error,
              placeholder: placeholder ?? undefined,
            }}
            inputRef={inputRef}
          />
        )}
      />
    </>
  );
};
const BaseAutocomplete = React.memo(BaseAutocompleteComponent);
export { BaseAutocomplete };
