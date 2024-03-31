import React from "react";
import { useStyles } from "./ContractInformation.styles";
import useTranslation from "next-translate/useTranslation";
import { Box, Grid } from "@mui/material";
import {
  formatDate,
  formatNumberValueToString,
  getProperty,
} from "@/src/helpers";
import { ContractInfoFieldConfig } from "@/src/types";
interface Props {
  config: ContractInfoFieldConfig[];
  data: any;
}
const ContractInformationComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { config, data } = props;

  const getValue = (fieldConfig: ContractInfoFieldConfig): string => {
    const value = getProperty(data, fieldConfig.key, "");
    if (!value) {
      return value;
    }
    switch (fieldConfig.formatType) {
      case "DATE": {
        return formatDate(value);
      }
      case "NUMBER": {
        return formatNumberValueToString(value);
      }
      case "PERCENT": {
        return formatNumberValueToString(value) + " %";
      }
      default: {
        return value;
      }
    }
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        <Box className={classes.top}>
          <Box className={classes.title}>{"Thông tin hợp đồng"}</Box>
        </Box>
        <Box className={classes.content}>
          {config.map((field, index) => {
            switch (field.type) {
              case "LINE": {
                return <Box key={index} className={classes.line}></Box>;
              }
              default: {
                return (
                  <Box key={index}>
                    <Grid
                      container
                      columns={12}
                      columnSpacing={1.5}
                      className={classes.row}
                    >
                      <Grid item xs={6}>
                        <Box className={classes.label}>{field.label}</Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box className={classes.value}>{getValue(field)}</Box>
                      </Grid>
                    </Grid>
                  </Box>
                );
              }
            }
          })}
        </Box>
      </Box>
    </Box>
  );
};
const ContractInformation = React.memo(ContractInformationComponent);
export { ContractInformation };
