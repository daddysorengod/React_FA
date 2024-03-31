import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    invalid: {
      color: "red",
    },
    label: {
      fontFamily: "Inter",
      fontWeight: 600,
      fontSize: 14,
      lineHeight: "20px",
      color: "#272E36",
      padding: 0,
      margin: 0,
    },
    input: {
      background: "#FFFFFF",
      "&:hover": {},
    },
    login: {
      "& .MuiInputBase-root.MuiOutlinedInput-root, .MuiInputBase-root.MuiOutlinedInput-root,.MuiInputBase-root.MuiOutlinedInput-root.MuiSelect-root ":
        {
          borderRadius: 12,
        },
      "& .MuiInputBase-root.MuiOutlinedInput-root:hover": {
        borderRadius: 12,
      },
      "& .MuiInputBase-input.MuiOutlinedInput-input, .MuiInputBase-input.MuiOutlinedInput-input, .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input":
        {
          padding: 14,
        },
    },
    buttonLogin: {
      backgroundColor: "#04A857",
      "&:hover": {
        backgroundColor: "#04A857",
      },
    },
    err: {
      margin: "6px 0 0 0",
      color: "red",
      fontSize: 13,
    },
  }),
);
