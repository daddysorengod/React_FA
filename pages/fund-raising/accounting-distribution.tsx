import React, { Fragment, ReactElement } from "react";
import { AppLayout } from "@/src/layouts/AppLayout";
import { NextPageWithLayout } from "../_app";
import { FundRasingAccountingDistributionScreen } from "@/src/screens/fund-raising/FundRaisingAccountingDistributionScreen";
import * as authWrapper from "@app/core/authWrapper";

const AccountingDistribution: NextPageWithLayout = (): JSX.Element => {
  return (
    <Fragment>
      <FundRasingAccountingDistributionScreen />
    </Fragment>
  );
};

AccountingDistribution.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
export const getServerSideProps = authWrapper.getServerSideProps({
  isAuth: false,
})(async (context: any) => {
  return {
    // notFound: true,
    props: {},
  };
});
export default AccountingDistribution;
