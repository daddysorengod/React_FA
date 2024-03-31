import React, { Fragment, ReactElement } from "react";
import { AppLayout } from "@/src/layouts/AppLayout";
import { NextPageWithLayout } from "../_app";
import * as authWrapper from "@app/core/authWrapper";
import { getFormConfig, getValidRouter } from "@/src/helpers";
import { DynamicObject } from "@/src/types/field";
import { InternalTransactionScreen } from "@/src/screens/InternalTransactionScreen";
import { useMapFormToState } from "@/src/helpers/getFormSetting";

interface Props {
  pageTitle?: string;
  internalTransaction?: string;
  screenPrevData?: string[];
  urlQuery?: DynamicObject;
}

const InternalTransaction: NextPageWithLayout = (props: Props): JSX.Element => {
  const { screenPrevData, internalTransaction } = props
  useMapFormToState({
    listFormCode: screenPrevData,
    dependencies: []
  })
  return (
    <Fragment>
      <InternalTransactionScreen routeName={internalTransaction || ""} />
    </Fragment>
  );
};

InternalTransaction.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
export const getServerSideProps = authWrapper.getServerSideProps({
  isAuth: false,
})(async (context: any) => {
  const { internalTransaction, ...urlQuery } = context?.query;

  const { pageTitle } = getValidRouter("internal-transaction", internalTransaction);
  if (pageTitle) {
    const screenPrevData =
      getFormConfig("internal-transaction", internalTransaction) ?? null;

    return {
      props: {
        pageTitle,
        internalTransaction,
        screenPrevData,
        urlQuery,
      },
    };
  }
  return {
    notFound: true,
    props: {
      internalTransaction: "",
    },
  };
});
export default InternalTransaction;
