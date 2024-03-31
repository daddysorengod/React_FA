import React from "react";
import { useStyles } from "./PageNotFoundScreen.styles";
import useTranslation from "next-translate/useTranslation";
import Page from "@/src/components/third-party/Page";
import { ImagesSvg } from "@/src/constants/images";

interface Props {}
const PageNotFoundScreenComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <Page title="Page not found">
      <div className={classes.root}>
        <img src={ImagesSvg.appPageNotFound} alt="" />
        <span className={classes.title}>404</span>
        <span className={classes.des}>Page not found</span>
      </div>
    </Page>
  );
};
const PageNotFoundScreen = React.memo(PageNotFoundScreenComponent);
export { PageNotFoundScreen };
