import React, { ReactNode } from "react";
import { useStyles } from "./AuthWrapper.styles";
import useTranslation from "next-translate/useTranslation";
interface Props {
  children: ReactNode;
  title: String;
}
const AuthWrapperComponent = (props: Props): JSX.Element => {
  const { children, title } = props;
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.content}>
        <div className={classes.containerChild}>
          <div className={classes.contentChild}>
            <div className={classes.logoContainer}>
              <img src="/images/vp-logo.png" alt="" className={classes.logo} />
              <h1 className={classes.title}>{title}</h1>
            </div>
            {children}
          </div>
        </div>
        <img
          src="/images/vp-shape-1.png"
          alt=""
          className={classes.bg_shape_1}
        />
        <img
          src="/images/vp-shape-2.png"
          alt=""
          className={classes.bg_shape_2}
        />
        <img
          src="/images/vp-shape-3.png"
          alt=""
          className={classes.bg_shape_3}
        />
        <img
          src="/images/vp-shape-4.png"
          alt=""
          className={classes.bg_shape_4}
        />
      </div>
    </div>
  );
};
const AuthWrapper = React.memo(AuthWrapperComponent);
export { AuthWrapper };
