import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    inputLabel: {
      fontSize: 14,
      fontWeight: 600,
      color: "#272E36",
    },
  }),
);
