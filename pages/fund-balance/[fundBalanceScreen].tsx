import React, { Fragment, ReactElement } from "react";
import { AppLayout } from "@/src/layouts/AppLayout";
import { NextPageWithLayout } from "../_app";
import * as authWrapper from "@app/core/authWrapper";
import { getFormConfig, getValidRouter } from "@/src/helpers";
import { DynamicObject } from "@/src/types/field";
import { GenericScreen } from "@/src/screens";
import { TABLE_TYPE } from "@/src/constants";
import { useMapFormToState } from "@/src/helpers/getFormSetting";

interface Props {
  pageTitle?: string;
  fundBalanceScreen?: string;
  screenPrevData?: string[];
  urlQuery?: DynamicObject;
}

const FundBalance: NextPageWithLayout = (props: Props): JSX.Element => {
  const { fundBalanceScreen, pageTitle, screenPrevData, urlQuery } = props;
  useMapFormToState({
    listFormCode: screenPrevData,
    dependencies: []
  })
  return (
    <Fragment>
      {fundBalanceScreen ? (
        <GenericScreen
          pageTitle={pageTitle}
          urlQuery={urlQuery}
          tableType={TABLE_TYPE.EXPANDABLE}
        />
      ) : (
        <div></div>
      )}
    </Fragment>
  );
};

export const getServerSideProps = authWrapper.getServerSideProps({
  isAuth: false,
})(async (context: any) => {
  const { fundBalanceScreen, ...urlQuery } = context?.query;

  const { pageTitle } = getValidRouter("fund-balance", fundBalanceScreen);
  if (pageTitle) {
    const screenPrevData = getFormConfig("fund-balance", fundBalanceScreen) ?? null;

    return {
      props: {
        pageTitle,
        fundBalanceScreen,
        screenPrevData,
        urlQuery,
      },
    };
  }
  return {
    notFound: true,
    props: {
      fundBalanceScreen: "",
    },
  };
});

FundBalance.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default FundBalance;
