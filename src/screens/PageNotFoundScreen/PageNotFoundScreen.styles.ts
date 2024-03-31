import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
      flexDirection: "column",
    },
    title: {
      paddingTop: "22px",
      fontWeight: 700,
      fontSize: "54.5455px",
      lineHeight: "57px",
      textAlign: "center",
      letterSpacing: "-0.01em",
      color: "#A5AEBF",
    },
    des:{
      paddingTop: "7.2px",
      fontWeight: 700,
      fontSize: "27px",
      lineHeight: "29px",
      textAlign: "center",
      letterSpacing: "-0.01em",
      color: "#A5AEBF",
    }
  }),
);
