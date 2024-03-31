import React, { Fragment, ReactElement } from "react";
/// import store
import { AppLayout } from "@/src/layouts/AppLayout";
import { TableBuilderScreen } from "@/src/screens/TableBuilderScreen";
import * as authWrapper from "@app/core/authWrapper";
/// end import store

interface Props {}
const TableBuilder = (props: Props): JSX.Element => {
  return (
    <Fragment>
      <TableBuilderScreen />
    </Fragment>
  );
};
TableBuilder.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
export default TableBuilder;
export const getServerSideProps = authWrapper.getServerSideProps({
  isAuth: false,
  hideInProduction: true,
})(async (context: any) => {
  return {
    // notFound: true,
    props: {},
  };
});
