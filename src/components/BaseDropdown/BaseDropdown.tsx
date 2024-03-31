import React, { useEffect, useState, useRef, use } from "react";
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
import { useStyles } from "./BaseDropdown.styles";
import Transitions from "@components/@extended/Transitions";
import {
  getListOptionsDropdown,
  setAutoFillValue,
  setDetailContractUpdateSeparateKey,
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
  getMapKeyToDependKey,
  getObjChild,
  getQueryURL,
  isEmptyObject,
} from "@/src/helpers/getQueryURL";
import { debounce } from "lodash";
import ClearIcon from "@mui/icons-material/Clear";
import { formatNumberStringToNumber } from "@/src/helpers";

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
  } = props;
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const prevDependency = useRef<any>(initialState);
  const prevConfigAutocomplete = useRef<any>({});
  const [optionsUrl, setOptionsUrl] = useState<string>("");

  const { autoFill } = useSelector((state: RootStateProps) => state.general);
  const [searchValue, setSearchValue] = useState("");
  const [globalSearchMode, setGlobalSearchMode] = useState<boolean>(false);
  const [options, setOptions] = useState<any>([]);
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [globalSearchData, setGlobalSearchData] = useState<any>([]);
  const [totalRecordGlobalSearch, setTotalRecordGlobalSearch] =
    useState<number>(0);

  useEffect(() => {
    const getListOptions = async () => {
      try {
        if(dropdownType ===AutoCompleteType.DropDownFetchByForm){
          if (dependencyTypes?.paging) {
            if (options.length > 0) {
              return;
            }
            getQueryOption();
            return;
          } else if (dependencyTypes?.needStorage) {
            if (
              compareObjectsNotNull(
                getObjChild(initialState, dependencies),
                getObjChild(prevDependency.current, dependencies),
              )
            ) {
              if (
                value &&
                (options.length < 1 ||
                  options.filter(item => item.value === value).length < 1)
              ) {
                getQueryOption();
                return;
              } else {
                return;
              }
            }
            // onChange(null);
            getQueryOption();
            return;
          } else if (
            dependencyTypes?.needParentID ||
            dependencyTypes?.needCurrentState
          ) {
            if (
              compareObjectsNotNull(
                getObjChild(initialState, dependencies),
                getObjChild(prevDependency.current, dependencies),
              )
            ) {
              if (
                value &&
                (options.length < 1 ||
                  options.filter(item => item.value === value).length < 1)
              ) {
                getQueryOption();
              } else {
                return;
              }
              return;
            }
            // onChange(null);
            getQueryOption();
            return;
          }
        }
        
      } catch (err) {
        return;
      }
    };
    getListOptions();
    prevDependency.current = initialState;
  }, [autoFill, dependencies]);

  useEffect(()=>{
    const getListOptionsYesNo= ()=>{
      if(dropdownType ===AutoCompleteType.DropDownYesNo){
        if (options.length > 0) {
          return
        }
        setOptions([
          { text: "Có", value: true },
          { text: "Không", value: false },
        ]);
      }
    }
    getListOptionsYesNo()
  },[])

  useEffect(()=>{
    const getListOptionsYesNo= ()=>{
      if(dropdownType ===AutoCompleteType.DropDownPreFetch){
        if (options.length > 0) {
          return;
        }
        getQueryOption();
        return;
      }
    }
    getListOptionsYesNo()
  },[])

  useEffect(() => {
    const debouncedOnChange = setTimeout(() => {
      if (customAttrs && customAttrs?.useAccounting === "ACTIVE") {
        if (!customAttrs?.accountingStorageKey) {
          return;
        }
        dispatch(
          setDetailContractUpdateSeparateKey({
            key: customAttrs?.accountingStorageKey,
            value: formatNumberStringToNumber(value),
            editing: true,
          }),
        );
      }

    }, 500);
    return () => clearTimeout(debouncedOnChange);
  }, [value, 500]);


  useEffect(() => {
    const changeModeSearchAutocomplete = () => {
      if (!globalSearchMode) {
        if (prevConfigAutocomplete?.current?.options && prevConfigAutocomplete?.current?.totalRecord) {
          setOptions(prevConfigAutocomplete?.current?.options)
          setTotalRecord(prevConfigAutocomplete?.current?.totalRecord)
        }
        return
      }
      prevConfigAutocomplete.current = {
        options: options,
        totalRecord: totalRecord
      }
    }
    changeModeSearchAutocomplete()
  }, [globalSearchMode])

  // const getQueryOption = async () => {
  //   const { expandParams, fixedParams } = getCustomQuery({ customAttrs: customAttrs, formValues: initialState, storageAutoFill: autoFill, formCode: formCode });
  //   if (isEmptyObject({ ...expandParams, ...fixedParams })) {
  //     return;
  //   }
  //   const customUrl = getQueryURL(url, { ...expandParams, ...fixedParams });

  //   setOptionsUrl(customUrl);
  //   const { totalRecords, source, page } = await dispatch(
  //     getListOptionsDropdown(customUrl),
  //   );

  //   if (globalSearchMode) {
  //     setGlobalSearchData(
  //       formatListObjToOptions(
  //         source,
  //         {
  //           fieldValue: selectOption?.fieldValue,
  //           fieldLabel: selectOption?.fieldLabel,
  //         },
  //         customAttrs?.customLabel,
  //       ),
  //     );
  //     setTotalRecordGlobalSearch(totalRecords);
  //   } else {
  //     if (totalRecords > 0) {
  //       setOptions(
  //         formatListObjToOptions(
  //           source,
  //           {
  //             fieldValue: selectOption?.fieldValue,
  //             fieldLabel: selectOption?.fieldLabel,
  //           },
  //           customAttrs?.customLabel,
  //         ),
  //       );
  //       setTotalRecord(totalRecords);
  //     }
  //   }

  //   return;
  // };

  const getQueryOption = async () => {
    const { expandParams, fixedParams } = getCustomQuery({ customAttrs: customAttrs, formValues: initialState, storageAutoFill: autoFill, formCode: formCode });
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

  useEffect(() => {
    const saveAutoFilData = () => {
      if (customAttrs?.allowFill) {
        if ((Array.isArray(options) && options.length < 1) || !value) {
          if (
            autoFill[`${formCode}_${name}`] &&
            Object.keys(autoFill[`${formCode}_${name}`]).length < 1
          ) {
            return;
          }
          const newFilledValue = { [`${formCode}_${name}`]: {} };
          dispatch(setAutoFillValue(newFilledValue));
          return;
        }

        const data = options?.find(item => Object.values(item).includes(value));
        if (
          compareObjectsNotNull({ ...data }, autoFill[`${formCode}_${name}`])
        ) {
          return;
        }
        const newFilledValue = { [`${formCode}_${name}`]: { ...data } };
        dispatch(setAutoFillValue(newFilledValue));
      }
    };
    saveAutoFilData();
  }, [value, options]);

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
            <Box
              sx={{
                width: `${currentWidth}px`,
                justifyContent: "center",
                alignItems: "center",
                height: "36px",
                backgroundColor: "#E2E6EA",
                display: "flex",
              }}
            >
              <Typography>----Chọn---</Typography>
            </Box>
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
    } catch (error) { }
  }, 500);

  const handleGlobalSearch = async (inputValue: string) => {
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
        { ...queryUrl, globalTerm: inputValue }
        ,
        "",
      );
      setOptionsUrl(customUrl);
      const { totalRecords, source, page } = await dispatch(
        getListOptionsDropdown(customUrl),
      );
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
    } catch (error) { }
  }

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

  const handelChangeAutocomplete = ({ dropdownType, value }) => {
    try {
      if (dropdownType === AutoCompleteType.DropDownYesNo) {
        onChangeValue(value ?? false);
      } else {
        onChangeValue(value ?? null);
      }
    } catch (error) {

    }
  }

  const handelChangeInput = ({ inputValue, inputType, mode }) => {
    try {
      if (mode && inputValue && inputType === "reset") {
        return;
      }
      if (mode && inputType === "input") {
        setSearchValue(inputValue);
      }
      if (!inputValue && mode && inputType === "input") {
        setGlobalSearchMode(false);
      }
    } catch (error) {

    }
  }

  const handleFocusAutocomplete = () => {
    setOpen(true);
    setIsLoading(false);
  }

  const handleCloseAutocomplete = () => {
    setOpen(false);
    setIsLoading(false);
  }

  const getFilterOption = ({ inputValue, mode, options }: { inputValue: string, mode: boolean, options: any[] }) => {
    try {
      if (mode) {
        return options;
      }
      const displayOptions = options.filter(
        option =>
          option?.text &&
          option?.text.trim().includes(inputValue),
      );
      if (displayOptions.length < 1) {
        if (!mode) {
          setGlobalSearchMode(true);
          handleGlobalSearch(inputValue)
        }

        return [];
      } else {
        return options;
      }
    } catch (error) {
      return []
    }
  }

  return (
    <div>
      {label ? (
        <label className={classes.inputLabel}>
          {label}
          {!isDisabled && !disabledDropdown() && isRequired ? (
            <span className={classes.red}> *</span>
          ) : (
            ""
          )}
        </label>
      ) : (
        <div className={classes.noLabel}></div>
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
          options={
            !globalSearchMode ? options : globalSearchData || []
            // options || []
          }
          value={
            !globalSearchMode ? options.find(option => option.value == value) || null : globalSearchData.find(option => option.value == value) || null
            // options.find(option => option.value == value) || null
          }
          onChange={(event, optVal, reason) => {
            handelChangeAutocomplete({ dropdownType: dropdownType, value: optVal?.value })
          }}
          onInputChange={(event, value, reason) => {
            handelChangeInput({ inputValue: value, inputType: reason, mode: globalSearchMode })
          }}
          filterOptions={(options, state) => {
            // getFilterOption({inputValue:state.inputValue.trim(), mode: globalSearchData, options:options })
            try {
              if (globalSearchMode) {
                return globalSearchData;
              }
              const displayOptions = options.filter(
                option =>
                  option?.text &&
                  option?.text.trim().includes(state.inputValue.trim()),
              );
              if (displayOptions.length < 1) {
                if (!globalSearchMode) {
                  setGlobalSearchMode(true);
                  handleGlobalSearch(state.inputValue.trim())
                }

                return [];
              } else {
                return displayOptions;
              }
            } catch (error) {
              return []
            }
          }}
          onBlur={event => {
            // onBlurSelectOption()
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
                  className={classes.textOption}
                  sx={{
                    maxWidth: anchorRef.current?.clientWidth
                      ? anchorRef.current?.clientWidth * 1.5
                      : 100,

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
          open={open
            // || globalSearchMode
          }
          onOpen={handleFocusAutocomplete}
          onClose={handleCloseAutocomplete}
        // clearOnBlur={globalSearchMode ? false : true}
        // selectOnFocus={true}
        />
      </Box>
    </div>
  );
};
const BaseDropdown = React.memo(Dropdown);
export { BaseDropdown };
