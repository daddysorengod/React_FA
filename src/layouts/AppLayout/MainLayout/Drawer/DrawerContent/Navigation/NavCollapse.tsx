import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Collapse,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Typography,
  useMediaQuery,
} from "@mui/material";

// project import
import NavItem from "./NavItem";
import Dot from "@components/@extended/Dot";
import Transitions from "@components/@extended/Transitions";

import useConfig from "@hooks/useConfig";
import { dispatch, useSelector } from "@store/store";
import { activeItem } from "@store/reducers/menu";

// assets
import {
  BorderOutlined,
  DownOutlined,
  UpOutlined,
  RightOutlined,
} from "@ant-design/icons";

// types
import { NavItemType } from "@app/types/menu";
import { LAYOUT_CONST } from "@app/types/config";
import { NavOpenForm } from "./NavItemOpenForm";

type VirtualElement = {
  getBoundingClientRect: () => ClientRect | DOMRect;
  contextElement?: Element;
};

// mini-menu - wrapper
const PopperStyled = styled(Popper)(({ theme }) => ({
  overflow: "visible",
  zIndex: 1202,
  minWidth: 180,
  "&:before": {
    content: '""',
    display: "block",
    position: "absolute",
    top: 38,
    left: -5,
    width: 10,
    height: 10,
    backgroundColor: theme.palette.background.paper,
    transform: "translateY(-50%) rotate(45deg)",
    zIndex: 120,
    borderLeft: `1px solid ${theme.palette.grey.A800}`,
    borderBottom: `1px solid ${theme.palette.grey.A800}`,
  },
}));

// ==============================|| NAVIGATION - LIST COLLAPSE ||============================== //

interface Props {
  menu: NavItemType;
  level: number;
  parentId: string;
  setSelectedItems: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedItems: string | undefined;
  setSelectedLevel: React.Dispatch<React.SetStateAction<number>>;
  selectedLevel: number;
}

