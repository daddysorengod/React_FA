// --- IMPORT FROM OTHER LIB -------------
import useTranslation from "next-translate/useTranslation";

// --- IMPORT FROM REACT, MRT -------------
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import MaterialReactTable, {
  type MRT_ColumnDef,
  MRT_Cell,
  MRT_ColumnPinningState,
} from "material-react-table";

// --- IMPORT FROM MUI -------------
import {
  Box,
  Tooltip,
  useMediaQuery,
  useTheme,
  InputAdornment,
  TextField,
  Autocomplete,
  MenuItem,
  IconButton,
  Checkbox,
} from "@mui/material";

import { useStyles } from "../BaseEditableTable/BaseEditableTable.styles";
import { BaseTableFooter } from "../BaseTableFooter";
import { BaseConfirmModal } from "@/src/components";
// ---- IMPORT FROM HELPER, CONSTANT, TYPE --------------
import {
  COLUMN_OPTIONS_INTERFACE,
  FETCH_DATA_API_CONFIG_INTERFACE,
  ParamObject,
  TABLE_OPTIONS_INTERFACE,
  TABLE_SELECT_OPTIONS_FIELD_CONFIG,
} from "@/src/types/generic-table";
import {
  API_ACTION,
  CO_TYPE,
  CO_ALIGN,
  LIST_PAGINATION_OPTIONS,
  CO_EDIT_TYPE,
  TABLE_TYPE,
  CO_FILTER_TYPE,
  VC_TYPE,
} from "@/src/constants/generic-table";
import {
  formatOrganizeProviderRoles,
  isTimeValidHHMMSS,
  getListDataBase,
  getFetchDataConfig,
  getValidateInfo,
} from "@/src/helpers";

// --- IMPORT FROM STORE ------------
import { useDispatch } from "@store/store";
import { insertOrUpdateRecord } from "@/src/store/reducers/general";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { ITabConfig } from "@/src/constants/formConfigFiles";
import { ImagesSvg } from "@/src/constants/images";
import { getTableSelectOptions } from "@/src/store/reducers/tableSelectOptions";
import { TABLE_SELECT_OPTIONS, VALIDATION_INTERFACE } from "@/src/types";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { ValidationErrorTootip } from "../../BuiltFormComponent/ValidationErrorTootip";
import { BaseTextField } from "../../BaseTextField";

interface Props {
  tableOptions: TABLE_OPTIONS_INTERFACE;
  parentId?: string;
  source: any[];
  nameKey?: string;
  labelNameKey?: string;
  listOfRecordKey: string;
}

