import React, { Fragment, ReactElement } from "react";
import { AppLayout } from "@/src/layouts/AppLayout";
import { NextPageWithLayout } from "../_app";
import { EventTHQScreen } from "@/src/screens/EventTHQ";
import * as authWrapper from "@app/core/authWrapper";
import { getFormConfig, getValidRouter } from "@/src/helpers";
import { DynamicObject } from "@/src/types/field";
import { useMapFormToState } from "@/src/helpers/getFormSetting";

interface Props {
  pageTitle?: string;
  eventTHQScreen?: string;
  screenPrevData?: string[];
  urlQuery?: DynamicObject;
}

const EventTHQ: NextPageWithLayout = (props: Props): JSX.Element => {
  const { eventTHQScreen, pageTitle, screenPrevData, urlQuery } = props;
  useMapFormToState({
    listFormCode: screenPrevData,
    dependencies: [],
  });
  return (
    <Fragment>
      {eventTHQScreen ? (
        <EventTHQScreen
          pageTitle={pageTitle}
          urlQuery={urlQuery}
          EventTHQControlRoute={eventTHQScreen || ""}
        />
      ) : (
        <div></div>
      )}
    </Fragment>
  );
};

export const getServerSideProps = authWrapper.getServerSideProps({
  isAuth: false,
})(async (context: any) => {
  const { eventTHQScreen, ...urlQuery } = context?.query;

  const { pageTitle } = getValidRouter("event-THQ", eventTHQScreen);

  if (pageTitle) {
    const screenPrevData = getFormConfig("event-THQ", eventTHQScreen) ?? null;
    return {
      props: {
        pageTitle,
        eventTHQScreen,
        screenPrevData,
        urlQuery,
      },
    };
  }
  return {
    notFound: true,
    props: {
      eventTHQScreen: "",
    },
  };
});

EventTHQ.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default EventTHQ;
