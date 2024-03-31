import React, { ReactElement, useEffect } from "react";
// import { BuilderScreen } from "@screens/BuilderScreen";
import { NextPageWithLayout } from "./_app";
import { AppLayout } from "@/src/layouts/AppLayout";
import * as authWrapper from "@app/core/authWrapper";

const Home: NextPageWithLayout = () => {
  return <main>{/* <GenericScreen /> */}</main>;
};
export const getServerSideProps = authWrapper.getServerSideProps({
  isAuth: false,
})(async context => {
  return {
    props: {},
  };
});
Home.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default Home;
