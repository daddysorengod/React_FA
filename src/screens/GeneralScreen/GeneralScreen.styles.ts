import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
import { useTheme } from "@emotion/react";
export const useStyles = makeStyles(() => {
  const theme = useTheme() as Theme;
  return createStyles({
    root: {},
  });
});
