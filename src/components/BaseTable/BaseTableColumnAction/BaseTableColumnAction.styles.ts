import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      display: "block",
      marginBottom: "4px",
      fontSize: "14px",
      lineHeight: "20px",
      fontWeight: "600",
    },
    input: {
      width: "100%",
      "& input": {
        boxSizing: "border-box",
        display: "block",
        fontSize: "14px",
        lineHeight: "20px",
        height: "32px",
        padding: "6px 8px",
        borderRadius: "4px",
      },
    },
    dateInput: {
      width: "100%",
      "& input": {
        boxSizing: "border-box",
        display: "block",
        fontSize: "14px",
        lineHeight: "20px",
        height: "32px",
        padding: "6px 8px",
        borderRadius: "4px",
        border: "none !important",
      },
    },
    select: {
      "& .MuiInputBase-root": {
        padding: "0 40px 0 0",
        "& input": {
          boxSizing: "border-box",
          fontSize: "14px",
          lineHeight: "20px",
          height: "32px",
          padding: "6px 8px !important",
          borderRadius: "4px",
        },
      },
    },
    buttonGroup: {
      marginTop: "24px",
      display: "flex",
      justifyContent: "space-between",
    },
    clearButton: {
      backgroundColor: "#E2E6EA",
      color: "#272E36",
      width: "138px",
      padding: "6px auto",
      fontWeight: "600",
      fontSize: "14px",
      lineHeight: "20px",
      textTransform: "initial",
      "&:hover": { backgroundColor: "#d1d6db" },
    },
    searchButton: {
      backgroundColor: "#04A857",
      color: "#DDF6E8",
      width: "138px",
      padding: "6px auto",
      fontWeight: "600",
      fontSize: "14px",
      lineHeight: "20px",
      textTransform: "initial",
      "&:hover": { backgroundColor: "#028343" },
    },
  }),
);
