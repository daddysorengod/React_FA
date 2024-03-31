import React, { Fragment, ReactElement } from "react";
import { GeneralScreen } from "@/src/screens/GeneralScreen";
import { AppLayout } from "@/src/layouts/AppLayout";
import { NextPageWithLayout } from "../_app";
import * as authWrapper from "@app/core/authWrapper";
import { getFormConfig, getValidRouter } from "@/src/helpers";
import { useMapFormToState } from "@/src/helpers/getFormSetting";

/// end import store

interface Props {
  fundScreen?: string;
  pageTitle?: string;
  screenPrevData?: string[];
}

const General: NextPageWithLayout = (props: Props): JSX.Element => {
  const { fundScreen, pageTitle, screenPrevData } = props;
  useMapFormToState({
    listFormCode: screenPrevData,
    dependencies: []
  })
  return (
    <Fragment>
      {fundScreen ? (
        <GeneralScreen pageTitle={pageTitle} />
      ) : (
        <div></div>
      )}
    </Fragment>
  );
};

export const getServerSideProps = authWrapper.getServerSideProps({
  isAuth: false,
})(async (context: any) => {
  const { fundScreen } = context?.query;
  const { pageTitle } = getValidRouter("fund", fundScreen);
  if (pageTitle) {
    const screenPrevData = getFormConfig("fund", fundScreen) ?? null;
    return {
      props: {
        pageTitle,
        fundScreen,
        screenPrevData,
      },
    };
  }
  return {
    notFound: true,
    props: {
      fundScreen: "",
    },
  };
});

General.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default General;
