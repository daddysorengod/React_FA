import { useSelector } from "react-redux";

// material-ui
import { useMediaQuery, useTheme } from "@mui/material";

// project import
import Navigation from "./Navigation/Navigation";
// import SimpleBar from '@components/third-party/SimpleBar';

// types
import { RootStateProps } from "@app/types/root";
import { useRouter } from "next/router";

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));

  const menu = useSelector((state: RootStateProps) => state.menu);
  const { drawerOpen } = menu;
  const route = useRouter();

  const isNotFoundPage = route?.pathname === "/404";
  if (isNotFoundPage) {
    return <></>;
  }
  return (
    // <SimpleBar
    //   sx={{
    //     '& .simplebar-content': {
    //       display: 'flex',
    //       flexDirection: 'column'
    //     }
    //   }}
    // >
    // <Fragment>
    <Navigation />
    // </Fragment>
    // </SimpleBar>
  );
};

export default DrawerContent;
