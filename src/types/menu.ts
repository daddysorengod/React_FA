import { ReactNode } from "react";

// material-ui
import { ChipProps } from "@mui/material";

import { GenericCardProps } from "./root";
import { IForm } from "./field";

// ==============================|| MENU TYPES  ||============================== //

export type NavItemType = {
  breadcrumbs?: boolean;
  caption?: ReactNode | string;
  children?: NavItemType[];
  elements?: NavItemType[];
  chip?: ChipProps;
  color?: "primary" | "secondary" | "default" | undefined;
  disabled?: boolean;
  external?: boolean;
  icon?: GenericCardProps["iconPrimary"] | string;
  id?: string;
  search?: string;
  target?: boolean;
  title?: ReactNode | string;
  type?: string;
  url?: string | undefined;
  dialogCode?: string[];
  dialogConfig?: {
    dialogCode?: string,
    formCode?: string[]
  }
};

export type LinkTarget = "_blank" | "_self" | "_parent" | "_top";

export type MenuProps = {
  openItem: string[];
  activeTab: string;
  openComponent: string;
  selectedID: string | null;
  drawerOpen: boolean;
  componentDrawerOpen: boolean;
  menuDashboard: NavItemType;
  error: null;
  baseRouteApi?: string | null;
  routeConfig: IRouteConfigMenu;
  roleType: "FA" | "SB";
  isLoading: boolean;
};

export interface IRouteConfigMenu {
  fetchDataUrl: string;
  fetchByIdUrl: string;
  fetchByManyIdUrl: string;
  insertUpdateUrl: string;
  insertUpdateManyUrl: string;
  deleteUrl: string;
  deleteManyUrl: string;
  activeDeActiveUrl: string;
  exportToXlsxFile: string;
}
