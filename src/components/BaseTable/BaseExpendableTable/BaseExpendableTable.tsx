// --- IMPORT FROM OTHER LIB -------------
import useTranslation from "next-translate/useTranslation";

// --- IMPORT FROM REACT, MRT -------------
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { MRT_Localization_VI } from "material-react-table/locales/vi";
import MaterialReactTable, {
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
  type MRT_Icons,
  MRT_PaginationState,
  MRT_SortingState,
  MRT_ColumnOrderState,
  MRT_ColumnPinningState,
  MRT_ExpandedState,
  MRT_Cell,
} from "material-react-table";

// --- IMPORT FROM MUI -------------
import { Box, useTheme, useMediaQuery } from "@mui/material";
import {
  DragIndicator as DragIndicatorIcon,
  DashboardCustomize as DashboardCustomizeIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";

// ---- IMPORT FROM HELPER, CONSTANT, TYPE --------------
import {
  COLUMN_OPTIONS_INTERFACE,
  FETCH_DATA_API_CONFIG_INTERFACE,
  ParamObject,
  ROW_ACTION_INTERFACE,
  TABLE_OPTIONS_INTERFACE,
  TABLE_ROUTE_INTERFACE,
  TABLE_SELECT_OPTIONS,
  TABLE_SELECT_OPTIONS_FIELD_CONFIG,
} from "@/src/types/generic-table";
import axios from "@/src/helpers/axios";
import { api } from "@/src/constants/api";
import {
  RS_TYPE,
  API_ACTION,
  RS_ACTION_TYPE,
  LIST_PAGINATION_OPTIONS,
  CO_TYPE,
  CO_ALIGN,
  CO_FILTER_TYPE,
  RS_METHOD,
  EXPORT_EXCEL_TYPE,
} from "@/src/constants/generic-table";
import {
  formatDate,
  formatNumber,
  formatOrganizeProviderRoles,
  formatValueNameObject,
  getListDataBase,
} from "@/src/helpers";
import { setIsLoading } from "@/src/store/reducers/menu";
import { getFetchDataConfig } from "@/src/helpers/dynamic-table";

// --- IMPORT FROM STORE ------------
import { openSnackbar } from "@/src/store/reducers/snackbar";
import { store, useDispatch, useSelector } from "@store/store";
import { getFileExcel } from "@app/store/reducers/general";

// --- IMPORT FROM COMPONENT -----------------
import { useStyles } from "@/src/components/BaseTable/BaseExpendableTable/BaseExpendableTable.styles";
import { BaseConfirmModal, BaseDialogCreate } from "@/src/components";
import { BaseTableHeader } from "@/src/components/BaseTable/BaseTableHeader";
import { BaseTableFooter } from "@/src/components/BaseTable/BaseTableFooter";
import { BaseTableColumnAction } from "@/src/components/BaseTable/BaseTableColumnAction";
import { IDialog, formConfigFiles } from "@/src/constants/formConfigFiles";
import { IFormType } from "@/src/types/general";
import { ImagesSvg } from "@/src/constants/images";
import { BaseTableColumnSettingMenu } from "../BaseTableColumnSettingMenu";
import { BaseTableColumnChip } from "../BaseTableColumnChip";
import { getTableSelectOptions } from "@/src/store/reducers/tableSelectOptions";
import { BaseTableColumnState } from "../BaseTableColumnState";
import { addQueryToURL, removeQueryFromURL } from "@/src/helpers/getUrlRouter";
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

interface IDispatch {
  type: string;
  payload?: any;
}

interface Props {
  tableOptions: TABLE_OPTIONS_INTERFACE;
  parentId?: string;
  submitParentData?: any;
  onlyShow?: boolean;
  selectedId?: string;
  onClickRow?: Function;
  tableLevel?: string;
  onRefreshRecord?: Function;
}

const BaseExpendableTableComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    tableOptions,
    parentId,
    submitParentData,
    onlyShow,
    onClickRow,
    selectedId,
    tableLevel,
    onRefreshRecord,
  } = props;

  // --- STORE ----
  const dispatch = useDispatch();
  const userRole = useSelector(state => state.auth.role);
  // --- END STORE ---

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

  const [currentDialogConfig, setCurrentDialogConfig] = useState<
    IDialog | undefined
  >(undefined);

  const [dialogConfigs, setDialogConfigs] = useState<{
    [key: string]: IDialog | undefined;
  }>({});

  // Object chứa các list select của các trường
  const [selectOptionsListField, setSelectOptionsListField] = useState<{
    [key: string]: TABLE_SELECT_OPTIONS;
  }>({});

  // Dữ liệu popup confirm
  const [confirmDialogOption, setConfirmDialogOption] = useState<ParamObject>({
    open: false,
  });

  // -------------- Data and Fetching state -----------------
  const [dataTable, setDataTable] = useState<ParamObject>({
    source: [],
    totalRecords: 0,
  });

  const [isError, setIsError] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [dataListColumn, setdataListColumn] = useState<
    COLUMN_OPTIONS_INTERFACE[]
  >(
    tableOptions.listColumn.filter(
      ele =>
        (ele.hiddenCondition?.roleCheck &&
          (ele.hiddenCondition?.allowedRoles || []).includes(userRole)) ||
        !ele.hiddenCondition?.roleCheck ||
        ele.type === CO_TYPE.SETTING,
    ),
  );

  const [filterParams, setFilterParams] = useState<ParamObject>(() => {
    let res: ParamObject = {};
    (tableOptions.listColumn || []).forEach(item => {
      if (
        [CO_FILTER_TYPE.MIN_MAX_DATE, CO_FILTER_TYPE.MIN_MAX_NUMBER].includes(
          item.typeFilter,
        )
      ) {
        res[item.key + "-min"] = "";
        res[item.key + "-max"] = "";
      } else if (item.type == CO_TYPE.VALUE_NAME_OBJECT) {
        res[item?.relatedKey || item.key] = "";
      } else {
        res[item.key] = "";
      }
    });

    return res;
  });

  const [listColumnObject, setListColumnObject] = useState<ParamObject>(() => {
    let res: ParamObject = {};
    (tableOptions.listColumn || []).forEach((item: any) => {
      res[item.key] = item;
    });

    return res;
  });

  // ----------- End Data and Fetching state -----------------

  // ---------------- Table state ------------------------
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: tableOptions?.defaultPageSize || 10,
  });
  const [pinning, setPinning] = useState<MRT_ColumnPinningState>(() => {
    let res: { left: string[]; right: string[] } = {
      left: [],
      right: [],
    };

    const columns = (tableOptions.listColumn || []).map(item => item.key);
    if (tableOptions.enableRowSelection) {
      res.left.push("mrt-row-select");
    } else {
      if (tableOptions.enableExpanding) {
        res.left.push("mrt-row-expand");
      }
    }
    if (columns.indexOf(CO_TYPE.SETTING) != -1) {
      res.right.push(CO_TYPE.SETTING);
    }

    return res;
  });
  const [ordering, setOrdering] = useState<MRT_ColumnOrderState>(() => {
    const res = (tableOptions.listColumn || []).map(item => item.key);
    let index = res.indexOf(CO_TYPE.ENABLED);
    if (index !== -1) {
      res.splice(index, 1);
      res.push(CO_TYPE.ENABLED);
    }
    index = res.indexOf(CO_TYPE.WORK_FOLLOW);
    if (index !== -1) {
      res.splice(index, 1);
      res.push(CO_TYPE.WORK_FOLLOW);
    }
    index = res.indexOf(CO_TYPE.SETTING);
    if (index !== -1) {
      res.splice(index, 1);
      res.push(CO_TYPE.SETTING);
    }

    if (tableOptions.enableExpanding) {
      res.unshift("mrt-row-expand");
    }

    if (tableOptions.enableRowSelection) {
      res.unshift("mrt-row-select");
    }

    return res;
  });

  const [initialVisibleColumns, setInitialVisibleColumns] = useState(() => {
    let res = {};
    (tableOptions.listColumn || []).forEach(item => {
      res[item.key] = item.visible;
    });
    return res;
  });

  // const [expandedRows, setExpendedRows] = useState<MRT_ExpandedState>({});

  // Icon Table
  const iconsTable: Partial<MRT_Icons> = {
    DragHandleIcon: () => <DragIndicatorIcon />,
    MoreVertIcon: () => <ArrowDropDownIcon />,
    ViewColumnIcon: () => (
      <DashboardCustomizeIcon
        sx={{ color: "#04A857", bgcolor: "#DDF6E8", borderRadius: "4px" }}
      />
    ),
    ExpandMoreIcon: (props: any) => {
      switch (props.style.transform) {
        case "rotate(0deg)": {
          return (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="4.75"
                y="4.75"
                width="14.5"
                height="14.5"
                rx="3.25"
                stroke="#828D9A"
                strokeWidth="1.5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 8C11.5582 8 11.2 8.35817 11.2 8.8V11.2H8.8C8.35817 11.2 8 11.5582 8 12C8 12.4418 8.35817 12.8 8.8 12.8H11.2V15.2C11.2 15.6418 11.5582 16 12 16C12.4418 16 12.8 15.6418 12.8 15.2V12.8H15.2C15.6418 12.8 16 12.4418 16 12C16 11.5582 15.6418 11.2 15.2 11.2H12.8V8.8C12.8 8.35817 12.4418 8 12 8Z"
                fill="#828D9A"
              />
            </svg>
          );
        }
        case "rotate(-180deg)": {
          return (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="16"
                y="11"
                width="1.6"
                height="8"
                rx="0.8"
                transform="rotate(90 16 11)"
                fill="#828D9A"
              />
              <rect
                x="4.75"
                y="4.75"
                width="14.5"
                height="14.5"
                rx="3.25"
                stroke="#828D9A"
                strokeWidth="1.5"
              />
            </svg>
          );
        }
        case "rotate(-90deg)": {
          return "";
        }
      }
    },
  };

  // Set Header Table
  const columns2 = useMemo(() => {
    return dataListColumn.map((item: COLUMN_OPTIONS_INTERFACE) => {
      return {
        accessorKey: item.key,
        header: item.label,
        type: item.type,
        minSize:
          item.type === CO_TYPE.SETTING && userRole === 1
            ? 100
            : item.minSize[sizeScreen],
        maxSize:
          item.type === CO_TYPE.SETTING && userRole === 1
            ? 100
            : item.maxSize[sizeScreen],
        size:
          item.type === CO_TYPE.SETTING && userRole === 1
            ? 100
            : item.size[sizeScreen],
        enableClickToCopy: item?.enableClickToCopy,
        enableResizing: !(
          item.type === CO_TYPE.SETTING || item.type === CO_TYPE.WORK_FOLLOW
        ),
        enableSorting: item.enableSorting && tableOptions.enableSorting,
        enableColumnActions:
          item.typeFilter !== CO_FILTER_TYPE.NONE && item.enableColumnActions,
        enableColumnOrdering:
          item.enableColumnOrdering && tableOptions.enableColumnOrdering,
        enableHiding: item.enableHiding,
        positionActionsColumn: "last",
        debugColumns: true,
        Header: cell => (
          <Box>{item.key !== CO_TYPE.SETTING ? item.label : ""}</Box>
        ),
        Cell: ({ cell }) => {
          switch (item.type) {
            case CO_TYPE.SETTING: {
              return (
                <BaseTableColumnSettingMenu
                  cell={cell}
                  listRowAction={tableOptions.listRowAction || []}
                  handleRowAction={handleRowAction}
                  onlyShow={onlyShow}
                  columnOption={item}
                />
              );
            }
            case CO_TYPE.WORK_FOLLOW: {
              return <BaseTableColumnState cell={cell} />;
            }
            case CO_TYPE.ENABLED: {
              return <BaseTableColumnChip columnOption={item} cell={cell} />;
            }
            case CO_TYPE.DATE: {
              let cellValue = cell.getValue<string>();
              return formatDate(cellValue);
            }
            case CO_TYPE.NUMBER: {
              let cellValue = cell.getValue<any>();
              return formatNumber(cellValue);
            }
            case CO_TYPE.TEXT: {
              const cellValue = cell.getValue<any>();
              const value =
                cellValue === null ||
                cellValue === undefined ||
                !["string", "number", "boolean"].includes(typeof cellValue)
                  ? ""
                  : cellValue;

              return item.isRootPaddingIncreasing ? (
                <Box>{value}</Box>
              ) : (
                <>{value}</>
              );
            }
            case CO_TYPE.ORGANIZE_PROVIDER_ROLES: {
              let cellValue: any = cell.getValue();
              return formatOrganizeProviderRoles(cellValue);
            }
            case CO_TYPE.VALUE_NAME_OBJECT: {
              let cellValue = cell.getValue<any>();
              return formatValueNameObject(cellValue);
            }
            case CO_TYPE.JSON_STRING: {
              let cellValue = cell.getValue<any>();
              if (!cellValue) return "";
              return (cellValue as string).substring(0, 110) + "...";
            }
            default: {
              return <></>;
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
                    ? "30px"
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
        muiTableBodyCellProps: ({ cell }) => {
          const depth = cell.row.depth;
          return {
            align: item.align,
            sx: {
              padding:
                item.type !== CO_TYPE.SETTING
                  ? item.isRootPaddingIncreasing
                    ? `8px 12px 8px 12px !important`
                    : "8px 12px !important"
                  : "0 !important",
              fontWeight:
                depth === 0 && item?.isRootBold ? "600 !important" : "400",
              display:
                depth === 0 && typeof item?.isRootFullColspan === "boolean"
                  ? item.isRootFullColspan
                    ? "table-cell"
                    : "none !important"
                  : "table-cell",
              "& .MuiBox-root": {
                position: "relative",
                left: `${depth * 20 + 12}px`,
              },
              fontSize:
                depth > 0 && item.isRootFullColspan ? "0 !important" : null,
            },
            colSpan:
              depth === 0 && item.isRootFullColspan
                ? dataListColumn.length.toString()
                : "0",
          };
        },
      };
    }) as MRT_ColumnDef<any>[];
  }, [dataListColumn, sizeScreen, selectOptionsListField]);

  // ---------------- End Table state ------------------------

  // -------------- Function -----------------------

  // Get Dialog Config
  const getDialogConfigByDialogCode = async (
    dialogCode: string,
  ): Promise<IDialog | undefined> => {
    if (!dialogCode) {
      return undefined;
    } else {
      try {
        const res = formConfigFiles[dialogCode] as IDialog;

        if (res && typeof res === "object") {
          const dialog = res as IDialog;

          if (dialog.title) {
            return res;
          }
        }
        return undefined;
      } catch (error) {
        console.log("error", error);
        return undefined;
      }
    }
  };

  const getDialogConfigs = async () => {
    const configs: {
      [key: string]: IDialog | undefined;
    } = {};
    if ((tableOptions.addNewConfig?.actions || []).length > 0) {
      for (const action of tableOptions.addNewConfig?.actions || []) {
        if (!configs[action.dialogCode]) {
          const dialogConfig = await getDialogConfigByDialogCode(
            action.dialogCode,
          );
          configs[action.dialogCode] = dialogConfig;
        }
      }
    }

    if (tableOptions.listRowAction.length) {
      for (const action of tableOptions.listRowAction) {
        if (action.dialogCode && !configs[action.dialogCode]) {
          const dialogConfig = await getDialogConfigByDialogCode(
            action.dialogCode,
          );
          configs[action.dialogCode] = dialogConfig;
        }
      }
    }

    setDialogConfigs(configs);
  };

  // Change filterParams
  const handleFilterFormChange = (newValue: object) => {
    setFilterParams({ ...filterParams, ...newValue });
  };

  // Clear filter
  const handleClearFilter = useCallback(
    (typeFilter: CO_FILTER_TYPE, key: string) => {
      if (
        [CO_FILTER_TYPE.MIN_MAX_DATE, CO_FILTER_TYPE.MIN_MAX_NUMBER].includes(
          typeFilter,
        )
      ) {
        setFilterParams({
          ...filterParams,
          [key + "-min"]: "",
          [key + "-max"]: "",
        });
      } else {
        setFilterParams({
          ...filterParams,
          [key]: "",
        });
      }
    },
    [filterParams],
  );

  // Xóa tất cả filter
  const handleClearAllFilter = useCallback(() => {
    setFilterParams(() => {
      let res: ParamObject = {};
      (tableOptions.listColumn || []).forEach(item => {
        if (
          [CO_FILTER_TYPE.MIN_MAX_DATE, CO_FILTER_TYPE.MIN_MAX_NUMBER].includes(
            item.typeFilter,
          )
        ) {
          res[item.key + "-min"] = "";
          res[item.key + "-max"] = "";
        } else if (
          item.typeFilter == CO_FILTER_TYPE.SELECT &&
          item.type == CO_TYPE.VALUE_NAME_OBJECT
        ) {
          res[item?.relatedKey || item.key] = "";
        } else {
          res[item.key] = "";
        }
      });

      return res;
    });
  }, [tableOptions, filterParams]);

  // Handle Row Action
  const handleRowAction = async (
    id: string,
    rowAction: ROW_ACTION_INTERFACE,
    cell: MRT_Cell<any>,
    closeMenu?: Function,
  ) => {
    if (closeMenu) {
      closeMenu();
    }

    const objRoute = tableOptions.routes[rowAction.action] as
      | TABLE_ROUTE_INTERFACE
      | undefined;

    if (
      !objRoute?.url &&
      !rowAction.url &&
      rowAction.actionType === RS_ACTION_TYPE.CALL_API
    ) {
      console.log(
        "handle-Row-Action - RS_ACTION_TYPE.CALL_API: There's no route api.",
      );
      return;
    }

    if (rowAction.actionType == RS_ACTION_TYPE.CALL_API) {
      if (rowAction.type == RS_TYPE.DELETE) {
        setConfirmDialogOption({
          open: true,
          id,
          action: rowAction.action,
          method: rowAction.method,
          type: rowAction.type,
          title: "Bạn có chắc chắn muốn xóa bản ghi này không?",
          url: rowAction.url || objRoute?.url || "",
          parentId,
          parentIdName: objRoute?.parentIdName,
        });
        return;
      }
      callApiRowAction(
        id,
        rowAction.method,
        rowAction.type,
        rowAction.url || objRoute?.url || "",
        parentId,
        objRoute?.parentIdName,
      );
    } else if (rowAction.actionType == RS_ACTION_TYPE.CALL_API_POPUP) {
      callApiPopUpRowAction(
        id,
        cell,
        rowAction.type as any,
        rowAction.dialogCode,
      );
    }
  };

  // Call API Action
  const callApiRowAction = async (
    id: string,
    method: RS_METHOD,
    type: RS_TYPE,
    url: string,
    parentId?: string,
    parentIdName?: string,
  ) => {
    try {
      if (type == RS_TYPE.DELETE) setConfirmDialogOption({ open: false });

      if (!url || !method || !id) {
        console.log("call-Api-Row-Action: id, method, url are required.");
        return;
      }

      const apiUrl = `${publicRuntimeConfig.ORIGIN_URL}/${url}?id=${id}${
        parentId && parentIdName ? `&${parentIdName}=${parentId}` : ""
      }`;
      const res = await axios[method.toString()](apiUrl);

      if (res?.data?.success) {
        dispatch(
          openSnackbar({
            src: ImagesSvg.notifySuccessIcon,
            title: "Thành công!",
            open: true,
            message: "Bản ghi đang chờ checker duyệt",
            variant: "alert",
            alert: {
              color: "success",
            },
            close: false,
            transition: "SlideRight",
            anchorOrigin: { vertical: "top", horizontal: "left" },
          }),
        );
        await getData();
      }
    } catch (error) {
      console.log("error", error);
      dispatch(
        openSnackbar({
          open: true,
          message: error,
          variant: "alert",
          alert: {
            color: "error",
          },
          close: false,
          transition: "SlideLeft",
        }),
      );
    }
  };

  const callApiPopUpRowAction = async (
    id: string,
    cell: MRT_Cell<any>,
    type?: IFormType,
    dialogCode?: string,
  ) => {
    if (dialogCode && dialogConfigs[dialogCode]) {
      setCurrentDialogConfig(dialogConfigs[dialogCode]);
    } else {
      setCurrentDialogConfig(undefined);
    }
    handleOpenAddNewFormDialog();
    setCurrentId(id);
    setAccountingId(
      tableOptions?.checkerCancelAccountingEntry
        ? cell.row.original?.fundContractFeesAccountingId ?? ""
        : "",
    );
    setCurrentWorkFollowStatus(
      tableOptions?.checkerApprove
        ? cell.row.original?.workFollowStatus || ""
        : "",
    );
    setCurrentStatus(type ?? "show");
    addQueryToURL(
      {
        [tableOptions.routes[API_ACTION.FETCH_DATA_URL].parentIdName ?? "id"]:
          parentId ? parentId : id ? id : null,
      },
      tableLevel,
    );
    dispatch(setIsLoading(false));
  };

  const handleCancelDelete = () => {
    setConfirmDialogOption({ open: false });
  };

  // Handle Action all
  const handleActionAll = async (
    action: API_ACTION,
    actionType: RS_ACTION_TYPE,
    method: RS_METHOD,
    closeMenu: Function,
    type: RS_TYPE,
  ) => {
    const listId = Object.keys(rowSelection);
    closeMenu();

    const objRoute = tableOptions.routes[action] as
      | TABLE_ROUTE_INTERFACE
      | undefined;

    if (
      (!objRoute || !objRoute?.url) &&
      actionType === RS_ACTION_TYPE.CALL_API
    ) {
      console.log("handle-Row-Action: There's no route api.");
      return;
    }

    if (actionType == RS_ACTION_TYPE.CALL_API) {
      if (type == RS_TYPE.DELETE) {
        setConfirmDialogOption({
          open: true,
          listId,
          action,
          method,
          type,
          title: "Bạn có đồng ý xóa các bản ghi đã chọn?",
          url: objRoute?.url || "",
          parentId,
          parentIdName: objRoute?.parentIdName,
        });

        return;
      }
      await callApiActionAll(
        method,
        listId,
        type,
        objRoute?.url || "",
        parentId,
        objRoute?.parentIdName,
      );
    }
  };

  // Call API Action All
  const callApiActionAll = async (
    method: RS_METHOD,
    listId: string[],
    type: RS_TYPE,
    url: string,
    parentId?: string,
    parentIdName?: string,
  ) => {
    try {
      if (type == RS_TYPE.DELETE) setConfirmDialogOption({ open: false });

      if (!publicRuntimeConfig.ORIGIN_URL || listId.length < 2 || !url) {
        return;
      }

      const apiUrl = `${publicRuntimeConfig.ORIGIN_URL}/${url}${
        parentId && parentIdName ? `?${parentIdName}=${parentId}` : ""
      }`;
      const res = await axios[method.toString()](apiUrl, { data: listId });

      if (res?.data?.success) {
        dispatch(
          openSnackbar({
            src: ImagesSvg.notifySuccessIcon,
            title: "Thành công!",
            open: true,
            message: "Bản ghi đang chờ checker duyệt",
            variant: "alert",
            alert: {
              color: "success",
            },
            close: false,
            transition: "SlideRight",
            anchorOrigin: { vertical: "top", horizontal: "left" },
          }),
        );
        await getData();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSubmitConfirmDialog = async () => {
    if (confirmDialogOption.id)
      callApiRowAction(
        confirmDialogOption?.id || "",
        confirmDialogOption?.method || "",
        confirmDialogOption?.type || RS_TYPE.DELETE,
        confirmDialogOption?.url || "",
        confirmDialogOption?.parentId,
        confirmDialogOption?.parentIdName,
      );
    else
      callApiActionAll(
        confirmDialogOption?.method || "",
        confirmDialogOption?.listId || [],
        confirmDialogOption?.type || RS_TYPE.DELETE,
        confirmDialogOption?.url || "",
        confirmDialogOption?.parentId,
        confirmDialogOption?.parentIdName,
      );
  };

  // Export Excel
  const handleExportRows = async (
    selectedColumns: string[],
    typeExport: EXPORT_EXCEL_TYPE,
  ) => {
    const config = getConfigQuery(typeExport, selectedColumns);
    if (config) {
      await dispatch(getFileExcel(config));
    }
  };

  const getConfigQuery = (
    typeExport?: EXPORT_EXCEL_TYPE,
    exportedColumns?: string[],
  ): FETCH_DATA_API_CONFIG_INTERFACE | false => {
    try {
      let objRoutes = typeExport
        ? tableOptions.routes[API_ACTION.EXPORT_TO_XLSX_FILE]
        : tableOptions.routes[API_ACTION.FETCH_DATA_URL];
      if (!objRoutes?.url) return false;

      const config = getFetchDataConfig(
        objRoutes?.url,
        filterParams,
        tableOptions.listColumn,
        objRoutes?.parentIdName && parentId
          ? {
              fieldName: objRoutes?.parentIdName || "",
              fieldValue: parentId,
            }
          : undefined,
        objRoutes?.searchTerms,
        objRoutes?.params,
        rowSelection,
        typeExport,
        exportedColumns,
        objRoutes.defaultSorting,
        sorting,
        pagination,
        globalFilter,
      );
      return config;
    } catch (error) {
      console.log("getQuery", error);
      return false;
    }
  };

  // Get data
  const getData = async () => {
    setRowSelection({});
    try {
      const config = getConfigQuery();
      if (config) {
        const res = await getListDataBase(config);
        setDataTable(res);
      }
      setIsError(false);
      setIsLoadingTable(false);
      if (onRefreshRecord) {
        onRefreshRecord();
      }
    } catch (error) {
      setDataTable({});
      console.log(error);
      setIsError(true);
      setIsLoadingTable(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsLoadingTable(true);
    removeQueryFromURL(
      {
        [tableOptions.routes[API_ACTION.FETCH_DATA_URL].parentIdName ?? "id"]:
          parentId ? parentId : null,
      },
      tableLevel,
    );
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

  const handleClickRow = async (rowId: string) => {
    if (!onClickRow) return;
    onClickRow(rowId);
  };

  // -------------- End Function -----------------------

  useEffect(() => {
    const asyncFunction = async () => {
      if (tableOptions.listColumn.length === 0) {
        return;
      }
      setdataListColumn(
        (tableOptions.listColumn || []).filter(
          ele =>
            (ele.hiddenCondition?.roleCheck &&
              (ele.hiddenCondition?.allowedRoles || []).includes(userRole)) ||
            !ele.hiddenCondition?.roleCheck ||
            ele.type === CO_TYPE.SETTING,
        ),
      );
      setGlobalFilter("");
      setFilterParams(() => {
        let res: ParamObject = {};
        (tableOptions.listColumn || []).forEach(item => {
          if (
            [
              CO_FILTER_TYPE.MIN_MAX_DATE,
              CO_FILTER_TYPE.MIN_MAX_NUMBER,
            ].includes(item.typeFilter)
          ) {
            res[item.key + "-min"] = "";
            res[item.key + "-max"] = "";
          } else if (
            item.typeFilter == CO_FILTER_TYPE.SELECT &&
            item.type == CO_TYPE.VALUE_NAME_OBJECT
          ) {
            res[item?.relatedKey || item.key] = "";
          } else {
            res[item.key] = "";
          }
        });

        return res;
      });
      setRowSelection({});
      setSorting([]);
      setOrdering(() => {
        const res = (tableOptions.listColumn || []).map(item => item.key);
        let index = res.indexOf(CO_TYPE.ENABLED);
        if (index !== -1) {
          res.splice(index, 1);
          res.push(CO_TYPE.ENABLED);
        }
        index = res.indexOf(CO_TYPE.WORK_FOLLOW);
        if (index !== -1) {
          res.splice(index, 1);
          res.push(CO_TYPE.WORK_FOLLOW);
        }
        index = res.indexOf(CO_TYPE.SETTING);
        if (index !== -1) {
          res.splice(index, 1);
          res.push(CO_TYPE.SETTING);
        }

        if (tableOptions.enableExpanding) {
          res.unshift("mrt-row-expand");
        }

        if (tableOptions.enableRowSelection) {
          res.unshift("mrt-row-select");
        }

        return res;
      });
      setPinning(() => {
        let res: { left: string[]; right: string[] } = {
          left: [],
          right: [],
        };

        const columns = (tableOptions.listColumn || []).map(item => item.key);
        if (tableOptions.enableRowSelection) {
          res.left.push("mrt-row-select");
        } else {
          if (tableOptions.enableExpanding) {
            res.left.push("mrt-row-expand");
          }
        }
        if (columns.indexOf(CO_TYPE.SETTING) != -1) {
          res.right.push(CO_TYPE.SETTING);
        }

        return res;
      });
      setPagination({
        pageIndex: 0,
        pageSize: tableOptions.defaultPageSize || 10,
      });
      setInitialVisibleColumns(() => {
        let res = {};
        (tableOptions.listColumn || []).forEach(item => {
          res[item.key] = item.visible;
        });
        return res;
      });
      setListColumnObject(() => {
        let res: ParamObject = {};
        (tableOptions.listColumn || []).forEach((item: any) => {
          res[item.key] = item;
        });

        return res;
      });
      await getDialogConfigs();
      await getSelectOptionsListField(
        tableOptions.selectOptionsListField || {},
      );
    };

    asyncFunction();
  }, [tableOptions]);

  useEffect(() => {
    const asyncFunction = async () => {
      if (tableOptions.listColumn.length === 0) {
        return;
      }
      setIsLoadingTable(true);
      await getData();
    };

    asyncFunction();
  }, [sorting, pagination, filterParams, globalFilter, parentId]);

  const [visibleAddNewFormDialog, setVisibleAddNewFormDialog] = useState(false);

  const [currentId, setCurrentId] = useState("");
  const [accountingId, setAccountingId] = useState("");
  const [currentWorkFollowStatus, setCurrentWorkFollowStatus] = useState("");

  const [currentStatus, setCurrentStatus] = useState<IFormType>("create");
  const handleOpenAddNewFormDialog = useCallback(() => {
    setVisibleAddNewFormDialog(true);
  }, []);
  const handleCloseAddNewFormDialog = () => {
    setCurrentStatus("create");
    setCurrentId("");
    setCurrentWorkFollowStatus("");
    setVisibleAddNewFormDialog(false);
    setTimeout(() => {
      setCurrentDialogConfig(undefined);
    }, 500);
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {!!tableOptions.tableTitle ? (
        <Box
          sx={{
            fontWeight: 700,
            fontSize: "20px",
            lineHeight: "32px",
            color: "#272E36",
          }}
        >
          {tableOptions.tableTitle}
        </Box>
      ) : (
        <></>
      )}
      <Box
        className={classes.tableGeneric}
        sx={{
          height: !!tableOptions.tableTitle ? "calc(100% - 32px)" : "",
        }}
      >
        <MaterialReactTable
          columns={columns2}
          data={dataTable?.source || []}
          rowCount={dataTable?.totalRecords || 0}
          displayColumnDefOptions={{
            "mrt-row-expand": {
              size: 10,
              minSize: 10,
              maxSize: 10,
              Header: () => <></>,
            },
          }}
          state={{
            rowSelection: rowSelection,
            pagination: pagination,
            globalFilter: globalFilter,
            sorting: sorting,
            columnPinning: pinning,
            showGlobalFilter: true,
            columnOrder: ordering,
            showSkeletons: isLoadingTable,
            columnVisibility: initialVisibleColumns,
            // expanded: expandedRows,
          }}
          initialState={{ expanded: tableOptions.defaultExpanded || undefined }}
          enableExpandAll={false}
          manualFiltering={true}
          manualSorting={true}
          // onExpandedChange={setExpendedRows}
          onSortingChange={setSorting}
          onPaginationChange={setPagination}
          onGlobalFilterChange={setGlobalFilter}
          onColumnOrderChange={setOrdering}
          onColumnVisibilityChange={setInitialVisibleColumns}
          icons={iconsTable}
          getRowId={row => row?.id?.toString()}
          onRowSelectionChange={setRowSelection}
          enableSorting={tableOptions.enableSorting}
          enableRowSelection={tableOptions.enableRowSelection}
          enableColumnResizing={tableOptions.enableColumnResizing}
          enableColumnOrdering={tableOptions.enableColumnOrdering}
          enableColumnDragging={tableOptions.enableColumnDragging}
          enableStickyHeader={tableOptions.enableStickyHeader}
          enableExpanding={true}
          getSubRows={originalRow => originalRow.subRows}
          manualPagination={true}
          enablePagination={tableOptions.enablePagination}
          positionToolbarAlertBanner="bottom"
          globalFilterFn="contains"
          localization={MRT_Localization_VI}
          muiTablePaginationProps={{
            rowsPerPageOptions: LIST_PAGINATION_OPTIONS,
            showFirstButton: true,
            showLastButton: true,
          }}
          muiTableBodyRowProps={
            onClickRow
              ? ({ row }) => ({
                  onClick: () => {
                    handleClickRow(row.id);
                  },
                  sx:
                    selectedId === row.id
                      ? {
                          cursor: "pointer",
                          backgroundColor: "#DDF6E8 !important",
                          "&:hover": {
                            backgroundColor: "#b3ebcf !important",
                          },
                        }
                      : {
                          cursor: "pointer",
                        },
                })
              : undefined
          }
          muiSearchTextFieldProps={{
            placeholder: "Tìm kiếm",
            sx: {
              "& .MuiSvgIcon-root": { fontSize: "22px" },
              "& input": { padding: "8px", fontSize: "14px" },
              "& .MuiOutlinedInput-notchedOutline": {},
            },
            variant: "outlined",
          }}
          muiToolbarAlertBannerProps={
            isError
              ? {
                  color: "error",
                  children: "Không lấy được dữ liệu",
                }
              : undefined
          }
          renderTopToolbar={({ table }) => (
            <BaseTableHeader
              table={table}
              dataListColumn={dataListColumn}
              listHandleAllAction={tableOptions.listHandleAllAction || []}
              filterParams={filterParams}
              rowSelection={rowSelection}
              visibleColumns={initialVisibleColumns}
              showAddNewButton={tableOptions.showAddNewButton || false}
              showExportExcelButton={
                tableOptions.showExportExcelButton || false
              }
              showRefreshButton={tableOptions.showRefreshButton || false}
              selectOptionsListField={selectOptionsListField}
              onClearFilter={handleClearFilter}
              onClearAllFilter={handleClearAllFilter}
              onRefresh={handleRefresh}
              onHandleActionAll={handleActionAll}
              onExportRow={handleExportRows}
              onPressOpenFormDialog={handleOpenAddNewFormDialog}
              addNewConfig={tableOptions.addNewConfig}
              setAction={(value: string) => {
                setCurrentDialogConfig(dialogConfigs[value]);
              }}
              isLoading={isLoadingTable}
              onlyShow={onlyShow}
              parentId={parentId}
            />
          )}
          renderBottomToolbar={({ table }) => <BaseTableFooter table={table} />}
          renderColumnActionsMenuItems={({ closeMenu, column }) => {
            const columnOption = listColumnObject[column.id];
            return [
              <BaseTableColumnAction
                columnOption={columnOption}
                filterParams={filterParams}
                selectOptionsListField={selectOptionsListField}
                onSearch={handleFilterFormChange}
                closeMenu={closeMenu}
                key={columnOption.key}
              />,
            ];
          }}
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
        {`
                      div:has(.filter-column) {
                          .MuiMenu-list {
                              padding-right: 0 !important;
                              width: 100% !important;
                              .MuiMenuItem-root {
                                  display: none;
                              }
                          }
                      }

                      .filter-column {
                        padding: 16px; width: 332px;
                      }
          `}
      </style>

      <BaseDialogCreate
        currentId={currentId}
        currentStatus={currentStatus}
        // isDisabled={false}
        dialogConfig={currentDialogConfig}
        visible={visibleAddNewFormDialog}
        onCloseDialogForm={handleCloseAddNewFormDialog}
        handleRefresh={() => {
          handleRefresh();
        }}
        parentId={{
          [tableOptions.routes[API_ACTION.FETCH_DATA_URL].parentIdName ??
          "fundId"]: parentId ? parentId : currentId ? currentId : null,
        }}
        submitParentData={submitParentData}
        checkerAPI={{
          approve: tableOptions.routes[API_ACTION.APPROVE]?.url || "",
          deny: tableOptions.routes[API_ACTION.DENY]?.url || "",
          cancelApprove:
            tableOptions.routes[API_ACTION.CANCEL_APPROVE]?.url || "",
          cancelAccountingEntry: {
            url:
              tableOptions.routes[API_ACTION.CANCEL_ACCOUNTING_ENTRY]?.url ||
              "",
            id: accountingId,
          },
        }}
        checkerApprove={!!tableOptions.checkerApprove}
        workFollowStatus={currentWorkFollowStatus}
      />
    </Box>
  );
};
const BaseExpendableTable = React.memo(BaseExpendableTableComponent);
export { BaseExpendableTable };
