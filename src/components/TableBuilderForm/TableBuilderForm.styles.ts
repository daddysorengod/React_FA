import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: "24px",
      display: "flex",
      flexDirection: "column",

      "& label": {
        display: "block",
        margin: "0 6px 6px 0",
        fontWeight: "600",
        fontSize: "16px",
      },
      "& .required-label::after": {
        content: '"*"',
        color: "red",
      },
      "& input, .MuiSelect-select": {
        padding: "6px 10px",
        backgroundColor: "#ffffff",
      },
    },

    diffEditor: {
      alignItems: "center",
      "& label": {
        margin: "0 6px 0 0",
      },
      "& .diffOverview": {
        backgroundColor: "#1e1e1e !important",
      },
      "& span.mtk1": {
        color: "#9cdcfe",
      },
    },

    formatCodeEx: {
      display: "inline-block",
      backgroundColor: "#1e1e1e",
      fontSize: "14px",
      padding: "0px 5px",
      marginLeft: "7px",
      "& span": {
        "&:nth-child(1)": { color: "#569cd6", paddingRight: "4px" },
        "&:nth-child(2)": { color: "#9cdcfe" },
        "&:nth-child(3)": { color: "#dcdcdc", paddingRight: "6px" },
        "&:nth-child(4)": { color: "#3dc9b0", paddingRight: "6px" },
        "&:nth-child(5)": { color: "#dcdcdc", paddingRight: "6px" },
        "&:nth-child(6)": { color: "#ffd700", paddingRight: "6px" },
        "&:nth-child(7)": { color: "#dcdcdc", paddingRight: "6px" },
        "&:nth-child(8)": { color: "#ffd700" },
        "&:nth-child(9)": { color: "#dcdcdc" },
      },
    },
  }),
);
