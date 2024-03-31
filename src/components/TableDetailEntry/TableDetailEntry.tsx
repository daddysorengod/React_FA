import React, { forwardRef, useState, useEffect, useRef } from "react";
import { useStyles } from "./TableDetailEntry.styles";
import {
  PARAM_INTERFACE,
  TABLE_OPTIONS_INTERFACE,
} from "@/src/types/generic-table";
import { Box } from "@mui/material";
import { getTableConfigStore } from "@/src/store/reducers/tableConfig";
import { DynamicObject } from "@/src/types/field";

/// import store
import { dispatch, useSelector } from "@store/store";
import { RootStateProps } from "@app/types/root";
import { getAccountingVariable } from "@/src/helpers/handleAccounting";
import { BaseAccountingEntryDetailsTableEdit } from "./conponents";
import { getListAccounting } from "@/src/store/reducers/general";
/// end import store

interface Props {
  isDisabled: boolean;
  parentId?: string;
  tableCode?: string;
  submitParentData?: any;
  entryProp: DynamicObject;
  isRefresh?: boolean;
  currentId?: string;
  customAttrs?: DynamicObject | null;
  workFollowStatus?: string;
}
interface IConfigGetData {
  url: string;
  params?: PARAM_INTERFACE[];
  idName?: string;
}
const TableDetailEntryComponent = forwardRef(
  (props: Props, ref): JSX.Element => {
    const classes = useStyles();

    const {
      isDisabled,
      parentId,
      tableCode,
      entryProp,
      isRefresh,
      currentId,
      customAttrs,
      workFollowStatus,
    } = props;

    const [tableConfigData, setTableConfigData] = useState<
      TABLE_OPTIONS_INTERFACE | any
    >(null);
    const [configGetData, setConfigGetData] = useState<IConfigGetData>({
      url: "",
    });

    const [updateData, setUpdateData] = useState<any>();

    const [isMounting, setIsMounting] = useState(false);
    const [configWorkflowCheck, setConfigWorkflowCheck] = useState<string[]>(
      [],
    );

    const useAccountingData: any =
      useSelector((state: RootStateProps) => state.general.detailContract) ||
      null;

    const handleChildForm = useRef() as any;
    useEffect(() => {
      try {
        if (typeof isRefresh !== "undefined" && !isRefresh) {
          return;
        }
        handleChildForm?.current?.handleRefreshRef();
      } catch (error) {}
    }, [isRefresh]);

    useEffect(() => {
      try {
        const getConfigData = async () => {
          try {
            let paramsConfig;
            if (
              customAttrs?.params &&
              typeof customAttrs?.params === "string"
            ) {
              paramsConfig = customAttrs?.params.split("$").map(item => {
                const param = item.split("*");
                if (Array.isArray(param) && param.length == 2) {
                  return {
                    paramKey: param[0],
                    paramValue: param[1],
                  };
                }
              });
            }
            let workflowCheck =
              customAttrs?.workflowCheck &&
              typeof customAttrs?.workflowCheck === "string"
                ? customAttrs?.workflowCheck.split(",")
                : [];
            setConfigGetData({
              url: customAttrs?.tableUrl || "",
              idName: customAttrs?.configIdName || "",
              params: paramsConfig,
            });
            setConfigWorkflowCheck(workflowCheck);
          } catch (error) {
            setConfigGetData({
              url: customAttrs?.tableUrl || "",
              idName: customAttrs?.configIdName || "",
            });
          }
        };
        getConfigData();
      } catch (error) {}
    }, [customAttrs]);

    useEffect(() => {
      const fetchData = async () => {
        if (tableCode) {
          const getTableConfig = async (tableCode: string) => {
            try {
              const res = await dispatch(getTableConfigStore(tableCode));
              setTableConfigData(res || null);
              setIsMounting(true);
            } catch (error) {}
          };
          await getTableConfig(tableCode as string);
        }
      };
      fetchData();
    }, []);

    useEffect(() => {
      const calculateData = async () => {
        if (
          useAccountingData === null ||
          (!customAttrs?.useAccountingEdit && !customAttrs?.useAccountingApi)
        ) {
          return;
        }
        if (!isMounting) {
          return;
        }
        if (useAccountingData?.editing === 1) {
          const updateAccounting = await dispatch(
            getListAccounting({
              url: customAttrs?.useAccountingApi,
              payload: getAccountingVariable(
                customAttrs?.useAccountingEdit,
                useAccountingData,
              ),
            }),
          );
          if (updateAccounting && Array.isArray(updateAccounting)) {
            setUpdateData(updateAccounting);
          }
        }
      };
      calculateData();
    }, [useAccountingData]);

    if (!tableConfigData) return <></>;
    return (
      <Box className={classes.tableWrap}>
        {(workFollowStatus &&
          configWorkflowCheck.length > 0 &&
          configWorkflowCheck.includes(workFollowStatus)) ||
        !workFollowStatus ? (
          <BaseAccountingEntryDetailsTableEdit
            onlyShow={isDisabled}
            tableOptions={tableConfigData}
            ref={handleChildForm}
            currentId={currentId}
            configGetData={configGetData}
            customDetailEntryStyle=""
            updateData={updateData}
          />
        ) : (
          <></>
        )}
      </Box>
    );
  },
);
const TableDetailEntry = React.memo(TableDetailEntryComponent);
export { TableDetailEntry };
