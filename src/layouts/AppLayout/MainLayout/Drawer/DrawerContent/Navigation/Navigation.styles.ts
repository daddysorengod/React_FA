import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    textColor: {
      color: "#CFD6DD",
    },
    listItemDrawerClose: {
      "&:hover": {
        backgroundColor: "transparent",
      },
      "&.Mui-selected": {
        "&:hover": {
          backgroundColor: "transparent",
        },
        backgroundColor: "transparent",
      },
    },
    listItemIconDrawerClose: {
      borderRadius: 1.5,
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
      minWidth: 28,
      color: "#CFD6DD",
    },
    notMenuOrientation: {
      zIndex: 1201,
    },
    bgTransparent: {
      "&:hover": {
        backgroundColor: "transparent",
      },
      backgroundColor: "transparent",
    },
    bgTransparentOnlyHover:{
        "&:hover": {
            backgroundColor: "transparent",
          },
    },
    listItemIconNotIconDrawerClose: {
      borderRadius: 1.5,
      alignItems: "center",
      justifyContent: "flex-start",
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
    listItemIconIsIconDrawerClose: {
      borderRadius: 1.5,
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "flex-start",
      minWidth: 36,
    },
  }),
);
