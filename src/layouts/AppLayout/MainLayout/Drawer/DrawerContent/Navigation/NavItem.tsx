import {
  forwardRef,
  useEffect,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";

// next
import { useRouter } from "next/router";
import NextLink from "next/link";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Chip,
  Link,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";

// project import
import Dot from "@app/components/@extended/Dot";
import useConfig from "@hooks/useConfig";
import { dispatch, useSelector } from "@store/store";
import { activeItem, openDrawer } from "@store/reducers/menu";

// types
import { LinkTarget, NavItemType } from "@app/types/menu";
import { LAYOUT_CONST } from "@app/types/config";

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

interface Props {
  item: NavItemType;
  level: number;
}

const NavItem = ({ item, level }: Props) => {
  const theme = useTheme();

  const menu = useSelector(state => state.menu);
  const matchDownLg = useMediaQuery(theme.breakpoints.down("lg"));
  const { drawerOpen, openItem } = menu;

  const downLG = useMediaQuery(theme.breakpoints.down("lg"));

  const { menuOrientation } = useConfig();
  let itemTarget: LinkTarget = "_self";
  if (item.target) {
    itemTarget = "_blank";
  }

  let listItemProps: {
    component:
      | ForwardRefExoticComponent<RefAttributes<HTMLAnchorElement>>
      | string;
    href?: string;
    target?: LinkTarget;
  } = {
    component: forwardRef((props, ref) => (
      <NextLink {...props} passHref target={itemTarget} href={item.url!} />
    )),
  };
  if (item?.external) {
    listItemProps = { component: "a", href: item.url, target: itemTarget };
  }

  const Icon = item.icon!;
  const itemIcon = item.icon ? (
    <Icon style={{ fontSize: drawerOpen ? "1rem" : "1.25rem" }} />
  ) : (
    false
  );

  const isSelected = openItem.findIndex(id => id === item.id) > -1;

  const router = useRouter();
  const { asPath } = router;

  // active menu item on page load
  useEffect(() => {
    if (asPath === item.url) {
      dispatch(activeItem({ openItem: [item.id] }));
      dispatch({
        type: "menu/setActiveTab",
        payload: asPath,
      });
    }
    // eslint-disable-next-line
  }, [asPath]);

  const textColor = theme.palette.mode === "dark" ? "grey.400" : "text.primary";
  const iconSelectedColor =
    theme.palette.mode === "dark" && drawerOpen
      ? "text.primary"
      : "primary.main";

  return (
    <>
      {menuOrientation === LAYOUT_CONST.VERTICAL_LAYOUT || downLG ? (
        <ListItemButton
          {...listItemProps}
          // onClick={(event) => {
          //   // if (item.url) router.push(`${item.url}`);
          // }}
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
                // color: iconSelectedColor,
                color: "#CFD6DD",
                "&:hover": {
                  // color: iconSelectedColor,
                  color: "#CFD6DD",
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "divider"
                      : "primary.lighter",
                },
              },
            }),
            ...(!drawerOpen && {
              "&:hover": {
                bgcolor: "transparent",
              },
              "&.Mui-selected": {
                "&:hover": {
                  bgcolor: "transparent",
                },
                bgcolor: "transparent",
              },
            }),
          }}
          {...(matchDownLg && {
            onClick: () => dispatch(openDrawer(false)),
          })}
        >
          {itemIcon && (
            <ListItemIcon
              sx={{
                minWidth: 28,
                // color: isSelected ? iconSelectedColor : textColor,
                color: "#CFD6DD",
                ...(!drawerOpen && {
                  borderRadius: 1.5,
                  width: 36,
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
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
                <Typography
                  variant="h6"
                  sx={{
                    color: "#CFD6DD",
                  }}
                >
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
          {...listItemProps}
          disabled={item.disabled}
          selected={isSelected}
          sx={{
            zIndex: 1201,
            ...(drawerOpen && {
              "&:hover": {
                bgcolor: "transparent",
              },
              "&.Mui-selected": {
                bgcolor: "transparent",
                color: iconSelectedColor,
                "&:hover": {
                  color: iconSelectedColor,
                  bgcolor: "transparent",
                },
              },
            }),
            ...(!drawerOpen && {
              "&:hover": {
                bgcolor: "transparent",
              },
              "&.Mui-selected": {
                "&:hover": {
                  bgcolor: "transparent",
                },
                bgcolor: "transparent",
              },
            }),
          }}
        >
          {itemIcon && (
            <ListItemIcon
              sx={{
                minWidth: 36,
                ...(!drawerOpen && {
                  borderRadius: 1.5,
                  width: 36,
                  height: 36,
                  alignItems: "center",
                  justifyContent: "flex-start",
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                }),
                ...(!drawerOpen &&
                  isSelected && {
                    bgcolor: "transparent",
                    "&:hover": {
                      bgcolor: "transparent",
                    },
                  }),
              }}
            >
              {itemIcon}
            </ListItemIcon>
          )}

          {!itemIcon && (
            <ListItemIcon
              sx={{
                color: isSelected ? "primary.main" : "secondary.main",
                ...(!drawerOpen && {
                  borderRadius: 1.5,
                  alignItems: "center",
                  justifyContent: "flex-start",
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                }),
                ...(!drawerOpen &&
                  isSelected && {
                    bgcolor: "transparent",
                    "&:hover": {
                      bgcolor: "transparent",
                    },
                  }),
              }}
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
    </>
  );
};

export default NavItem;
