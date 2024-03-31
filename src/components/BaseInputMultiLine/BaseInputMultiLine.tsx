import React from "react";
import { useStyles } from "./BaseInputMultiLine.styles";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import {
  OutlinedInput,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { ImagesSvg } from "@/src/constants/images";
import { DynamicObject } from "@/src/types/field";

interface Props {
  value: string;
  fieldName?: string;
  type: string;
  onChange: (event) => void;
  isDisabled: boolean;
  fieldIndex?: number;
  label?: string;
  isRequired: boolean;
  errorField?: string | null;
  customAttrs?: DynamicObject | null;
}
const BaseInputMultiLineComponent = (props: Props): JSX.Element => {
  const {
    value,
    onChange,
    fieldName,
    isDisabled,
    type,
    fieldIndex,
    label,
    isRequired,
    errorField,
    customAttrs,
  } = props;
  const classes = useStyles();
  const onChangeValue = event => {
    onChange(event.target.value);
  };
  const maxRow = () => {
    try {
      if (customAttrs?.maxRow && typeof customAttrs?.maxRow === "number") {
        return customAttrs?.maxRow;
      }
      return 1;
    } catch (err) {
      return 1;
    }
  };
  return (
    <div>
      <label className={classes.inputLabel}>
        {label}
        {isRequired ? <span style={{ color: "red" }}> *</span> : ""}
      </label>
      <div
        style={{ display: "flex", padding: "0px !important" }}
        key={`${fieldName?.replace(/\s+/g, "_")}-${fieldIndex}`}
      >
        <TextField
          sx={{ m: 1, width: "100%", margin: 0 }}
          name={fieldName ?? ""}
          className={
            isDisabled ? classes.commonInputReadOnly : classes.commonInput
          }
          multiline
          rows={4}
          aria-describedby="outlined-weight-helper-text"
          color={errorField ? "error" : "primary"}
          error={errorField ? true : false}
          InputProps={{
            "aria-label": "weight",
            inputComponent: TextareaAutosize,
            minRows: 1,
            maxRows: 4,
            style: { padding: "10px 10px" },
            endAdornment: (
              <InputAdornment position="start">
                {/* <CalendarMonthIcon /> */}
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
            ),
          }}
          type={type ?? "text"}
          disabled={isDisabled ?? false}
          value={value ?? ""}
          onChange={onChangeValue}
        />
      </div>
    </div>
  );
};
const BaseInputMultiLine = React.memo(BaseInputMultiLineComponent);
export { BaseInputMultiLine };
