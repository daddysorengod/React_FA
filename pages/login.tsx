import React, { Fragment } from "react";
import { LoginScreen } from "@/src/screens/LoginScreen";
import dynamic from "next/dynamic";
import * as authWrapper from "@app/core/authWrapper";

// const DynamicComponentJqueryWithNoSSR = dynamic(
//   () => import("@app/contexts/JqueryContext"),
//   { ssr: true },
// );

const loginPage = (): JSX.Element => {
  return (
    <Fragment>
      {/* <DynamicComponentJqueryWithNoSSR/> */}
      <LoginScreen />
    </Fragment>
  );
};
export const getServerSideProps = authWrapper.getServerSideProps({
  isAuth: false,
})(async (context: any) => {
  const code = context.query?.code ?? "";
  return {
    // notFound: true,
    props: {
      code,
    },
  };
});
export default loginPage;
