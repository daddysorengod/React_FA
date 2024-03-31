import React, { useState } from "react";
import { TransitionProps } from "@mui/material/transitions";
import { useStyles } from "./BaseConfirmModal.styles";
import {
  Dialog,
  Slide,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  title: string;
  content: string;
  textSubmit: string;
  textClose: string;
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  icon: string;
  key?: string;
}
const Modal = (props: Props): JSX.Element => {
  const {
    title,
    content,
    textSubmit,
    visible,
    onClose,
    onSubmit,
    textClose,
    icon,
    key,
  } = props;
  const classes = useStyles();

  // click enter
  const handleKeyUpEnter = event => {
    if (event.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <Dialog
      open={visible}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 340,
        },
      }}
      className={classes.dialog}
      // key={key}
    >
      <DialogTitle
        id={`confirm-modal-${title}`}
        className={classes.dialogTitle}
      >
        {icon && <img src={icon} />}
        <div> {title}</div>
      </DialogTitle>
      <DialogContent sx={{ padding: "20px 24px" }}>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <div className={classes.btnContainer}>
        <Button onClick={onClose} className={classes.closeBtn}>
          {textClose}
        </Button>
        <Button
          onClick={onSubmit}
          className={classes.submitBtn}
          onKeyUp={handleKeyUpEnter}
          tabIndex={0}
        >
          {textSubmit}
        </Button>
      </div>
    </Dialog>
  );
};
const BaseConfirmModal = React.memo(Modal);
export { BaseConfirmModal };
