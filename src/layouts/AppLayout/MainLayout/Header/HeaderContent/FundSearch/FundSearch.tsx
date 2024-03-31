import React, { useState, useEffect } from "react";
import { useStyles } from "./FundSearch.styles";
import useTranslation from "next-translate/useTranslation";
import { store, useSelector, dispatch } from "@store/store";
import {
  AUTOCOMPLETE_WITH_HEADER_COLUMN_CONFIG,
  BaseWithHeaderAutocomplete,
} from "@/src/components/BaseWithHeaderAutocomplete";
import { RootStateProps } from "@/src/types/root";
import {
  getFormDataReducer,
  setGlobalFundId,
  setGlobalRecentNavDate,
} from "@/src/store/reducers/general";
import { FETCH_DATA_API_CONFIG_INTERFACE } from "@/src/types";
import { getListDataBase } from "@/src/helpers";

import { CO_ALIGN, CO_TYPE, api } from "@/src/constants";
import axios from "@/src/helpers/axios";
import { useRouter } from "next/router";
import { AccountingInvestment } from "../AccountingInvesment";
import { Box } from "@mui/material";
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

interface Props {}

const columnsConfig: AUTOCOMPLETE_WITH_HEADER_COLUMN_CONFIG[] = [
  {
    key: "code",
    label: "Mã quỹ",
    width: 12,
    type: CO_TYPE.TEXT,
    align: CO_ALIGN.LEFT,
    showOnTextField: true,
    boldText: false,
  },
  {
    key: "fullName",
    label: "Tên quỹ",
    width: 40,
    type: CO_TYPE.TEXT,
    align: CO_ALIGN.LEFT,
    showOnTextField: true,
    boldText: false,
  },
];

const FundSearchComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const globalFundId = useSelector(
    (state: RootStateProps) => state.general.globalFundId,
  );
  const route = useRouter().asPath;

  const [options, setOptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fundName, setFundName] = useState<string>("");
  const [searchString, setSearchString] = useState<string>("");

  const handleFundIdChange = async value => {
    dispatch(setGlobalFundId(value));
    const fundInfo = await dispatch(
      getFormDataReducer({
        url: "/fund-information-api/find-by-id",
        id: value,
      }),
    );
    dispatch(setGlobalRecentNavDate(fundInfo?.recentNavDate));
    dispatch({
      type: "general/setGlobalFundData",
      payload: fundInfo,
    });
  };

  const handleFundIdInputChange = async value => {
    setIsLoading(true);
    const str = (value as string).includes("-")
      ? (value as string).split("-")[0]
      : value;
    setSearchString(str);
    await getFunds(str);
  };

  const getFunds = async (searchStr?: string) => {
    const config: FETCH_DATA_API_CONFIG_INTERFACE = {
      url: "fund-information-api/find?pageIndex=1&pageSize=20&searchTerms[0].fieldName=workFollowStatus&searchTerms[0].fieldValue=2&searchTerms[0].condition=EQUAL",
      params: [
        {
          paramKey: "globalTerm",
          paramValue: searchStr || "",
        },
      ],
      searchTerms: [
        {
          fieldName: "enabled",
          fieldValue: true,
        },
      ],
    };

    const res = await getListDataBase(config);
    setOptions(res.source);
    setIsLoading(false);
  };

  const getFundNameById = async (id: string) => {
    try {
      const res = await axios.get(
        `${publicRuntimeConfig.ORIGIN_URL}/fund-information-api/find-by-id?id=${id}`,
      );

      const { code, fullName } = res?.data?.data;
      if (res?.data?.data?.fullName) {
        setFundName(`${code} - ${fullName}`);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    const asyncFunction = async () => {
      setIsLoading(true);
      await getFunds(searchString);
    };

    asyncFunction();
  }, [route]);

  useEffect(() => {
    const asyncFunction = async () => {
      if (globalFundId) {
        await getFundNameById(globalFundId);
      }
    };

    asyncFunction();
  }, [globalFundId]);

  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <BaseWithHeaderAutocomplete
        value={globalFundId}
        valueKey={"id"}
        showHeader={true}
        apiFilter
        apiDefaultTextValue={fundName}
        isLoading={isLoading}
        options={options}
        columnConfigs={columnsConfig}
        onChange={handleFundIdChange}
        onInputChange={handleFundIdInputChange}
        listHeight={300}
        listWidth={410}
        horizontalPosition={"right"}
        className={`${classes.autocompleteWithHeader} ${classes.paddingTop}`}
      />
      <AccountingInvestment />
    </Box>
  );
};
const FundSearch = React.memo(FundSearchComponent);
export { FundSearch };
