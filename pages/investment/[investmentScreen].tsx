import React, { Fragment, ReactElement } from "react";
import { AppLayout } from "@/src/layouts/AppLayout";
import { NextPageWithLayout } from "../_app";
import { InvestmentScreen } from "@/src/screens/investment/InvestmentScreen";
import * as authWrapper from "@app/core/authWrapper";
import {
  getFormConfigByRoute,
  getValidRouter,
} from "@/src/helpers";
import { DynamicObject } from "@/src/types/field";
import { useMapFormToState } from "@/src/helpers/getFormSetting";

interface Props {
  pageTitle?: string;
  investmentScreen?: string;
  screenPrevData?: string[];
  urlQuery?: DynamicObject;
}

const Investment: NextPageWithLayout = (props: Props): JSX.Element => {
  const { investmentScreen, pageTitle, screenPrevData } = props;
  useMapFormToState({
    listFormCode: screenPrevData,
    dependencies: [investmentScreen],
  });
  return (
    <Fragment>
      <InvestmentScreen
        pageTitle={pageTitle || "Hoạt động đầu tư"}
        routeName={investmentScreen || ""}
      />
    </Fragment>
  );
};

export const getServerSideProps = authWrapper.getServerSideProps({
  isAuth: false,
})(async (context: any) => {
  const { investmentScreen, ...urlQuery } = context?.query;
  const { resolvedUrl } = context;
  const { pageTitle } = getValidRouter("investment", investmentScreen);
  if (pageTitle) {
    const screenPrevData = getFormConfigByRoute(resolvedUrl) ?? null;
    return {
      props: {
        pageTitle,
        investmentScreen,
        screenPrevData,
        urlQuery,
      },
    };
  }
  return {
    notFound: true,
    props: {
      investmentScreen: "",
    },
  };
});
Investment.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
export default Investment;
