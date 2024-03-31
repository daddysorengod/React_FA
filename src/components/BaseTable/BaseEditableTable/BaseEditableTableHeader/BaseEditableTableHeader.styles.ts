import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topTable: {
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    topTableLeft: {
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
    addNewBtn: {
      bgcolor: "#04A857",
      color: "#DDF6E8",
      marginLeft: "8px",
      padding: "6px 12px",
      textTransform: "unset",
      height: "32px",
      "&:hover": { bgcolor: "#028343" },
      "& .MuiSvgIcon-root": {
        fontSize: "20px",
      },
    },
    tableTitle: {
      fontWeight: "700",
      fontSize: "16px",
      lineHeight: "24px",
      letterSpacing: "-0.01em",
      color: "#272E36",
      marginRight: "16px",
    },
  }),
);
