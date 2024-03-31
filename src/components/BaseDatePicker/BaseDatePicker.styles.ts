import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    date: {
      backgroundColor: "field",
      color: "black",
      marginTop: 4,
      "& p": {
        margin: 0,
        backgroundColor: "#F4F7FA",
      },
      "& .MuiFormControl-root, .MuiTextField-root": {
        width: "100%",
        // border: "1.5px solid #CFD6DD",
        // borderRadius: 4,
      },
      "& .MuiInputBase-input, .MuiOutlinedInput-input ,.MuiInputBase-inputAdornedEnd":
        {
          padding: "7px 0px",
        },
      // "&.MuiTextField-root": {
      //   width: "100%",
      // },
      // "& MuiFormControl-root MuiTextField-root jss58 css-i44wyl"
      display: "flex",
      flexDirection: "row",
    },
    disable: {
      "& input": {
        color: "#000!important",
        zIndex: 10,
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
