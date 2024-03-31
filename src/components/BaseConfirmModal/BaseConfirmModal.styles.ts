import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {},
    dialogTitle: {
      textAlign: "center",
      fontSize: 16,
      fontWeight: 700,
      padding: "20px 20px 0",
    },
    dialogContent: {
      backgroundColor: "#F4F7FA",
    },
    submitBtn: {
      backgroundColor: "#E6544F",
      color: "#fff",
      width: "50%",
      "&:hover": {
        backgroundColor: "#E6544F",
        opacity: 0.7,
      },
    },
    btnContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px 20px",
      columnGap: 20,
    },
    closeBtn: {
      backgroundColor: "#E2E6EA",
      color: "#272E36",
      width: "50%",
      "&:hover": {
        backgroundColor: "#E2E6EA",
        opacity: 0.7,
      },
    },
  }),
);
