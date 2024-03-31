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
      backgroundColor: "#fff",
      display: "flex",
      justifyContent: "end",
      width: "100%",
      margin: 0,
      "& .MuiInputBase-root.MuiOutlinedInput-root": {
        padding: "0px 5px",
      },
    },
    commonInputReadOnly: {
      border: "1px solid #CFD6DD",
      marginTop: 4,
      backgroundColor: "#fff",
      display: "flex",
      justifyContent: "end",
      "& input": {
        color: "#000!important",
        zIndex: 10000,
      },
      "& fieldset": {
        backgroundColor: "#E2E6EA",
      },
      "& .MuiInputBase-input .MuiOutlinedInput-input .Mui-disabled": {
        "-webkit-text-fill-color": "#000",
      },
      width: "100%",
      margin: 0,
      "& .MuiInputBase-root.MuiOutlinedInput-root": {
        padding: "0px 5px",
      },
    },
  }),
);
