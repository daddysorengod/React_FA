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
  type MRT_Icons,
  MRT_PaginationState,
  MRT_SortingState,
  MRT_Cell,
} from "material-react-table";

// --- IMPORT FROM MUI -------------
import {
  Box,
  Tooltip,
  IconButton,
  useMediaQuery,
  useTheme,
  InputAdornment,
  TextField,
  Autocomplete,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  DragIndicator as DragIndicatorIcon,
  DashboardCustomize as DashboardCustomizeIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

// --- IMPORT FROM COMPONENT -----------------
import { useStyles } from "./BaseEditableTable.styles";
import { BaseEditableTableHeader } from "./BaseEditableTableHeader";
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
  EXPORT_EXCEL_TYPE,
} from "@/src/constants/generic-table";
import {
  formatDate,
  formatNumber,
  formatOrganizeProviderRoles,
  isTimeValidHHMMSS,
  getFetchDataConfig,
  getListDataBase,
  getValidateInfo,
  formatOnChangeNumberValueToString,
  formatNumberValueToString,
  formatNumberStringToNumber,
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
import { TABLE_SELECT_OPTIONS } from "@/src/types";
import { DynamicObject } from "@/src/types/field";
import { BaseTextField } from "../../BaseTextField";
import { BaseAutocomplete } from "../../BaseAutocomplete";
interface Props {
  onlyShow: boolean;
  tableOptions: TABLE_OPTIONS_INTERFACE;
  parentId?: string;
  formSettingSubmitStep?: ITabConfig;
  entryProp?: {
    [key: string]: any;
  };
}

const BaseEditableTableComponent = forwardRef(
  (
    {
      onlyShow,
      tableOptions,
      parentId,
      formSettingSubmitStep,
      entryProp,
    }: Props,
    ref,
  ): JSX.Element => {
    const { t } = useTranslation();
    const classes = useStyles();

    // --- STORE ----
    const dispatch = useDispatch();

    const [dataTable, setDataTable] = useState<ParamObject>({
      source: [],
      totalRecords: 0,
    });
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

    // --- END STORE ---

    // -------------- Data and Fetching state -----------enableEditingitem------
    const [isError, setIsError] = useState(false);
    const [isLoadingTable, setIsLoadingTable] = useState(false);
    const [dataListColumn, setDataListColumn] = useState(
      tableOptions?.listColumn || [],
    );
    const [validationErrors, setValidationErrors] = useState<ParamObject>({});

    // ----------- End Data and Fetching state -----------------

    // ---------------- Table state ------------------------
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const [pagination, setPagination] = useState<MRT_PaginationState>({
      pageIndex: 0,
      pageSize: 20,
    });

    const [initialVisibleColumns, setInitialVisibleColumns] = useState(() => {
      if (tableOptions?.enableEditing && !onlyShow) {
        return {};
      } else {
        const column = (tableOptions?.listColumn || []).find(
          ele => ele.key == CO_TYPE.ACTION_DELETE,
        );
        if (column) {
          return {
            [column.type]: false,
          };
        } else return {};
      }
    });

    // Icon Table
    const iconsTable: Partial<MRT_Icons> = {
      DragHandleIcon: () => <DragIndicatorIcon />,
      MoreVertIcon: () => <ArrowDropDownIcon />,
      ViewColumnIcon: () => (
        <DashboardCustomizeIcon
          sx={{ color: "#04A857", bgcolor: "#DDF6E8", borderRadius: "4px" }}
        />
      ),
    };

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
              item?.enableEditing &&
              tableOptions?.enableEditing &&
              !onlyShow &&
              item.editType
            ) {
              if (
                [
                  CO_EDIT_TYPE.TEXT,
                  CO_EDIT_TYPE.NUMBER,
                  CO_EDIT_TYPE.EMAIL,
                  CO_EDIT_TYPE.TEL,
                ].includes(item.editType)
              ) {
                return (
                  <BaseTextField
                    value={dataTable.source[cell.row.index][item.key]}
                    onChange={event => {
                      handleTextFieldChange(event, cell, item);
                    }}
                    onBlur={event => {
                      handleValidateCell(event.target.value, cell.row.id, item);
                    }}
                    error={!!validationErrors?.[cell.row.id]?.[item.key]}
                    errorMessage={validationErrors?.[cell.row.id]?.[item.key]}
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
                  <BaseAutocomplete
                    options={object?.list || []}
                    value={cellValue}
                    valueKey={object?.valueKey || ""}
                    labelKey={object?.nameKey || ""}
                    onChange={value => {
                      handleAutocompleteChange(value, cell, item);
                    }}
                    onBlur={() => {
                      handleValidateCell(cellValue, cell.row.id, item);
                    }}
                    error={!!validationErrors?.[cell.row.id]?.[item.key]}
                    errorMessage={validationErrors?.[cell.row.id]?.[item.key]}
                    className={classes.cellEditAutocomplete}
                    fullWidth
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
              }
              return "";
            } else {
              switch (item.type) {
                case CO_TYPE.ACTION_DELETE: {
                  return (
                    <Tooltip title={"Xóa"} arrow>
                      <IconButton
                        size="small"
                        aria-label="delete"
                        color="error"
                        onClick={() => {
                          handleDeleteRow(cell.row.original.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  );
                }
                case CO_TYPE.DATE: {
                  let cellValue: any = cell.getValue();
                  return formatDate(cellValue);
                }
                case CO_TYPE.NUMBER: {
                  let cellValue = cell.getValue();
                  return formatNumber(cellValue);
                }
                case CO_TYPE.TEXT: {
                  return getCellValue(item, cell);
                }
                case CO_TYPE.ORGANIZE_PROVIDER_ROLES: {
                  return getCellValue(item, cell);
                }
                case CO_TYPE.VALUE_NAME_OBJECT_ID: {
                  return getCellValue(item, cell);
                }
                default: {
                  return <></>;
                }
              }
            }
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
              padding:
                tableOptions?.enableEditing && !onlyShow
                  ? item?.enableEditing ||
                    [CO_TYPE.SETTING, CO_TYPE.ACTION_DELETE].includes(item.type)
                    ? "0 !important"
                    : "6px 8px !important"
                  : ![CO_TYPE.SETTING, CO_TYPE.ACTION_DELETE].includes(
                      item.type,
                    )
                  ? "6px 8px !important"
                  : "0 !important",
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

    // ---------------- End Table state ------------------------

    // -------------- Function -----------------------

    const getCellValue = (
      column: COLUMN_OPTIONS_INTERFACE,
      cell: MRT_Cell<any>,
    ) => {
      switch (column.type) {
        case CO_TYPE.DATE: {
          let cellValue = cell.getValue<string>() || "";
          if (
            tableOptions?.enableEditing &&
            column.enableEditing &&
            !onlyShow
          ) {
            if (!cellValue) {
              return cellValue;
            }
            const parsedDate = moment(cellValue);
            if (parsedDate.isValid()) {
              return parsedDate;
            }
            return "";
          } else {
            if (!cellValue) {
              return "";
            }
            return new Date(cellValue).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
          }
        }
        case CO_TYPE.NUMBER: {
          let cellValue = cell.getValue<number | string>();
          if (!cellValue) return "";
          if (cellValue == 0) return 0;
          if (typeof cellValue === "number" || /^\d+$/.test(cellValue)) {
            return cellValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          } else {
            return Number(cellValue).toLocaleString("vi-VN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
          }
        }
        case CO_TYPE.TEXT: {
          let levelRol = cell?.row?.original?.level;
          let levelCol = column?.styleColLevel ?? "";
          // console.log(column, cell);
          // console.log(levelRol, levelCol);
          const value = cell.getValue();
          return (
            <Typography
              className={`${
                levelRol == 1 && levelCol == 1 ? classes.textDeco : ""
              } ${levelRol == 2 && levelCol == 1 ? classes.textItalic : ""} ${
                levelCol ? classes.textBold : ""
              }`}
            >
              {`${value ? value : ""}`}
            </Typography>
          );
        }
        case CO_TYPE.ORGANIZE_PROVIDER_ROLES: {
          let cellValue = cell.getValue<any[]>();
          return formatOrganizeProviderRoles(cellValue);
        }
        case CO_TYPE.VALUE_NAME_OBJECT_ID: {
          if (
            tableOptions?.enableEditing &&
            column.enableEditing &&
            !onlyShow
          ) {
            return cell.row.original[column.key];
          } else {
            return (
              cell.row.original?.[column.relatedKey || column.key]?.name || ""
            );
          }
        }
        case CO_TYPE.TIME: {
          let cellValue = cell.getValue<string>() || "";
          if (
            tableOptions?.enableEditing &&
            column.enableEditing &&
            !onlyShow
          ) {
            if (!cellValue) return cellValue;
            if (isTimeValidHHMMSS(cellValue)) {
              return cellValue;
            } else {
              return "";
            }
          } else {
            if (!cellValue) return "";
            return cellValue;
          }
        }
        default: {
          return "";
        }
      }
    };

    const handleSaveCell = (cell: MRT_Cell<any>, value: any) => {
      let listData = dataTable.source;
      listData[cell.row.index][cell.column.id] = value;
      setDataTable({
        source: listData,
        totalRecords: listData.length,
      });
    };

    // Handle Action

    const handleCancelDelete = () => {
      setConfirmDialogOption({
        open: false,
      });
    };

    const handleDeleteRow = (id: string) => {
      setConfirmDialogOption({
        open: true,
        id,
        title: "Bạn có đồng ý xóa bản ghi?",
      });
    };

    const deleteRow = (id: string) => {
      const newList = dataTable.source.filter(ele => ele.id !== id);
      setDataTable({
        ...dataTable,
        source: newList,
      });
      setConfirmDialogOption({
        open: false,
      });
    };

    const handleSubmitConfirmDialog = async () => {
      deleteRow(confirmDialogOption.id || "");
    };

    const getConfigQuery = (
      typeExport?: EXPORT_EXCEL_TYPE,
      exportedColumns?: string[],
    ): FETCH_DATA_API_CONFIG_INTERFACE | false => {
      try {
        let objRoutes = typeExport
          ? tableOptions?.routes[API_ACTION.EXPORT_TO_XLSX_FILE]
          : tableOptions?.routes[API_ACTION.FETCH_DATA_URL];
        if (!objRoutes?.url) return false;

        const config = getFetchDataConfig(
          objRoutes?.url,
          undefined,
          undefined,
          objRoutes?.parentIdName && parentId
            ? {
                fieldName: objRoutes?.parentIdName || "",
                fieldValue: parentId,
              }
            : undefined,
          objRoutes?.searchTerms,
          objRoutes?.params,
          undefined,
          undefined,
          undefined,
          undefined,
          sorting,
          tableOptions?.showPagination ? pagination : undefined,
          globalFilter,
          entryProp,
          objRoutes.entryPropKeys,
        );
        return config;
      } catch (error) {
        console.log("getQuery", error);
        return false;
      }
    };

    const formatAPIData = (list: any[]): any[] => {
      const res: any[] = list.map(item => {
        const formatedItem = { ...item };
        tableOptions.listColumn.forEach(col => {
          if (col.editType === CO_EDIT_TYPE.NUMBER) {
            formatedItem[col.key] = formatNumberValueToString(item[col.key]);
          }
        });
        return formatedItem;
      });

      return res;
    };

    const formatSubmitData = (list: any[]): any[] => {
      const res: any[] = list.map(item => {
        const formatedItem = { ...item };
        tableOptions.listColumn.forEach(col => {
          if (col.editType === CO_EDIT_TYPE.NUMBER) {
            formatedItem[col.key] = formatNumberStringToNumber(item[col.key]);
          }
        });
        return formatedItem;
      });

      return res;
    };

    // Get data
    const getData = async () => {
      try {
        const config = getConfigQuery();
        if (config) {
          const res = await getListDataBase(config);
          setDataTable({ ...res, source: formatAPIData(res?.source || []) });
        }
        setIsError(false);
        setIsLoadingTable(false);
      } catch (error) {
        setDataTable({});
        console.log(error);
        setIsError(true);
        setIsLoadingTable(false);
      }
    };
    const mergeDataSource = (data, temp) => {
      let dataSource = data;
      let tempSource = temp;
      tempSource.forEach(tempSourceItem => {
        const found = dataSource.find(
          dataSourceItem => dataSourceItem.id === tempSourceItem.id,
        );
        if (!found && tempSourceItem.id) {
          dataSource.unshift(tempSourceItem);
        }
      });
      return { dataSource: dataSource };
    };

    const handleRefresh = async () => {
      setIsLoadingTable(true);
      await getData();
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

    function generateUniqueId() {
      const randomId = "new-item-" + Math.random().toString(36).substr(2, 9);
      const existingIds = (dataTable?.source || []).map(item => item.id);
      if (existingIds.includes(randomId)) {
        return generateUniqueId();
      }
      return randomId;
    }

    const handleAddNewRow = () => {
      let newItem: ParamObject = {};
      (tableOptions?.listColumn || []).forEach(
        (item: COLUMN_OPTIONS_INTERFACE) => {
          if (![CO_TYPE.ACTION_DELETE].includes(item.type)) {
            newItem[item.key] = "";
          }
        },
      );

      let objRoutes = tableOptions?.routes[API_ACTION.FETCH_DATA_URL];

      if (parentId && objRoutes?.parentIdName) {
        newItem[objRoutes?.parentIdName] = parentId;
      }

      const newId = generateUniqueId();
      newItem.id = newId;
      let count = dataTable.totalRecords + 1;
      setDataTable({
        totalRecords: count,
        source: [newItem, ...(dataTable?.source || [])],
      });
    };

    const validateAllCell = async () => {
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

    const formatInputValue = (
      event: React.ChangeEvent<any>,
      cell: MRT_Cell<any>,
      columnOption: COLUMN_OPTIONS_INTERFACE,
    ) => {
      if (columnOption.editType === CO_EDIT_TYPE.NUMBER) {
        return formatOnChangeNumberValueToString(
          event,
          dataTable.source[cell.row.index][columnOption.key],
        );
      } else return (event as React.ChangeEvent<HTMLInputElement>).target.value;
    };

    const handleTextFieldChange = (
      event: React.ChangeEvent<any>,
      cell: MRT_Cell<any>,
      columnOption: COLUMN_OPTIONS_INTERFACE,
    ) => {
      const formatedValue = formatInputValue(event, cell, columnOption);

      setDataTable(prev => {
        const updatedList = [...prev.source];
        updatedList[cell.row.index][columnOption.key] = formatedValue;
        return {
          source: updatedList,
          ...prev,
        };
      });
      handleValidateCell(formatedValue, cell.row.id, columnOption);
    };

    const handleAutocompleteChange = (
      value: any,
      cell: MRT_Cell<any>,
      columnOption: COLUMN_OPTIONS_INTERFACE,
    ) => {
      setDataTable(prev => {
        const updatedList = [...prev.source];
        updatedList[cell.row.index][columnOption.key] = value;
        return {
          source: updatedList,
          ...prev,
        };
      });
      handleValidateCell(value, cell.row.id, columnOption);
    };

    // -------------- End Function -----------------------

    useEffect(() => {
      if (tableOptions.listColumn.length === 0) {
        return;
      }
      const asyncFunction = async () => {
        try {
          setGlobalFilter("");
          setDataListColumn(tableOptions?.listColumn || []);
          setPagination({
            pageIndex: 0,
            pageSize: 10,
          });
          setSorting([]);
          await getSelectOptionsListField(
            tableOptions?.selectOptionsListField || {},
          );
        } catch (error) {
          console.log(error);
        }
      };

      asyncFunction();
    }, [tableOptions, JSON.stringify(entryProp || {})]);

    useEffect(() => {
      setIsLoadingTable(true);
      if (parentId && tableOptions.listColumn.length > 0) {
        getData();
      } else {
        setIsLoadingTable(false);
      }
    }, [pagination, sorting, globalFilter]);

    useImperativeHandle(ref, () => ({
      async onSubmitTableRef(submitData) {
        try {
          const isValid = await validateAllCell();
          if (!isValid) {
            return;
          }
          const body = dataTable.source.map((item, index) => {
            if (item.id.startsWith("new-item-")) {
              const { id, ...otherValue } = item;
              return { ...submitData, ...otherValue };
            } else {
              return { ...submitData, ...item };
            }
          });

          if (body === undefined || body.length < 1) {
            return true;
          }
          const response = await dispatch(
            insertOrUpdateRecord({
              url: formSettingSubmitStep?.apiSubmit?.url,
              params: formatSubmitData(body),
            }),
          );

          if (response) {
            return true;
          }
          return false;
        } catch (error) {}
      },
      async onSubmitFinishRef(submitData: DynamicObject) {
        try {
          const isValid = validateAllCell();
          if (!isValid) {
            return;
          }
          const body = dataTable.source.map((item, index) => {
            if (item.id.startsWith("new-item-")) {
              const { id, ...otherValue } = item;
              return { ...otherValue };
            } else {
              return { ...item };
            }
          });
          const titleSubmit = formSettingSubmitStep?.fieldName;
          if (!titleSubmit) {
            return { ...submitData };
          }
          return { [titleSubmit]: [...body], ...submitData };
        } catch (error) {}
      },
      handleUnFocus() {
        // handleUnFocus
      },
      async onSaveValueRef() {
        try {
          const isValid = validateAllCell();
          if (!isValid) {
            return;
          }
          const titleSubmit = formSettingSubmitStep?.apiSubmit?.idName;
          if (!titleSubmit) {
            return { ...getTableValues() };
          }
          return { [titleSubmit]: [...getTableValues()] };
        } catch (error) {
          return null;
        }
      },
      async saveLocalForm() {
        try {
          return saveLocalTableValue();
        } catch (error) {
          return null;
        }
      },
      async handleRefreshRef() {
        try {
          handleRefresh();
          return true;
        } catch (error) {
          return null;
        }
      },
      handleSubmitDataRef() {
        const isValid = validateAllCell();
        if (!isValid) {
          return;
        }
        const body = dataTable.source.map((item, index) => {
          if (item.id.startsWith("new-item-")) {
            const { id, ...otherValue } = item;
            return { ...otherValue };
          } else {
            return { ...item };
          }
        });

        if (body?.length > 0) {
          return body;
        }

        return [];
      },
    }));

    const getTableValues = () => {
      const body = dataTable.source.map((item, index) => {
        if (item.id.startsWith("new-item-")) {
          delete item["action-delete"];
          const { id, ...otherValue } = item;
          return { ...otherValue };
        } else {
          delete item["action-delete"];
          return { ...item };
        }
      });
      return { ...body };
    };

    const saveLocalTableValue = () => {
      return [...dataTable.source];
    };

    return (
      <Box className={classes.childTableGeneric}>
        <Box>
          <MaterialReactTable
            columns={columns2}
            data={dataTable?.source || []}
            rowCount={dataTable?.totalRecords || 0}
            state={{
              pagination: pagination,
              globalFilter: globalFilter,
              sorting: sorting,
              showSkeletons: isLoadingTable,
              showGlobalFilter: tableOptions?.showGlobalFilter && onlyShow,
              columnVisibility: initialVisibleColumns,
            }}
            icons={iconsTable}
            getRowId={row => row?.id?.toString()}
            onPaginationChange={setPagination}
            onGlobalFilterChange={setGlobalFilter}
            enableTopToolbar={tableOptions?.enableTopToolbar}
            enableBottomToolbar={tableOptions?.enableBottomToolbar}
            enableColumnActions={false}
            enableSorting={tableOptions?.enableSorting}
            onSortingChange={setSorting}
            enableStickyHeader={tableOptions?.enableStickyHeader}
            manualPagination={true}
            enablePagination={tableOptions.enablePagination}
            globalFilterFn="contains"
            localization={MRT_Localization_VI}
            muiTablePaginationProps={{
              rowsPerPageOptions: LIST_PAGINATION_OPTIONS,
              showFirstButton: true,
              showLastButton: true,
            }}
            muiSearchTextFieldProps={{
              placeholder: "Tìm kiếm",
              sx: {
                "& .MuiSvgIcon-root": { fontSize: "22px" },
                "& input": { padding: "8px", fontSize: "14px" },
                "& .MuiOutlinedInput-notchedOutline": {},
              },
              variant: "outlined",
            }}
            renderTopToolbar={({ table }) => (
              <Box>
                {true ? (
                  <BaseEditableTableHeader
                    table={table}
                    tableTitle={tableOptions?.tableTitle || ""}
                    onlyShow={onlyShow}
                    showAddNewButton={tableOptions?.showAddNewButton || false}
                    showRefreshButton={tableOptions?.showRefreshButton || false}
                    onAddNewRow={handleAddNewRow}
                    onRefresh={handleRefresh}
                  />
                ) : (
                  <></>
                )}
              </Box>
            )}
            renderBottomToolbar={({ table }) => (
              <BaseTableFooter table={table} />
            )}
            muiToolbarAlertBannerProps={
              isError
                ? {
                    color: "error",
                    children: "Không lấy được dữ liệu",
                  }
                : undefined
            }
          />
        </Box>

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
const BaseEditableTable = React.memo(BaseEditableTableComponent);
export { BaseEditableTable };
