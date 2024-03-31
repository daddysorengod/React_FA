import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
createStyles({
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
    closeBtn: {
      background: "transparent",
      border: "none",
      cursor: "pointer",
    },
    dialogContent: {
      backgroundColor: "#F4F7FA",
    },
  }),
);
