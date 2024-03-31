import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // backgroundColor: "#1f764b",
      height: "39px",
      display: "flex",
      alignItems: "center",
    },
    activeButton: {
      display: "inline-block",
      padding: "4px 18px",
      backgroundColor: "#fff",
      border: "1px solid #fff",
      color: "#04A857",
      textAlign: "center",
      textDecoration: "none",
      fontSize: "14px",
      cursor: "pointer",
      borderRadius: "4px",
      height:32
    },
    roleButtonContainer: {
      // backgroundColor: "#1f764b",
      height: "41.3px",
      display: "flex",
      alignItems: "center",
      paddingLeft:14
    },
    
    dialogLabel: {
      fontSize: 20,
      fontWeight: 700,
      color: "#fff",
    },
    dialogTitle: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: 'center',
      backgroundColor: "#272E36",
      padding: "20px",
    },
    dialogContent: {
      backgroundColor: "#F4F7FA",
      display: "flex",
      flexDirection: "column",
      "& div[role='tabpanel']": {
        flexGrow: '1',
      },
    },
    closeBtn: {
      color: "#fff",
    },
    commonButtonBack: {
      width: 138,
      display: "inline-block",
      padding: "8px 16px",
      backgroundColor: "#04A857",
      border: "1px solid #04A857",
      color: "#fff",
      textAlign: "center",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
      borderRadius: "4px",
      "&:hover": {
        backgroundColor: "#04954d",
        borderColor: "#04954d",
      },
      "& .MuiLoadingButton-loadingIndicator": {
        top: "50%",
        left: "16%",
        transform: "translate(-50%, -50%)"
      }
    },
    dateStaticStyles:{
      "& .MuiPickersToolbar-root":{
        display:"none"
      }
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: 600,
      color: "#272E36",
    },
    date: {
      backgroundColor: "field",
      color: "black",
      marginTop: 4,
      "& p": {
        margin: 0,
        backgroundColor: "#F4F7FA",
      },
      "& .MuiFormControl-root, .MuiTextField-root": {
        width: "100%",
      },
      "& .MuiInputBase-input, .MuiOutlinedInput-input ,.MuiInputBase-inputAdornedEnd":
        {
          padding: "7px 0px",
        },
      display: "flex",
      flexDirection: "row",
    },
    datePickerInput:{
      "& .MuiInputAdornment-positionEnd":{
        display:"none"
      }
    },
    headerText:{
      "&::selection": {
        backgroundColor: "transparent",
        color: "inherit",
      },
      cursor: "pointer",
      "&::-moz-selection": {
        backgroundColor: "transparent",
        color: "inherit",
      },
    },
    typography:{
      color: "#fff",
      fontSize: 12
    },
    headerStyles:{
      display:"flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: 'start',height: 39,
    }
  }),
);
