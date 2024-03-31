import { createStyles, makeStyles } from "@mui/styles";
import { Theme, stepConnectorClasses } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogTitle: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: 'center',
      backgroundColor: "#272E36",
      padding: "20px",
    },
    dialogLabel: {
      fontSize: 20,
      fontWeight: 700,
      color: "#fff",
    },
    closeBtn: {
      // background: "transparent",
      // border: "none",
      // cursor: "pointer",
      color: "#fff",
    },
    dialogContent: {
      backgroundColor: "#F4F7FA",
      display: "flex",
      flexDirection: "column",
      "& div[role='tabpanel']": {
        flexGrow: '1',
      },
    },
    common_button: {
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
    common_button3: {
      width: 138,
      display: "flex",

      padding: "8px 16px",
      backgroundColor: "#a6e6c2",
      border: "1px solid #a6e6c2",
      color: "#04A857",
      textAlign: "center",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
      borderRadius: "4px",
      "&:hover": {
        backgroundColor: "#a6e6c2",
        borderColor: "#a6e6c2",
      },
      "& .MuiLoadingButton-loadingIndicator": {
        top: "50%",
        left: "16%",
        transform: "translate(-50%, -50%)"
      }
    },
    common_button4: {
      width: 138,
      display: "flex",

      padding: "8px 16px",
      backgroundColor: "#FFE2DF",
      border: "1px solid #FFE2DF",
      color: "#E6544F",
      textAlign: "center",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
      borderRadius: "4px",
      "&:hover": {
        backgroundColor: "#FFE2DF",
        borderColor: "#FFE2DF",
      },
      "& .MuiLoadingButton-loadingIndicator": {
        top: "50%",
        left: "16%",
        transform: "translate(-50%, -50%)"
      }
    },
    commonButtonBack: {
      width: 138,
      display: "inline-block",
      padding: "8px 16px",
      backgroundColor: "#E2E6EA",
      border: "1px solid #E2E6EA",
      color: "#454D59",
      textAlign: "center",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
      borderRadius: "4px",
    },
    approveBtt: {
      boxShadow: "unset !important",
      backgroundColor: "#DDF6E8 !important",
      color: "#04A857 !important",
      padding: "6px 12px",
      textTransform: "unset",
      height: "32px",
      "&:hover": { backgroundColor: "#a6e6c2" },
      "& .MuiSvgIcon-root": {
        fontSize: "20px",
      },
      "&.Mui-disabled": {
        backgroundColor: "#cfe4d8 !important",
        color: "#6da68a !important",
      },
    },
    rejectBtt: {
      boxShadow: "unset !important",
      backgroundColor: "#FFE2DF !important",
      color: "#FFE2DF !important",
      padding: "6px 12px",
      textTransform: "unset",
      height: "32px",
      "&:hover": { backgroundColor: "#FFE2DF" },
      "& .MuiSvgIcon-root": {
        fontSize: "20px",
      },
      "&.Mui-disabled": {
        backgroundColor: "#FFE2DF !important",
        color: "#FFE2DF !important",
      },
    },
    stepConnectorStyles: {
      [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
      },
      [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          backgroundColor: "#04A857",
        },
      },
      [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          backgroundColor: "#04A857",
        },
      },
      [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor:
          theme.palette?.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
        borderRadius: 1,
      },
    },
  }),
);
