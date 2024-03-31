import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    name: {
      fontSize: '20px',
      fontWeight: '700',
      lineHeight: '32px',
      marginBottom: '12px',
    }
    // nameFunction: {
    //   font-size: '20px',
    // font-weight: '700',
    // line-height: '32px',
    // margin-bottom: '12px',
    // }
  })
);
