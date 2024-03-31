import React, { useState, useEffect } from "react";
import { useStyles } from "@/src/components/BuiltFormComponent/BuiltFormComponent.styles";
import useTranslation from "next-translate/useTranslation";
import { Box, Grid } from "@mui/material";
import { getItemById } from "@/src/helpers";
import { TABLE_OPTIONS_INTERFACE, VALIDATION_INTERFACE } from "@/src/types";
import { BaseDynamicTable } from "@/src/components/BaseTable/BaseDynamicTable";
import { getTableConfigStore } from "@/src/store/reducers/tableConfig";
import { dispatch } from "@/src/store";
import { INPUT_FORMAT_TYPE } from "@/src/constants/built-form";
import { BaseTextField } from "@/src/components/BaseTextField";

interface Props {
  currentId?: string;
  parentId: string;
}
const BalanceCompareDetailFormComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { currentId, parentId } = props;

  const [fundCode, setFundCode] = useState<string>("");
  const [custodyAccount, setCustodyAccount] = useState<string>("");
  const [name, setName] = useState<string>("");

  const [tableConfigData, setTableConfigData] = useState<
    TABLE_OPTIONS_INTERFACE | undefined
  >(undefined);

  const getTransResultDetailById = async () => {
    if (!currentId) return;
    const res = await getItemById(
      currentId,
      "fund-money-statement-api/imported-batch/find-by-id",
    );
    if (res) {
      setFundCode(res.fundCode);
      setCustodyAccount(res.fundCustodyAccount || "");
      setName(res.name || "");
    }
  };

  const getTableConfig = async () => {
    const res = await dispatch(
      getTableConfigStore("NAV/BALANCE_COMPARE/MONEY-STATEMENT/DETAILED"),
    );
    setTableConfigData(res || undefined);
  };

  useEffect(() => {
    const asyncFunction = async () => {
      await getTransResultDetailById();
    };
    asyncFunction();
  }, [currentId]);

  useEffect(() => {
    const asyncFunction = async () => {
      await getTableConfig();
    };
    asyncFunction();
  }, []);

  return (
    <Box
      sx={{
        marginTop: "20px",
      }}
    >
      <Box
        sx={{
          marginBottom: "20px",
          height: "100%",
        }}
      >
        <Grid container columns={12} columnSpacing={4}>
          <Grid item xs={2}>
            <BaseTextField
              label={fieldsConfig.fundCode.label}
              value={fundCode}
              disabled={true}
              fullWidth
              className={classes.textFieldInput}
            />
          </Grid>
          <Grid item xs={2}>
            <BaseTextField
              label={fieldsConfig.custodyAccount.label}
              value={custodyAccount}
              disabled={true}
              fullWidth
              className={classes.textFieldInput}
            />
          </Grid>
          <Grid item xs={2}>
            <BaseTextField
              label={fieldsConfig.name.label}
              value={name}
              disabled={true}
              fullWidth
              className={classes.textFieldInput}
            />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          height: "calc(90% - 100px)",
        }}
      >
        {tableConfigData ? (
          <BaseDynamicTable
            tableOptions={tableConfigData}
            parentId={currentId}
            entryProp={{
              fundMoneyStatementBatchId: currentId,
            }}
          />
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};
const BalanceCompareDetailForm = React.memo(BalanceCompareDetailFormComponent);
export { BalanceCompareDetailForm };

interface FieldConfig {
  label: string;
  validationConfig?: VALIDATION_INTERFACE;
  formatConfig?: {
    type: INPUT_FORMAT_TYPE;
  };
}

const fieldsConfig: {
  fundCode: FieldConfig;
  name: FieldConfig;
  custodyAccount: FieldConfig;
} = {
  fundCode: {
    label: "Mã quỹ",
  },
  custodyAccount: {
    label: "STK TVLK",
  },
  name: {
    label: "Tên đợt giao dịch",
  },
};
