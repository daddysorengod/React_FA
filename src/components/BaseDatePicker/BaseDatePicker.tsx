import React, { Fragment, useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useStyles } from "./BaseDatePicker.styles";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { formatNormalDate, formatParamsDate } from "@/src/helpers";
import moment from "moment";
import {
  OutlinedInput,
  InputAdornment,
  Tooltip,
  Typography,
} from "@mui/material";
import { ImagesSvg } from "@/src/constants/images";
import { DynamicObject } from "@/src/types/field";
/// import store
import { useDispatch } from "react-redux";
import { dispatch, useSelector } from "@store/store";
import { RootStateProps } from "@app/types/root";
/// end import store

interface Props {
  minDate?: any;
  maxDate?: any;
  name: string;
  onChange: (newValue) => void;
  valueDatePicker: any;
  isDisabled?: boolean;
  fieldIndex?: number;
  label?: string;
  isRequired: boolean;
  errorField?: string | null;
  initialState?: DynamicObject;
  customAttrs?: DynamicObject | null;
  formCode?: string;
}
const DatePickerComponent = (props: Props): JSX.Element => {
  const {
    onChange,
    name,
    minDate,
    maxDate,
    valueDatePicker,
    isDisabled,
    fieldIndex,
    label,
    isRequired,
    errorField,
    initialState,
    customAttrs,
    formCode,
  } = props;
  const classes = useStyles();
  const generalData = useSelector((state: RootStateProps) => state.general);
  const autoFill = useSelector(
    (state: RootStateProps) => state.general.autoFill,
  );

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
        const fillValue = storeObj ? storeObj : valueDatePicker ?? null;
        onChange(fillValue);
      } catch (err) {
        console.log("autoFillValue global field", err);
      }
    };
    autoFillValueFromGeneral();
  }, [customAttrs]);

  useEffect(() => {
    const autoFillChangeForm = () => {
      if (
        typeof customAttrs !== "object" || !customAttrs?.fillFrom
      ) {
        return;
      }
      try {
        const storeObj = autoFill[`${formCode}_${customAttrs?.fillFrom}`];
        
        const fillValue = storeObj[`${customAttrs?.fillValue}`]
          ? storeObj[`${customAttrs?.fillValue}`]
          : null;
        onChange(formatParamsDate(fillValue));
      } catch (err) {
        // console.log("autoFillChangeForm", err);
      }
    };
    autoFillChangeForm();
  }, [autoFill]);

  return (
    <div>
      <label className={classes.inputLabel}>
        {label}
        {isRequired ? <span style={{ color: "red" }}> *</span> : ""}
      </label>
      <div
        className={classes.date}
        key={`${name.replace(/\s+/g, "_")}-${fieldIndex}`}
      >
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            className={isDisabled ? classes.disable : ""}
            format="DD/MM/YYYY"
            value={!valueDatePicker ? null : moment(valueDatePicker)}
            onChange={newValue => {
              if (formatNormalDate(newValue) != "Invalid date") {
                onChange(formatParamsDate(newValue));
              }
            }}
            minDate={minDate ? minDate : moment().subtract(200, "years")}
            maxDate={maxDate ? maxDate : moment().add(200, "years")}
            slotProps={{
              textField: {
                name: `${name ?? ""}`,
                color: errorField ? "error" : "primary",
                error: errorField ? true : false,
                InputProps: {
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{ position: "absolute", right: "14%" }}
                    >
                      {errorField ? (
                        <Tooltip
                          placement="bottom-end"
                          title={
                            <React.Fragment>
                              <Typography color="inherit">
                                {errorField}
                              </Typography>
                            </React.Fragment>
                          }
                        >
                          <img src={ImagesSvg.textFieldErrorIcon} />
                        </Tooltip>
                      ) : (
                        <></>
                      )}
                    </InputAdornment>
                  ),
                },
              },
            }}
            disabled={isDisabled}
          />
        </LocalizationProvider>
      </div>
    </div>
  );
};
const BaseDatePicker = React.memo(DatePickerComponent);
export { BaseDatePicker };
