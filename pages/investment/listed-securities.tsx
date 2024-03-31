import React, { Fragment, ReactElement } from "react";
import { AppLayout } from "@/src/layouts/AppLayout";
import { NextPageWithLayout } from "../_app";
import { InvestmentListedSecuritiesScreen } from "@/src/screens/investment/InvestmentListedSecuritiesScreen";
import * as authWrapper from "@app/core/authWrapper";
import { getFormConfigByRoute } from "@/src/helpers";
import { useMapFormToState } from "@/src/helpers/getFormSetting";

interface Props {
  screenPrevData?: string[];
}

const InvestmentListedSecurities: NextPageWithLayout = (
  props: Props,
): JSX.Element => {
  const { screenPrevData } = props;
  useMapFormToState({
    listFormCode: screenPrevData,
    dependencies: [],
  });
  return (
    <Fragment>
      <InvestmentListedSecuritiesScreen />
    </Fragment>
  );
};

InvestmentListedSecurities.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
export const getServerSideProps = authWrapper.getServerSideProps({
  isAuth: false,
})(async (context: any) => {
  const { resolvedUrl } = context;
  const screenPrevData = getFormConfigByRoute(resolvedUrl) ?? null;
  return {
    props: {
      screenPrevData,
    },
  };
});
export default InvestmentListedSecurities;
