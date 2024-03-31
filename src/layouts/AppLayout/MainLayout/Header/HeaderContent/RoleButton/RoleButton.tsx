import React from "react";
import { useStyles } from "./RoleButton.styles";
import useTranslation from "next-translate/useTranslation";
import {
  FormControl,
  ButtonBase,
} from "@mui/material";
/// import store
import { useDispatch } from "react-redux";
import { dispatch, useSelector } from "@store/store";
import { RootStateProps } from "@app/types/root";
import { setRoleType } from "@/src/store/reducers/menu";
/// end import store

const roleType = {
  FA: "FA",
  SB: "SB",
};
interface Props {}
const RoleButtonComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { roleType } = useSelector((state: RootStateProps) => state.menu);
  const changeRoleType = (role: "FA" | "SB") => {
    dispatch(setRoleType(role));
  };
  return (
    <div className={classes.roleButtonContainer}>
      <FormControl sx={{ width: { xs: "100%", md: 360 } }}>
        <div className={classes.flexCol}>
          <ButtonBase
            className={
              roleType === "FA" ? classes.activeButton : classes.inactiveButton
            }
            onClick={() => {
              changeRoleType("FA");
            }}
          >
            Kế toán quỹ (FA)
          </ButtonBase>
          <ButtonBase
            className={
              roleType === "SB" ? classes.activeButton : classes.inactiveButton
            }
            onClick={() => {
              changeRoleType("SB");
            }}
          >
            Ngân hàng giám sát (SB)
          </ButtonBase>
        </div>
      </FormControl>
    </div>
  );
};
const RoleButton = React.memo(RoleButtonComponent);

export { RoleButton };
