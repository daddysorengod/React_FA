import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    paper: {
      position: "fixed",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      margin: 0,
      height: "100%",
      width: "100%",
      maxHeight: "none",
      maxWidth: "none",
      borderRadius: 0,
    },
    dialogTitle: {
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: "#272E36",
      padding: "20px",
    },
    dialogLabel: {
      fontSize: 20,
      fontWeight: 700,
      color: "#fff",
    },
    justifyEnd: { display: "flex", justifyContent: "end" },
    buttonClose: {
      background: "transparent",
      border: "none",
      cursor: "pointer",
    },
    dialogBg: {
      backgroundColor: "#F4F7FA",
    },
  }),
);
