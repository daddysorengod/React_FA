import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  CustomAutoCompleteWithHeaderStylesProps,
  useStyles,
} from "./BaseWithHeaderAutocomplete.styles";
import useTranslation from "next-translate/useTranslation";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
} from "@mui/icons-material";
import { FilterByString, searchAndSortObjects } from "./helpers";
import { CO_ALIGN, CO_TYPE } from "@/src/constants";

interface Props {
  value: any;
  apiDefaultTextValue?: string;
  valueKey: string;
  options: any[];
  showHeader?: boolean;
  columnConfigs: AUTOCOMPLETE_WITH_HEADER_COLUMN_CONFIG[];
  onChange: Function;
  onInputChange: Function;
  className?: any;
  listHeight?: number;
  listWidth?: number;
  verticalPosition?: "top" | "bottom";
  horizontalPosition?: "left" | "center" | "right";
  apiFilter?: boolean;
  isLoading?: boolean;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

export interface AUTOCOMPLETE_WITH_HEADER_COLUMN_CONFIG {
  key: string;
  label: string;
  width: number;
  type: CO_TYPE;
  align: CO_ALIGN;
  showOnTextField?: boolean;
  boldText?: boolean;
}
const defaultListHeight = 456;
const defaultWidthHeight = 300;

const BaseWithHeaderAutocompleteComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles({
    tableBorderRadius: 4,
  } as CustomAutoCompleteWithHeaderStylesProps);

  const {
    value,
    apiDefaultTextValue,
    onChange,
    onInputChange,
    valueKey,
    options,
    showHeader,
    columnConfigs,
    className,
    listHeight,
    listWidth,
    verticalPosition,
    horizontalPosition,
    apiFilter,
    isLoading,
    error,
    errorMessage,
    disabled,
  } = props;

  const [textValue, setTextValue] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<any[]>([]);
  const [openPopper, setOpenPopper] = useState<boolean>(false);
  const [isValueChange, setIsValueChange] = useState<boolean>(false);
  const [isInputValueChange, setIsInputValueChange] = useState<boolean>(false);
  const componentRef = useRef<HTMLDivElement | null>(null);

  const handleOpenPopper = () => {
    setOpenPopper(true);
  };

  const handleClosePopper = () => {
    setOpenPopper(false);
  };

  const handleChoose = (item: any) => {
    setOpenPopper(false);
    setIsValueChange(true);
    setIsInputValueChange(true);
    onChange(item[valueKey], true);
  };

