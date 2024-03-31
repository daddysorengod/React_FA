import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableHeader: {
      display: "flex",
      justifyContent: "space-between",
      padding: "12px 0",
      backgroundColor: "unset",
    },
    leftTableHeader: {
      display: "flex",
      alignItems: "center",
      "& .MuiCollapse-root.MuiCollapse-horizontal": {
        minWidth: "220px !important",
      },
      "& .MuiFormControl-root.MuiTextField-root": {
        minWidth: "unset",
      },
      "& .MuiInputBase-root.MuiOutlinedInput-root": {
        width: "220px",
        padding: "0 0 0 4px",
      },
      "& #button-handle-all": {
        width: "220px",
      },
    },
    actionAllButton: {
      backgroundColor: "#DDF6E8",
      color: "#04A857",
      padding: "8px 12px",
      textTransform: "unset",
      height: "36px",
      fontWeight: "600",
      "&:hover": { backgroundColor: "#a6e6c2" },
      "& .MuiSvgIcon-root": {
        fontSize: "20px",
      },
    },
    filterColumn: {
      paddingLeft: "16px",
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
    },

    filterColumnItem: {
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      lineHeight: "20px",
      marginRight: "16px",
    },

    filterColumnLabel: { color: "#828D9A", marginRight: "4px" },
    filterColumnValue: { color: "#272E36" },

    closeIcon: { color: "#E6544F" },

    clearAllButton: {
      textDecoration: "underline !important",
      textTransform: "initial",
      color: "#272E36",
    },
    rightTableHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "end",
      minWidth: "340px",
      "& button": {
        fontSize: "14px",
        lineHeight: "20px",
      },
    },
    refreshButton: {
      height: "40px",
      padding: "5px",
      margin: "0 3px",
      "& .MuiSvgIcon-root": {
        fontSize: "30px",
        color: "#04A857",
        backgroundColor: "#DDF6E8",
        borderRadius: "4px",
      },
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
    menu: {
      "& .MuiMenuItem-root": {
        fontWeight: "500 !important",
        fontSize: "14px",
        lineHeight: "20px",
      },
    },
    addNewButton: {
      boxShadow: "unset !important",
      backgroundColor: "#04A857",
      color: "#DDF6E8",
      marginLeft: "8px",
      padding: "6px 12px",
      textTransform: "unset",
      height: "32px",
      "&:hover": { backgroundColor: "#028343" },
      "& .MuiSvgIcon-root": {
        fontSize: "20px",
      },
      "&.Mui-disabled": {
        backgroundColor: "#1f764b !important",
        color: "#fff !important",
      },
    },
    MRT_ShowHideColumnsButton: {
      height: "40px",
      padding: "5px",
      margin: "0 3px",
      "& .MuiSvgIcon-root": {
        fontSize: "30px",
      },
    },
  }),
);
