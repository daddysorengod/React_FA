import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#1f764b",
      height: "39px",
      display: "flex",
      alignItems: "center",
    },
    activeButton: {
      display: "inline-block",
      padding: "4px 18px",
      backgroundColor: "#04A857",
      border: "1px solid #04A857",
      color: "#fff",
      textAlign: "center",
      textDecoration: "none",
      fontSize: "14px",
      cursor: "pointer",
      borderRadius: "4px",
      // "&:hover": {
      //   backgroundColor: "#04954d",
      //   borderColor: "#04954d",
      // },
    },
    inactiveButton: {
      display: "inline-block",
      padding: "2px 16px",
      backgroundColor: "#1f764b",
      border: "1px solid #1f764b",
      color: "#fff",
      textAlign: "center",
      textDecoration: "none",
      fontSize: "14px",
      cursor: "pointer",
      borderRadius: "4px",
      // "&:hover": {
      //   backgroundColor: "#04954d",
      //   borderColor: "#04954d",
      // },
    },
    roleButtonContainer: {
      backgroundColor: "#1f764b",
      height: "39px",
      display: "flex",
      alignItems: "center",
    },
    flexCol: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
  }),
);
