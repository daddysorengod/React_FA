import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    paper: {
      position: "fixed",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      margin: 0,
      height: "100%",
      width: "100%",
      maxHeight: "none",
      maxWidth: "none",
      borderRadius: 0,
    },
    containerButton: {
      display: "flex",
      justifyContent: "end",
      alignItems: "end",
      width: "100%",
    },
    common_button: {
      display: "inline-block",
      padding: "8px 16px",
      backgroundColor: "#04A857",
      border: "1px solid #04A857",
      color: "#fff",
      textAlign: "center",
      textDecoration: "none",
      fontSize: "16px",
      cursor: "pointer",
      borderRadius: "4px",
      "&:hover": {
        backgroundColor: "#04954d",
        borderColor: "#04954d",
      },
    },
    common_button2: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "8px 16px",
      backgroundColor: "#DDF6E8",
      border: "1px solid #DDF6E8",
      color: "#04A857",
      textAlign: "center",
      textDecoration: "none",
      fontSize: "16px",
      cursor: "pointer",
      borderRadius: "4px",
      "&:hover": {
        backgroundColor: "#DDF6E8",
        borderColor: "#DDF6E8",
      },
    },
    common_button3: {
      display: "inline-block",
      padding: "8px 16px",
      backgroundColor: "#E6544F",
      border: "1px solid #E6544F",
      color: "#fff",
      textAlign: "center",
      textDecoration: "none",
      fontSize: "16px",
      cursor: "pointer",
      borderRadius: "4px",
      "&:hover": {
        backgroundColor: "#E6544F",
        borderColor: "#E6544F",
      },
    },
    dropdown: {
      backgroundColor: "field",
      color: "black",
      height: 36,
    },
    commonInput: {
      border: "1px solid #CFD6DD",
      marginTop: 4,
      height: 36,
      backgroundColor: "#fff",
      display: "flex",
      justifyContent: "end",
    },
    commonError: {
      color: "red",
      fontSize: 14,
      textAlign: "left",
    },
    formContainer: {
      backgroundColor: "#F4F7FA",
      padding: "20px 0",
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: 600,
      color: "#272E36",
      paddingBottom: 4,
    },
    formRow: {},
    formButton: {
      backgroundColor: "#DDF6E8",
      fontSize: 14,
      fontWeight: 600,
      "&:hover": {
        backgroundColor: "#04954d",
      },
    },
    commonTextArea: {
      border: "1px solid #CFD6DD",
      marginTop: 4,
      backgroundColor: "#fff",
      width: "100%",
    },
    newFieldContainer: {
      margin: "12px 16px 16px 16px",
      paddingTop: "20px",
    },
    formControlSelectSx: {
      m: 0.5,
      minWidth: "100%",
      margin: 0,
    },
    selectSx: { display: "flex", gap: 1, justifyContent: "flex-end" },
    outlinedInputSx: { m: 1, width: "100%", margin: 0, paddingRight: 0 },
    justifyEnd: {
      display: "flex",
      justifyContent: "end",
    },
    colFlex: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "start",
    },
    label: {
      fontSize: 22,
      fontWeight: 700,
    },
  }),
);