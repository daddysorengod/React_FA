import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    label: {
      fontSize: 16,
      fontWeight: 700,
    },
    formContainer: {
      backgroundColor: "#F4F7FA",
    },
    formRow: {
      marginTop: 20,
    },
    submitBttContainer: {
      display: "flex",
      justifyContent: "end",
      marginTop: 20,
    },
    exportExcelButton: {
      boxShadow: "unset !important",
      backgroundColor: "#DDF6E8 !important",
      color: "#04A857 !important",
      padding: "6px 12px",
      textTransform: "unset",
      height: "32px",
      "&:hover": { backgroundColor: "#a6e6c2" },
      "& .MuiSvgIcon-root": {
        fontSize: "20px",
      },
      "&.Mui-disabled": {
        backgroundColor: "#cfe4d8 !important",
        color: "#6da68a !important",
      },
    },
    activeButton: {
      display: "inline-block",
      padding: "4px 18px",
      backgroundColor: "#fff",
      border: "1px solid #fff",
      color: "#04A857",
      textAlign: "center",
      textDecoration: "none",
      fontSize: "14px",
      cursor: "pointer",
      borderRadius: "4px",
      height: 32,
    },
    paddingTop: {
      marginTop: "22px",
    },
    paddingRight: {
      marginRight: "22px",
    },
    setMinHeight: {
      "& .MuiTableContainer-root": {
        maxHeight: "calc(98vh - 180px)",
        overflow: "scroll",
      },
    },
  }),
);
