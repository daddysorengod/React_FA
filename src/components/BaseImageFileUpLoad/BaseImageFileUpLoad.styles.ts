import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      fontSize: "14px",
      fontWeight: "600",
      lineHeight: "20px",
      letterSpacing: "-0.14px",
      color: "#272E36",
      margin: " 0 4px 4px 0",
      display: "inline-block",
    },
    requiredLabel: {
      fontSize: "14px",
      fontWeight: "600",
      lineHeight: "20px",
      letterSpacing: "-0.14px",
      color: "#272E36",
      margin: "0 4px 4px 0",
      display: "inline-block",
      "&::after": {
        content: '"*"',
        color: "red",
        marginLeft: "2px",
      },
    },
    root: {
      backgroundColor: "#fff",
      border: "1px solid #CFD6DD",
      borderRadius: "4px",
      height: "88px",
      padding: "8px",
      fontSize: "14px",
      "& input": {
        display: "none",
      },
    },
    container: {
      height: "100%",
      alignItems: "stretch",
      "& .MuiGrid-item": {
        width: "100%",
        height: "100%",
      },
    },
    image: {
      width: "100%",
      height: "100%",
      border: "1px dashed #CFD6DD",
      borderRadius: "4px",
      "& img": {
        objectFit: "fill",
        width: "100%",
        height: "100%",
      },
    },
    buttonContainer: {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      flexDirection: "column",
      textDecoration: "underline !important",
      fontWeight: "400",
    },
    imageNameContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: "14px",
      width: "100%",
    },
    imageName: {
      fontSize: "14px",
      textOverflow: "ellipsis",
      overflow: "hidden",
      wordBreak: "break-all",
      textWrap: "nowrap",
    },
    clearImageNameButton: {
      display: "flex",
      alignItems: "center",
      color: "#E6544F",
      marginLeft: "4px",
    },
  }),
);
