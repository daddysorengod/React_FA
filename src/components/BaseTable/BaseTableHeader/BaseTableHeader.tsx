import { useStyles } from "./BaseTableHeader.styles";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import {
  Box,
  Tooltip,
  Button,
  IconButton,
  MenuItem,
  Menu,
} from "@mui/material";

import { Close as CloseIcon } from "@mui/icons-material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { ExportExcelDialog } from "@/src/components/BaseTable/ExportExcelDialog";

import {
  Add as AddIcon,
  GetApp as GetAppIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

import {
  MRT_ShowHideColumnsButton,
  MRT_GlobalFilterTextField,
} from "material-react-table";
import {
  CO_FILTER_TYPE,
  CO_TYPE,
  EXPORT_EXCEL_TYPE,
  RS_COLOR,
} from "@/src/constants/generic-table";
import {
  ALL_ACTION_INTERFACE,
  COLUMN_OPTIONS_INTERFACE,
  ParamObject,
  TABLE_ADD_NEW_CONFIG_INTERFACE,
  TABLE_SELECT_OPTIONS,
} from "@/src/types/generic-table";
import { formatDate, formatNumber } from "@/src/helpers";
import { MRT_TableInstance } from "material-react-table";
import { useSelector } from "@/src/store";

interface Props {
  table: MRT_TableInstance<any>;
  dataListColumn: any[];
  listHandleAllAction: ALL_ACTION_INTERFACE[];
  filterParams: ParamObject;
  rowSelection: ParamObject;
  visibleColumns: ParamObject;
  showAddNewButton: boolean;
  showExportExcelButton: boolean;
  showRefreshButton: boolean;
  selectOptionsListField: { [key: string]: TABLE_SELECT_OPTIONS };
  onClearFilter: Function;
  onClearAllFilter: Function;
  onHandleActionAll: Function;
  onRefresh: Function;
  onExportRow: Function;
  onPressOpenFormDialog: Function;
  addNewConfig?: TABLE_ADD_NEW_CONFIG_INTERFACE;
  setAction: Function;
  isLoading?: boolean;
  onlyShow?: boolean;
  parentId?: string;
}
const BaseTableHeaderComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();

  const {
    table,
    dataListColumn,
    listHandleAllAction,
    filterParams,
    rowSelection,
    visibleColumns,
    showAddNewButton,
    showExportExcelButton,
    showRefreshButton,
    selectOptionsListField,
    onClearFilter,
    onClearAllFilter,
    onHandleActionAll,
    onRefresh,
    onExportRow,
    onPressOpenFormDialog,
    addNewConfig,
    setAction,
    isLoading,
    onlyShow,
    parentId,
  } = props;

  const isFilterParamsEmpty = () => {
    for (var key in filterParams) {
      if (filterParams[key].length > 0) {
        return false;
      }
    }
    return true;
  };

  const userRole = useSelector(state => state.auth.role);

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [typeExport, setTypeExport] = useState("");

  const handleOpenFormDialog = (closeMenu?: Function) => {
    if (closeMenu) closeMenu();
    onPressOpenFormDialog();
  };

  const handleOpenPopUpSelectColumn = (
    typeExport: EXPORT_EXCEL_TYPE,
    closeMenu: Function,
  ) => {
    closeMenu();
    setTypeExport(typeExport);
    setVisibleDialog(true);
  };

  const handleExport = (selectedColumns: string[]) => {
    setVisibleDialog(false);
    onExportRow(selectedColumns, typeExport);
  };

  const handleClearFilter = (typeFilter: CO_FILTER_TYPE, key: string) => {
    onClearFilter(typeFilter, key);
  };

  const handleClearAllFilter = () => {
    onClearAllFilter();
  };

  const handleRefresh = () => {
    onRefresh();
  };

  const handleActionAll = (action, actionType, method, closeMenu, type) => {
    onHandleActionAll(action, actionType, method, closeMenu, type);
  };

  const getLabelSelect = (value: any, column: any) => {
    let obj = selectOptionsListField[column.key] || {};
    const option = (obj?.list || []).find(
      (item: any) =>
        (item[obj.valueKey] != null ? item[obj.valueKey] : "") == value,
    );
    if (!option) return "";

    return option[obj.nameKey];
  };

  const handleOpenDialog = (dialogCode: string) => {
    setAction(dialogCode);
    handleOpenFormDialog();
  };

  const isShowAddNewButton = (): boolean => {
    let res =
      !!showAddNewButton && !!addNewConfig && addNewConfig.actions.length > 0;
    if (addNewConfig?.hiddenCondition?.parentIdCheck) {
      res = !!parentId;
    }
    if (addNewConfig?.hiddenCondition?.roleCheck) {
      res = !(addNewConfig.hiddenCondition.allowedRoles || []).includes(
        userRole,
      );
    }
    return res;
  };

  const isDiableAddNewButton = (): boolean => {
    return (
      isLoading ||
      onlyShow ||
      (!!addNewConfig?.disabledCondition?.parentIdCheck && !parentId)
    );
  };

  return (
    <Box className={classes.tableHeader}>
      <Box className={classes.leftTableHeader}>
        <Box>
          {Object.keys(rowSelection).length < 2 ||
          listHandleAllAction.length == 0 ? (
            <MRT_GlobalFilterTextField table={table} />
          ) : (
            <PopupState
              variant="popover"
              popupId={"popup-popover-handle-all-btn"}
            >
              {popupState => (
                <Box>
                  <Button
                    id="button-handle-all"
                    variant="contained"
                    disableElevation
                    {...bindTrigger(popupState)}
                    endIcon={<ArrowDropDownIcon />}
                    className={classes.actionAllButton}
                  >
                    Thực hiện hàng loạt
                  </Button>

                  <Menu
                    {...bindMenu(popupState)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    className={classes.menu}
                  >
                    {listHandleAllAction.map(item => (
                      <MenuItem
                        key={item.action}
                        onClick={() => {
                          handleActionAll(
                            item.action,
                            item.actionType,
                            item.method,
                            popupState.close,
                            item.type,
                          );
                        }}
                        sx={{
                          color: item.color == RS_COLOR.ERROR ? "#E6544F" : "",
                        }}
                        disabled={onlyShow && item.color == RS_COLOR.ERROR}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              )}
            </PopupState>
          )}
        </Box>

        <Box className={classes.filterColumn}>
          {dataListColumn.map((item: COLUMN_OPTIONS_INTERFACE) => {
            if (item.typeFilter == CO_FILTER_TYPE.MIN_MAX_DATE) {
              return (
                <Box key={item.key} sx={{ display: "flex" }}>
                  {filterParams[item.key + "-min"] ? (
                    <Box className={classes.filterColumnItem}>
                      <Box className={classes.filterColumnLabel}>
                        {item.label + " - min"}
                      </Box>
                      <Box className={classes.filterColumnValue}>
                        "{formatDate(filterParams[item.key + "-min"])}"
                      </Box>
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => {
                          handleClearFilter(
                            CO_FILTER_TYPE.TEXT,
                            item.key + "-min",
                          );
                        }}
                      >
                        <CloseIcon
                          className={classes.closeIcon}
                          fontSize="inherit"
                        />
                      </IconButton>
                    </Box>
                  ) : (
                    <></>
                  )}

                  {filterParams[item.key + "-max"] ? (
                    <Box className={classes.filterColumnItem}>
                      <Box className={classes.filterColumnLabel}>
                        {filterParams[item.key + "-min"]
                          ? `max`
                          : `${item.label} - max`}
                      </Box>
                      <Box className={classes.filterColumnValue}>
                        "{formatDate(filterParams[item.key + "-max"])}"
                      </Box>
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => {
                          handleClearFilter(
                            CO_FILTER_TYPE.TEXT,
                            item.key + "-max",
                          );
                        }}
                      >
                        <CloseIcon
                          className={classes.closeIcon}
                          fontSize="inherit"
                        />
                      </IconButton>
                    </Box>
                  ) : (
                    <></>
                  )}
                </Box>
              );
            } else if (item.typeFilter == CO_FILTER_TYPE.MIN_MAX_NUMBER) {
              return (
                <Box key={item.key} sx={{ display: "flex" }}>
                  {filterParams[item.key + "-min"] ? (
                    <Box className={classes.filterColumnItem}>
                      <Box className={classes.filterColumnLabel}>
                        {item.label + " - min"}
                      </Box>
                      <Box className={classes.filterColumnValue}>
                        "{formatNumber(filterParams[item.key + "-min"])}"
                      </Box>
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => {
                          handleClearFilter(
                            CO_FILTER_TYPE.TEXT,
                            item.key + "-min",
                          );
                        }}
                      >
                        <CloseIcon
                          className={classes.closeIcon}
                          fontSize="inherit"
                        />
                      </IconButton>
                    </Box>
                  ) : (
                    <></>
                  )}

                  {filterParams[item.key + "-max"] ? (
                    <Box className={classes.filterColumnItem}>
                      <Box className={classes.filterColumnLabel}>
                        {filterParams[item.key + "-min"]
                          ? `max`
                          : `${item.label} - max`}
                      </Box>
                      <Box className={classes.filterColumnValue}>
                        "{formatNumber(filterParams[item.key + "-max"])}"
                      </Box>
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => {
                          handleClearFilter(
                            CO_FILTER_TYPE.TEXT,
                            item.key + "-max",
                          );
                        }}
                      >
                        <CloseIcon
                          className={classes.closeIcon}
                          fontSize="inherit"
                        />
                      </IconButton>
                    </Box>
                  ) : (
                    <></>
                  )}
                </Box>
              );
            } else if (item.typeFilter === CO_FILTER_TYPE.SELECT) {
              if (item.type === CO_TYPE.ORGANIZE_PROVIDER_ROLES) {
                return <span key={item.key}></span>;
              }
              return (
                <Box key={item.key}>
                  {item.relatedKey && filterParams[item.relatedKey] !== "" ? (
                    <Box className={classes.filterColumnItem}>
                      <Box className={classes.filterColumnLabel}>
                        {item.label}
                      </Box>
                      <Box className={classes.filterColumnValue}>
                        "{getLabelSelect(filterParams[item.relatedKey], item)}"
                      </Box>
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => {
                          handleClearFilter(
                            item.typeFilter,
                            item.relatedKey || item.key,
                          );
                        }}
                      >
                        <CloseIcon
                          className={classes.closeIcon}
                          fontSize="inherit"
                        />
                      </IconButton>
                    </Box>
                  ) : (
                    <></>
                  )}
                </Box>
              );
            } else {
              return (
                <Box key={item.key}>
                  {filterParams[item.key]?.length > 0 ? (
                    <Box className={classes.filterColumnItem}>
                      <Box className={classes.filterColumnLabel}>
                        {item.label}
                      </Box>
                      <Box className={classes.filterColumnValue}>
                        "{filterParams[item.key]}"
                      </Box>
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => {
                          handleClearFilter(item.typeFilter, item.key);
                        }}
                      >
                        <CloseIcon
                          className={classes.closeIcon}
                          fontSize="inherit"
                        />
                      </IconButton>
                    </Box>
                  ) : (
                    <></>
                  )}
                </Box>
              );
            }
          })}
          {!isFilterParamsEmpty() ? (
            <Button
              variant="text"
              size="small"
              className={classes.clearAllButton}
              onClick={() => {
                handleClearAllFilter();
              }}
            >
              Xóa bộ lọc
            </Button>
          ) : (
            <></>
          )}
        </Box>
      </Box>
      <Box className={classes.rightTableHeader}>
        {showRefreshButton ? (
          <Tooltip title="Refresh" arrow>
            <IconButton
              aria-label="refresh"
              className={classes.refreshButton}
              onClick={() => {
                handleRefresh();
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <></>
        )}

        {showExportExcelButton ? (
          <PopupState
            variant="popover"
            popupId={"popup-popover-export-excell-btn"}
          >
            {popupState => (
              <Box>
                <Button
                  variant="contained"
                  startIcon={<GetAppIcon />}
                  {...bindTrigger(popupState)}
                  className={classes.exportExcelButton}
                  disabled={isLoading}
                >
                  Xuất Excel
                </Button>

                <Menu
                  {...bindMenu(popupState)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  className={classes.menu}
                >
                  <MenuItem
                    onClick={() => {
                      handleOpenPopUpSelectColumn(
                        EXPORT_EXCEL_TYPE.ALL,
                        popupState.close,
                      );
                    }}
                  >
                    Xuất tất cả bản ghi
                  </MenuItem>
                  {Object.keys(rowSelection).length > 0 ? (
                    <MenuItem
                      onClick={() => {
                        handleOpenPopUpSelectColumn(
                          EXPORT_EXCEL_TYPE.SELECTED,
                          popupState.close,
                        );
                      }}
                    >
                      Chỉ xuất bản ghi đã chọn
                    </MenuItem>
                  ) : (
                    <span></span>
                  )}
                </Menu>
              </Box>
            )}
          </PopupState>
        ) : (
          <></>
        )}

        {isShowAddNewButton() && addNewConfig ? (
          addNewConfig.actions.length > 1 ? (
            <PopupState
              variant="popover"
              popupId={"popup-popover-export-excell-btn"}
            >
              {popupState => (
                <Box>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    className={classes.addNewButton}
                    {...bindTrigger(popupState)}
                    disabled={isDiableAddNewButton()}
                  >
                    {addNewConfig.title || "Thêm mới"}
                  </Button>
                  <Menu
                    {...bindMenu(popupState)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    className={classes.menu}
                  >
                    {addNewConfig.actions.map((action, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => {
                          handleOpenDialog(action.dialogCode);
                        }}
                      >
                        {action.title}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              )}
            </PopupState>
          ) : (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              className={classes.addNewButton}
              onClick={() => {
                handleOpenDialog(addNewConfig.actions[0].dialogCode);
              }}
              disabled={isDiableAddNewButton()}
            >
              {addNewConfig.title ||
                addNewConfig.actions[0].title ||
                "Thêm mới"}
            </Button>
          )
        ) : (
          <></>
        )}

        <Box>
          <MRT_ShowHideColumnsButton
            table={table}
            className={classes.MRT_ShowHideColumnsButton}
          />
        </Box>

        <ExportExcelDialog
          dataListColumn={dataListColumn}
          visibleDialog={visibleDialog}
          visibleColumns={visibleColumns}
          onCloseDialog={() => {
            setVisibleDialog(false);
          }}
          onSubmit={handleExport}
        ></ExportExcelDialog>
      </Box>
    </Box>
  );
};
const BaseTableHeader = React.memo(BaseTableHeaderComponent);
export { BaseTableHeader };
