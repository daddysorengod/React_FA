import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dropdown: {
      backgroundColor: "field",
      color: "black",
      marginTop: 4,
      height: 36,
    },
    dropdownDisable: {
      backgroundColor: "field",
      color: "black",
      marginTop: 4,
      height: 36,
      "& input": {
        color: "#000!important",
        zIndex: 10000,
      },
      "& fieldset": {
        backgroundColor: "#E2E6EA",
      },
      "& .Mui-disabled": {
        "-webkit-text-fill-color": "#000",
      },
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: 600,
      color: "#272E36",
    },
  }),
);
