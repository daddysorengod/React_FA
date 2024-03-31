import React, {
  useState,
  Fragment,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
/// import store
import { dispatch } from "@store/store";
/// end import store
import {
  BaseConfirmModal,
  BaseFormDynamicSteps,
} from "@/src/components";
import { useStyles } from "./ViewFormDialog.styles";
import {
  IconButton,
} from "@mui/material";
import { DynamicObject, IFieldValue, IForm } from "@/src/types/field";
import { TabPanel, Transition } from "./component";
import {
  getFormDataReducer,
} from "@/src/store/reducers/general";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  ITypeComponent,
} from "@/src/constants/formConfigFiles";
import { IDialog } from "@/src/constants/formConfigFiles";
import { IFormType } from "@/src/types/general";
import { inputDisable } from "@/src/helpers/disableInput";

interface Props {
  data?: IDialog;
  visible: boolean;
  onCloseDialogForm: () => void;
  formSetting?: any;
  currentId?: string;
  currentStatus?: IFormType;
  handleRefresh: VoidFunction;
  parentId?: DynamicObject;
  submitParentData: any;
  checkerAPI?: {
    approve?: string;
    deny?: string;
    cancelApprove?: string;
  };
  workFollowStatus?: string;
  formBuilderCurrentSetting: IForm;
}

const configSizeDialog = (dialogConfig: IDialog | undefined) => {
  switch (dialogConfig?.size) {
    case "SUBMIT_IFRAME":
      return { maxWidth: "md", fullWidth: true, height: "600px" };
    case "SUBMIT_IFRAME_LARGE":
      return { maxWidth: "lg", fullWidth: true, height: "600px" };
    case "SUBMIT_IFRAME_XLARGE":
      return { fullScreen: true, height: undefined };
    default:
      return;
  }
};

