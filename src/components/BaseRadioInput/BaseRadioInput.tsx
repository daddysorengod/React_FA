import React, { useState, useEffect, useRef } from "react";
import { useStyles } from "./BaseRadioInput.styles";
import useTranslation from "next-translate/useTranslation";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { ImagesSvg } from "@/src/constants/images";
/// import store
import { useDispatch } from "react-redux";
import { dispatch, useSelector } from "@store/store";
import { RootStateProps } from "@app/types/root";
import { getListOptionsDropdown } from "@/src/store/reducers/general";
/// end import store

interface Props {
  label?: string;
  value: boolean | string;
  fieldName?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  fieldIndex?: any;
  errorField?: string;
  onChange: Function;
  valueKey: string;
  labelKey: string;
  url?: string;
}
const BaseRadioInputComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    label,
    isRequired,
    isDisabled,
    value,
    onChange,
    errorField,
    fieldIndex,
    fieldName,
    valueKey,
    labelKey,
    url,
  } = props;

  const [options, setOptions] = useState<any[]>([]);

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   onChange((event.target as HTMLInputElement).value);
  // };

  useEffect(() => {
    const fetchData = async () => {
      if (!url) {
        return;
      }
      const { totalRecords, source, page } = await dispatch(
        getListOptionsDropdown(url),
      );
      setOptions(source);
    };
    fetchData();
  }, [url]);

  return (
    <Box className={classes.root}>
      {label ? (
        <Box>
          <label
            htmlFor={`radio-${fieldName}`}
            className={isRequired ? classes.requiredLabel : classes.label}
          >
            {label}
          </label>
        </Box>
      ) : (
        <></>
      )}
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        {fieldName ? (
          <RadioGroup
            name={`${fieldName}`}
            value={value ? value : null}
            className={classes.radioGroup}
          >
            {options.map((item, index) => (
              <FormControlLabel
                value={item[valueKey]}
                control={<Radio />}
                label={item[labelKey]}
                key={index}
                disabled={isDisabled}
                onClick={() => {
                  onChange(item[valueKey] ? item[valueKey] : null);
                }}
              />
            ))}
          </RadioGroup>
        ) : (
          <></>
        )}

        {errorField ? (
          <Tooltip
            arrow
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
      </Box>
    </Box>
  );
};
const BaseRadioInput = React.memo(BaseRadioInputComponent);
export { BaseRadioInput };
