import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    checkbox: {
      "& .MuiCheckbox-root": {
        // height: "36px !important",
        // width: "36px !important",
        // padding: "0px 9px 0px 0px",
        marginLeft:"-8px"
      },
    },
    checkboxLabel: {
      fontSize: 14,
      color: "#000000",
    },
    labelOnTOp: {
      marginTop: 4,
      display: "flex",
      flexDirection: "column-reverse",
      justifyContent: "start",
      alignItems: "start",
      "& label": {
        fontSize: 14,
        fontWeight: 600,
        color: "#272E36",
      },
      "& .MuiCheckbox-root": {
        height: "36px !important",
        width: "36px !important",
        // padding: "0px 9px 0px 0px",
        marginLeft:"-8px"
      },
      
    },
    paddingTop:{
      "& .MuiCheckbox-root": {
        height: "36px !important",
        width: "36px !important",
        marginLeft:"-8px"
      },
      marginTop:"14px"
    }
  }),
);
