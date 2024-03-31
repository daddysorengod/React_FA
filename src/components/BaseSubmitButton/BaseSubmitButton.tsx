import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useStyles } from "./BaseSubmitButton.styles";
import useTranslation from "next-translate/useTranslation";
import { ButtonBase, } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';

interface Props {
  disabled: boolean;
  className: string,
  children: any,
  type: string,
  onClick: VoidFunction,
  sx: any
}
const Component = forwardRef((props: any, ref: any): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const { disabled } = props;
  useImperativeHandle(ref, () => ({
    setButtonLoading(value: boolean) {
      setIsLoading(value);
    },
  }));
  return (
    <LoadingButton
      {...props}
      className={`${classes.button} ${props.className}`}
      disabled={disabled || isLoading}
      loading={isLoading}
      loadingPosition="start"
        variant="outlined"

    >
      {props.children}
    </LoadingButton>
  );
});
const BaseSubmitButton = React.memo(Component);
export { BaseSubmitButton };


