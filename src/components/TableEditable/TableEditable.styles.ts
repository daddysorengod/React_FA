import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableWrap: {
      backgroundColor: "#F4F7FA",
      maxHeight: "233px",
      "& .MuiTableContainer-root": {
        maxHeight: "233px",
        overflow: "scroll",
      },
    },
    minHeight: {
      minHeight: "233px",
    },
  }),
);
