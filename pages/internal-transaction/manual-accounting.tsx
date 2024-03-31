import React, { Fragment, ReactElement } from "react";
import { AppLayout } from "@/src/layouts/AppLayout";
import { NextPageWithLayout } from "../_app";
import { GenericScreen } from "@/src/screens";
import * as authWrapper from "@app/core/authWrapper";
import { getFormConfig } from "@/src/helpers";
import { useMapFormToState } from "@/src/helpers/getFormSetting";

interface Props {
  screenPrevData?: string[];
}

const InternalTransactionManualAccounting: NextPageWithLayout = (
  props: Props,
): JSX.Element => {
  const { screenPrevData } = props
  // useEffect(() => {
  //   const listForms = [
  //     "INTERNAL_TRANSACTION/LIST_OF_CONTRACT",
  //     "INTERNAL_TRANSACTION/CONTRACT_EXPENSE",
  //   ];
  //   dispatch(getListFormConfigFromCodes(listForms));
  // }, []);
  useMapFormToState({
    listFormCode: screenPrevData,
    dependencies: []
  })
  return (
    <Fragment>
      <GenericScreen pageTitle="Giao dịch nội bộ - Bút toán thủ công" />
    </Fragment>
  );
};

InternalTransactionManualAccounting.getLayout = function getLayout(
  page: ReactElement,
) {
  return <AppLayout>{page}</AppLayout>;
};
export const getServerSideProps = authWrapper.getServerSideProps({
  isAuth: false,
})(async (context: any) => {
  const screenPrevData =
    getFormConfig("internal-transaction", "manual-accounting") ?? null;
  return {
    props: {
      screenPrevData,

    },
  };
});
export default InternalTransactionManualAccounting;
