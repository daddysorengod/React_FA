import React, { useState, useEffect } from "react";
import Page from "@/src/components/third-party/Page";
/// import store
import { dispatch, useSelector } from "@store/store";
import { RootStateProps } from "@app/types/root";
import { setIsLoading } from "@/src/store/reducers/menu";

import { TABLE_OPTIONS_INTERFACE } from "@/src/types/generic-table";
import { useRouter } from "next/router";
import {
  MAPPED_TABLE_CODE_BY_ROUTER,
  TABLE_LEVEL_TYPE,
} from "@/src/constants/generic-table";
import { BaseDynamicTable } from "@/src/components/BaseTable/BaseDynamicTable";

import { getTableConfigStore } from "@/src/store/reducers/tableConfig";
import { Box } from "@mui/material";

import { DynamicObject } from "@/src/types/field";

interface Props {
  pageTitle?: string;
  urlQuery?: DynamicObject;
}
const GeneralScreenComponent = (props: Props): JSX.Element => {
  const { pageTitle, urlQuery } = props;
  const route = useRouter();

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
    <Page title={pageTitle || "Tham số chung"}>
      <Box
        sx={{
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Box sx={{ height: "90%" }}>
          <BaseDynamicTable
            tableOptions={tableConfigData}
            tableLevel={TABLE_LEVEL_TYPE.MAIN}
          />
        </Box>
      </Box>
    </Page>
  );
};
const GeneralScreen = React.memo(GeneralScreenComponent);

export { GeneralScreen };
