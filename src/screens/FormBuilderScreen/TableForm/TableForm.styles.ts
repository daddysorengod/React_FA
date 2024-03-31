import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    refreshButton: {
      height: "40px",
      padding: "5px",
      margin: "0 3px",
      "& .MuiSvgIcon-root": {
        fontSize: "30px",
        color: "#04A857",
        backgroundColor: "#DDF6E8",
        borderRadius: "4px",
      },
    },
  }),
);
