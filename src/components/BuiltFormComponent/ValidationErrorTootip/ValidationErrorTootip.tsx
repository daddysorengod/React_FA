import React from "react";
import { useStyles } from "@/src/components/BuiltFormComponent/BuiltFormComponent.styles";
import useTranslation from "next-translate/useTranslation";
import { Tooltip } from "@mui/material";
interface Props {
  error?: boolean;
  errorMessage?: string;
  className?: any;
}
const ValidationErrorTootipComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { error, errorMessage, className } = props;
  return (
    <>
      {!!error ? (
        <Tooltip
          arrow
          placement="bottom-end"
          title={errorMessage || ""}
          className={
            className === null
              ? classes.textFieldInputValidateTootip
              : className
          }
        >
          <img src="/svg/error_icon.svg" />
        </Tooltip>
      ) : (
        <></>
      )}
    </>
  );
};
const ValidationErrorTootip = React.memo(ValidationErrorTootipComponent);
export { ValidationErrorTootip };