const BaseFixImportedDataTableComponent = forwardRef(
  (props: Props, ref): JSX.Element => {
    const { t } = useTranslation();
    const classes = useStyles();
    const {
      tableOptions,
      parentId,
      source,
      nameKey,
      labelNameKey,
      listOfRecordKey,
    } = props;

    useImperativeHandle(ref, () => ({
      onSubmitRef() {
        if (validateAllCell() && handleValidateTitle(title)) {
          const submitData = {
            ...{
              [listOfRecordKey || "data"]: dataTable.source,
            },
            ...(!!nameKey ? { [nameKey]: title } : {}),
          };
          return submitData;
        }
        return null;
      },
    }));

    const dispatch = useDispatch();

    const [dataTable, setDataTable] = useState<ParamObject>({
      source: [],
      totalRecords: 0,
    });
    const [title, setTitle] = useState<string>("");
    const [titleValidationError, setTitleValidationError] =
      useState<string>("");

    const [selectOptionsListField, setSelectOptionsListField] = useState<{
      [key: string]: TABLE_SELECT_OPTIONS;
    }>({});

    // Responsive
    const theme = useTheme();
    const xxlScreen = useMediaQuery(theme.breakpoints.up(1890));
    const xlScreen = useMediaQuery(theme.breakpoints.up("xl"));
    const [sizeScreen, setSizeScreen] = useState(() => {
      if (xxlScreen) return "xxl";
      if (xlScreen) return "xl";
      return "lg";
    });

    useEffect(() => {
      setSizeScreen(() => {
        if (xxlScreen) return "xxl";
        if (xlScreen) return "xl";
        return "lg";
      });
    }, [xxlScreen, xlScreen]);

    const [confirmDialogOption, setConfirmDialogOption] = useState<ParamObject>(
      {
        open: false,
      },
    );

    // -------------- Data and Fetching state -----------------
    const [isError, setIsError] = useState(false);
    const [isLoadingTable, setIsLoadingTable] = useState(false);
    const [dataListColumn, setDataListColumn] = useState(
      tableOptions?.listColumn || [],
    );
    const [validationErrors, setValidationErrors] = useState<ParamObject>({});

    const [pinning, setPinning] = useState<MRT_ColumnPinningState>(() => {
      let res: { left: string[]; right: string[] } = {
        left: [],
        right: [],
      };
      const columns = (tableOptions?.listColumn || []).map(item => item.key);
      if (columns.indexOf(CO_TYPE.VALIDATE_TOOLTIP) != -1) {
        res.left.push(CO_TYPE.VALIDATE_TOOLTIP);
      }
      if (columns.indexOf(CO_TYPE.ACTION_DELETE) != -1) {
        res.right.push(CO_TYPE.ACTION_DELETE);
      }
      return res;
    });

    // ----------- End Data and Fetching state -----------------

    // -------------- Function -----------------------

    const getCellValue = (
      column: COLUMN_OPTIONS_INTERFACE,
      cell: MRT_Cell<any>,
    ) => {
      switch (column.type) {
        case CO_TYPE.TEXT: {
          const value = cell.getValue();
          return value;
        }
        case CO_TYPE.ORGANIZE_PROVIDER_ROLES: {
          let cellValue = cell.getValue<any[]>();
          return formatOrganizeProviderRoles(cellValue);
        }
        case CO_TYPE.VALUE_NAME_OBJECT_ID: {
          const object = selectOptionsListField[column.key];
          const value = (object?.list || []).find(
            ele => ele[object.valueKey] === cell.row.original[column.key],
          );

          return value ? value : null;
        }
        case CO_TYPE.TIME: {
          let cellValue = cell.getValue<string>() || "";

          if (!cellValue) return cellValue;
          if (isTimeValidHHMMSS(cellValue)) {
            return cellValue;
          } else {
            return "";
          }
        }
        default: {
          return "";
        }
      }
    };

    // Handle Action
    const handleCancelDelete = () => {
      setConfirmDialogOption({
        open: false,
      });
    };

    const handleDeleteRow = (autoId: string) => {
      setConfirmDialogOption({
        open: true,
        autoId,
        title: "Bạn có đồng ý xóa bản ghi?",
      });
    };

    const deleteRow = (autoId: string) => {
      const newList = dataTable.source.filter(ele => ele.autoId !== autoId);
      setDataTable({
        ...dataTable,
        source: newList,
      });
      setConfirmDialogOption({
        open: false,
      });
    };

    const handleSubmitConfirmDialog = async () => {
      deleteRow(confirmDialogOption.autoId || "");
    };

    const getSelectOptionsListField = async (object: {
      [key: string]: TABLE_SELECT_OPTIONS_FIELD_CONFIG;
    }) => {
      let res: { [key: string]: TABLE_SELECT_OPTIONS } = {};
      for (var key in object) {
        let config: FETCH_DATA_API_CONFIG_INTERFACE = {
          url: object[key].url,
          searchTerms: [],
        };

        if (
          object[key].parentIdName &&
          parentId &&
          typeof config.searchTerms !== "undefined"
        ) {
          config.searchTerms.push({
            fieldName: object[key].parentIdName as string,
            fieldValue: parentId,
          });
        }

        const obj = await dispatch(
          getTableSelectOptions(
            config,
            object[key].nameKey,
            object[key].valueKey,
          ),
        );
        res[key] = obj;
      }
      setSelectOptionsListField(res);
    };

    const validateAllCell = () => {
      let valid = true;
      let validationErrorsTemp = { ...validationErrors };
      (dataTable?.source || []).forEach(element => {
        dataListColumn.forEach((columnOption: COLUMN_OPTIONS_INTERFACE) => {
          if (
            columnOption.type !== CO_TYPE.ACTION_DELETE &&
            columnOption.validations
          ) {
            const info = getValidateInfo(
              element[columnOption.key],
              columnOption.label,
              columnOption.validations,
            );
            if (info.error) {
              valid = false;
              validationErrorsTemp = {
                ...validationErrorsTemp,
                [element.id]: {
                  ...validationErrorsTemp[element.id],
                  [columnOption.key]: info.errorMessage,
                },
              };
            } else {
              delete validationErrorsTemp[element.id]?.[columnOption.key];
            }
          }
        });
      });
      setValidationErrors(validationErrorsTemp);

      return valid;
    };

    const handleValidateCell = (
      value: any,
      rowId: string,
      columnOptions: COLUMN_OPTIONS_INTERFACE,
    ): boolean => {
      try {
        if (!columnOptions.validations) {
          return false;
        }
        const info = getValidateInfo(
          value,
          columnOptions.label,
          columnOptions.validations,
        );
        const newValidationError = { ...validationErrors };
        if (info.error) {
          newValidationError[rowId] = {
            ...newValidationError[rowId],
            [columnOptions.key]: info.errorMessage,
          };
          setValidationErrors({ ...newValidationError });
          return false;
        } else {
          delete newValidationError[rowId]?.[columnOptions.key];
          setValidationErrors({ ...newValidationError });
          return true;
        }
      } catch (error) {
        console.log("error", error);
        return true;
      }
    };

    const handleTextFieldChange = (
      event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
      cell: MRT_Cell<any>,
      columnOption: COLUMN_OPTIONS_INTERFACE,
    ) => {
      handleValidateCell(event.target.value, cell.row.id, columnOption);
      setDataTable(prev => {
        const updatedList = [...prev.source];
        updatedList[cell.row.index][columnOption.key] = event.target.value;
        return {
          source: updatedList,
          ...prev,
        };
      });
    };

    // -------------- End Function -----------------------

    useEffect(() => {
      if (tableOptions.listColumn.length === 0) {
        return;
      }
      const asyncFunction = async () => {
        try {
          setDataListColumn(tableOptions?.listColumn || []);
          await getSelectOptionsListField(
            tableOptions?.selectOptionsListField || {},
          );
        } catch (error) {
          console.log(error);
        }
      };

      asyncFunction();
    }, [tableOptions]);

    useEffect(() => {
      setDataTable({
        ...dataTable,
        source: source,
      });
    }, [source]);

    // Set Header Table
    const columns2 = useMemo(() => {
      return dataListColumn.map((item: COLUMN_OPTIONS_INTERFACE) => {
        return {
          accessorKey: item.key,
          header: item.label,
          type: item.type,
          minSize: item.minSize[sizeScreen],
          maxSize: item.maxSize[sizeScreen],
          size: item.size[sizeScreen],
          enableClickToCopy: item.enableClickToCopy,
          enableResizing: !(
            item.type === CO_TYPE.SETTING || item.type === CO_TYPE.WORK_FOLLOW
          ),
          enableSorting: item.enableSorting,
          enableColumnOrdering: item.enableColumnOrdering,
          enableHiding: item.enableHiding,
          positionActionsColumn: "last",
          debugColumns: true,
          Header: cell => (
            <Box>{item.key !== CO_TYPE.SETTING ? item.label : ""}</Box>
          ),
          Cell: ({ cell }) => {
            if (
              item.editType &&
              [
                CO_EDIT_TYPE.TEXT,
                CO_EDIT_TYPE.NUMBER,
                CO_EDIT_TYPE.EMAIL,
                CO_EDIT_TYPE.TEL,
              ].includes(item.editType)
            ) {
              const errorMessage =
                validationErrors?.[cell.row.id]?.[item.key] || "";
              return (
                <TextField
                  value={dataTable.source[cell.row.index][item.key]}
                  color="primary"
                  onChange={event => {
                    handleTextFieldChange(event, cell, item);
                  }}
                  onBlur={event => {
                    handleValidateCell(event.target.value, cell.row.id, item);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {!!errorMessage ? (
                          <Tooltip
                            arrow
                            placement="bottom-end"
                            title={errorMessage}
                            className={classes.validateTootip}
                          >
                            <img src={ImagesSvg.textFieldErrorIcon} />
                          </Tooltip>
                        ) : (
                          <></>
                        )}
                      </InputAdornment>
                    ),
                  }}
                  className={classes.cellEditInput}
                  fullWidth
                />
              );
            } else if (item.editType === CO_EDIT_TYPE.SELECT) {
              const object = selectOptionsListField[
                item.key
              ] as TABLE_SELECT_OPTIONS;
              const cellValue = getCellValue(item, cell);

              return (
                <Autocomplete
                  options={object?.list || []}
                  value={cellValue}
                  onChange={(e: any, v: any) => {
                    setDataTable(prev => {
                      const updatedList = [...prev.source];
                      updatedList[cell.row.index][item.key] =
                        v?.[object.valueKey];
                      return {
                        source: updatedList,
                        ...prev,
                      };
                    });
                    handleValidateCell(v?.[object.valueKey], cell.row.id, item);
                  }}
                  getOptionLabel={option => option[object.nameKey] || ""}
                  isOptionEqualToValue={(option, value) =>
                    option[object.valueKey] === value[object.valueKey]
                  }
                  clearOnBlur={true}
                  renderOption={(props, option) => {
                    return (
                      <MenuItem {...props}>
                        {option[object.nameKey] ? option[object.nameKey] : ""}
                      </MenuItem>
                    );
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      onChange={event => {
                        if (event.target.value === "") {
                          handleValidateCell(
                            event.target.value,
                            cell.row.id,
                            item,
                          );
                        }
                      }}
                      onBlur={event => {
                        if (event.target.value === "") {
                          handleValidateCell(
                            event.target.value,
                            cell.row.id,
                            item,
                          );
                        }
                      }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            <InputAdornment position="end">
                              {validationErrors?.[cell.row.id]?.[item.key] ? (
                                <Tooltip
                                  arrow
                                  placement="bottom-end"
                                  title={
                                    validationErrors[cell.row.id][item.key]
                                  }
                                  className={classes.autoValidateTootip}
                                >
                                  <img src={ImagesSvg.textFieldErrorIcon} />
                                </Tooltip>
                              ) : (
                                <></>
                              )}
                            </InputAdornment>
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      color="primary"
                      className={classes.cellEditAutocomplete}
                      fullWidth
                    />
                  )}
                />
              );
            } else if (item.editType === CO_EDIT_TYPE.DATE) {
              const defaultValue = getCellValue(item, cell);
              const formatStr = "DD/MM/YYYY";
              return (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    defaultValue={defaultValue}
                    onChange={newValue => {
                      const parseValue = moment(newValue);
                      const value = parseValue.isValid()
                        ? parseValue.format("MM/DD/YYYY")
                        : "";

                      setDataTable(prev => {
                        const updatedList = [...prev.source];
                        updatedList[cell.row.index][item.key] = value;

                        return {
                          source: updatedList,
                          ...prev,
                        };
                      });

                      handleValidateCell(value, cell.row.id, item);
                    }}
                    slotProps={{
                      textField: {
                        InputProps: {
                          onBlur: event => {
                            handleValidateCell(
                              event.target.value === formatStr
                                ? ""
                                : event.target.value,
                              cell.row.id,
                              item,
                            );
                          },
                        },
                      },
                    }}
                    format={formatStr}
                    minDate={moment().subtract(200, "years")}
                    maxDate={moment().add(200, "years")}
                    className={classes.datePicker}
                  />
                  <span
                    style={{
                      position: "relative",
                    }}
                  >
                    {validationErrors?.[cell.row.id]?.[item.key] ? (
                      <Tooltip
                        arrow
                        placement="bottom-end"
                        title={validationErrors[cell.row.id][item.key]}
                        className={classes.datepickerValidateTootip}
                      >
                        <img src={ImagesSvg.textFieldErrorIcon} />
                      </Tooltip>
                    ) : (
                      <></>
                    )}
                  </span>
                </LocalizationProvider>
              );
            } else if (item.editType === CO_EDIT_TYPE.TIME) {
              const cellValue = getCellValue(item, cell);
              const defaultValue = cellValue
                ? moment(cellValue, "HH:mm:ss")
                : null;
              const formatStr = "hh:mm";
              return (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <TimePicker
                    value={defaultValue}
                    onChange={(time: moment.Moment | null) => {
                      let value;
                      if (time) {
                        let parsedTime = moment(time).format("HH:mm:ss");
                        value = parsedTime;
                      } else {
                        value = "";
                      }
                      setDataTable(prev => {
                        const updatedList = [...prev.source];
                        updatedList[cell.row.index][item.key] = value;
                        return {
                          source: updatedList,
                          ...prev,
                        };
                      });
                    }}
                    slotProps={{
                      textField: {
                        InputProps: {
                          onBlur: event => {
                            handleValidateCell(
                              event.target.value === formatStr
                                ? ""
                                : event.target.value,
                              cell.row.id,
                              item,
                            );
                          },
                        },
                      },
                    }}
                    ampm={false}
                    timeSteps={{ hours: 1, minutes: 1 }}
                    className={classes.timepicker}
                  />
                  <span
                    style={{
                      position: "relative",
                    }}
                  >
                    {validationErrors?.[cell.row.id]?.[item.key] ? (
                      <Tooltip
                        arrow
                        placement="bottom-end"
                        title={validationErrors[cell.row.id][item.key]}
                        className={classes.datepickerValidateTootip}
                      >
                        <img src={ImagesSvg.textFieldErrorIcon} />
                      </Tooltip>
                    ) : (
                      <></>
                    )}
                  </span>
                </LocalizationProvider>
              );
            } else if (item.type === CO_TYPE.ACTION_DELETE) {
              return (
                <Tooltip title={"Xóa"} arrow>
                  <IconButton
                    size="small"
                    aria-label="delete"
                    color="error"
                    onClick={() => {
                      handleDeleteRow(cell.row.original.autoId);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              );
            } else if (item.type === CO_TYPE.VALIDATE_TOOLTIP) {
              const str = (cell.row.original.errorMessages || [])
                .map(ele => ele.message)
                .join(", ");
              return (
                <>
                  {!!str ? (
                    <ValidationErrorTootip
                      error={true}
                      errorMessage={str}
                      className={undefined}
                    />
                  ) : (
                    <img src="/svg/valid-check.svg" alt="vaid-data" />
                  )}
                </>
              );
            }
            return "";
          },
          muiTableHeadCellProps: {
            align: item.align,
            sx: {
              padding: "8px 0px 8px 12px !important",
              "& .Mui-TableHeadCell-Content": {
                justifyContent:
                  item.align == CO_ALIGN.LEFT
                    ? ""
                    : item.align == CO_ALIGN.RIGHT
                    ? "end"
                    : "center",
                "& .Mui-TableHeadCell-Content-Labels": {
                  marginRight:
                    item.align == CO_ALIGN.LEFT
                      ? ""
                      : item.align == CO_ALIGN.RIGHT
                      ? "12px"
                      : "",
                  "& .Mui-TableHeadCell-Content-Wrapper": {
                    paddingLeft:
                      item.align == CO_ALIGN.LEFT
                        ? ""
                        : item.align == CO_ALIGN.RIGHT
                        ? "2px"
                        : "",
                  },
                },
              },
            },
          },
          muiTableBodyCellProps: {
            align: item.align,
            sx: {
              padding: "0 !important",
            },
          },
        };
      }) as MRT_ColumnDef<any>[];
    }, [
      dataListColumn,
      selectOptionsListField,
      dataTable.source,
      sizeScreen,
      validationErrors,
      isLoadingTable,
    ]);

    const handleTitleChange = event => {
      setTitle(event.target.value);
      handleValidateTitle(event.target.value);
    };

    const handleValidateTitle = (value): boolean => {
      if(!nameKey) {
        return true;
      }
      
      const validateConfig: VALIDATION_INTERFACE = {
        requiredValidate: true,
        lengthValidate: true,
        maxLength: 255,
      };
      const info = getValidateInfo(
        value,
        "Tên kết quả giao dịch CCQ",
        validateConfig,
      );

      setTitleValidationError(info.error ? info.errorMessage : "");

      return !info.error;
    };

    return (
      <Box className={classes.childTableGeneric}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          {!!nameKey ? (
            <>
              <Box>
                <BaseTextField
                  value={title}
                  label={labelNameKey || "Tên"}
                  required
                  onChange={handleTitleChange}
                  onBlur={() => {
                    handleValidateTitle(title);
                  }}
                  fullWidth
                  error={!!titleValidationError}
                  errorMessage={titleValidationError}
                />
              </Box>
            </>
          ) : (
            <></>
          )}
          <Box className={classes.checkBox}>
            <Checkbox
              id={`show-error`}
              // checked={showError}
              // onChange={event => {
              //   setShowError(event.target.checked);
              // }}
            />
            <label htmlFor={`show-error`}>
              {"Chỉ hiển thị dòng chứa dữ liệu lỗi"}
            </label>
          </Box>
        </Box>
        <MaterialReactTable
          columns={columns2}
          data={dataTable?.source || []}
          state={{
            showSkeletons: isLoadingTable,
            columnPinning: pinning,
          }}
          getRowId={row => row?.autoId?.toString()}
          enablePinning={true}
          enableTopToolbar={false}
          enableBottomToolbar={true}
          enableColumnActions={false}
          enableStickyHeader={true}
          enablePagination={true}
          localization={MRT_Localization_VI}
          muiTablePaginationProps={{
            rowsPerPageOptions: LIST_PAGINATION_OPTIONS,
            showFirstButton: true,
            showLastButton: true,
          }}
          renderBottomToolbar={({ table }) => <BaseTableFooter table={table} />}
          muiToolbarAlertBannerProps={
            isError
              ? {
                  color: "error",
                  children: "Không lấy được dữ liệu",
                }
              : undefined
          }
        />

        <BaseConfirmModal
          icon={""}
          title={confirmDialogOption?.title || ""}
          content={""}
          textSubmit={"Có"}
          textClose={"Không"}
          visible={confirmDialogOption?.open ?? false}
          onClose={handleCancelDelete}
          onSubmit={handleSubmitConfirmDialog}
        />

        <style lang="scss">
          {`.MuiPickersLayout-contentWrapper {
                .MuiMultiSectionDigitalClock-root::-webkit-scrollbar {
                  width: 0;
                }
              }
              .MuiMultiSectionDigitalClock-root::after {
                height: 0;
              }      
            `}
        </style>
      </Box>
    );
  },
);
const BaseFixImportedDataTable = React.memo(BaseFixImportedDataTableComponent);
export { BaseFixImportedDataTable };
