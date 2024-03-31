import { useMemo } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Drawer, useMediaQuery } from "@mui/material";

// project import
import DrawerHeader from "./DrawerHeader/DrawerHeader";
import DrawerContent from "./DrawerContent/DrawerContent";
import MiniDrawerStyled from "./MiniDrawerStyled";
import { DRAWER_WIDTH } from "@configs/config";

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

interface Props {
  open: boolean;
  window?: () => Window;
  handleDrawerToggle?: () => void;
}

const MainDrawer = ({ open, handleDrawerToggle, window }: Props) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));

  // responsive drawer container
  const container =
    window !== undefined ? () => window().document.body : undefined;

  // header content
  const drawerHeader = useMemo(() => <DrawerHeader open={open} />, [open]);
  const drawerContent = useMemo(() => <DrawerContent />, []);
  
  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { md: 0 },
        zIndex: 1200,
        // backgroundColor: "#1A1D1F",
      }}
      aria-label="mailbox folders"
    >
      {!matchDownMD ? (
        <MiniDrawerStyled variant="permanent" open={open}>
          {drawerHeader}
          {drawerContent}
        </MiniDrawerStyled>
      ) : (
        <Drawer
          container={container}
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundImage: "none",
              boxShadow: "inherit",
            },
          }}
        >
          {drawerHeader}
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

export default MainDrawer;
