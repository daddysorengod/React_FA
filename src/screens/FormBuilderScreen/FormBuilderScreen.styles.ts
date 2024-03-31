import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
import { useTheme } from "@emotion/react";
export const useStyles = makeStyles(() => {
  const theme = useTheme() as Theme;
  return createStyles({
    root: {},
    common_button: {
      display: "inline-block",
      padding: "8px 16px",
      backgroundColor: `${theme?.palette?.primary.main}`,
      border: `1px solid ${theme?.palette?.primary.main}`,
      color: "#fff",
      textAlign: "center",
      textDecoration: "none",
      fontSize: "16px",
      cursor: "pointer",
      borderRadius: "4px",
      "&:hover": {
        backgroundColor: `${theme.palette?.primary.main}`,
        borderColor: `${theme.palette?.primary.main}`,
      },
    },
  });
});
