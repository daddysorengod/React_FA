import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    container: {
      height: "100%",
      overflow: "hidden",
    },
    pageTitle: {
      fontSize: "20px",
      fontWeight: "700",
      lineHeight: "32px",
      marginBottom: "12px",
    },
    top: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      marginBottom: "16px",
    },
    tabs: {
      flexGrow: "1",
      borderBottom: "1px solid #E2E6EA",
    },
    tabTitle: {
      fontWeight: "600",
    },
    topLeft: {
      width: "360px",
      marginLeft: "24px",
    },
    detailEntry: {
      fontSize: "16px",
      fontWeight: "700",
      lineHeight: "24px",
      marginBottom: "8px",
    },
    detailEntryTable:{
      height: "calc(100% - 32px)",
    },
    mgB:{
      marginBottom: "20px",
    },
    mainTable:{
      height: "calc(100% - 110px)"
    }
  }),
);
