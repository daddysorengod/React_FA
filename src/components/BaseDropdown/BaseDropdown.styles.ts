import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dropdown: {
      backgroundColor: "field",
      color: "black",
    },
    dropdownDisable: {
      backgroundColor: "field",
      color: "black",
      marginTop: 4,
      height: 36,
      "& input": {
        color: "#000!important",
        zIndex: 10000,
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
    dropdownCommon: {
      width: "100%",
    },
    dropdownReadOnly: {
      width: "100%",
      "& .Mui-disabled": {
        "-webkit-text-fill-color": "#000",
        zIndex: 10000,
      },
    },
    errorIcon: {
      position: "absolute",
      right: "10%",
      top: "35%",
    },
    autoValidateTootip: {
      padding: "6px",
      cursor: "pointer",
      right: "24px",
      position: "absolute",
    },
    iconButtonClear: {
      padding: "0px",
      cursor: "pointer",
      right: "28px",
      top: "12%",
      position: "absolute",
    },
    autoLoading: {
      cursor: "pointer",
      right: "12px",
      bottom: "6px",
      position: "absolute",
    },
    select: {
      backgroundColor: "#fff",
      marginTop: 5,
      height: 34,
      position: "relative",

      "& .MuiInputBase-root": {
        padding: "0 34px 0 0",
        "&.Mui-disabled": {
          "-webkit-text-fill-color": "#000",
          backgroundColor: "green",
        },
        "& input": {
          boxSizing: "border-box",
          fontSize: "14px",
          // lineHeight: "20px",
          height: "34px",
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

    selectDisable: {
      backgroundColor: "field",
      color: "black",
      marginTop: 4,
      height: 36,
      "& input": {
        color: "#000!important",
        zIndex: 10000,
      },
      "& fieldset": {
        backgroundColor: "#E2E6EA",
      },
      "& .Mui-disabled": {
        "-webkit-text-fill-color": "#000",
      },
      position: "relative",
      "& .MuiInputBase-root": {
        padding: "0 40px 0 0",
        "&.Mui-disabled": {
          "-webkit-text-fill-color": "#000",
        },
        "& input": {
          boxSizing: "border-box",
          fontSize: "14px",
          lineHeight: "20px",
          height: "36px",
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
    headCell: {
      height: "auto",
      display: "inline-flex",
      padding: "8px 0px",
      alignItems: "center",
      borderColor: "#CFD6DD",
      borderWidth: "1px 1px 2px 0",
      borderStyle: "solid",
      fontWeight: "600",
      fontSize: "12px",
    },
    bodyRow: {
      "&:hover": {
        backgroundColor: "#DDF6E8",
      },
      "&.Mui-focused": {
        backgroundColor: "#DDF6E8",
      },
    },
    textOption: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    noLabel:{
      height: "19px"
    },
    red:{
      color: "red"
    }
  }),
);
