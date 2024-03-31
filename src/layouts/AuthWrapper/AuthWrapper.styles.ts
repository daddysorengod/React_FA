import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      backgroundColor: "#F4F7FA",
      display: "flex",
      overflow: "hidden",
      height: "100vh",
    },
    content: {
      position: "relative",
      width: "100%",
    },
    containerChild: {
      // height: "calc(100vh -50px)",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    },
    contentChild: {
      // width: "352px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "39px",
      gap: "24px",
      // position: "absolute",
      width: "404px",
      // height: "590px",
      // left: "733px",
      // top: "244px",
      background: "#FFFFFF",
      boxShadow: "0px 4px 42px rgba(204, 211, 217, 0.5)",
      borderRadius: "20px",
    },

    logoContainer: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    },
    logo: {
      width: 144,
    },
    title: {
      // marginBottom: "24px",
      fontSize: "32px",
      fontWeight: 700,
      lineHeight: "calc(48 / 40)",
      letterSpacing: "-2%",
      margin: "24px 0px 0px 0px",
    },
    bg_shape_1: {
      zIndex: "10",
      position: "absolute",
      left: "-2px",
      bottom: "220px",
      width: "58px",
    },
    bg_shape_2: {
      position: "absolute",
      left: "-2px",
      bottom: "90px",
      width: "100px",
    },
    bg_shape_3: {
      zIndex: "10",
      position: "absolute",
      right: "0",
      top: "40px",
      width: "134px",
    },
    bg_shape_4: {
      position: "absolute",
      right: "0",
      top: "98px",
      width: "140px",
    },
  }),
);
