import React, { useState, useEffect } from "react";
import { useStyles } from "./TableBuilderScreen.styles";
import useTranslation from "next-translate/useTranslation";
import {
  TABLE_OPTIONS_INTERFACE,
} from "@/src/types/generic-table";
import { useRouter } from "next/router";
import { BaseDynamicTable } from "@/src/components/BaseTable/BaseDynamicTable";
import { MAPPED_TABLE_CODE_BY_ROUTER } from "@/src/constants/generic-table";
import { getTableConfigStore } from "@/src/store/reducers/tableConfig";
import { dispatch } from "@/src/store";
interface Props {}
const TableBuilderScreenComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const route = useRouter().asPath;

  const [tableConfigData, setTableConfigData] = useState<
    TABLE_OPTIONS_INTERFACE | undefined
  >(undefined);

  const getTableConfigByRouter = async () => {
    if (route) {
      const tableCode = MAPPED_TABLE_CODE_BY_ROUTER[route] || "";
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

  return <BaseDynamicTable tableOptions={tableConfigData} />;
};
const TableBuilderScreen = React.memo(TableBuilderScreenComponent);
export { TableBuilderScreen };
