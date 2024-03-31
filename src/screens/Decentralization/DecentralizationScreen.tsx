import React, { useState, useEffect, useRef } from "react";
import { BaseDynamicTable } from "@/src/components/BaseTable/BaseDynamicTable";
import { useStyles } from "./Decentralization.styles";
import Page from "@/src/components/third-party/Page";
/// import store
import { dispatch, useSelector } from "@store/store";
import { RootStateProps } from "@app/types/root";

import { getTableConfigStore } from "@/src/store/reducers/tableConfig";
import { Box, Tab, Tabs } from "@mui/material";
import { DynamicObject } from "@/src/types/field";
import {
  PARAM_INTERFACE,
  SEARCH_TERMS_INTERFACE,
  TABLE_OPTIONS_INTERFACE,
} from "@/src/types";
interface Props {
  pageTitle?: string;
  urlQuery?: DynamicObject;
  complianceControlRoute: string;
}

const DecentralizationScreenComponent = (props: Props): JSX.Element => {
  const classes = useStyles();
  const { complianceControlRoute } = props;
  const globalFundId = useSelector(
    (state: RootStateProps) => state.general.globalFundId,
  );

  // const route = useRouter().asPath.split("?")[0];

  const [mainTableConfig, setMainTableConfig] = useState<
    TABLE_OPTIONS_INTERFACE | undefined
  >(undefined);
  const [detailedTableConfig, setDetailedTableConfig] = useState<
    TABLE_OPTIONS_INTERFACE | undefined
  >(undefined);

  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string>("");
  const detailTableComponentRef = useRef<any>(null);

  const getTableConfigByTab = async (obj: {
    title: string;
    mainTableCode: string;
    accountingEntryDetailTableCode?: string;
    configGetData?: {
      url: string;
      params?: PARAM_INTERFACE[];
      searchTerms?: SEARCH_TERMS_INTERFACE[];
    };
  }) => {
    const res = await dispatch(getTableConfigStore(obj.mainTableCode));
    setMainTableConfig(res || undefined);

    if (!!obj.accountingEntryDetailTableCode) {
      const res2 = await dispatch(
        getTableConfigStore(obj.accountingEntryDetailTableCode),
      );
      setDetailedTableConfig(res2 || undefined);
    } else {
      setDetailedTableConfig(undefined);
    }
  };

  useEffect(() => {
    const asyncFunction = async () => {
      setSelectedId("");
      if (
        !complianceControlRoute ||
        !CONFIG[complianceControlRoute] ||
        !CONFIG[complianceControlRoute].listOfTab[activeTab]
      ) {
        return;
      }
      await getTableConfigByTab(
        CONFIG[complianceControlRoute].listOfTab[activeTab],
      );
    };

    asyncFunction();
  }, [activeTab, complianceControlRoute]);

  useEffect(() => {
    const refreshTab = () => {
      setActiveTab(0);
    };
    refreshTab();
  }, [complianceControlRoute]);

  return (
    <Page
      title={`Tài khoản & nhóm quyền${
        CONFIG[complianceControlRoute] && !!CONFIG[complianceControlRoute].title
          ? ` - ${CONFIG[complianceControlRoute].title}`
          : ""
      }`}
    >
      <Box className={classes.name}>Tài khoản & nhóm quyền</Box>
      <Box
        sx={{
          height: "100%",
          overflow: "hidden",
        }}
      >
        {CONFIG[complianceControlRoute] &&
        CONFIG[complianceControlRoute].listOfTab &&
        !CONFIG[complianceControlRoute].isDisabledTabHeader ? (
          <Tabs
            value={activeTab}
            onChange={(_event, newValue) => setActiveTab(newValue)}
            sx={{
              marginBottom: "16px",
              borderBottom: "1px solid #E2E6EA",
            }}
          >
            {CONFIG[complianceControlRoute].listOfTab.map((ele, index) => (
              <Tab
                label={ele.title}
                sx={{
                  fontWeight: "600",
                }}
                key={index}
              />
            ))}
          </Tabs>
        ) : (
          <></>
        )}
        {mainTableConfig ? (
          <Box
            sx={{
              height: !!detailedTableConfig ? "50%" : "85%",
              marginBottom: "20px",
            }}
          >
            <BaseDynamicTable
              tableOptions={mainTableConfig}
              parentId={globalFundId}
              onClickRow={
                !!detailedTableConfig ? rowData => setSelectedId(rowData["id"]) : undefined
              }
              selectedId={!!detailedTableConfig ? selectedId : undefined}
              onRefreshRecord={() => {
                if (detailTableComponentRef.current?.onRefresh) {
                  detailTableComponentRef.current.onRefresh();
                }
              }}
              entryProp={{
                ...{ fundId: globalFundId },
              }}
            />
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Page>
  );
};
const DecentralizationScreen = React.memo(DecentralizationScreenComponent);
export { DecentralizationScreen };

const CONFIG: {
  [key: string]: {
    title: string;
    isDisabledTabHeader: boolean;
    listOfTab: {
      title: string;

      mainTableCode: string;
      accountingEntryDetailTableCode?: string;
      configGetData?: {
        url: string;
        params?: PARAM_INTERFACE[];
        searchTerms?: SEARCH_TERMS_INTERFACE[];
        idName?: string;
      };
    }[];
  };
} = {
  "decentralization-group-function": {
    title: "",
    isDisabledTabHeader: false,
    listOfTab: [
      {
        title: "Nhóm quyền",
        mainTableCode:
          "DECENTRALIZATION/DECENTRALIZATION-GROUP-FUNCTION/GROUP-FUNCTION-LIST/MAIN",
        accountingEntryDetailTableCode: "",
      },
      {
        title: "Quản lý tài khoản",
        mainTableCode:
          "DECENTRALIZATION/DECENTRALIZATION-GROUP-FUNCTION/ACCOUNT-LIST/MAIN",
        accountingEntryDetailTableCode: "",
      },
    ],
  },
};
