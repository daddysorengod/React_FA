import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    autocompleteWithHeader: {
      width: "271px",
      "& .MuiOutlinedInput-root": {
        paddingRight: "0",
        backgroundColor: "rgba(0, 0, 0, 0.20)",
      },
      "& .MuiOutlinedInput-root.Mui-disabled": {
        backgroundColor: "#E2E6EA",
        "& input": {},
      },
      "& input": {
        boxSizing: "border-box",
        display: "block",
        fontSize: "14px",
        lineHeight: "20px",
        height: "32px",
        padding: "6px 12px 6px 8px",
        borderRadius: "4px",
        border: "none !important",
        "-webkit-text-fill-color": "#fff",
        color: "#fff",
      },
      "& button": {
        color: "#fff",
      },
      "& .Mui-focused": {
        "& fieldset": {
          borderColor: "#000 !important",
          borderWidth: "1px !important",
        },
      },
    },
    paddingTop:{
      paddingTop:2
    }
  }),
);
