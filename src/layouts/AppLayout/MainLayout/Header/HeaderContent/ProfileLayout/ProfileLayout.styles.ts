import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
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
    customUserName: {
      maxWidth: 100,
      overflow: "hidden",
    },
  }),
);
