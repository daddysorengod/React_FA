import React, { Fragment, ReactElement } from "react";
import { GeneralScreen } from "@/src/screens/GeneralScreen";
import { AppLayout } from "@/src/layouts/AppLayout";
import { NextPageWithLayout } from "../_app";
import * as authWrapper from "@app/core/authWrapper";
import { getFormConfig, getValidRouter } from "@/src/helpers";
import { DynamicObject } from "@/src/types/field";
import { useMapFormToState } from "@/src/helpers/getFormSetting";

interface Props {
  pageTitle?: string;
  generalScreen?: string;
  screenPrevData?: string[];
  urlQuery?: DynamicObject;
}

const General: NextPageWithLayout = (props: Props): JSX.Element => {
  const { generalScreen, pageTitle, screenPrevData, urlQuery } = props;
  useMapFormToState({
    listFormCode: screenPrevData,
    dependencies: []
  })
  return (
    <Fragment>
      {generalScreen ? (
        <GeneralScreen pageTitle={pageTitle} urlQuery={urlQuery} />
      ) : (
        <div></div>
      )}
    </Fragment>
  );
};

export const getServerSideProps = authWrapper.getServerSideProps({
  isAuth: false,
})(async (context: any) => {
  const { generalScreen, ...urlQuery } = context?.query;

  const { pageTitle } = getValidRouter("general", generalScreen);
  if (pageTitle) {
    const screenPrevData = getFormConfig("general", generalScreen) ?? null;

    return {
      props: {
        pageTitle,
        generalScreen,
        screenPrevData,
        urlQuery,
      },
    };
  }
  return {
    notFound: true,
    props: {
      generalScreen: "",
    },
  };
});

General.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default General;
