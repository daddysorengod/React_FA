import React, { useState, useLayoutEffect } from "react";
import { useStyles } from "./BaseTableColumnSettingMenu.styles";
import useTranslation from "next-translate/useTranslation";
import { MRT_Cell } from "material-react-table";
import { COLUMN_OPTIONS_INTERFACE, ROW_ACTION_INTERFACE } from "@/src/types";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { RS_TYPE, SEARCH_CONDITIONS } from "@/src/constants";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { useSelector } from "@/src/store";
interface Props {
  cell: MRT_Cell<any>;
  listRowAction: ROW_ACTION_INTERFACE[];
  handleRowAction: Function;
  onlyShow?: boolean;
  columnOption: COLUMN_OPTIONS_INTERFACE;
  checkerApprove?: boolean;
  checkerCancelAccountingEntry?: boolean;
}
const BaseTableColumnSettingMenuComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    cell,
    listRowAction,
    handleRowAction,
    onlyShow,
    columnOption,
    checkerApprove,
    checkerCancelAccountingEntry
  } = props;

  const [actions, setActions] = useState<any[]>([]);

  const [checkerFormAction, setCheckerFormAction] =
    useState<ROW_ACTION_INTERFACE | null>(null);

  const userRole = useSelector(state => state.auth.role);

  const checkCondition = (
    action: ROW_ACTION_INTERFACE,
    type: "hidden" | "disabled",
  ): boolean => {
    const condition =
      type === "hidden" ? action.hiddenCondition : action.disabledCondition;
    if (condition) {
      const {
        valueCheck,
        valueConditions,
        roleCheck,
        allowedRoles,
        onlyShowCheck,
      } = condition;

      if (valueCheck && valueConditions) {
        for (let i = 0; i < valueConditions.length; i++) {
          const cellValue = cell.row.original[valueConditions[i].fieldName];
          const conditionValue = valueConditions[i].fieldValue;
          switch (valueConditions[i].condition) {
            case SEARCH_CONDITIONS.GREATER_THAN: {
              if (cellValue > conditionValue) {
                return true;
              }
              break;
            }
            case SEARCH_CONDITIONS.GREATER_THAN_OR_EQUAL: {
              if (cellValue >= conditionValue) {
                return true;
              }
              break;
            }
            case SEARCH_CONDITIONS.LESS_THAN: {
              if (cellValue < conditionValue) {
                return true;
              }
              break;
            }
            case SEARCH_CONDITIONS.LESS_THAN_OR_EQUAL: {
              if (cellValue <= conditionValue) {
                return true;
              }
              break;
            }
            case SEARCH_CONDITIONS.CONTAINS: {
              if (
                typeof cellValue === "string" &&
                (cellValue as string).includes(conditionValue)
              ) {
                return true;
              }
              break;
            }
            case SEARCH_CONDITIONS.NOT_EQUAL_TO: {
              if (
                (Array.isArray(cellValue) && Array.isArray(conditionValue)) ||
                (typeof cellValue === "object" &&
                  typeof conditionValue === "object")
              ) {
                if (
                  JSON.stringify(cellValue) !== JSON.stringify(conditionValue)
                ) {
                  return true;
                }
              } else {
                if (cellValue !== conditionValue) {
                  return true;
                }
              }
              break;
            }
            default: {
              if (cellValue === conditionValue) {
                return true;
              }
            }
          }
        }
      }
      if (roleCheck && allowedRoles) {
        // Check by User role
        if (!allowedRoles.includes(userRole)) {
          return true;
        }
      }
      if (onlyShowCheck) {
        if (onlyShow) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  };

  const isHiddenAction = (action: ROW_ACTION_INTERFACE): boolean => {
    return checkCondition(action, "hidden");
  };
  const isDisabledAction = (action: ROW_ACTION_INTERFACE): boolean => {
    return checkCondition(action, "disabled");
  };

  const showSettings = (): boolean => {
    let res = true;
    if (columnOption.hiddenCondition?.roleCheck) {
      res = !(columnOption.hiddenCondition?.allowedRoles || []).includes(
        userRole,
      );
    }

    return res;
  };

  const isWaitingForApprovement = (): boolean => {
    return !!checkerApprove && cell.row.original?.workFollowStatus == "1";
  };

  useLayoutEffect(() => {
    setActions(() => {
      return listRowAction.filter(item => !isHiddenAction(item));
    });
  }, [listRowAction, cell]);

  useLayoutEffect(() => {
    const action = listRowAction.find(ele => ele.type === RS_TYPE.SHOW);
    if (action) {
      setCheckerFormAction({ ...action });
    }
  }, [listRowAction, userRole]);

  return (
    <>
      {actions.length ? (
        showSettings() ? (
          <PopupState
            variant="popover"
            popupId={"popup-popover-row-" + cell.row.original.id}
          >
            {popupState => (
              <div>
                <IconButton sx={{ color: "#000" }} {...bindTrigger(popupState)}>
                  <SettingsIcon />
                </IconButton>

                <Menu {...bindMenu(popupState)}>
                  {actions.map((action: ROW_ACTION_INTERFACE) => {
                    const disabled = isDisabledAction(action);
                    return (
                      <MenuItem
                        key={action.label}
                        onClick={() => {
                          handleRowAction(
                            cell.row.original.id,
                            action,
                            cell,
                            popupState.close,
                          );
                        }}
                        disabled={disabled}
                        sx={{
                          color: action.color === "error" ? "#E6544F" : "",
                        }}
                      >
                        {action.label}
                      </MenuItem>
                    );
                  })}
                </Menu>
              </div>
            )}
          </PopupState>
        ) : (
          <>
            {!!checkerFormAction ? (
              <>
                <Button
                  variant="contained"
                  className={
                    isWaitingForApprovement()
                      ? classes.approveButton
                      : classes.showButton
                  }
                  onClick={() => {
                    if (checkerFormAction) {
                      handleRowAction(
                        cell.row.original.id,
                        checkerFormAction,
                        cell,
                      );
                    }
                  }}
                  sx={{
                    fontSize: "12px",
                  }}
                >
                  {isWaitingForApprovement() ? "Duyệt / Từ chối" : "Xem"}
                </Button>
              </>
            ) : (
              <>Eye</>
            )}
          </>
        )
      ) : (
        <></>
      )}
    </>
  );
};
const BaseTableColumnSettingMenu = React.memo(
  BaseTableColumnSettingMenuComponent,
);
export { BaseTableColumnSettingMenu };
