import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: "#272E36",
      fontSize: "14px",
    },
    label: {
      fontSize: "14px",
      fontWeight: "600",
      lineHeight: "20px",
      letterSpacing: "-0.14px",
      color: "#272E36",
      margin: " 0 4px 12px 0",
      display: "inline-block",
    },
    requiredLabel: {
      fontSize: "14px",
      fontWeight: "600",
      lineHeight: "20px",
      letterSpacing: "-0.14px",
      color: "#272E36",
      margin: "0 4px 4px 0",
      display: "inline-block",
      "&::after": {
        content: '"*"',
        color: "red",
        marginLeft: "2px",
      },
    },
    radioGroup: {
      flexDirection: "row",
      "& .MuiFormControlLabel-root": {
        marginRight: "32px",
        "& .MuiSvgIcon-root": {
          fontSize: 20,
        },
        "& .Mui-disabled": {
          color: "#ababab"
        }
      },
    },
  }),
);
