import React, { useState } from "react";
// next

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Chip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";

// project import
import Dot from "@app/components/@extended/Dot";
import useConfig from "@hooks/useConfig";
import { openDrawer } from "@store/reducers/menu";

// types
import { NavItemType } from "@app/types/menu";
import { LAYOUT_CONST } from "@app/types/config";
import { BaseDialogCreate } from "@/src/components";
import { formConfigFiles } from "@/src/constants/formConfigFiles";
import { useStyles } from "./Navigation.styles";

/// import store
import { useDispatch } from "react-redux";
import { dispatch, useSelector } from "@store/store";
import { RootStateProps } from "@app/types/root";
import { useMapFormToState } from "@/src/helpers/getFormSetting";
/// end import store

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

interface Props {
  item: NavItemType;
  level: number;
  handleCloseItem: () => void;
}

interface Props {}
const NavOpenFormComponent = ({
  item,
  level,
  handleCloseItem,
}: Props): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles();
  const menu = useSelector(state => state.menu);
  const matchDownLg = useMediaQuery(theme.breakpoints.down("lg"));
  const [isRefreshForm, setIsRefreshForm] = useState(false);
  const { drawerOpen, openItem } = menu;
  const globalFundId = useSelector(
    (state: RootStateProps) => state.general.globalFundId,
  );
  const userRole = useSelector(state => state.auth.role);
  const downLG = useMediaQuery(theme.breakpoints.down("lg"));

  const { menuOrientation } = useConfig();

  const Icon = item.icon!;
  const itemIcon = item.icon ? (
    <Icon style={{ fontSize: drawerOpen ? "1rem" : "1.25rem" }} />
  ) : (
    false
  );

  const isSelected = openItem.findIndex(id => id === item.id) > -1;
  useMapFormToState({
    listFormCode: item.dialogConfig ? item.dialogConfig.formCode : [],
    dependencies: [],
  });
  const iconSelectedColor =
    theme.palette.mode === "dark" && drawerOpen
      ? "text.primary"
      : "primary.main";
  const [visibleAddNewFormDialog, setVisibleAddNewFormDialog] =
    React.useState(false);
  const handleOpenAddNewFormDialog = React.useCallback(() => {
    // handleCloseItem()
    setVisibleAddNewFormDialog(true);
    handleRefreshForm();
  }, []);
  const handleCloseAddNewFormDialog = () => {
    setVisibleAddNewFormDialog(false);
  };

  const handleRefreshForm = () => {
    setIsRefreshForm(true);
    setTimeout(() => {
      setIsRefreshForm(false);
    }, 500);
  };

  return (
    <>
      {menuOrientation === LAYOUT_CONST.VERTICAL_LAYOUT || downLG ? (
        <ListItemButton
          onClick={event => {
            handleOpenAddNewFormDialog();
          }}
          disabled={item.disabled}
          selected={isSelected}
          sx={{
            zIndex: 1201,
            pl: drawerOpen ? `${level * 28}px` : 1.5,
            py: !drawerOpen && level === 1 ? 1.25 : 1,
            ...(drawerOpen && {
              "&:hover": {
                bgcolor:
                  theme.palette.mode === "dark" ? "divider" : "primary.lighter",
              },
              "&.Mui-selected": {
                bgcolor:
                  theme.palette.mode === "dark" ? "divider" : "primary.lighter",
                borderRight: `2px solid ${theme.palette.primary.main}`,
                color: "#CFD6DD",
                "&:hover": {
                  color: "#CFD6DD",
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "divider"
                      : "primary.lighter",
                },
              },
            }),
          }}
          {...(matchDownLg && {
            onClick: () => dispatch(openDrawer(false)),
          })}
          className={`${!drawerOpen ? classes.listItemDrawerClose : ""}`}
        >
          {itemIcon && (
            <ListItemIcon
              className={`${
                !drawerOpen ? classes.listItemIconDrawerClose : ""
              }`}
              sx={{
                ...(!drawerOpen && {
                  "&:hover": {
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "secondary.light"
                        : "secondary.lighter",
                  },
                }),
                ...(!drawerOpen &&
                  isSelected && {
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "primary.900"
                        : "primary.lighter",
                    "&:hover": {
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "primary.darker"
                          : "primary.lighter",
                    },
                  }),
              }}
            >
              {itemIcon}
            </ListItemIcon>
          )}
          {(drawerOpen || (!drawerOpen && level !== 1)) && (
            <ListItemText
              primary={
                <Typography variant="h6" className={classes.textColor}>
                  {item.title}
                </Typography>
              }
            />
          )}
          {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
            <Chip
              color={item.chip.color}
              variant={item.chip.variant}
              size={item.chip.size}
              label={item.chip.label}
              avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
            />
          )}
        </ListItemButton>
      ) : (
        <ListItemButton
          onClick={event => {
            handleOpenAddNewFormDialog();
          }}
          className={`${!drawerOpen ? classes.listItemIconDrawerClose : ""} ${
            classes.notMenuOrientation
          }`}
          disabled={item.disabled}
          selected={isSelected}
          sx={{
            ...(drawerOpen && {
              "&.Mui-selected": {
                color: iconSelectedColor,
                "&:hover": {
                  color: iconSelectedColor,
                },
              },
            }),
          }}
        >
          {itemIcon && (
            <ListItemIcon
              className={`${
                !drawerOpen ? classes.listItemIconIsIconDrawerClose : ""
              } ${classes.bgTransparentOnlyHover} ${
                !drawerOpen && isSelected ? classes.bgTransparent : ""
              }`}
            >
              {itemIcon}
            </ListItemIcon>
          )}

          {!itemIcon && (
            <ListItemIcon
              sx={{
                color: isSelected ? "primary.main" : "secondary.main",
              }}
              className={`${
                !drawerOpen && isSelected ? classes.bgTransparent : ""
              } ${!drawerOpen ? classes.listItemIconNotIconDrawerClose : ""}`}
            >
              <Dot size={4} color={isSelected ? "primary" : "secondary"} />
            </ListItemIcon>
          )}
          <ListItemText
            primary={
              <Typography variant="h6" color="inherit">
                {item.title}
              </Typography>
            }
          />
          {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
            <Chip
              color={item.chip.color}
              variant={item.chip.variant}
              size={item.chip.size}
              label={item.chip.label}
              avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
            />
          )}
        </ListItemButton>
      )}
      <BaseDialogCreate
        currentId={globalFundId ? globalFundId : ""}
        isRefreshForm={isRefreshForm}
        currentStatus={userRole === 1 ? "show" : "create"}
        // isDisabled={false}
        dialogConfig={
          item?.dialogConfig?.dialogCode
            ? formConfigFiles[item?.dialogConfig?.dialogCode]
            : undefined
        }
        visible={visibleAddNewFormDialog}
        onCloseDialogForm={handleCloseAddNewFormDialog}
        handleRefresh={() => {
          // handleRefresh();
        }}
        parentId={{
          id: globalFundId ? globalFundId : "",
        }}
        submitParentData={{}}
        checkerAPI={{
          approve:
            item?.dialogConfig?.dialogCode &&
            formConfigFiles[item?.dialogConfig?.dialogCode]
              ? formConfigFiles[item?.dialogConfig?.dialogCode].apiSubmit
                  .approveUrl
              : "",
          deny: "",
          cancelApprove: "",
          cancelAccountingEntry: {
            url: "",
            id: "",
          },
        }}
        workFollowStatus={userRole === 1 ? "5" : "1"}
        checkerApprove={true}
        checkerCancelAccountingEntry={true}
        useCurrentRecordId={false}
      />
    </>
  );
};
const NavOpenForm = React.memo(NavOpenFormComponent);
export { NavOpenForm };
