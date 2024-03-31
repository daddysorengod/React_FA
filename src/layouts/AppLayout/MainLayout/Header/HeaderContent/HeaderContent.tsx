import { useMemo } from "react";

// material-ui
import { Theme } from "@mui/material/styles";
import { Box, Button, useMediaQuery } from "@mui/material";

// project import
import Search from "./Search/Search";

import useConfig from "@hooks/useConfig";
import DrawerHeader from "../../Drawer/DrawerHeader/DrawerHeader";

// type
import { LAYOUT_CONST } from "@app/types/config";

import { RoleButton } from "./RoleButton";
import { ProfileLayout } from "./ProfileLayout";
import { FundSearch } from "./FundSearch";
import { useSelector } from "@/src/store";
import { RootStateProps } from "@/src/types/root";

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const { menuOrientation } = useConfig();

  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));

  return (
    <>
      {menuOrientation === LAYOUT_CONST.HORIZONTAL_LAYOUT && !downLG && (
        <DrawerHeader open={true} />
      )}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: !downLG ? "space-between" : "flex-end",
        }}
      >
        {!downLG && <FundSearch />}
        {/* <RoleButton /> */}
        <ProfileLayout />
      </div>
    </>
  );
};

export default HeaderContent;
