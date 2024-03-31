import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogTitle: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#272E36",
      padding: "12px 20px",
    },
    dialogLabel: {
      fontSize: 20,
      fontWeight: 700,
      color: "#fff",
    },
    closeBtn: {
      color: "#fff",
      fontSize: 26,
    },
    dialogContent: {
      backgroundColor: "#F4F7FA",
      padding: '0 !important'
    },
  }),
);
