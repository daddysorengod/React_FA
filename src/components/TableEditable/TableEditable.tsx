import React, { forwardRef, useState, useEffect, useRef } from "react";
import { useStyles } from "./TableEditable.styles";
import { TABLE_OPTIONS_INTERFACE } from "@/src/types/generic-table";
import { Box } from "@mui/material";
import { getTableConfigStore } from "@/src/store/reducers/tableConfig";
import { dispatch } from "@store/store";
import { BaseEditableTable } from "../BaseTable/BaseEditableTable";
import { DynamicObject } from "@/src/types/field";
interface Props {
  isDisabled?: boolean;
  parentId?: string;
  tableCode?: string;
  submitParentData?: any;
  entryProp: DynamicObject;
  isRefresh?: boolean;
  classesName?: string
}
const TableEditableComponent = forwardRef((props: Props, ref): JSX.Element => {
  const classes = useStyles();

  const { isDisabled, parentId, tableCode, entryProp, isRefresh,classesName } = props;
  const [tableConfigData, setTableConfigData] = useState<
    TABLE_OPTIONS_INTERFACE | any
  >(null);

  const handleChildForm = useRef() as any;
    useEffect(() => {
      try {
        if (typeof isRefresh !== "undefined" && !isRefresh) {
          return;
        }
        handleChildForm?.current?.handleRefreshRef();
      } catch (error) {
        console.log(error);
      }
    }, [isRefresh]);
  

  const getTableConfig = async (tableCode: string) => {
    try {
      const res = await dispatch(getTableConfigStore(tableCode));
      setTableConfigData(res || null);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (tableCode) {
        await getTableConfig(tableCode as string);
      }
    };
    fetchData();
  }, []);

  if (!tableConfigData) return <></>;

  return (
    <Box className={`${classes.tableWrap} ${classesName ? classesName: ""}`}>
      <BaseEditableTable
        onlyShow={isDisabled ?? false}
        tableOptions={tableConfigData}
        parentId={parentId}
        entryProp={{ ...entryProp }}
        ref={handleChildForm}
      />
    </Box>
  );
});
const TableEditable = React.memo(TableEditableComponent);
export { TableEditable };
