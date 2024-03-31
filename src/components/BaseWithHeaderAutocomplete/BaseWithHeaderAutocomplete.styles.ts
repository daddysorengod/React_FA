import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";

export interface CustomAutoCompleteWithHeaderStylesProps {
  tableBorderRadius?: number;
}

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
    },
    table: {
      position: "absolute",
      zIndex: "3",
      width: "auto",
      minHeight: "unset !important",
      borderRadius: `4px`,
      overflow: "hidden",
    },
    headRow: {
      height: "36px",
      backgroundColor: "#E2E6EA",
      display: "flex",
    },
    headCell: {
      height: "auto",
      display: "inline-flex",
      padding: "8px 12px",
      alignItems: "center",
      borderColor: "#CFD6DD",
      borderWidth: "1px 1px 2px 0",
      borderStyle: "solid",
      fontWeight: "600",
      fontSize: "12px",
      "&:nth-child(1)": {
        borderWidth: "1px 1px 2px 1px",
      },
      "&:nth-last-child(1)": {
        borderWidth: "1px 1px 2px 0px",
      },
    },
    body: {
      overflow: "auto",
      position: "relative",
      "&::-webkit-scrollbar": {
        // width: "0",
      },
    },
    bodyRow: {
      backgroundColor: "#fff",
      display: "flex",
      padding: "0",
      position: "relative",
      overflow: "hidden",
      alignItems: "stretch",

      "&:hover": {
        backgroundColor: "#DDF6E8",
      },
    },
    bodyCell: {
      maxHeight: "max-content",
      display: "inline-flex",
      padding: "8px 12px",
      alignItems: "center",
      border: "1px solid #CFD6DD",
      borderWidth: "0 1px 1px 0",
      fontSize: "14px",
      textWrap: "initial",
      overflowX: "hidden",
      "&:nth-child(1)": {
        borderWidth: "0px 1px 1px 1px",
      },
      "&:nth-last-child(1)": {
        borderWidth: "0 1px 1px 1px",
      },
    },
    noOption: {
      color: "#C0C0C0",
      border: "1px solid #CFD6DD",
      borderWidth: "0 1px 1px 1px",
      height: "60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    autoValidateTootip: {
      padding: "6px",
      cursor: "pointer",
      right: "28px",
      position: "absolute",
    },
  }),
);
