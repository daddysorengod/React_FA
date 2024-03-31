import React, { Fragment, ReactElement } from "react";
import { AppLayout } from "@/src/layouts/AppLayout";
import { NextPageWithLayout } from "../_app";
import { DynamicObject } from "@/src/types/field";
import { NAVCalculationProcessScreen } from "@/src/screens/nav-calculation-process/NAVCalculationProcessScreen";
import * as authWrapper from "@app/core/authWrapper";
import { getFormConfig, getValidRouter } from "@/src/helpers";
import { useMapFormToState } from "@/src/helpers/getFormSetting";
interface Props {
  pageTitle?: string;
  navCalculationProcess?: string;
  screenPrevData?: string[];
  urlQuery?: DynamicObject;
}

const AssetValuationProcess: NextPageWithLayout = (
  props: Props,
): JSX.Element => {
  const { screenPrevData } = props
  // useEffect(() => {
  //   const listForms = [
  //     "NAV_CALCULATION_PROCESS/ASSET_VALUATION_PROCESS/DETAIL",
  //     "NAV_CALCULATION_PROCESS/ASSET_VALUATION_PROCESS/INFORMATION",
  //     "NAV_CALCULATION_PROCESS/DEFINE_NAV/DETAIL",
  //     "NAV_CALCULATION_PROCESS/DEFINE_NAV/DETAIL/CAP_FEE"
  //   ];
  //   dispatch(getListFormConfigFromCodes(listForms));
  // }, []);
  useMapFormToState({
    listFormCode: screenPrevData,
    dependencies: []
  })
  return (
    <Fragment>
      <NAVCalculationProcessScreen />
    </Fragment>
  );
};


AssetValuationProcess.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};


export const getServerSideProps = authWrapper.getServerSideProps({
  isAuth: false,
})(async (context: any) => {
  const { navCalculationProcess, ...urlQuery } = context?.query;

  const { pageTitle } = getValidRouter("nav-calculation-process", navCalculationProcess);
  if (pageTitle) {
    const screenPrevData =
      getFormConfig("nav-calculation-process", navCalculationProcess) ?? null;

    return {
      props: {
        pageTitle,
        navCalculationProcess,
        screenPrevData,
        urlQuery,
      },
    };
  }
  return {
    notFound: true,
    props: {
      navCalculationProcess: "",
    },
  };
});

export default AssetValuationProcess;