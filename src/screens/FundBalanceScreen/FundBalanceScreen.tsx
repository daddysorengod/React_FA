import React, { useState, useEffect } from "react";
import Page from "@/src/components/third-party/Page";
/// import store
import { dispatch, useSelector } from "@store/store";
import { RootStateProps } from "@app/types/root";
import { TABLE_OPTIONS_INTERFACE } from "@/src/types";
import { useRouter } from "next/router";
import { BaseExpendableTable } from "@/src/components/BaseTable/BaseExpendableTable";
import { MAPPED_TABLE_CODE_BY_ROUTER } from "@/src/constants";
import { getTableConfigStore } from "@/src/store/reducers/tableConfig";
import { Box } from "@mui/material";
import { DynamicObject } from "@/src/types/field";
interface Props {
  pageTitle?: string;
  urlQuery?: DynamicObject;
}
const FundBalanceScreenComponent = (props: Props): JSX.Element => {
  const { pageTitle, urlQuery } = props;
  const route = useRouter();
  const globalFundId = useSelector(
    (state: RootStateProps) => state.general.globalFundId,
  );

  const [tableConfigData, setTableConfigData] = useState<
    TABLE_OPTIONS_INTERFACE | undefined
  >(undefined);

  const getTableConfigByRouter = async () => {
    if (route.asPath) {
      const tableCode =
        MAPPED_TABLE_CODE_BY_ROUTER[route.asPath.split("?")[0]] || "";
      const res = await dispatch(getTableConfigStore(tableCode));
      if (res) {
        setTableConfigData(res);
      }
    }
  };

  useEffect(() => {
    const asyncFunction = async () => {
      await getTableConfigByRouter();
    };

    asyncFunction();
  }, [route]);

  if (!tableConfigData) {
    return <></>;
  }

  return (
    <Page title={pageTitle || "Số dư ban đầu"}>
      <Box
        sx={{
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Box sx={{ height: "90%" }}>
          <BaseExpendableTable
            tableOptions={tableConfigData}
            parentId={globalFundId}
          />
        </Box>
      </Box>
    </Page>
  );
};
const FundBalanceScreen = React.memo(FundBalanceScreenComponent);
export { FundBalanceScreen };
