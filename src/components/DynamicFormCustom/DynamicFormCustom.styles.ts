import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    label: {
      fontSize: 16,
      fontWeight: 700,
    },
    formContainer: {
      backgroundColor: "#F4F7FA",
    },
    formRow: {
      marginBottom: 20,
    },
    submitBttContainer: {
      display: "flex",
      justifyContent: "end",
      marginTop: 20,
    },
  }),
);
