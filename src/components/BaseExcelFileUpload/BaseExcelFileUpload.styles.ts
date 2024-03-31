import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { display: "flex", justifyContent: "center", marginTop: "20px" },
    container: {
      width: "100%",
      maxWidth: "574px",
      margin: "0 auto",
    },
    top: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: "20px",
    },
    topTitle: {
      fontSize: "20px",
      fontWeight: "700",
    },
    downloadBtn: {
      fontSize: "14px",
      fontWeight: "600",
      textDecoration: "underline !important",
      color: "#04A857",
      display: "flex",
      alignItems: "center",
    },
    downloadIcon: {
      marginRight: "4px",
      fontSize: "20px",
    },
    content: {
      marginBottom: "20px",
      backgroundColor: "#fff",
      borderRadius: "4px",
      border: "1px solid #CFD6DD",
      padding: "20px",
    },
    contentTitle: {
      fontSize: "16px",
      fontWeight: "700",
      lineHeight: "24px",
      marginBottom: "12px",
    },
    dropUploadFile: {
      borderWidth: "2px",
      borderStyle: "dashed",
      borderColor: "#CFD6DD",
      height: "210px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "&:hover": {
        backgroundColor: "#F8F8F8",
        transition: "0.2s",
        cursor: "pointer",
      },
    },
    imageContainer: {
      marginBottom: "12px",
      display: "flex",
      justifyContent: "center",
    },
    labelUploadFileInput: {
      marginBottom: "8px",
      fontSize: "16px",
      fontWeight: "700",
    },
    textGray: {
      color: "#828D9A",
      marginRight: "4px",
      display: "inline-block",
    },
    textGreen: {
      color: "#04A857",
      textDecoration: "underline !important",
      display: "inline-block",
    },
    description: { fontSize: "12px", color: "#828D9A", fontWeight: "400" },
    fileUpload: {
      height: "112px",
      marginTop: "20px",
    },
    filesCount: {
      color: "#828D9A",
      fontSize: "12px",
      fontWeight: "400",
      marginBottom: "12px",
    },
    fileUploadContainer: {
      borderRadius: "4px",
      backgroundColor: "#F4F7FA",
      height: "60px",
      padding: "12px",
    },
    topFileUploadContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "8px",
    },
    topLeftFileUploadContainer: { display: "flex", alignItems: "stretch" },
    fileIcon: {
      padding: "4px",
      marginRight: "12px",
      backgroundColor: "#FFF",
      display: "flex",
      alignItems: "center",
      borderRadius: "4px",
      border: "1px solid #E2E6EA",
      color: "#04A857",
    },
    fileInfo: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    fileName: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    fileSize: {
      fontWeight: "400",
      color: "#828D9A",
      fontSize: "12px",
    },
    progessUpload: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    progess: { width: "100%" },
    progessText: {
      marginLeft: "12px",
      fontWeight: "400",
      color: "#828D9A",
      fontSize: "12px",
    },

    textFieldInput: {
      width: "100%",
      "& .MuiOutlinedInput-root": {
        paddingRight: "0",
        backgroundColor: "#fff",
      },
      "& .MuiOutlinedInput-root.Mui-disabled": {
        backgroundColor: "#E2E6EA",
        "& input": {
          "-webkit-text-fill-color": "#000",
        },
      },
      "& input, .MuiSelect-outlined": {
        boxSizing: "border-box",
        display: "block",
        fontSize: "14px",
        lineHeight: "20px",
        height: "32px",
        padding: "6px 8px 6px 8px",
        borderRadius: "4px",
        border: "none !important",
      },
    },
    inputLabel: {
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "4px",
      display: "inline-block !important",
    },
  }),
);
