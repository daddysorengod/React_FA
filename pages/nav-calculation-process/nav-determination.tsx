import React, { Fragment, ReactElement } from "react";
import { AppLayout } from "@/src/layouts/AppLayout";
import { NextPageWithLayout } from "../_app";
import { DynamicObject } from "@/src/types/field";
import * as authWrapper from "@app/core/authWrapper";
import { GenericScreen } from "@/src/screens";
import { getFormConfig } from "@/src/helpers";
import { useMapFormToState } from "@/src/helpers/getFormSetting";

interface Props {
  pageTitle?: string;
  internalTransactionScreen?: string;
  screenPrevData?: string[];
  urlQuery?: DynamicObject;
}

const NAVCalculationProcess: NextPageWithLayout = (
  props: Props,
): JSX.Element => {
  const { screenPrevData } = props
  useMapFormToState({
    listFormCode: screenPrevData,
    dependencies: []
  })
  // useEffect(() => {
  //   const listForms = [
  //     "NAV_CALCULATION_PROCESS/DEFINE_NAV/DETAIL",
  //     "NAV_CALCULATION_PROCESS/DEFINE_NAV/DETAIL/CAP_FEE",
  //   ];
  //   dispatch(getListFormConfigFromCodes(listForms));
  // }, []);

  return (
    <Fragment>
      <GenericScreen pageTitle={"Xác định NAV | Quy trình tính NAV"} />
    </Fragment>
  );
};

NAVCalculationProcess.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
export const getServerSideProps = authWrapper.getServerSideProps({
  isAuth: false,
})(async (context: any) => {
  const screenPrevData =
    getFormConfig("nav-calculation-process", "nav-determination") ?? null;
  return {
    props: {
      screenPrevData,

    },
  };
});
export default NAVCalculationProcess;
