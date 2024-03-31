import React, { forwardRef, useState, useEffect } from "react";
import { useStyles } from "./BaseTableFormDynamicSteps.styles";
import { TABLE_OPTIONS_INTERFACE } from "@/src/types/generic-table";
import { TABLE_TYPE } from "@/src/constants/generic-table";
import { BaseEditableTable } from "../BaseTable/BaseEditableTable";
import { ITabConfig } from "@/src/constants/formConfigFiles";
import { BaseDynamicTable } from "../BaseTable/BaseDynamicTable";
import { Box } from "@mui/material";
import { BaseExpendableTable } from "../BaseTable/BaseExpendableTable";
import { getTableConfigStore } from "@/src/store/reducers/tableConfig";
import { dispatch } from "@store/store";
import { DynamicObject } from "@/src/types/field";
interface Props {
  onlyShow: boolean;
  formSettingSubmitStep?: ITabConfig;
  parentId?: string;
  tableCode?: string;
  submitParentData?: any;
  entryProp?: DynamicObject
}
const BaseTableFormDynamicStepsComponent = forwardRef(
  (props: Props, ref): JSX.Element => {
    const classes = useStyles();

    const {
      onlyShow,
      formSettingSubmitStep,
      parentId,
      submitParentData,
      tableCode,
      entryProp
    } = props;

    const [tableConfigData, setTableConfigData] = useState<
      TABLE_OPTIONS_INTERFACE | any
    >(null);

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

    switch (tableConfigData?.tableType) {
      case TABLE_TYPE.BASE: {
        return (
          <Box className={classes.tableWrap}>
            <BaseDynamicTable
              onlyShow={onlyShow}
              tableOptions={tableConfigData}
              parentId={parentId}
              submitParentData={submitParentData}
              entryProp={{
                ...entryProp
              }}
            />
          </Box>
        );
      }
      case TABLE_TYPE.EDITABLE: {
        return (
          <Box className={classes.tableWrap}>
            <BaseEditableTable
              onlyShow={onlyShow}
              tableOptions={tableConfigData}
              formSettingSubmitStep={formSettingSubmitStep}
              ref={ref}
              parentId={parentId}
              entryProp={{
                ...entryProp
              }}
            />
          </Box>
        );
      }
      case TABLE_TYPE.EXPANDABLE: {
        return (
          <Box className={classes.tableWrap}>
            <BaseExpendableTable
              onlyShow={onlyShow}
              tableOptions={tableConfigData}
              parentId={parentId}
              submitParentData={submitParentData}
            />
          </Box>
        );
      }
      default: {
        return <></>;
      }
    }
  },
);
const BaseTableFormDynamicSteps = React.memo(
  BaseTableFormDynamicStepsComponent,
);
export { BaseTableFormDynamicSteps };
