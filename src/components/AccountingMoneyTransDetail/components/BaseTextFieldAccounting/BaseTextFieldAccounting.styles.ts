import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    inputLabel: {
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "4px",
      display: "inline-block !important",
    },
    requiredInputLabel: {
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "4px",
      display: "inline-block !important",
      "&::after": {
        content: '"*"',
        color: "red",
        marginLeft: "2px",
      },
    },
    textFieldInput: {
      width: "100%",
      "& .MuiOutlinedInput-root": {
        paddingRight: "0",
        backgroundColor: "#fff",
        color: "#262626",
      },
      "& .MuiOutlinedInput-root.Mui-disabled": {
        backgroundColor: "#E2E6EA",
        "& input": {
          "-webkit-text-fill-color": "#262626",
        },
      },
      "& input": {
        boxSizing: "border-box",
        display: "block",
        fontSize: "14px",
        lineHeight: "20px",
        height: "32px",
        padding: "6px 40px 6px 8px",
        borderRadius: "4px",
        border: "none !important",
      },
    },
  }),
);
