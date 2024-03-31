import React from "react";
import { useStyles } from "./AddNewFormDialog.styles";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { TransitionProps } from "@mui/material/transitions";
import { AddNewFields } from "../AddNewFields";
import { ImagesSvg } from "@/src/constants/images";

interface Props {
  dialogTitle: String;
  openAddNewFormDialog: boolean;
  handleCloseAddNewFormDialog: any;
  handleOpenAddNewFormDialog: any;
}
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const AddNewFormDialogComponent = (props: Props): JSX.Element => {
  const classes = useStyles();

  const {
    dialogTitle,
    openAddNewFormDialog,
    handleCloseAddNewFormDialog,
    handleOpenAddNewFormDialog,
  } = props;
  return (
    <Dialog
      open={openAddNewFormDialog}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
      fullScreen
      id="AddNewFormDialog"
    >
      <DialogTitle id="AddNewFormTittleDialog" className={classes.dialogTitle}>
        <label className={classes.dialogLabel}>
          {dialogTitle ?? "Thêm mới Form"}
        </label>
        <button
          onClick={handleCloseAddNewFormDialog}
          className={classes.buttonClose}
        >
          <img src={ImagesSvg.closeIcon} />
        </button>
      </DialogTitle>
      <DialogContent className={classes.dialogBg}>
        <AddNewFields
          handleCloseAddNewFormDialog={handleCloseAddNewFormDialog}
        />
      </DialogContent>
    </Dialog>
  );
};
const AddNewFormDialog = React.memo(AddNewFormDialogComponent);
export { AddNewFormDialog };
