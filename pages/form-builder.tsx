import React, { useEffect, ReactElement } from "react";
import { FormBuilderScreen } from "@/src/screens/FormBuilderScreen";
/// import store
import { dispatch } from "@store/store";
import {
  getListFormConfigFromCodesFormBuilder,
} from "@/src/store/reducers/formBuilder";
import { setBaseRouteApiReducer as setBaseRouteApiReducerMenu } from "@/src/store/reducers/menu";
import { AppLayout } from "@/src/layouts/AppLayout";
import * as authWrapper from "@app/core/authWrapper";
/// end import store

interface Props {}
const FormBuilder = (props: Props): JSX.Element => {
  useEffect(() => {
    dispatch(getListFormConfigFromCodesFormBuilder());
    dispatch(setBaseRouteApiReducerMenu(`/form-builder-api`));
  }, []);
  return <FormBuilderScreen />;
};
FormBuilder.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
export default FormBuilder;

export const getServerSideProps = authWrapper.getServerSideProps({
  isAuth: false,
  hideInProduction: true,
})(async (context: any) => {
  console.log("context: ", context?.req?.headers["user-agent"]);

  return {
    // notFound: true,
    props: {},
  };
});
