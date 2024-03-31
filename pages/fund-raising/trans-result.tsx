import React, { Fragment, ReactElement } from "react";
import { AppLayout } from "@/src/layouts/AppLayout";
import { NextPageWithLayout } from "../_app";
import * as authWrapper from "@app/core/authWrapper";
import { GenericScreen } from "@/src/screens";

const TransResult: NextPageWithLayout = (): JSX.Element => {
  return (
    <Fragment>
      <GenericScreen pageTitle={"Huy Động Vốn | Kết quả giao dịch CCQ"} />
    </Fragment>
  );
};

TransResult.getLayout = function getLayout(page: ReactElement) {
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
export default TransResult;
