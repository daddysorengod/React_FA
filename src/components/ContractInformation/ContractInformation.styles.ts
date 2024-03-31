import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#fff",
      height: "100%",
    },
    container: { height: "100%", boxSizing: "border-box", padding: "20px" },
    top: { marginBottom: "20px" },
    title: { fontSize: "16px", fontWeight: "700", lineHeight: "24px" },
    content: {
      height: "calc(100% - 44px)",
      overflow: "auto",
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#c9c9c9",
        outline: "1px solid #a0a0a0",
        borderRadius: "4px",
      },
    },
    line: {
      borderBottom: "1px solid #E2E6EA",
      marginBottom: "16px",
    },
    row: {
      fontWeight: "500",
      fontSize: "12px",
      marginBottom: "16px",
      wordBreak: "break-word",
    },
    label: {
      color: "#828D9A",
    },
    value: {
      color: "#272E36",
    },
  }),
);
