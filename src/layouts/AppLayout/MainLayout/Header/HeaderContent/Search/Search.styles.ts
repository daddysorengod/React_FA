import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      ".outlinedInput": {
        border: "0px solid",
      },
      " .MuiOutlinedInput-notchedOutline": {
        border: "none",
        color: "#fff !important",
      },
      color: "#fff !important",
    },
    textFieldStyles: {
      border: "0px solid",
      backgroundColor: "#1f764b",
      borderRadius: "5px",
      outline: "none",
      ".MuiInputBase-input": {
        color: "#fff !important",
      },
      color: "#fff !important",
    },
  }),
);
