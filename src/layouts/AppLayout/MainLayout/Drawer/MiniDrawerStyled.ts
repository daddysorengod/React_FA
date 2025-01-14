// material-ui
import { styled, Theme, CSSObject } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";

// project import
import { DRAWER_WIDTH } from "@configs/config";

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  borderRight: `0px solid ${theme.palette.divider}`,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  boxShadow: theme.palette.mode === "dark" ? theme.customShadows.z1 : "none",
  backgroundColor: "#1A1D1F",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: theme.spacing(7.5),
  borderRight: "none",
  boxShadow: theme.customShadows.z1,
  backgroundColor: "#1A1D1F",
});

// ==============================|| DRAWER - MINI STYLED ||============================== //

const MiniDrawerStyled = styled(Drawer, {
  shouldForwardProp: prop => prop !== "open",
})(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default MiniDrawerStyled;
