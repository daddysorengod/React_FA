import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    select: {
      width: "100%",
      "& .MuiOutlinedInput-root": {
        paddingRight: "0",

        "& input.MuiOutlinedInput-input": {
          height: "20px",
        },

        "&.MuiInputBase-adornedEnd": {
          paddingRight: "0 !important",

          // AutoComplete Edit cell
          "& .MuiInputAdornment-positionEnd": {
            position: "relative",
            width: "65px",
            marginLeft: "0 !important",
          },
          "& .MuiAutocomplete-endAdornment": {
            right: "4px !important",
            paddingRight: "0 !important",
            "& .MuiAutocomplete-clearIndicator": {
              display: "none",
            },
          },
        },
        "& .MuiAutocomplete-endAdornment": {
          paddingRight: "30px !important",
        },

        "& input": {
          padding: "10px 12px",
          "&.Mui-disabled": {
            "-webkit-text-fill-color": "#262626",
          },
        },
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderRadius: "unset",
        borderWidth: 0,
        "&:focus": {
          borderWidth: 1,
        },
      },
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
    inputLabel: {
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "4px",
      display: "inline-block !important",
    },
    bodyRow: {
      "&:hover": {
        backgroundColor: "#DDF6E8",
      },
      "&.Mui-focused": {
        backgroundColor: "#DDF6E8",
      },
    },
    autoLoading: {
      cursor: "pointer",
      right: "12px",
      bottom: "6px",
      position: "absolute",
    },
    autoValidateTootip: {
      padding: "6px",
      cursor: "pointer",
      right: "24px",
      position: "absolute",
    },
  }),
);
