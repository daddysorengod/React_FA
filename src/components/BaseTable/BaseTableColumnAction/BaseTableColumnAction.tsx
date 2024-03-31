import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { Box, Grid, Button, Autocomplete, MenuItem } from "@mui/material";
import { useStyles } from "./BaseTableColumnAction.styles";
import useTranslation from "next-translate/useTranslation";
import { CO_FILTER_TYPE } from "@/src/constants/generic-table";
import { OutlinedInput } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { TextField } from "@mui/material";
import {
  ParamObject,
  type COLUMN_OPTIONS_INTERFACE,
  TABLE_SELECT_OPTIONS,
} from "@/src/types/generic-table";

interface Props {
  columnOption: COLUMN_OPTIONS_INTERFACE;
  filterParams: any;
  selectOptionsListField: { [key: string]: TABLE_SELECT_OPTIONS };
  onSearch: Function;
  closeMenu: Function;
}

const listErrorKeyInput: string[] = ["h", "H", "l", "L"] as string[];

const BaseTableColumnActionComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();

  const {
    columnOption,
    filterParams,
    selectOptionsListField,
    onSearch,
    closeMenu,
  } = props;

  const [value, setValue] = useState<ParamObject>({});

  const [autoValue, setAutoValue] = useState<any>(() => {
    if (columnOption.typeFilter == CO_FILTER_TYPE.SELECT) {
      const obj = selectOptionsListField[columnOption.key];
      const option = (obj?.list || []).find(
        ele =>
          ele[obj.valueKey] ===
          filterParams[columnOption.relatedKey || columnOption.key],
      );
      if (option) {
        return option;
      }
    }
    return null;
  });
  const [inputAutoValue, setInputAutoValue] = useState(() => {
    if (columnOption.typeFilter == CO_FILTER_TYPE.SELECT) {
      const obj = selectOptionsListField[columnOption.key];
      const option = (obj?.list || []).find(
        ele =>
          ele[obj.valueKey] ===
          filterParams[columnOption.relatedKey || columnOption.key],
      );
      if (option) {
        return option[obj.nameKey];
      }
    }
    return undefined;
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const initValueInput = () => {
    if (
      [CO_FILTER_TYPE.MIN_MAX_DATE, CO_FILTER_TYPE.MIN_MAX_NUMBER].includes(
        columnOption.typeFilter,
      )
    ) {
      setValue({
        [`${columnOption.key}-min`]:
          filterParams[`${columnOption.key}-min`] || "",
        [`${columnOption.key}-max`]:
          filterParams[`${columnOption.key}-max`] || "",
      });
    } else if (columnOption.typeFilter === CO_FILTER_TYPE.SELECT) {
    } else {
      setValue({
        [columnOption.key]: filterParams[columnOption.key] || "",
      });
    }
  };

  useLayoutEffect(() => {
    initValueInput();
  }, []);

  const handleChange = (event?: any, newValue?: any) => {
    if (
      [CO_FILTER_TYPE.MIN_MAX_DATE, CO_FILTER_TYPE.MIN_MAX_NUMBER].includes(
        columnOption.typeFilter,
      ) &&
      event
    ) {
      setValue({
        ...value,
        [event.target.name]: event.target.value,
      });
    } else if (columnOption.typeFilter === CO_FILTER_TYPE.SELECT) {
      setValue({
        [columnOption.key]: newValue ? newValue : "",
      });
    } else if (columnOption.typeFilter === CO_FILTER_TYPE.TEXT) {
      if (!listErrorKeyInput.includes(event?.nativeEvent?.data))
        setValue({
          [columnOption.key]: event.target.value,
        });
    } else {
      if (!event) return;
      setValue({
        [columnOption.key]: event.target.value,
      });
    }
  };

  const handleClearFilter = async () => {
    if (
      [CO_FILTER_TYPE.MIN_MAX_DATE, CO_FILTER_TYPE.MIN_MAX_NUMBER].includes(
        columnOption.typeFilter,
      )
    ) {
      setValue({
        [`${columnOption.key}-min`]: "",
        [`${columnOption.key}-max`]: "",
      });
    } else if (columnOption.typeFilter === CO_FILTER_TYPE.SELECT) {
      setInputAutoValue("");
      setAutoValue(null);
      if (inputRef.current) inputRef.current.focus();
    } else {
      setValue({
        [columnOption.key]: "",
      });
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleOnSearchFilterColumn = async () => {
    closeMenu();
    const tempValue = { ...value };
    if (columnOption.typeFilter == CO_FILTER_TYPE.SELECT) {
      const obj = selectOptionsListField[columnOption.key] || {};
      if (columnOption?.relatedKey) {
        tempValue[columnOption.relatedKey] =
          autoValue &&
          autoValue[obj.valueKey] !== null &&
          autoValue[obj.valueKey] !== undefined &&
          columnOption?.relatedKey
            ? autoValue[obj.valueKey]
            : "";
      }
    }
    await onSearch(tempValue);
  };

  switch (columnOption.typeFilter) {
    case CO_FILTER_TYPE.TEXT: {
      return (
        <Box className={"filter-column"}>
          <Box className={"input-filter-" + columnOption.key}>
            <label className={classes.label}>Tìm kiếm</label>
            <OutlinedInput
              name={columnOption.key}
              value={value[columnOption.key] || ""}
              className={classes.input}
              type="text"
              inputRef={inputRef}
              autoFocus
              onChange={handleChange}
              onKeyDown={event => {
                let key = event.key || "";
                if (listErrorKeyInput.includes(key)) {
                  let str = value[columnOption.key] || "";
                  setValue({
                    [columnOption.key]: str + key,
                  });
                }
              }}
            />
          </Box>
          <Box className={classes.buttonGroup}>
            <Button
              className={classes.clearButton}
              onClick={() => {
                handleClearFilter();
              }}
            >
              Đặt lại
            </Button>
            <Button
              className={classes.searchButton}
              onClick={() => {
                handleOnSearchFilterColumn();
              }}
            >
              Tìm kiếm
            </Button>
          </Box>
        </Box>
      );
    }
    case CO_FILTER_TYPE.NUMBER: {
      return (
        <Box className={"filter-column"}>
          <Box>
            <label className={classes.label}>Tìm kiếm</label>
            <OutlinedInput
              name={columnOption.key}
              value={value[columnOption.key] || ""}
              className={classes.input}
              type="number"
              onChange={handleChange}
            />
          </Box>
          <Box className={classes.buttonGroup}>
            <Button
              className={classes.clearButton}
              onClick={() => {
                handleClearFilter();
              }}
            >
              Đặt lại
            </Button>
            <Button
              className={classes.searchButton}
              onClick={() => {
                handleOnSearchFilterColumn();
              }}
            >
              Tìm kiếm
            </Button>
          </Box>
        </Box>
      );
    }
    case CO_FILTER_TYPE.MIN_MAX_NUMBER: {
      return (
        <Box className={"filter-column"}>
          <Grid container columns={12} columnSpacing={3} sx={{}}>
            <Grid item xs={6}>
              <label className={classes.label}>Min</label>
              <OutlinedInput
                value={value[`${columnOption.key}-min`] || ""}
                className={classes.input}
                type="number"
                name={`${columnOption.key}-min`}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <label className={classes.label}>Max</label>
              <OutlinedInput
                value={value[`${columnOption.key}-max`] || ""}
                className={classes.input}
                type="number"
                name={`${columnOption.key}-max`}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Box className={classes.buttonGroup}>
            <Button
              className={classes.clearButton}
              onClick={() => {
                handleClearFilter();
              }}
            >
              Đặt lại
            </Button>
            <Button
              className={classes.searchButton}
              onClick={() => {
                handleOnSearchFilterColumn();
              }}
            >
              Tìm kiếm
            </Button>
          </Box>
        </Box>
      );
    }
    case CO_FILTER_TYPE.MIN_MAX_DATE: {
      return (
        <Box className={"filter-column"}>
          <Grid container columns={12} rowSpacing={2.5} sx={{}}>
            <Grid item xs={12}>
              <label className={classes.label}>Min</label>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  value={
                    value[`${columnOption.key}-min`]
                      ? moment(value[`${columnOption.key}-min`] || "")
                      : null
                  }
                  onChange={newValue => {
                    setValue({
                      ...value,
                      [`${columnOption.key}-min`]:
                        moment(newValue).format("MM-DD-YYYY"),
                    });
                  }}
                  format="DD/MM/YYYY"
                  minDate={moment().subtract(200, "years")}
                  maxDate={moment().add(200, "years")}
                  className={classes.dateInput}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <label className={classes.label}>Max</label>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  value={
                    value[`${columnOption.key}-max`]
                      ? moment(value[`${columnOption.key}-max`] || "")
                      : null
                  }
                  onChange={newValue =>
                    setValue({
                      ...value,
                      [`${columnOption.key}-max`]:
                        moment(newValue).format("MM/DD/YYYY"),
                    })
                  }
                  format="DD/MM/YYYY"
                  minDate={moment("0000-01-01T00:00:00.000")}
                  maxDate={moment("9999-01-01T00:00:00.000")}
                  className={classes.dateInput}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Box className={classes.buttonGroup}>
            <Button
              className={classes.clearButton}
              onClick={() => {
                handleClearFilter();
              }}
            >
              Đặt lại
            </Button>
            <Button
              className={classes.searchButton}
              onClick={() => {
                handleOnSearchFilterColumn();
              }}
            >
              Tìm kiếm
            </Button>
          </Box>
        </Box>
      );
    }
    case CO_FILTER_TYPE.SELECT: {
      const obj = selectOptionsListField[columnOption.key] || {};
      return (
        <Box className={"filter-column"}>
          <Grid container columns={12}>
            <Grid item xs={12}>
              <label className={classes.label}>Bộ lọc</label>
              <Autocomplete
                options={obj?.list || []}
                getOptionLabel={option => option[obj.nameKey] || ""}
                value={autoValue || null}
                inputValue={inputAutoValue || ""}
                onChange={(e: any, v: any) => {
                  setAutoValue(v);
                }}
                onInputChange={(e: any, v: any) => {
                  if (!listErrorKeyInput.includes(e.nativeEvent?.data))
                    setInputAutoValue(v);
                }}
                renderOption={(props, option) => {
                  return (
                    <MenuItem {...props}>
                      {option[obj.nameKey] ? option[obj.nameKey] : ""}
                    </MenuItem>
                  );
                }}
                isOptionEqualToValue={(option, value) =>
                  option[obj.valueKey] === value[obj.valueKey]
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    inputRef={inputRef}
                    autoFocus
                    onKeyDown={event => {
                      let key = event.key || "";
                      if (listErrorKeyInput.includes(key)) {
                        let str = inputAutoValue || "";
                        setInputAutoValue(str + key);
                      }
                    }}
                  />
                )}
                fullWidth
                autoFocus={true}
                className={classes.select}
              />
            </Grid>
          </Grid>
          <Box className={classes.buttonGroup}>
            <Button
              className={classes.clearButton}
              onClick={() => {
                handleClearFilter();
              }}
            >
              Đặt lại
            </Button>
            <Button
              className={classes.searchButton}
              onClick={() => {
                handleOnSearchFilterColumn();
              }}
            >
              Tìm kiếm
            </Button>
          </Box>
        </Box>
      );
    }
    default: {
      return <></>;
    }
  }
};

const BaseTableColumnAction = React.memo(BaseTableColumnActionComponent);
export { BaseTableColumnAction };
