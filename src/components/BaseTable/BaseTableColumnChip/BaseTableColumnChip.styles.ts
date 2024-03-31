import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& div.dot": {
        width: "4px",
        aspectRatio: "1",
        borderRadius: "50%",
        margin: "0 0 0 10px !important",
      },
    },
  }),
);
