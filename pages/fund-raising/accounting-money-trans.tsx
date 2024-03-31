import React, { Fragment, ReactElement } from "react";
import { AppLayout } from "@/src/layouts/AppLayout";
import { NextPageWithLayout } from "../_app";
import { FundRaisingAccountingMoneyTransScreen } from "@/src/screens/fund-raising/FundRaisingAccountingMoneyTransScreen";
import * as authWrapper from "@app/core/authWrapper";

const AccountingMoneyTrans: NextPageWithLayout = (): JSX.Element => {
  return (
    <Fragment>
      <FundRaisingAccountingMoneyTransScreen />
    </Fragment>
  );
};

AccountingMoneyTrans.getLayout = function getLayout(page: ReactElement) {
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
export default AccountingMoneyTrans;
