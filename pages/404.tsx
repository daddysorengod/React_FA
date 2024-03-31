import React, { ReactElement } from "react";
import { PageNotFoundScreen } from "@/src/screens/PageNotFoundScreen";
import { NextPageWithLayout } from "./_app";
import { AppLayout } from "@/src/layouts/AppLayout";
import * as authWrapper from "@app/core/authWrapper";
const PageNotFound: NextPageWithLayout = (): JSX.Element => {
  return <PageNotFoundScreen />;
};
PageNotFound.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
// export const getServerSideProps = authWrapper.getServerSideProps({
//   isAuth: false,
// })(async (context: any) => {
//   return {
//     // notFound: true,
//     props: {},
//   };
// });
export default PageNotFound;
