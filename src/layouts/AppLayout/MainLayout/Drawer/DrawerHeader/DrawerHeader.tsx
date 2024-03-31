import { useEffect, useState } from "react";
// material-ui
import { useTheme } from "@mui/material/styles";
import { ButtonBase, useMediaQuery } from "@mui/material";

// project import
import DrawerHeaderStyled from "./DrawerHeader.Styles";
import Logo from "@components/logo";
import useConfig from "@hooks/useConfig";

// types
import { LAYOUT_CONST } from "@app/types/config";
// store
import { openDrawer } from "@store/reducers/menu";
import { useDispatch, useSelector } from "react-redux";
import { RootStateProps } from "@app/types/root";

import MenuIcon from "@mui/icons-material/Menu";
import { ImagesSvg } from "@/src/constants/images";


// ==============================|| DRAWER HEADER ||============================== //
const logo = ImagesSvg.logoVpb2;
interface Props {
  open: boolean;
}

const DrawerHeader = ({ open }: Props) => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down("lg"));
  const dispatch = useDispatch();

  const { menuOrientation } = useConfig();
  const isHorizontal =
    menuOrientation === LAYOUT_CONST.HORIZONTAL_LAYOUT && !downLG;
  const menu = useSelector((state: RootStateProps) => state.menu);
  const { drawerOpen } = menu;
  const handleDrawerToggle = () => {
    dispatch(openDrawer({ drawerOpen: !drawerOpen }));
  };
  return (
    <DrawerHeaderStyled
      theme={theme}
      open={open}
      sx={{
        minHeight: isHorizontal ? "unset" : "60px",
        paddingTop: isHorizontal ? { xs: "10px", lg: "0" } : "8px",
        paddingBottom: isHorizontal ? { xs: "18px", lg: "0" } : "8px",
        paddingLeft: isHorizontal
          ? { xs: "24px", lg: "0" }
          : drawerOpen
          ? "24px"
          : 0,
        paddingRight: drawerOpen ? "24px" : 0,
        backgroundColor: "#1A1D1F",
        display: "flex",
        justifyContent: !drawerOpen ? "center" : "space-between",
        position: 'sticky',
        top: 0,
        zIndex: 4000,
      }}
    >
      {drawerOpen ? <img src={logo} alt="VPBank" /> : <></>}
      <ButtonBase>
        <MenuIcon
          sx={{ color: "#fff" }}
          onClick={() => {
            handleDrawerToggle();
          }}
        />
      </ButtonBase>
    </DrawerHeaderStyled>
  );
};

export default DrawerHeader;
