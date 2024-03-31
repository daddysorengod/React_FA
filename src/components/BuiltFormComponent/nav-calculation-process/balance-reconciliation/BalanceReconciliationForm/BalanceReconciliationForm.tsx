import React from "react";
import { useStyles } from "./BalanceReconciliationForm.styles";
import useTranslation from "next-translate/useTranslation";
import { Box, Grid } from "@mui/material";
import { BaseTextField } from "@/src/components/BaseTextField";
interface Props {}
const BalanceReconciliationFormComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <Box>
      <Box>
        <Grid container columns={12} columnSpacing={2.5}>
          <Grid item xs={2}>
            <BaseTextField />
          </Grid>
          <Grid item xs={4}>
            <BaseTextField />
          </Grid>
          <Grid item xs={2}>
            <BaseTextField />
          </Grid>
          <Grid item xs={2}>
            <BaseTextField />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Grid container columns={12} columnSpacing={2.5}>
          <Grid item xs={2}>
            <BaseTextField />
          </Grid>
          <Grid item xs={2}>
            <BaseTextField />
          </Grid>
          <Grid item xs={2}>
            <BaseTextField />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Box
          sx={{
            fontWeight: "700",
            fontSize: "16px",
            lineHeight: "24px",
            marginBottom: "20px",
          }}
        >
          {"Chi tiết đối chiếu"}
        </Box>
      </Box>
    </Box>
  );
};
const BalanceReconciliationForm = React.memo(
  BalanceReconciliationFormComponent,
);
export { BalanceReconciliationForm };


