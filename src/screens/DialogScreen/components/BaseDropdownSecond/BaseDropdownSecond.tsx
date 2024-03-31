import React, { useEffect, useState, useRef } from "react";
import "jquery"; ///
// import $ from "@root/public/plugins/jquery";
import {
  MenuItem,
  Box,
  Tooltip,
  Typography,
  Autocomplete,
  TextField,
  InputAdornment,
  Popper,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useStyles } from "./BaseDropdownSecond.styles";
import Transitions from "@components/@extended/Transitions";
import {
  getListOptionsDropdown,
  setAutoFillValue,
} from "@/src/store/reducers/general";
import { ImagesSvg } from "@/src/constants/images";
import {
  AutoCompleteType,
  IDependencyType,
  IDropDown,
  IField,
} from "@/src/types/field";
import { dispatch, useSelector } from "@store/store";
import { RootStateProps } from "@app/types/root";
import {
  compareObjectsNotNull,
  formatListObjToOptions,
  getCustomQuery,
  getObjChild,
  getQueryURL,
  isEmptyObject,
} from "@/src/helpers/getQueryURL";
import { debounce } from "lodash";
import ClearIcon from "@mui/icons-material/Clear";
import { BaseSubmitButton } from "@/src/components";

interface DynamicObject {
  [key: string]: any;
}
interface Props {
  value: string;
  name: string;
  url: any;
  onChange: (event) => void;
  isDisabled?: boolean;
  fieldIndex: number;
  label?: string;
  isRequired: boolean;
  errorField: string;
  onBlurSelectOption: (event) => void;
  initialState: DynamicObject;
  customAttrs: DynamicObject | null;
  selectOption?: DynamicObject;
  formCode?: String;
  fieldSet: IField;
  dropdownType: IDropDown;
  dependencies: DynamicObject;
  dependencyTypes: IDependencyType;
  // isFilterByDate: boolean;
  // onChangeIsFilter: any;
}
const Dropdown = (props: Props): JSX.Element => {
  const {
    value,
    onChange,
    name,
    url,
    isDisabled,
    fieldIndex,
    label,
    isRequired,
    errorField,
    onBlurSelectOption,
    customAttrs,
    initialState,
    selectOption,
    formCode,
    fieldSet,
    dropdownType,
    dependencies,
    dependencyTypes,
    // isFilterByDate,
    // onChangeIsFilter,
  } = props;
  const classes = useStyles();
  const [options, setOptions] = useState<any>([]);
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const prevDependency = useRef<any>(initialState);
  const [optionsUrl, setOptionsUrl] = useState<string>("");
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const { autoFill } = useSelector((state: RootStateProps) => state.general);
  const [searchValue, setSearchValue] = useState("");
  const [globalSearchData, setGlobalSearchData] = useState<any>([]);
  const [globalSearchMode, setGlobalSearchMode] = useState<boolean>(false);
  const [totalRecordGlobalSearch, setTotalRecordGlobalSearch] =
    useState<number>(0);

  useEffect(() => {
    const getListOptions = async () => {
      if (isLoading) {
        return;
      }
      setIsLoading(true);

      await getQueryOption();
      setIsLoading(false);
    };

    getListOptions();
  }, []);

  

  const getQueryOption = async () => {
    const { expandParams, fixedParams } = getCustomQuery({customAttrs:customAttrs,formValues: initialState,storageAutoFill:autoFill,formCode:formCode});
    if (isEmptyObject({ ...expandParams, ...fixedParams })) {
      return;
    }
    const customUrl = getQueryURL(url, { ...expandParams, ...fixedParams });

    setOptionsUrl(customUrl);
    const { totalRecords, source, page } = await dispatch(
      getListOptionsDropdown(customUrl),
    );

    if (globalSearchMode) {
      setGlobalSearchData(
        formatListObjToOptions(
          source,
          {
            fieldValue: selectOption?.fieldValue,
            fieldLabel: selectOption?.fieldLabel,
          },
          customAttrs?.customLabel,
        ),
      );
      setTotalRecordGlobalSearch(totalRecords);
    } else {
      if (totalRecords > 0) {
        setOptions(
          formatListObjToOptions(
            source,
            {
              fieldValue: selectOption?.fieldValue,
              fieldLabel: selectOption?.fieldLabel,
            },
            customAttrs?.customLabel,
          ),
        );
        setTotalRecord(totalRecords);
      }
    }

    return;
  };

  const onChangeValue = event => {
    onChange(event);
  };

  const disabledDropdown = () => {
    try {
      if (isDisabled && !customAttrs?.type) {
        return true;
      } else if (
        customAttrs?.type &&
        customAttrs?.enableCaseWhen !== initialState[customAttrs?.fieldName] &&
        customAttrs?.selectType &&
        customAttrs?.selectType === "DEPEND"
      ) {
        if (value) {
          onChange(null);
        }
        return true;
      } else if (
        customAttrs?.selectType &&
        customAttrs?.selectType === "DEPEND"
      ) {
        return false;
      } else if (
        fieldSet?.validateAttribute?.isReadOnly ||
        fieldSet?.validateAttribute?.isDisabled ||
        customAttrs?.type === "DISABLED"
      ) {
        return true;
      }
    } catch (err) {
      return false;
    }
  };

  const anchorRef = useRef<any>(null);
  
  const PaperComponent = React.useCallback(props => {
    const currentWidth = customAttrs?.customWidth
      ? Number(customAttrs?.customWidth)
      : anchorRef.current?.clientWidth;
    const currentHeight = customAttrs?.customHeight
      ? Number(customAttrs?.customHeight)
      : 250;
    // anchorRef.current?.customHeight;
    return (
      <Popper
        {...props}
        anchorEl={anchorRef.current}
        style={{
          width: currentWidth,
        }}
        placement="bottom-start"
        transition
        // disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 9],
              },
            },
          ],
        }}
        disablePortal={false}
      >
        {({ TransitionProps }) => (
          <Transitions
            type="fade"
            {...TransitionProps}
            sx={{
              height: currentHeight,
              width: currentWidth ?? "100px",
            }}
          >
            {/* <Box
              sx={{
                width: `${currentWidth}px`,
                justifyContent: "center",
                alignItems: "center",
                height: "36px",
                backgroundColor: "#E2E6EA",
                display: "flex",
              }}
            > */}
              {/* <BaseSubmitButton
                sx={{
                  width: "100%",
                }}
                onClick={onChangeIsFilter}
              > */}
                {/* {!isFilterByDate ? "Mở tuỳ chọn" : "Đóng tuỳ chọn"} */}
                {/* {"Tuỳ chọn"} */}
              {/* </BaseSubmitButton> */}
            {/* </Box> */}
            {props.children}
          </Transitions>
        )}
      </Popper>
    );
  }, []);

  const loadMoreResults = async () => {
    try {
      if (
        !globalSearchMode &&
        (options.length >= totalRecord || (totalRecord && totalRecord < 1))
      ) {
        return;
      }
      totalRecordGlobalSearch;
      if (
        globalSearchMode &&
        (options.length >= totalRecordGlobalSearch ||
          (totalRecordGlobalSearch && totalRecordGlobalSearch < 1))
      ) {
        return;
      }
      setIsLoading(true);
      const currentUrl = optionsUrl.split("?");
      if (currentUrl.length < 2) {
        return;
      }
      const queryUrl = currentUrl[1]?.split("&").reduce((newQuery, item) => {
        let query = item?.split("=");
        if (query[0] && query[0] === "pageIndex") {
          newQuery[query[0]] = Number(query[1]) + 1;
        } else {
          newQuery[query[0]] = query[1];
        }

        return newQuery;
      }, {});
      if (
        Object.keys(queryUrl).length < 1 ||
        !Object.keys(queryUrl).includes("pageIndex")
      ) {
        return;
      }
      const customUrl = getQueryURL(currentUrl[0], queryUrl, "");
      setOptionsUrl(customUrl);
      const { totalRecords, source, page } = await dispatch(
        getListOptionsDropdown(customUrl),
      );
      if (globalSearchMode) {
        setGlobalSearchData(prev => [
          ...prev,
          ...formatListObjToOptions(
            source,
            {
              fieldValue: selectOption?.fieldValue,
              fieldLabel: selectOption?.fieldLabel,
            },
            customAttrs?.customLabel,
          ),
        ]);
        setTotalRecordGlobalSearch(totalRecords);
      } else {
        setOptions(prev => [
          ...prev,
          ...formatListObjToOptions(
            source,
            {
              fieldValue: selectOption?.fieldValue,
              fieldLabel: selectOption?.fieldLabel,
            },
            customAttrs?.customLabel,
          ),
        ]);
        setTotalRecord(totalRecords);
      }

      setTimeout(() => {
        setIsLoading(false);
        // setOpen(true);
      }, 500);
    } catch (error) {
      console.log("loadMoreResults: ", error);
    }
  };

  const handleScroll = event => {
    if (
      dropdownType !== AutoCompleteType.DropDownPreFetch &&
      dropdownType !== AutoCompleteType.DropDownFetchByForm
    ) {
      return;
    }
    const listboxNode = event.currentTarget;

    const position = listboxNode.scrollTop + listboxNode.clientHeight;
    if (listboxNode.scrollHeight - position <= 1) {
      loadMoreResults();
    }
  };

  const handleDebouncedSearch = debounce(async inputValue => {
    try {
      // setIsLoading(true);
      const currentUrl = optionsUrl.split("?");
      if (currentUrl.length < 2) {
        return;
      }
      const queryUrl = currentUrl[1]?.split("&").reduce((newQuery, item) => {
        let query = item?.split("=");
        if (query[0] && query[0] === "pageIndex") {
          newQuery[query[0]] = 1;
        } else {
          newQuery[query[0]] = query[1];
        }

        return newQuery;
      }, {});
      if (
        Object.keys(queryUrl).length < 1 ||
        !Object.keys(queryUrl).includes("pageIndex")
      ) {
        return;
      }
      const customUrl = getQueryURL(
        currentUrl[0],
        globalSearchMode
          ? { ...queryUrl, globalTerm: inputValue }
          : { ...queryUrl },
        "",
      );
      setOptionsUrl(customUrl);
      const { totalRecords, source, page } = await dispatch(
        getListOptionsDropdown(customUrl),
      );
      if (globalSearchMode) {
        setGlobalSearchData(
          formatListObjToOptions(
            source,
            {
              fieldValue: selectOption?.fieldValue,
              fieldLabel: selectOption?.fieldLabel,
            },
            customAttrs?.customLabel,
          ),
        );
        setTotalRecordGlobalSearch(totalRecords);
      } else {
        setOptions(prev => [
          ...prev,
          ...formatListObjToOptions(
            source,
            {
              fieldValue: selectOption?.fieldValue,
              fieldLabel: selectOption?.fieldLabel,
            },
            customAttrs?.customLabel,
          ),
        ]);
        setTotalRecord(totalRecords);
      }
    } catch (error) {}
  }, 500);

  // Xử lý khi giá trị value thay đổi
  useEffect(() => {
    // Gọi hàm debounce khi value thay đổi
    if (!searchValue) {
      // getQueryOption();
      return;
    }
    handleDebouncedSearch(searchValue);

    // Cleanup để tránh gọi hàm debounce khi component unmount
    return () => {
      handleDebouncedSearch.cancel();
    };
  }, [searchValue]);

  return (
    <div>
      {label ? (
        <label className={classes.inputLabel}>
          {label}
          {!isDisabled && !disabledDropdown() && isRequired ? (
            <span style={{ color: "red" }}> *</span>
          ) : (
            ""
          )}
        </label>
      ) : (
        <div style={{ height: "19px" }}></div>
      )}
      <Box
        key={`${name.replace(/\s+/g, "_")}-${fieldIndex}`}
        className={
          isDisabled || disabledDropdown()
            ? classes.dropdownReadOnly
            : classes.dropdownCommon
        }
        ref={anchorRef}
      >
        <Autocomplete
          PopperComponent={PaperComponent}
          id={`autocomplete-${name ?? ""}-${fieldIndex ?? ""}`}
          ListboxProps={{ onScroll: handleScroll }}
          options={!globalSearchMode ? options : globalSearchData || []}
          value={
            !globalSearchMode
              ? options.find(option => option.value == value) || null
              : globalSearchData.find(option => option.value == value) || null
          }
          onChange={(event, optVal, reason) => {
            if (dropdownType === AutoCompleteType.DropDownYesNo) {
              onChangeValue(optVal?.value ?? false);
            } else {
              onChangeValue(optVal?.value ?? null);
            }
          }}
          onInputChange={(event, value, reason) => {
            if (globalSearchMode && value && reason === "reset") {
              return;
            }
            if (globalSearchMode && reason === "input") {
              setSearchValue(value);
            }
            if (!value && globalSearchMode && reason === "input") {
              setGlobalSearchMode(false);
            }
          }}
          filterOptions={(options, state) => {
            if (globalSearchMode) {
              return globalSearchData;
            }
            const displayOptions = options.filter(
              option =>
                option?.text &&
                //  customAttrs?.customLabel
                //   ? option?.text.trim().includes(state.inputValue.trim())
                //   :
                option?.text.trim().includes(state.inputValue.trim()),
            );
            if (displayOptions.length < 1) {
              setGlobalSearchMode(true);
              return [];
            } else {
              return displayOptions;
            }
          }}
          onBlur={event => {
            onBlurSelectOption(event)
          }}
          renderOption={(
            props: React.HTMLAttributes<HTMLLIElement>,
            option,
            state,
          ) => {
            return (
              <MenuItem
                {...props}
                key={option?.value || option?.id || option?.cdVal}
                className={classes.bodyRow}
              >
                <Typography
                  sx={{
                    maxWidth: anchorRef.current?.clientWidth
                      ? anchorRef.current?.clientWidth * 1.5
                      : 100,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {option?.text ?? ""}
                </Typography>
              </MenuItem>
            );
          }}
          loading={isLoading}
          getOptionLabel={option => option?.text || ""}
          isOptionEqualToValue={(option, value) => {
            return option?.value === value?.value;
          }}
          fullWidth
          disabled={isDisabled || disabledDropdown()}
          className={
            isDisabled || disabledDropdown()
              ? classes.selectDisable
              : classes.select
          }
          renderInput={params => {
            return (
              <TextField
                {...params}
                name={name ?? ""}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Box>
                      {isLoading ? (
                        <CircularProgress
                          className={classes.autoLoading}
                          color="primary"
                          size={20}
                        />
                      ) : (
                        <Box></Box>
                      )}
                      {errorField && !isLoading ? (
                        <Box>
                          <InputAdornment position="end">
                            <Tooltip
                              placement="top-start"
                              arrow
                              title={
                                <React.Fragment>
                                  <Typography color="inherit">
                                    {errorField}
                                  </Typography>
                                </React.Fragment>
                              }
                              className={classes.autoValidateTootip}
                            >
                              <img src={ImagesSvg.textFieldErrorIcon} />
                            </Tooltip>
                          </InputAdornment>

                          {!isLoading ? params.InputProps.endAdornment : null}
                        </Box>
                      ) : (
                        <Box>
                          {!isLoading ? params.InputProps.endAdornment : null}
                        </Box>
                      )}
                    </Box>
                  ),
                  color: errorField ? "error" : "primary",
                  error: errorField ? true : false,
                }}
              />
            );
          }}
          open={
            open
            // || globalSearchMode
          }
          onOpen={() => {
            setOpen(true);
            setIsLoading(false);
          }}
          onClose={() => {
            // if (!globalSearchMode) {
            //   setOpen(false);
            // }
            setOpen(false);
            setIsLoading(false);
          }}
          // clearOnBlur={globalSearchMode ? false : true}
          // selectOnFocus={true}
        />
      </Box>
    </div>
  );
};
const BaseDropdownSecond = React.memo(Dropdown);
export { BaseDropdownSecond };
