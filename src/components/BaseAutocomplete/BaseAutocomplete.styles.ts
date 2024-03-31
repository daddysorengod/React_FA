import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    select: {
      backgroundColor: "#fff",
      "& .MuiInputBase-root": {
        padding: "0 40px 0 0",
        "&.Mui-disabled": {
          "-webkit-text-fill-color": "#262626",
          backgroundColor: "#E2E6EA",
        },
        "& input": {
          boxSizing: "border-box",
          fontSize: "14px",
          lineHeight: "20px",
          height: "32px",
          padding: "6px 8px !important",
          borderRadius: "4px",
          "-webkit-text-fill-color": "inherit",
        },
        "&.MuiInputBase-adornedEnd": {
          paddingRight: "0 !important",
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
      },
    },
  }),
);
