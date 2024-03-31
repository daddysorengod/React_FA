import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      maxHeight:40
    },
    tableBodyCell: {
      fontSize: "14px",
      fontWeight: "400",
      padding: "4px 12px",
      backgroundColor: "#FFF",
      lineHeight: "20px",
      borderStyle: "solid",
      borderColor: "#CFD6DD",
      borderWidth: "0 1px 1px 0",
      "&:last-child": {
        borderWidth: "0 0px 1px 0",
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
    cellEditInput2: {
      "& input":{
        textAlign:"end",
      },
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
    tableCellRequiredText: {
      "&::after": {
        content: '"*"',
        color: "red",
        marginLeft: "2px",
      },
    },
  }),
);
