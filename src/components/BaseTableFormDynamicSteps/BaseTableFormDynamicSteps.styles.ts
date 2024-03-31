import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableWrap: {
      marginTop: "20px",
      backgroundColor: "#F4F7FA",
      maxHeight: "calc(100vh - 220px)",
      height: "100%",
    },
  }),
);