  const handleTextValueChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setTextValue(event.target.value);
    const fetchData = async () => {
      if (event.target.value === "") {
        onChange("", true);
      }
      // await filterOptions(openPopper ? textValue : "");
      await filterOptions(event.target.value);
    };
    fetchData();
  };

  const filterOptions = async (searchString: string) => {
    if (apiFilter) {
      onInputChange(searchString);
    } else {
      filterClientOptions(searchString);
    }
  };

  const filterClientOptions = (searchString: string): any[] => {
    const list: any[] = searchAndSortObjects(
      options,
      columnConfigs,
      searchString,
    );
    setFilteredOptions(list);
    return list;
  };

  const setTextValueFirstTime = (): string => {
    if (apiFilter && !isValueChange) {
      setTextValue(apiDefaultTextValue || "");
      return apiDefaultTextValue || "";
    }

    const item = options.find(ele => ele[valueKey] === value);
    if (item) {
      let inputStr = "";
      columnConfigs.forEach(column => {
        if (column.showOnTextField) {
          inputStr += item[column.key] + " - ";
        }
      });
      inputStr = inputStr.substring(0, inputStr.length - 3);
      setTextValue(inputStr);
      return inputStr;
    } else {
      onChange("", false);
    }
    setTextValue("");
    return "";
  };

  useEffect(() => {
    const fetchData = async () => {
      setFilteredOptions(options);
    };
    fetchData();
  }, [options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setOpenPopper(false);
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };

    if (openPopper) {
      document.addEventListener("mousedown", handleClickOutside);
      if (componentRef.current) {
        const inputElement = componentRef.current.querySelector("input");
        if (inputElement) inputElement.focus();
      }
    } else {
      if (textValue !== "") {
        setTextValueFirstTime();
      }
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openPopper]);

  useEffect(() => {
    const str = setTextValueFirstTime();
    const list: any[] = searchAndSortObjects(options, columnConfigs, str, true);
    setFilteredOptions(list);
  }, [value]);
  
  useEffect(() => {
    // const str = setTextValueFirstTime();
    // const list: any[] = searchAndSortObjects(options, columnConfigs, str, true);
    // setFilteredOptions(list);
  }, [options]);

  useEffect(() => {
    setTextValue(apiDefaultTextValue || "");
  }, [apiDefaultTextValue]);

  useEffect(() => {}, [textValue]);

  const TablePoper = () => {
    const top = verticalPosition === "bottom";
    const sumWidth = columnConfigs.reduce((total, column) => {
      return total + column.width;
    }, 0);

    return (
      <Box sx={{ position: "relative" }}>
        <Paper
          component={"div"}
          square={false}
          elevation={2}
          className={classes.table}
          sx={{
            left:
              horizontalPosition == "right"
                ? "0"
                : horizontalPosition == "center"
                ? "-50%"
                : null,
            right:
              horizontalPosition == "left"
                ? "0"
                : horizontalPosition == "center"
                ? "-50%"
                : null,
            bottom: top ? "0" : null,
            top: !top ? "0" : null,
          }}
        >
          {showHeader === false ? (
            <></>
          ) : (
            <Box className={classes.headRow}>
              {columnConfigs.map(columnOption => {
                const width =
                  (columnOption.width / sumWidth) *
                  (listWidth || defaultWidthHeight);
                return (
                  <Box
                    key={columnOption.key}
                    sx={{
                      width: `${width}px`,
                      justifyContent:
                        columnOption.align == CO_ALIGN.RIGHT
                          ? "flex-end"
                          : columnOption.align == CO_ALIGN.CENTER
                          ? "center"
                          : "flex-start",
                    }}
                    className={classes.headCell}
                  >
                    {columnOption.label}
                  </Box>
                );
              })}
            </Box>
          )}
          <Box
            className={classes.body}
            sx={{
              maxHeight: `${listHeight ? listHeight : defaultListHeight}px`,
            }}
          >
            {filteredOptions.length === 0 ? (
              <Box className={classes.noOption}>No options</Box>
            ) : (
              <>
                {filteredOptions.map((row, rowIndex) => {
                  return (
                    <MenuItem
                      key={rowIndex}
                      onClick={() => {
                        handleChoose(row);
                      }}
                      className={classes.bodyRow}
                    >
                      {columnConfigs.map(columnOption => {
                        const width =
                          (columnOption.width / sumWidth) *
                          (listWidth || defaultWidthHeight);
                        return (
                          <Box
                            key={`${rowIndex}-${columnOption.key}`}
                            sx={{
                              width: `${width}px`,
                              justifyContent:
                                columnOption.align == CO_ALIGN.RIGHT
                                  ? "flex-end"
                                  : columnOption.align == CO_ALIGN.CENTER
                                  ? "center"
                                  : "flex-start",
                              fontWeight: columnOption.boldText ? "600" : "400",
                            }}
                            className={classes.bodyCell}
                          >
                            {row[columnOption.key]}
                          </Box>
                        );
                      })}
                    </MenuItem>
                  );
                })}
              </>
            )}
            {isLoading ? (
              <Box
                sx={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  top: 0,
                  left: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f0fff9b0",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <></>
            )}
          </Box>
        </Paper>
      </Box>
    );
  };

  return (
    <Box ref={componentRef} className={className}>
      {openPopper && verticalPosition === "top" ? <TablePoper /> : ""}
      <TextField
        value={textValue}
        onChange={handleTextValueChange}
        focused={openPopper}
        onFocus={handleOpenPopper}
        autoComplete="off"
        error={error}
        disabled={disabled}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {error ? (
                <Tooltip
                  arrow
                  placement="bottom-end"
                  title={errorMessage || "Validate error"}
                  className={classes.autoValidateTootip}
                >
                  <img src="/svg/error_icon.svg" />
                </Tooltip>
              ) : (
                <></>
              )}
              {openPopper ? (
                <IconButton
                  disabled={disabled}
                  size="small"
                  onClick={handleClosePopper}
                >
                  <ArrowDropUpIcon />
                </IconButton>
              ) : (
                <IconButton
                  disabled={disabled}
                  size="small"
                  onClick={handleOpenPopper}
                >
                  <ArrowDropDownIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
        fullWidth
        className={classes.input}
      />
      {openPopper && verticalPosition !== "top" ? <TablePoper /> : ""}
    </Box>
  );
};
const BaseWithHeaderAutocomplete = React.memo(
  BaseWithHeaderAutocompleteComponent,
);
export { BaseWithHeaderAutocomplete };
