import React, { Fragment, useEffect, useRef, useState } from "react";
import { useStyles } from "./AutocompleteAccounting.styles";
import useTranslation from "next-translate/useTranslation";
import {
    AutoCompleteType,
  DynamicObject,
  IDependencyType,
  IDropDown,
  IField,
} from "@/src/types/field";
import { MenuItem,
    Box,
    Tooltip,
    Typography,
    Autocomplete,
    TextField,
    InputAdornment,
    Popper,
    CircularProgress, } from "@mui/material";
import Transitions from "@components/@extended/Transitions";
/// import store
import { useDispatch } from 'react-redux';
import { dispatch, useSelector } from '@store/store';
import { RootStateProps } from '@app/types/root';
import { compareObjectsNotNull, formatListObjToOptions, getCustomQuery, getObjChild, getQueryURL, isEmptyObject } from "@/src/helpers/getQueryURL";
import { getListOptionsDropdown, setAutoFillValue } from "@/src/store/reducers/general";
/// end import store
import { debounce } from "lodash";
import { ImagesSvg } from "@/src/constants/images";



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
const AutocompleteAccountingComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
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
  const [options, setOptions] = useState<any>([]);
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const prevDependency = useRef<any>(initialState);
  const [optionsUrl, setOptionsUrl] = useState<string>("");
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const { autoFill } = useSelector((state: RootStateProps) => state.general);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const getListOptions = async () => {
      try {
        switch (dropdownType) {
          case AutoCompleteType.DropDownYesNo: {
            if (options.length > 0) {
              break;
            }
            setOptions([
              { text: "Có", value: true },
              { text: "Không", value: false },
            ]);
            break;
          }
          case AutoCompleteType.DropDownPreFetch: {
            if (options.length > 0) {
              break;
            }
            getQueryOption();
            break;
          }
          case AutoCompleteType.DropDownFetchByForm: {
            if (dependencyTypes?.paging) {
              if (options.length > 0) {
                break;
              }
              getQueryOption();
              break;
            } else if (!dependencyTypes?.needStorage) {
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
                  break;
                } else {
                  break;
                }
              }
              // onChange(null);
              getQueryOption();
              break;
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
                  break;
                }
                return;
              }
              // onChange(null);
              getQueryOption();
              break;
            }
          }
        }
      } catch (err) {
        return;
      }
    };
    getListOptions();
    prevDependency.current = initialState;
  }, [autoFill, dependencies]);

  

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
    if (totalRecords > 0) {
      setOptions(
        formatListObjToOptions(source, {
          fieldValue: selectOption?.fieldValue,
          fieldLabel: selectOption?.fieldLabel,
        }),
      );
      setTotalRecord(totalRecords);
    }
    return;
  };

  useEffect(() => {
    const saveAutoFilData = () => {
      if (customAttrs?.allowFill) {
        if (
          (Array.isArray(options) && options.length < 1 )
          || 
          !value
          ) {
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
        if (compareObjectsNotNull({ ...data }, autoFill[`${formCode}_${name}`])) {
          return;
        }
        const newFilledValue = { [`${formCode}_${name}`]: { ...data } };
        dispatch(setAutoFillValue(newFilledValue));  
      }
    };
    saveAutoFilData();
  }, [value,options]);

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
      if (options.length >= totalRecord || (totalRecord && totalRecord < 1)) {
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
      setOptions(prev => [
        ...prev,
        ...formatListObjToOptions(source, {
          fieldValue: selectOption?.fieldValue,
          fieldLabel: selectOption?.fieldLabel,
        }),
      ]);
      setTotalRecord(totalRecords);
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
        { ...queryUrl, globalTerm: inputValue },
        "",
      );
      setOptionsUrl(customUrl);
      const { totalRecords, source, page } = await dispatch(
        getListOptionsDropdown(customUrl),
      );
      setOptions(prev => [
        ...prev,
        ...formatListObjToOptions(source, {
          fieldValue: selectOption?.fieldValue,
          fieldLabel: selectOption?.fieldLabel,
        }),
      ]);
      setTotalRecord(totalRecords);
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
    <Fragment>
      {!!label ? (
        <label
          className={
            isRequired ? classes.requiredInputLabel : classes.inputLabel
          }
        >
          {label}
        </label>
      ) : (
        <></>
      )}
      <Box
        key={`${name.replace(/\s+/g, "_")}-${fieldIndex}`}
        
        ref={anchorRef}
      >
      <Autocomplete
        PopperComponent={PaperComponent}
        id={`autocomplete-${name ?? ""}-${fieldIndex ?? ""}`}
        ListboxProps={{ onScroll: handleScroll }}
        options={options || []}
        value={options?.find(option => option.value == value) || null}
        onChange={(event, optVal, reason) => {
          onChangeValue(optVal?.value ?? null);
        }}
        filterOptions={(options, state) => {
          const displayOptions = options.filter(
            option =>
              option?.text &&
              option?.text
                .toLowerCase()
                .trim()
                .includes(state.inputValue.toLowerCase().trim()),
          );
          if (displayOptions.length < 1) {
            setSearchValue(prev =>
              state.inputValue !== prev ? state.inputValue : prev,
            );
            return [];
          } else {
            return displayOptions;
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
          isOptionEqualToValue={(option, value) => {
            return option?.value === value?.value;
          }}
        // onInputChange={(_e, value) => {
        //   if (onInputChange) {
        //     onInputChange(value);
        //   }
        // }}
        disabled={isDisabled || disabledDropdown()}
        fullWidth
        className={isDisabled || disabledDropdown() ? classes.select :classes.select }
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
          open={open}
          onOpen={() => {
            setOpen(true);
            setIsLoading(false);
          }}
          onClose={() => {
            setOpen(false);
            setIsLoading(false);
          }}
      />
      </Box>
    </Fragment>
  );
};
const AutocompleteAccounting = React.memo(AutocompleteAccountingComponent);
export { AutocompleteAccounting };
