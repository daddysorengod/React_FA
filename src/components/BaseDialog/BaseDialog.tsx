import React from "react";
import { useStyles } from "./BaseDialog.styles";
import useTranslation from "next-translate/useTranslation";
import { Dialog, Slide, DialogTitle, DialogContent } from "@mui/material";
import { ImagesSvg } from "@/src/constants/images";
interface Props {
  data: any;
  data2: any;
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  widthType: any;
  stepper: any;
}
const BaseDialogComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { data, data2, visible, onClose, onSubmit, widthType, stepper } = props;
  return (
    <Dialog
      open={visible}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
      fullWidth={true}
      maxWidth={widthType}
    >
      <DialogTitle id="scroll-dialog-title" className={classes.dialogTitle}>
        <label className={classes.dialogLabel}>{data?.addNewFormName}</label>
        <button onClick={onClose} className={classes.closeBtn}>
          <img src={ImagesSvg.closeIcon} />
        </button>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}></DialogContent>
    </Dialog>
  );
};
const BaseDialog = React.memo(BaseDialogComponent);
export { BaseDialog };
