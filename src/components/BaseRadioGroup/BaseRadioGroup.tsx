import React from "react";
import { useStyles } from "./BaseRadioGroup.styles";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
interface Props {
  value: string;
  fieldName?: string;
  onChange: (event) => void;
  isDisabled: boolean;
  fieldIndex?: number;
  label?: string;
  isRequired: boolean;
}
const RadioButton = (props: Props): JSX.Element => {
  const {
    value,
    onChange,
    fieldName,
    isDisabled,
    fieldIndex,
    label,
    isRequired,
  } = props;
  const classes = useStyles();
  return (
    <div>
      <label className={classes.inputLabel}>
        {label}
        {isRequired ? <span style={{ color: "red" }}> *</span> : ""}
      </label>
      <div key={`${fieldName?.replace(/\s+/g, "_")}-${fieldIndex}`}>
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name={fieldName}
            value={value}
            onChange={onChange}
          >
            <FormControlLabel
              value="Y"
              control={<Radio />}
              label="Có"
              disabled={isDisabled}
            />

            <FormControlLabel
              value="N"
              control={<Radio />}
              label="Không"
              disabled={isDisabled}
            />
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
};
const BaseRadioGroup = React.memo(RadioButton);
export { BaseRadioGroup };
