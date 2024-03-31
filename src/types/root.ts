import { ComponentClass, FunctionComponent } from "react";

// material-ui
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

// types
import { SnackbarProps } from "./snackbar";
import { MenuProps } from "./menu";
import { GeneralProps } from "./general";
import { FormBuilderProps } from "./formBuilder";
import { AuthProps } from "./auth";

// ==============================|| ROOT TYPES  ||============================== //

export type RootStateProps = {
  snackbar: SnackbarProps;
  menu: MenuProps;
  formBuilder: FormBuilderProps;
  general: GeneralProps;
  auth: AuthProps
};

export type KeyedObject = {
  [key: string]: string | number | KeyedObject | any;
};

export type OverrideIcon =
  | (OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
      muiName: string;
    })
  | ComponentClass<any>
  | FunctionComponent<any>;

export interface GenericCardProps {
  title?: string;
  primary?: string | number | undefined;
  secondary?: string;
  content?: string;
  image?: string;
  dateTime?: string;
  iconPrimary?: OverrideIcon;
  color?: string;
  size?: string;
}
