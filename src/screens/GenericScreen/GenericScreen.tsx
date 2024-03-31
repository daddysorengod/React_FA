import React, { useEffect, useState } from "react";
import Page from "@/src/components/third-party/Page";
import { DynamicObject } from "@/src/types/field";
import { useRouter } from "next/router";
import { dispatch, useSelector } from "@/src/store";
import { RootStateProps } from "@/src/types/root";
import { setIsLoading } from "@/src/store/reducers/menu";
import { TABLE_OPTIONS_INTERFACE } from "@/src/types";
import {
  MAPPED_TABLE_CODE_BY_ROUTER,
  TABLE_LEVEL_TYPE,
  TABLE_TYPE,
} from "@/src/constants";
import { getTableConfigStore } from "@/src/store/reducers/tableConfig";
import { Box } from "@mui/material";
import { BaseDynamicTable } from "@/src/components/BaseTable/BaseDynamicTable";
import { BaseExpendableTable } from "@/src/components/BaseTable/BaseExpendableTable";

interface Props {
  pageTitle?: string;
  urlQuery?: DynamicObject;
  tableType?: TABLE_TYPE;
}

const GenericScreenComponent = (props: Props): JSX.Element => {
  const { pageTitle, urlQuery, tableType } = props;
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
    <Page title={pageTitle || "Kế toán quỹ"}>
      <Box
        sx={{
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Box sx={{ height: "90%" }}>
          {tableType == TABLE_TYPE.EXPANDABLE ? (
            <BaseExpendableTable
              tableOptions={tableConfigData}
              tableLevel={TABLE_LEVEL_TYPE.MAIN}
              parentId={globalFundId}
            />
          ) : (
            <BaseDynamicTable
              tableOptions={tableConfigData}
              tableLevel={TABLE_LEVEL_TYPE.MAIN}
              parentId={globalFundId}
            />
          )}
        </Box>
      </Box>
    </Page>
  );
};
const GenericScreen = React.memo(GenericScreenComponent);
export { GenericScreen };
