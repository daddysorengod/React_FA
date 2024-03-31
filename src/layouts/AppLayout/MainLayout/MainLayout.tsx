import { useEffect, useState, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Container, Toolbar, useMediaQuery } from "@mui/material";

// project import
import Drawer from "./Drawer/MainDrawer";
import Header from "./Header/Header";
import HorizontalBar from "./Drawer/HorizontalBar";
import Breadcrumbs from "@components/@extended/Breadcrumbs";

import useConfig from "@hooks/useConfig";
import { openDrawer } from "@store/reducers/menu";

// types
import { RootStateProps } from "@app/types/root";
import { LAYOUT_CONST } from "@app/types/config";

// ==============================|| MAIN LAYOUT ||============================== //

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down("xl"));
  const downLG = useMediaQuery(theme.breakpoints.down("lg"));

  const { container, miniDrawer, menuOrientation } = useConfig();
  const dispatch = useDispatch();

  const isHorizontal =
    menuOrientation === LAYOUT_CONST.HORIZONTAL_LAYOUT && !downLG;

  const menu = useSelector((state: RootStateProps) => state.menu);
  const { drawerOpen } = menu;

  // drawer toggler
  const [open, setOpen] = useState(
    // !miniDrawer ||
    drawerOpen,
  );
  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch(openDrawer({ drawerOpen: !open }));
  };

  // set media wise responsive drawer
  useEffect(() => {
    if (!miniDrawer) {
      setOpen(!matchDownLG);
      dispatch(openDrawer({ drawerOpen: !matchDownLG }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownLG]);

  // useEffect(() => {
  //   if (open !== drawerOpen) {
  //     setOpen(drawerOpen);
  //   }
  // }, [drawerOpen]);

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Header open={drawerOpen} handleDrawerToggle={handleDrawerToggle} />
      {!isHorizontal ? (
        <Drawer open={drawerOpen} handleDrawerToggle={handleDrawerToggle} />
      ) : (
        <HorizontalBar />
      )}
      <Box
        component="main"
        sx={{
          width: {
            xs: "calc(100% - 260px - 32px)",
            sm: "calc(100% - 260px - 48px)",
          },
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
        }}
      >
        <Toolbar sx={{ mt: isHorizontal ? 8 : "inherit", minHeight: "36px" }} />
        <Box
          sx={{
            height: "calc(100vh - 116px)",
            marginTop: "16px",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