const NavCollapse = ({
  menu,
  level,
  parentId,
  setSelectedItems,
  selectedItems,
  setSelectedLevel,
  selectedLevel,
}: Props) => {
  const theme = useTheme();

  const downLG = useMediaQuery(theme.breakpoints.down("lg"));
  const menuState = useSelector(state => state.menu);

  const { drawerOpen } = menuState;
  const { menuOrientation } = useConfig();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null | undefined>(null);
  const [anchorEl, setAnchorEl] = useState<
    VirtualElement | (() => VirtualElement) | null | undefined
  >(null);

  const handleClick = (
    event:
      | React.MouseEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | undefined,
  ) => {
    setAnchorEl(null);
    setSelectedLevel(level);
    if (drawerOpen) {
      setOpen(!open);
      setSelected(!selected ? menu.id : null);
      setSelectedItems(!selected ? menu.id : "");
      if (menu.url) router.push(`${menu.url}`);
    } else {
      setAnchorEl(event?.currentTarget);
    }
  };

  const handleCloseItemCollapse = () => {
    setOpen(false);
    setSelected(null);
    // setSelectedItems("");
    setAnchorEl(null);
  };

  const handlerIconLink = () => {
    if (!drawerOpen) {
      if (menu.url) router.push(`${menu.url}`);
    }
  };

  const handleHover = (
    event:
      | React.MouseEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | undefined,
  ) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    setAnchorEl(null);
  };

  useMemo(() => {
    if (selected === selectedItems) {
      if (level === 1) {
        setOpen(true);
      }
    } else {
      if (level === selectedLevel) {
        setOpen(false);
        setSelected(null);
      }
    }
  }, [selectedItems, level, selected, selectedLevel]);

  const { asPath } = router;
  const openMini = Boolean(anchorEl);

  const checkOpenForParent = (child: NavItemType[], id: string) => {
    child.forEach((item: NavItemType) => {
      if (item.url === asPath) {
        setOpen(true);
        setSelected(id);
      }
    });
  };

  // menu collapse for sub-levels
  useEffect(() => {
    setOpen(false);
    setSelected(null);
    if (openMini) setAnchorEl(null);
    if (menu.children) {
      menu.children.forEach((item: NavItemType) => {
        if (item.children?.length) {
          checkOpenForParent(item.children, menu.id!);
        }
        if (item.url === asPath) {
          setSelected(menu.id);
          setOpen(true);
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath, menu.children]);

  useEffect(() => {
    if (menu.url === asPath) {
      dispatch(activeItem({ openItem: [menu.id] }));
      setSelected(menu.id);
      setAnchorEl(null);
      setOpen(true);
    }
  }, [asPath, menu]);

  const navCollapse = menu.children?.map(item => {
    switch (item.type) {
      case "collapse":
        return (
          <NavCollapse
            key={item.id}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedItems={selectedItems}
            menu={item}
            level={level + 1}
            parentId={parentId}
          />
        );
      case "item":
        return <NavItem key={item.id} item={item} level={level + 1} />;
      case "open-form":
        return (
          <NavOpenForm
            handleCloseItem={() => {
              // handleClose();
              handleCloseItemCollapse();
            }}
            key={item.id}
            item={item}
            level={level + 1}
          />
        );
      default:
        return (
          // <Typography key={item.id} variant="h6" color="error" align="center">
          //   Có lỗi xảy ra !!!
          // </Typography>
          <></>
        );
    }
  });
  const isSelected = selected === menu.id;
  const borderIcon =
    level === 1 ? <BorderOutlined style={{ fontSize: "1rem" }} /> : null;
  const Icon = menu.icon!;
  const menuIcon = menu?.icon ? (
    <Icon style={{ fontSize: drawerOpen ? "1rem" : "1.25rem" }} />
  ) : null;
  const textColor = theme.palette.mode === "dark" ? "grey.400" : "text.primary";
  const iconSelectedColor =
    theme.palette.mode === "dark" && drawerOpen
      ? theme.palette.text.primary
      : theme.palette.primary.main;
  const popperId = openMini ? `collapse-pop-${menu.id}` : undefined;
  const FlexBox = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  };
  return (
    <>
      {menuOrientation === LAYOUT_CONST.VERTICAL_LAYOUT || downLG ? (
        <>
          <ListItemButton
            disableRipple
            selected={selected === menu.id}
            {...(!drawerOpen && {
              onMouseEnter: handleClick,
              onMouseLeave: handleClose,
            })}
            onClick={handleClick}
            sx={{
              pl: drawerOpen ? `${level * 28}px` : 1.5,
              py: !drawerOpen && level === 1 ? 1.25 : 1,
              ...(drawerOpen && {
                "&:hover": {
                  bgcolor: "#454D59",
                },
                "&.Mui-selected": {
                  bgcolor: "#454D59",
                  color: "#CFD6DD",
                  "&:hover": {
                    color: "#CFD6DD",
                    bgcolor: "#454D59",
                  },
                },
              }),
              ...(!drawerOpen && {
                "&:hover": {
                  bgcolor: "#454D59",
                },
                "&.Mui-selected": {
                  "&:hover": {
                    bgcolor: "#454D59",
                  },
                  bgcolor: "transparent",
                },
              }),
            }}
          >
            {menuIcon ? (
              <ListItemIcon
                onClick={handlerIconLink}
                sx={{
                  minWidth: 28,
                  color: "#CFD6DD",
                  ...(!drawerOpen && {
                    borderRadius: 1.5,
                    width: 36,
                    height: 36,
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      bgcolor: "#454D59",
                    },
                  }),
                  ...(!drawerOpen &&
                    selected === menu.id && {
                      bgcolor: "#454D59",
                      "&:hover": {
                        bgcolor: "#454D59",
                      },
                    }),
                }}
              >
                {menuIcon}
              </ListItemIcon>
            ) : null}
            {(drawerOpen || (!drawerOpen && level !== 1)) && (
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ color: "#CFD6DD" }}>
                    {menu.title}
                  </Typography>
                }
                secondary={
                  menu.caption && (
                    <Typography variant="caption" sx={{ color: "#CFD6DD" }}>
                      {menu.caption}
                    </Typography>
                  )
                }
              />
            )}
            {(drawerOpen || (!drawerOpen && level !== 1)) &&
              (openMini || open ? (
                <UpOutlined
                  style={{
                    fontSize: "0.625rem",
                    marginLeft: 1,
                    color: "#CFD6DD",
                  }}
                />
              ) : (
                <DownOutlined style={{ fontSize: "0.625rem", marginLeft: 1 }} />
              ))}

            {!drawerOpen && (
              <PopperStyled
                open={openMini}
                anchorEl={anchorEl}
                placement="right-start"
                sx={{
                  zIndex: 2001,
                }}
                popperOptions={{
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [-12, 1],
                      },
                    },
                  ],
                }}
              >
                {({ TransitionProps }) => (
                  <Transitions in={openMini} {...TransitionProps}>
                    <Paper
                      sx={{
                        overflow: "hidden",
                        mt: 1.5,
                        boxShadow: theme.customShadows.z1,
                        backgroundImage: "none",
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor: "#1A1D1F",
                      }}
                    >
                      <ClickAwayListener onClickAway={handleClose}>
                        <Box>{navCollapse}</Box>
                      </ClickAwayListener>
                    </Paper>
                  </Transitions>
                )}
              </PopperStyled>
            )}
          </ListItemButton>
          {drawerOpen && (
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List sx={{ p: 0 }}>{navCollapse}</List>
            </Collapse>
          )}
        </>
      ) : (
        <>
          <ListItemButton
            id={`boundary-${popperId}`}
            disableRipple
            selected={isSelected}
            onMouseEnter={handleHover}
            onMouseLeave={handleClose}
            onClick={handleHover}
            aria-describedby={popperId}
            sx={{
              "&.Mui-selected": {
                bgcolor: "#454D59",
              },
            }}
          >
            <Box onClick={handlerIconLink} sx={FlexBox}>
              {menuIcon && (
                <ListItemIcon
                  sx={{
                    my: "auto",
                    minWidth: !menu.icon ? 18 : 36,
                    color: "#CFD6DD",
                    // theme.palette.secondary.dark,
                  }}
                >
                  {menuIcon}
                </ListItemIcon>
              )}
              {!menuIcon && level !== 1 && (
                <ListItemIcon
                  sx={{
                    my: "auto",
                    minWidth: !menu.icon ? 18 : 36,
                    bgcolor: "transparent",
                    "&:hover": { bgcolor: "#454D59" },
                  }}
                >
                  <Dot
                    size={4}
                    sx={{ color: "#CFD6DD" }}
                  />
                </ListItemIcon>
              )}
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    color="inherit"
                    sx={{ my: "auto" }}
                  >
                    {menu.title}
                  </Typography>
                }
              />
              {openMini ? <RightOutlined /> : <DownOutlined />}
            </Box>

            {anchorEl && (
              <PopperStyled
                id={popperId}
                open={openMini}
                anchorEl={anchorEl}
                placement="right-start"
                style={{
                  zIndex: 2001,
                }}
                modifiers={[
                  {
                    name: "offset",
                    options: {
                      offset: [-10, 0],
                    },
                  },
                ]}
              >
                {({ TransitionProps }) => (
                  <Transitions in={openMini} {...TransitionProps}>
                    <Paper
                      sx={{
                        overflow: "hidden",
                        mt: 1.5,
                        py: 0.5,
                        boxShadow: theme.shadows[8],
                        backgroundImage: "none",
                      }}
                    >
                      <ClickAwayListener onClickAway={handleClose}>
                        <Box>{navCollapse}</Box>
                      </ClickAwayListener>
                    </Paper>
                  </Transitions>
                )}
              </PopperStyled>
            )}
          </ListItemButton>
        </>
      )}
    </>
  );
};

export default NavCollapse;
