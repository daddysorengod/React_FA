import React, { Fragment, ReactElement } from "react";
import { AppLayout } from "@/src/layouts/AppLayout";
import { NextPageWithLayout } from "../_app";
import { DecentralizationScreen } from "@/src/screens/Decentralization";
import * as authWrapper from "@app/core/authWrapper";
import { getFormConfig, getValidRouter } from "@/src/helpers";
import { DynamicObject } from "@/src/types/field";
import { useMapFormToState } from "@/src/helpers/getFormSetting";

interface Props {
  pageTitle?: string;
  decentralizationScreen?: string;
  screenPrevData?: string[];
  urlQuery?: DynamicObject;
}

const Decentralization: NextPageWithLayout = (props: Props): JSX.Element => {
  const { decentralizationScreen, pageTitle, screenPrevData, urlQuery } = props;
  useMapFormToState({
    listFormCode: screenPrevData,
    dependencies: [],
  });
  return (
    <Fragment>
      {decentralizationScreen ? (
        <DecentralizationScreen
          pageTitle={pageTitle}
          urlQuery={urlQuery}
          complianceControlRoute={decentralizationScreen || ""}
        />     ) : (
        <div></div>
      )}
    </Fragment>
  );
};

export const getServerSideProps = authWrapper.getServerSideProps({
  isAuth: false,
})(async (context: any) => {
  const { decentralizationScreen, ...urlQuery } = context?.query;

  const { pageTitle } = getValidRouter(
    "decentralization",
    decentralizationScreen,
  );
  if (pageTitle) {
    const screenPrevData =
      getFormConfig("decentralization", decentralizationScreen) ?? null;

    return {
      props: {
        pageTitle,
        decentralizationScreen,
        screenPrevData,
        urlQuery,
      },
    };
  }
  return {
    notFound: true,
    props: {
      decentralizationScreen: "",
    },
  };
});

Decentralization.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default Decentralization;
