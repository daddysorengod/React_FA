import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({root:{
    height: 72,
        borderRadius: "4px",
        borderLeft: "solid 5px #04A857",
        flexDirection: "column",
        justifyItems: "center",
        paddingLeft: "10px",
        display: "flex",
        justifyContent: "center",
  },
    inputLabel: {
      fontSize: 14,
      fontWeight: 400,
      lineHeight: "20px",
      color: "#272E36",
    },
    commonInput: {
      border: "none",
      marginTop: 4,
      height: 24,
      display: "flex",
      justifyContent: "end",
      fontWeight: 600,
      outline: "none",
      "& input": {
        padding: "0px",
        fontWeight: 600,
        fontSize: 16,
        border: "none",
        outline: "none",
        "&:focus": {
          outline: "none",
        },
      },
      "& .MuiInputBase-input": {
        border: "none",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        outline: "none",
        border: "none", 
      },
      "& .Mui-disabled": {
        color: "#000000",
      },
    },
    commonInputReadOnly: {
      border: "none",
      marginTop: 4,
      height: 24,
      backgroundColor: "#fff",
      display: "flex",
      justifyContent: "end",
      "& input": {
        color: "#000!important",
        zIndex: 9,
        padding: "0px",
        fontWeight: 600,
      },
      
      "& .Mui-disabled": {
        "-webkit-text-fill-color": "#000",
        color: "#000000",
      },
      "& .MuiInputBase-input": {
        border: "none",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        outline: "none",
        border: "none", 
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
