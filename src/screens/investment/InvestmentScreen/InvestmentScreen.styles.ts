import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
import { useTheme } from "@emotion/react";
export const useStyles = makeStyles(() => {
  const theme = useTheme() as Theme;
  return createStyles({
    root: {},
    title: {
      fontSize: "20px",
      fontWeight: "700",
      lineHeight: "32px",
      marginBottom: "12px",
    },
    titleContainer: {
      height: "100%",
      overflow: "hidden",
    },
    tabContainer: {
      marginBottom: "16px",
      borderBottom: "1px solid #E2E6EA",
    },
    tabLabel: {
      fontWeight: "600",
    },
    mgB: {
      marginBottom: "20px",
    },
    fullHeight: {
      height: "85%",
    },
    halfHeight: {
      height: "50%",
    },
    detailEntryLabel: {
      fontSize: "16px",
      fontWeight: "700",
      lineHeight: "24px",
      marginBottom: "8px",
    },
    detailEntry: {
      height: "35%",
    },
    customDetailEntry: {
      maxHeight: "22vh",
    },
  });
});
