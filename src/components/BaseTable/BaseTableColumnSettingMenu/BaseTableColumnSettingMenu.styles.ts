import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    approveButton: {
      boxShadow: "unset !important",
      backgroundColor: "#DDF6E8 !important",
      color: "#04A857 !important",
      padding: "6px 7px",
      margin: "0 5px",
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
    showButton: {
      boxShadow: "unset !important",
      backgroundColor: "#D1E7FF !important",
      color: "#00A3FF !important",
      padding: "6px 12px",
      textTransform: "unset",
      height: "32px",
      "&:hover": { backgroundColor: "#D1E7FF" },
      "& .MuiSvgIcon-root": {
        fontSize: "20px",
      },
      "&.Mui-disabled": {
        backgroundColor: "#cfe4d8 !important",
        color: "#a6a56d !important",
      },
    },
  }),
);