const ViewFormDialog = (props: Props): JSX.Element => {
  const {
    data,
    formSetting,
    visible,
    onCloseDialogForm,
    // formSize,
    // isDisabled,
    currentId,
    currentStatus,
    handleRefresh,
    parentId,
    submitParentData,
    checkerAPI,
    workFollowStatus,
    formBuilderCurrentSetting,
  } = props;
  const classes = useStyles();
  const [openDialogCancel, setOpenDialogCancel] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<IFieldValue>({});
  const [submitData, setSubmitData] = useState({});
  const [parentRecordId, setParentRecordId] = useState<DynamicObject>({
    ...parentId,
  });

  const [formSize, setFormSize] = useState<any>();

  useLayoutEffect(() => {
    setFormSize(() => {
      return configSizeDialog(data);
    });
  }, [data]);

  useEffect(() => {
    setParentRecordId({ ...parentId });
  }, [parentId]);

  useEffect(() => {
    if (!currentId) {
      setCurrentRecord({});
      return;
    }
    const getRecordData = async () => {
      if (data === undefined) {
        return;
      }
      if (parentRecordId && Object.keys(parentRecordId).length > 0) {
        const recordData = await dispatch(
          getFormDataReducer({
            id: currentId,
            url: data.children[activeTab].children[0]?.fetchUrl ?? "",
          }),
        );
        if (recordData && Object.keys(recordData).length > 0) {
          setCurrentRecord(recordData);
        }
        if (
          data?.children &&
          data.children.length > 1 &&
          data.children[activeTab].apiSubmit.idName
        ) {
          setSubmitData({
            ...parentRecordId,
            [data.children[activeTab].apiSubmit.idName ?? "id"]: currentId,
          });
        } else {
          setSubmitData({ id: currentId, ...parentRecordId });
        }
        return;
      }
      const recordData = await dispatch(
        getFormDataReducer({
          id: currentId,
          url: data.children[activeTab].children[0].fetchUrl ?? "",
        }),
      );
      if (recordData && Object.keys(recordData).length > 0) {
        setCurrentRecord(recordData);
      }
      if (
        data?.children &&
        data.children.length > 1 &&
        data.children[activeTab].apiSubmit.idName
      ) {
        setSubmitData({
          [data.children[activeTab].apiSubmit.idName ?? "id"]: currentId,
        });
      } else {
        setSubmitData({ id: currentId });
      }
    };
    getRecordData();
  }, [currentId]);

  useEffect(() => {
    if (!currentStatus) {
      return;
    }
    setIsDisabled(inputDisable(currentStatus));
  }, [currentStatus]);

  const onCloseConfirmModal = () => {
    setOpenDialogCancel(false);
  };

  const onCloseDialogFormRef = () => {
    onCloseDialogForm();
    setSubmitData({});
    setCurrentRecord({});
    handleSubmitForm?.current?.handleUnFocus();
    handleRefresh();
  };

  const handleCloseDialogCreate = () => {
    if (currentStatus === "update" || currentStatus === "create") {
      setOpenDialogCancel(true);
    } else {
      onCloseDialogFormRef();
    }
  };

  const onCloseAllDialog = () => {
    setCurrentRecord({});
    onCloseDialogFormRef();
    setOpenDialogCancel(false);
    handleResetRecordValues();
  };

  const renderTitleDialog = (formType?: string, formData?: IDialog) => {
    switch (formType) {
      case "update":
        return `Cập nhật ${formData?.title}`;
      case "create":
        return `Thêm mới ${formData?.title}`;
      case "show":
        return `Chi tiết ${formData?.title}`;
      default:
        return `${formData?.title?.replace(/^\w/, c => c)}`;
    }
  };

  /// new Hook Step tab
  const [activeTab, setActiveTab] = useState(0);
  const steps = data
    ? data.children?.map((item, index: number) => {
        return item?.title ? item?.title : "";
      })
    : [];

  const handleSubmitForm = useRef() as any;

  const handleResetRecordValues = async () => {
    try {
      let clearRecord = {};
      Object.keys(currentRecord).forEach(key => {
        clearRecord[key] = null;
      });
      setCurrentRecord(clearRecord);
    } catch (err) {
      console.log("handleResetRecordValues => fail");
      setCurrentRecord({});
    }
  };

  return (
    <Fragment>
      <Dialog
        open={visible}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        maxWidth={formSize?.maxWidth || "sm"}
        fullWidth={formSize?.fullWidth || false}
        fullScreen={formSize?.fullScreen || false}
        sx={{
          "& .MuiPaper-root": {
            minHeight: formSize?.height,
            maxHeight: "100vh",
          },
        }}
      >
        <DialogTitle id="scroll-dialog-title" className={classes.dialogTitle}>
          <label className={classes.dialogLabel}>
            {renderTitleDialog(currentStatus, data)}
          </label>
          <IconButton
            onClick={handleCloseDialogCreate}
            className={classes.closeBtn}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {steps?.map((formName: string, formIndex: number) => (
            <TabPanel value={activeTab} key={formIndex} index={formIndex}>
              {data &&
                data?.children[activeTab].children.length > 0 &&
                data?.children[activeTab].children.map((item, index) => {
                  switch (item.type) {
                    case ITypeComponent.DYNAMIC:
                      return (
                        <BaseFormDynamicSteps
                          currentRecord={
                            currentRecord && typeof currentRecord === "object"
                              ? currentRecord
                              : {}
                          }
                          currentId={currentId}
                          isDisableField={isDisabled}
                          formType={currentStatus}
                          key={formIndex}
                          ref={handleSubmitForm}
                          formSettingSubmitStep={data?.children[activeTab]}
                          formCode={item?.code}
                          parentId={parentRecordId}
                          formBuilderCurrentSetting={formBuilderCurrentSetting}
                          formBuildMode={true}
                        />
                      );
                    default:
                      return <></>;
                  }
                })}
            </TabPanel>
          ))}
        </DialogContent>
      </Dialog>
      <BaseConfirmModal
        icon={""}
        title={"Bạn có chắc chắn muốn đóng bản ghi này không?"}
        content={""}
        textSubmit={"Có"}
        textClose={"Không"}
        visible={openDialogCancel}
        onClose={onCloseConfirmModal}
        onSubmit={onCloseAllDialog}
        // key={`fa-sub
        // ${data?.title}`}
      />
    </Fragment>
  );
};
const BaseViewFormDialog = React.memo(ViewFormDialog);
export { BaseViewFormDialog };
