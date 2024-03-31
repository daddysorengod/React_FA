import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    container: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
    title: {
      fontSize: "16px",
      fontWeight: "700",
      lineHeight: "24px",
      marginBottom: "12px",
    },
    tableContainer: {
      overflowX: "auto",
      border: "1px solid #CFD6DD",
      borderRadius: "4px",
      width: "unset",
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#c9c9c9",
        outline: "1px solid #a0a0a0",
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-track": {
        outline: "1px solid #CFD6DD",
        borderRadius: "4px",
      },
    },
    tableHeadCell: {
      fontSize: "12px",
      fontWeight: "600",
      padding: "8px 12px",
      backgroundColor: "#E2E6EA",
      lineHeight: "16px",
      borderStyle: "solid",
      borderColor: "#CFD6DD",
      borderWidth: "0 1px 1px 0",
      "&:last-child": {
        borderWidth: "0 1px 1px 0",
      },
    },
    tableBodyRow: {
      "&:last-child": {
        "& td": {
          borderWidth: "0 1px 0 0",
          "&:first-child": {
            borderWidth: "0 1px 0 0",
          },
          "&:last-child": {
            borderWidth: "0",
          },
        },
      },
    },
    fw600: {
      fontWeight: "600 !important",
    },
    stickyRow: {
      position: "sticky",
      bottom: 0,
      zIndex: 999,
    },
    borderTop: {
      borderTop: "0px solid #CFD6DD !important",
    },
    tableBodyCell: {
      fontSize: "14px",
      fontWeight: "400",
      padding: "8px 12px",
      backgroundColor: "#FFF",
      lineHeight: "20px",
      borderStyle: "solid",
      borderColor: "#CFD6DD",
      borderWidth: "0 1px 1px 0",
      "&:last-child": {
        borderWidth: "0 0px 1px 0",
      },
    },
    tableCellRequiredText: {
      "&::after": {
        content: '"*"',
        color: "red",
        marginLeft: "2px",
      },
    },

    cellEditInput: {
      width: "100%",
      "& .MuiOutlinedInput-root": {
        paddingRight: "0",

        "&.MuiInputBase-adornedEnd": {
          paddingRight: "0 !important",

          "& .MuiInputAdornment-positionEnd": {
            position: "relative",
            width: "34px",
            marginLeft: "0 !important",
          },
        },

        "& input": {
          padding: "10px 12px",
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

    cellEditAutocomplete: {
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
    tableBodyEditCell: {
      fontSize: "14px",
      fontWeight: "400",
      padding: "0",
      backgroundColor: "#FFF",
      lineHeight: "20px",
      borderStyle: "solid",
      borderColor: "#CFD6DD",
      borderWidth: "0 1px 1px 0",
      "&:last-child": {
        borderWidth: "0 0px 1px 0",
      },
    },
    textColor: {
      "& input": {
        color: "#000!important",
        zIndex: 10,
      },
      "& .MuiOutlinedInput-input":{
        "-webkit-text-fill-color": "#262626"
      }
    },
  }),
);
