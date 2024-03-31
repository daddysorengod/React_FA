import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inputLabel: {
      fontSize: 14,
      fontWeight: 600,
      color: "#272E36",
    },
    commonInput: {
      border: "1px solid #CFD6DD",
      marginTop: 4,
      height: 36,
      backgroundColor: "#fff",
      display: "flex",
      justifyContent: "end",
      "& input": {
        padding: "7px 14px",
      },
    },
    commonInputReadOnly: {
      border: "1px solid #CFD6DD",
      marginTop: 4,
      height: 36,
      backgroundColor: "#fff",
      display: "flex",
      justifyContent: "end",
      "& input": {
        color: "#000!important",
        zIndex: 9,
      },
      "& fieldset": {
        backgroundColor: "#E2E6EA",
      },
      "& .Mui-disabled": {
        "-webkit-text-fill-color": "#000",
      },
      width: "100%",
      margin: 0,
    },
    displayFlex: {
      display: "flex",
    },
    spacing: {
      height: "17px",
    },
  }),
);
