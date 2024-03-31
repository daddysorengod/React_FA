import React, { lazy, Suspense, ReactElement } from "react";

// material-ui
import { styled } from "@mui/material/styles";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";

import MainLayout from "./MainLayout/MainLayout";
/// import store

import { dispatch, useSelector } from "@store/store";
import { RootStateProps } from "@app/types/root";

// ==============================|| Loader ||============================== //

const LoaderWrapper = styled("div")(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 2001,
  width: "100%",
  "& > * + *": {
    marginTop: theme.spacing(2),
  },
}));

export interface LoaderProps extends LinearProgressProps {}

const Loader = () => (
  <LoaderWrapper>
    <LinearProgress color="primary" />
  </LoaderWrapper>
);

// ==============================|| LAYOUTS - STRUCTURE ||============================== //

interface Props {
  children: ReactElement;
  variant?: "main" | "blank" | "landing" | "simple" | "component" | "auth";
}

const AppLayoutComponent = ({ variant = "main", children }: Props) => {
  const { isLoading } = useSelector((state: RootStateProps) => state.menu);

  return (
    <MainLayout>
      {isLoading && <Loader />}
      {children}
    </MainLayout>
  );
};
const AppLayout = React.memo(AppLayoutComponent);
export { AppLayout };
