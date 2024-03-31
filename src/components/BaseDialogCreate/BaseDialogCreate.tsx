import React, {
  useState,
  Fragment,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
import { Dialog, DialogTitle, DialogContent, Grid } from "@mui/material";
import dynamic from "next/dynamic";
/// import store
import { dispatch, useSelector } from "@store/store";
import { RootStateProps } from "@app/types/root";
/// end import store
import {
  BaseConfirmModal,
  BaseFormDynamicSteps,
  BaseSubmitButton,
} from "@/src/components";
import { useStyles } from "./BaseDialogCreate.styles";
import {
  ButtonBase,
  Step,
  StepButton,
  StepConnector,
  Stepper,
  Tabs,
  Tab,
  Box,
  IconButton,
} from "@mui/material";
import { DynamicObject, IFieldValue, IForm } from "@/src/types/field";
import { TabPanel, tabApplyProps, Transition } from "./component";
import {
  clearDetailContract,
  getFormDataReducer,
  insertOrUpdateRecord,
  insertOrUpdateRecordFormData,
} from "@/src/store/reducers/general";
import { BaseTableFormDynamicSteps } from "../BaseTableFormDynamicSteps";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  CustomView,
  DIALOG_TYPE,
  ICustomTypeBottomButton,
  ICustomTypeTabHeader,
  ITypeComponent,
  ITypeSubmit,
} from "@/src/constants/formConfigFiles";
import { IDialog } from "@/src/constants/formConfigFiles";
import { IFormType } from "@/src/types/general";
import { inputDisable } from "@/src/helpers/disableInput";
import { compareObjectsNotNull } from "@/src/helpers/getQueryURL";
import { BaseImportDataFromExcelForm } from "../BaseImportDataFromExcelForm";
import { CLOSE_DIALOG_ACTION_TYPE } from "@/src/constants";
import { GroupApprovedButtons } from "../GroupApprovedButtons";
import { toLowerCaseFirstChar } from "@/src/helpers";
import { ContractInformationWrapper } from "../ContractInformationWrapper";
import { NAVCycle } from "../BuiltFormComponent/fund/fund-information/NAVCycle";
import { FundAccountSystemAddNewForm } from "../BuiltFormComponent/fund/fund-information/FundAccountSystemAddNewForm";
import { AddBalance } from "../BuiltFormComponent/fund/fund-accounting-balance/AddBalance";
import { AddBankAccountBalanceTrans } from "../BuiltFormComponent/fund/fund-accounting-balance/AddBankAccountBalanceTrans";
import { AddOrganizeBalanceTrans } from "../BuiltFormComponent/fund/fund-accounting-balance/AddOrganizeBalanceTrans";
import { AddInvestorBalance } from "../BuiltFormComponent/fund/fund-accounting-balance/AddInvestorBalance";
import { TimeDepositContractForm } from "../BuiltFormComponent/investment/time-deposit/TimeDepositContractForm";
import { ReportStaticInvestmentScreen } from "@app/screens/DialogScreen/ReportStaticInvestmentScreen";
import { ReportStaticNavScreen } from "@app/screens/DialogScreen/ReportStaticNavScreen";
import { SetManualAccountingFormDetail } from "../BuiltFormComponent/investment/set-manual-accounting-form";
import { SetManualAccountingFormImport } from "../BuiltFormComponent/investment/set-manual-accounting-import-form";
import { AddBankAccountBalance } from "../BuiltFormComponent/fund/fund-accounting-balance/AddBankAccountBalance";
import { AddOrganizeBalance } from "../BuiltFormComponent/fund/fund-accounting-balance/AddOrganizeBalance";
import { AccountingMoneyTransDetail } from "../BuiltFormComponent/fund-raising/accounting-money-trans/AccountingMoneyTransDetail";
import { BalanceCompareForm } from "../BuiltFormComponent/nav-balance-compare/BalanceCompareForm";
import { AccountAdd } from "../BuiltFormComponent/account-identify/account-add";
import { DecentralizationFormImport } from "../BuiltFormComponent/account-decentralization/decentralization/AddDecentralization";
import { DecentralizationFormDetail } from "../BuiltFormComponent/account-decentralization/decentralization/Decentralization";

interface Props {
  dialogConfig?: IDialog;
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
    cancelApprove: string;
    cancelAccountingEntry?: {
      url: string;
      id: string;
    };
  };
  workFollowStatus?: string;
  checkerApprove?: boolean;
  checkerCancelAccountingEntry?: boolean;
  useCurrentRecordId?: boolean;
  isRefreshForm?: boolean;
}

const configSizeDialog = (dialogConfig: IDialog | undefined) => {
  switch (dialogConfig?.size) {
    case "SUBMIT_IFRAME":
      return { maxWidth: "md", fullWidth: true, height: "600px" };
    case "SUBMIT_IFRAME_LARGE":
      return { maxWidth: "lg", fullWidth: true, height: "600px" };
    case "SUBMIT_IFRAME_XLARGE":
      return { fullScreen: true, height: undefined, maxWidth: "sm" };
    default:
      return { maxWidth: "sm" };
  }
};

const renderTitleDialog = (formType?: string, dialogFormat?: IDialog) => {
  if (dialogFormat?.isCustomTitle) {
    return `${dialogFormat?.title?.replace(/^\w/, c => c)}`;
  }
  switch (formType) {
    case "update":
      return `Cập nhật ${toLowerCaseFirstChar(dialogFormat?.title)}`;
    case "create":
      return `Thêm mới ${toLowerCaseFirstChar(dialogFormat?.title)}`;
    case "show":
      return `Chi tiết ${toLowerCaseFirstChar(dialogFormat?.title)}`;
    default:
      return `${dialogFormat?.title?.replace(/^\w/, c => c)}`;
  }
};

const BaseDialog = (props: Props): JSX.Element => {
  const {
    dialogConfig,
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
    checkerApprove,
    checkerCancelAccountingEntry,
    useCurrentRecordId,
    isRefreshForm,
  } = props;
  const classes = useStyles();
  const [openDialogCancel, setOpenDialogCancel] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<IFieldValue>({});
  const [submitData, setSubmitData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [parentRecordId, setParentRecordId] = useState<DynamicObject>({
    ...parentId,
  });
  const [formSize, setFormSize] = useState<any>();

  const [activeTab, setActiveTab] = useState(0);
  const [tabCompleted, setTabCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  const userRole = useSelector(state => state.auth.role);

  const parentIdName = Object.keys(
    parentRecordId as DynamicObject,
  )[0] as string;

  useLayoutEffect(() => {
    setFormSize(() => {
      return configSizeDialog(dialogConfig);
    });
  }, [dialogConfig]);

  useEffect(() => {
    setParentRecordId({ ...parentId });
  }, [parentId]);

  const globalFundId = useSelector(
    (state: RootStateProps) => state.general.globalFundId,
  );

  // useEffect(() => {
  //   if (
  //     dialogConfig !== undefined &&
  //     dialogConfig.children[activeTab].children[0].type ===
  //       ITypeComponent.DYNAMIC
  //   ) {
  //     setIsRefresh(true);
  //   }
  // }, [activeTab]);

  useEffect(() => {
    if (!currentId) {
      setCurrentRecord({});
      return;
    }
    const getRecordData = async () => {
      try {
        if (dialogConfig === undefined) {
          return;
        }

        if (isLoading && !isRefresh) {
          return;
        }
        // setIsLoading(true);
        if (parentRecordId && Object.keys(parentRecordId).length > 0) {
          const recordData = await dispatch(
            getFormDataReducer({
              id: currentId,
              url: dialogConfig.children[activeTab].children[0]?.fetchUrl ?? "",
            }),
          );
          if (recordData && Object.keys(recordData).length > 0) {
            setCurrentRecord(recordData);
          }
          if (
            dialogConfig?.children &&
            dialogConfig.children.length > 1 &&
            dialogConfig.children[activeTab].apiSubmit.idName
          ) {
            setSubmitData({
              ...parentRecordId,
              [dialogConfig.children[activeTab].apiSubmit.idName || "id"]:
                currentId,
            });
          } else {
            setSubmitData({
              [dialogConfig.children[activeTab].apiSubmit.idName || "id"]:
                currentId,
              ...parentRecordId,
            });
          }
          return;
        }
        const recordData = await dispatch(
          getFormDataReducer({
            id: currentId,
            url: dialogConfig.children[activeTab].children[0].fetchUrl ?? "",
          }),
        );
        if (recordData && Object.keys(recordData).length > 0) {
          setCurrentRecord(recordData);
        }
        if (
          dialogConfig?.children &&
          dialogConfig.children.length > 1 &&
          dialogConfig.children[activeTab].apiSubmit.idName
        ) {
          setSubmitData({
            [dialogConfig.children[activeTab].apiSubmit.idName || "id"]:
              currentId,
          });
        } else {
          setSubmitData({
            [dialogConfig.children[activeTab].apiSubmit.idName || "id"]:
              currentId,
          });
        }
        setIsLoading(false);
        setIsRefresh(false);
      } catch (err) {}
    };
    getRecordData();
  }, [currentId]);

  useEffect(() => {
    if (!currentStatus) {
      return;
    }
    setIsDisabled(inputDisable(currentStatus));
  }, [currentStatus]);

  // click esc
  const handleKeyUpEscape = event => {
    if (event.key === "Escape") {
      handleCloseDialogCreate();
    }
  };
  const steps = dialogConfig
    ? dialogConfig.children?.map((item, index: number) => {
        return item?.title ? item?.title : "";
      })
    : [];

  const totalSteps = () => {
    return dialogConfig ? dialogConfig.children?.length : 0;
  };

  const completedSteps = () => {
    return Object.keys(tabCompleted).length;
  };

  const isLastStep = () => {
    return activeTab === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNextStep = () => {
    handleSaveLocalForm();
    if (isLastStep()) {
      handleResetStepTab();
      handleCloseDialogCreate();
      return;
    }
    // const newActiveStep = !allStepsCompleted()
    //   ? steps.findIndex((step, i) => !(i in tabCompleted))
    //   : activeTab + 1;
    const newActiveStep = activeTab + 1;
    setActiveTab(newActiveStep);
  };

  const handleBackStep = () => {
    setActiveTab(prevActiveStep => prevActiveStep - 1);
  };

  const handleComplete = () => {
    const newCompleted = tabCompleted;
    newCompleted[activeTab] = true;
    setTabCompleted(newCompleted);
    handleNextStep();
  };

  const handleChangeStepTab = async (newValue: number) => {
    handleSaveLocalForm();
    setActiveTab(newValue);
  };

  const handleSaveLocalForm = async () => {
    try {
      const dialogType = dialogConfig?.children[activeTab].children[0].type;
      if (dialogConfig?.submitType === ITypeSubmit.ALL) {
        switch (dialogType) {
          case ITypeComponent.BUILD: {
            break;
          }
          case ITypeComponent.TABLE: {
            const payload = await handleSubmitForm?.current?.saveLocalForm();
            if (payload) {
              if (payload && Array.isArray(payload)) {
                const titleSave = dialogConfig?.children[activeTab]?.fieldName;
                if (titleSave && typeof titleSave === "string") {
                  setCurrentRecord(prev => {
                    return {
                      ...prev,
                      [titleSave]: payload,
                    };
                  });
                }
              }
              return;
            }
            break;
          }
          case ITypeComponent.DYNAMIC: {
            if (currentStatus === "create") {
              return;
            }
            const payload = await handleSubmitForm?.current?.onSaveValueRef();
            if (payload) {
              if (
                typeof payload === "object" &&
                Object.keys(payload).length > 0
              ) {
                setSubmitData(prev => {
                  return {
                    ...prev,
                    ...payload,
                  };
                });
                setCurrentRecord(prev => {
                  return {
                    ...prev,
                    ...payload,
                  };
                });
              }
              return;
            }
            break;
          }
          default:
            break;
        }
      } else if (dialogConfig?.submitType === ITypeSubmit.SINGLE) {
        switch (dialogType) {
          case ITypeComponent.BUILD: {
            break;
          }
          case ITypeComponent.TABLE: {
            const payload = await handleSubmitForm?.current?.saveLocalForm();
            break;
          }
          case ITypeComponent.DYNAMIC: {
            if (currentStatus === "create") {
              return;
            }
            const payload = await handleSubmitForm?.current?.saveLocalForm();
            if (payload) {
              if (
                typeof payload === "object" &&
                Object.keys(payload).length > 0
              ) {
                setCurrentRecord(prev => {
                  return {
                    ...prev,
                    ...payload,
                  };
                });
              }
              return;
            }
            break;
          }
          default:
            break;
        }
      }
    } catch (err) {
      console.log("handleSaveLocalForm => fail");
    }
  };

  const handleResetStepTab = () => {
    setActiveTab(0);
    setTabCompleted({});
  };

  const onCloseConfirmModal = () => {
    setOpenDialogCancel(false);
  };

  const onCloseDialogFormRef = () => {
    try {
      onCloseDialogForm();
      setSubmitData({});
      setCurrentRecord({});
      handleSubmitForm?.current?.handleUnFocus();
      handleRefresh();
    } catch (err) {}
  };

  const handleCloseDialogCreate = () => {
    if (currentStatus === "update" || currentStatus === "create") {
      setOpenDialogCancel(true);
    } else {
      onCloseDialogFormRef();
      handleResetStepTab();
    }
  };

  const onCloseAllDialog = () => {
    handleResetStepTab();
    setCurrentRecord({});
    onCloseDialogFormRef();
    setOpenDialogCancel(false);
    handleResetRecordValues();
    dispatch(clearDetailContract());
  };

  const renderHeaderTabStep = () => {
    if (
      (currentStatus === "create" && !dialogConfig?.customTabHeader) ||
      (dialogConfig?.customTabHeader &&
        dialogConfig?.customTabHeader === ICustomTypeTabHeader.onlyStep)
    ) {
      return (
        <Fragment>
          <Stepper
            activeStep={activeTab}
            connector={
              <StepConnector className={classes.stepConnectorStyles} />
            }
            sx={{ pt: 3, pb: 1 }}
          >
            {steps.map((label, index) => (
              <Step key={label} completed={tabCompleted[index]}>
                <StepButton
                  color="inherit"
                  onClick={() => handleChangeStepTab(index)}
                >
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Fragment>
      );
    } else if (
      (currentStatus !== "create" && !dialogConfig?.customTabHeader) ||
      (dialogConfig?.customTabHeader &&
        dialogConfig?.customTabHeader === ICustomTypeTabHeader.onlyTab)
    ) {
      return (
        <Fragment>
          <Tabs
            value={activeTab}
            onChange={(_event, newValue) => handleChangeStepTab(newValue)}
            textColor="inherit"
            sx={{
              textTransform: "none",
            }}
          >
            {steps?.map((formName: string, formIndex: number) => (
              <Tab label={formName} {...tabApplyProps(formIndex)} />
            ))}
          </Tabs>
        </Fragment>
      );
    } else {
      return <></>;
    }
  };

  const renderBottomButton = () => {
    if (
      dialogConfig?.customBottomButton &&
      dialogConfig?.customBottomButton ===
        ICustomTypeBottomButton.submitSingleThenTurnOff
    ) {
      return (
        <BaseSubmitButton
          className={classes.common_button}
          type="submit"
          onClick={async () => {
            await handleLoading(() => handleFinishOnPress());
          }}
          sx={{ ml: 1 }}
          ref={buttonSubmitRef}
        >
          Xong
        </BaseSubmitButton>
      );
    }
    return (
      <Fragment>
        {isLastStep() ? (
          <BaseSubmitButton
            className={classes.common_button}
            type="submit"
            onClick={async () => {
              await handleLoading(() => handleFinishOnPress());
            }}
            sx={{ ml: 1 }}
            ref={buttonSubmitRef}
          >
            Xong
          </BaseSubmitButton>
        ) : (
          <BaseSubmitButton
            className={classes.common_button}
            onClick={async () => {
              await handleLoading(() => handleContinueOnPress());
            }}
            ref={buttonSubmitRef}
            sx={{ ml: 1 }}
          >
            {currentStatus !== "update" ? "Tiếp tục" : "Xong"}
          </BaseSubmitButton>
        )}
      </Fragment>
    );
  };

  const handleSubmitForm = useRef() as any;

  const buttonSubmitRef = useRef() as any;

  const handleContinueOnPress = async () => {
    const dialogType = dialogConfig?.children[activeTab].children[0].type;
    if (dialogConfig?.submitType === ITypeSubmit.SINGLE) {
      switch (dialogType) {
        case ITypeComponent.BUILD: {
          const payload = await handleSubmitForm?.current?.onSubmitRef();
          if (payload) {
            handleComplete();
          }
          break;
        }
        case ITypeComponent.TABLE: {
          handleComplete();
          break;
        }
        case ITypeComponent.DYNAMIC: {
          const currentFormValues =
            await handleSubmitForm?.current?.saveLocalForm();
          if (
            !dialogConfig?.children[activeTab].apiSubmit.url ||
            (compareObjectsNotNull(currentFormValues, currentRecord) &&
              Object.keys(currentRecord).length > 0)
          ) {
            handleComplete();
            return false;
          }
          const payload = await handleSubmitForm?.current?.onSubmitRef();
          if (payload) {
            setSubmitData(payload);
            if (
              currentStatus === "create"
              // &&
              // !Object.values(parentRecordId)[0]
            ) {
              setParentRecordId({ ...payload });
              const newRecordId =
                payload && Object.keys(payload).length > 0
                  ? payload[Object.keys(payload)[0]] ?? null
                  : null;
              if (newRecordId) {
                setCurrentRecord(prev => {
                  return {
                    ...prev,
                    ...currentFormValues,
                    ...{ id: newRecordId },
                  };
                });
              }
            }
            handleComplete();
            return false;
          }
          break;
        }
        default:
          break;
      }
    } else if (dialogConfig?.submitType === ITypeSubmit.ALL) {
      switch (dialogType) {
        case ITypeComponent.BUILD: {
          break;
        }
        case ITypeComponent.TABLE: {
          const payload = await handleSubmitForm?.current?.onSaveValueRef();
          if (payload) {
            setSubmitData(payload);
            handleComplete();
            if (
              typeof payload === "object" &&
              Object.keys(payload).length > 0
            ) {
              setCurrentRecord(prev => {
                return {
                  ...prev,
                  ...payload,
                };
              });
            }
          }
          break;
        }
        case ITypeComponent.DYNAMIC: {
          const payload = await handleSubmitForm?.current?.onSaveValueRef();
          if (payload) {
            setSubmitData(payload);
            handleComplete();
            if (
              typeof payload === "object" &&
              Object.keys(payload).length > 0
            ) {
              setCurrentRecord(prev => {
                return {
                  ...prev,
                  ...payload,
                };
              });
            }
            return false;
          }
          break;
        }
        default:
          break;
      }
    }
    return false;
  };

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

  const handleFinishOnPress = async () => {
    const dialogType = dialogConfig?.children[activeTab].children[0].type;
    if (dialogConfig?.submitType === ITypeSubmit.ALL) {
      if (dialogConfig.children.length > 1) {
        const payload = await handleSubmitForm?.current?.onSubmitFinishRef(
          submitData,
        );
        if (payload) {
          const response = await dispatch(
            insertOrUpdateRecord({
              url: dialogConfig?.apiSubmit?.url,
              params: { ...payload },
            }),
          );
          if (response) {
            onCloseDialogFormRef();
            handleResetStepTab();
          }
        }
        return false;
      }

      const payload = await handleSubmitForm?.current?.onSaveValueRef(
        submitData,
      );

      if (payload === CLOSE_DIALOG_ACTION_TYPE.ONLY_CLOSE) {
        onCloseDialogFormRef();
        handleResetStepTab();
        return false;
      }
      if (!payload) {
        return false;
      }
      if (dialogConfig?.apiSubmit?.overriding) {
        const response = await dispatch(
          insertOrUpdateRecordFormData({
            url: dialogConfig?.apiSubmit?.url,
            params: {
              ...payload,
              ...parentRecordId,
              ...submitParentData,
              ...submitData,
            },
          }),
        );
        if (response) {
          onCloseDialogFormRef();
          handleResetStepTab();
        }
        return false;
      }

      const params =
        dialogConfig?.children[activeTab].children[0].type ===
        ITypeComponent.BUILD
          ? {
              ...payload,
            }
          : {
              ...payload,
              ...submitParentData,
              ...submitData,
              ...parentRecordId,
            };
      const response = await dispatch(
        insertOrUpdateRecord({
          url: dialogConfig?.apiSubmit?.url,
          params: params,
        }),
      );
      if (response) {
        onCloseDialogFormRef();
        handleResetStepTab();
      }
      return false;
    } else if (dialogConfig?.submitType === ITypeSubmit.SINGLE) {
      switch (dialogType) {
        case ITypeComponent.BUILD: {
          onCloseDialogFormRef();
          handleResetStepTab();
          handleResetRecordValues();
          return false;
        }
        case ITypeComponent.TABLE: {
          if (dialogConfig?.children[activeTab].apiSubmit.url) {
            const response = await handleSubmitForm?.current?.onSubmitTableRef(
              submitData,
            );
            if (response) {
              onCloseDialogFormRef();
              handleResetStepTab();
              handleResetRecordValues();
            }
            return false;
          }
          onCloseDialogFormRef();
          handleResetStepTab();
          handleResetRecordValues();
          return false;
        }
        case ITypeComponent.DYNAMIC: {
          if (dialogConfig?.customBottomButton) {
            switch (dialogConfig?.customBottomButton) {
              case ICustomTypeBottomButton.submitSingleThenTurnOff: {
                const response =
                  await handleSubmitForm?.current?.onSubmitCustomRef(
                    submitData,
                  );
                if (response) {
                  onCloseDialogFormRef();
                  handleResetStepTab();
                  handleResetRecordValues();
                  return false;
                }
                break;
              }
              case ICustomTypeBottomButton.lockNav: {
                const response =
                  await handleSubmitForm?.current?.onSubmitLockNavRef(
                    submitData,
                  );
                if (response) {
                  onCloseDialogFormRef();
                  handleResetStepTab();
                  handleResetRecordValues();
                  return false;
                }
                break;
              }
              default: {
                break;
              }
            }

            return false;
          }
          onCloseDialogFormRef();
          handleResetStepTab();
          handleResetRecordValues();
          return false;
        }
        default:
          return false;
      }
    }
    return false;
  };

  const handleLoading = async (func: () => Promise<boolean>) => {
    buttonSubmitRef?.current?.setButtonLoading(true);
    const result = await func();
    buttonSubmitRef?.current?.setButtonLoading(false);
    return result;
  };

  const getCustomId = () => {
    try {
      const idName =
        dialogConfig?.children[activeTab].children[0]?.customViewFetchId;
      if (
        dialogConfig?.children[activeTab].children[0]?.customView ===
        CustomView.viewContractDetail
      ) {
        if (idName && currentRecord && typeof currentRecord === "object") {
          return currentRecord[idName].toString();
        }
      }
      return "";
    } catch (err) {
      return "";
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
            {renderTitleDialog(currentStatus, dialogConfig)}
          </label>
          <IconButton
            onClick={handleCloseDialogCreate}
            className={classes.closeBtn}
            onKeyUp={handleKeyUpEscape}
            tabIndex={0}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {dialogConfig?.type === DIALOG_TYPE.FULL_SCREEN ? (
          <Box
            sx={{
              height: "calc(100vh - 80px)",
            }}
          >
            {dialogConfig.children[activeTab].children.map((item, index) => {
              switch (item.type) {
                case ITypeComponent.BUILD: {
                  switch (item.code) {
                    // HĐĐT - TD - Đặt tiền gửi
                    case "TimeDepositSetDepositForm": {
                      const TimeDepositSetDepositForm = dynamic<any>(
                        () =>
                          import(
                            "../BuiltFormComponent/investment/time-deposit/TimeDepositSetDepositForm"
                          ).then(mod => mod.TimeDepositSetDepositForm),
                        { ssr: false },
                      );
                      return (
                        <TimeDepositSetDepositForm
                          currentId={currentId}
                          parentId={parentRecordId?.[parentIdName]}
                          onlyShow={isDisabled}
                          onCloseDialog={onCloseAllDialog}
                          ref={handleSubmitForm}
                          workFollowStatus={workFollowStatus}
                          checkerAPI={checkerAPI}
                          checkerApprove={checkerApprove}
                        />
                      );
                    }
                    // HĐĐT - TD - Dự thu tiền gửi tự động
                    case "TDAutomaticDepositCollectionForm": {
                      const TDAutomaticDepositCollectionForm = dynamic<any>(
                        () =>
                          import(
                            "../BuiltFormComponent/investment/time-deposit/TDAutomaticDepositCollectionForm"
                          ).then(mod => mod.TDAutomaticDepositCollectionForm),
                        { ssr: false },
                      );
                      return (
                        <TDAutomaticDepositCollectionForm
                          currentId={currentId}
                          parentId={parentRecordId?.[parentIdName]}
                          onlyShow={isDisabled}
                          onCloseDialog={onCloseAllDialog}
                          ref={handleSubmitForm}
                          workFollowStatus={workFollowStatus}
                          checkerAPI={checkerAPI}
                          checkerApprove={checkerApprove}
                        />
                      );
                    }
                    // HĐĐT - TD - Dự thu tiền gửi thủ công
                    case "TDManualDepositCollectionForm": {
                      const TDManualDepositCollectionForm = dynamic<any>(
                        () =>
                          import(
                            "../BuiltFormComponent/investment/time-deposit/TDManualDepositCollectionForm"
                          ).then(mod => mod.TDManualDepositCollectionForm),
                        { ssr: false },
                      );
                      return (
                        <TDManualDepositCollectionForm
                          currentId={currentId}
                          parentId={parentRecordId?.[parentIdName]}
                          onlyShow={isDisabled}
                          onCloseDialog={onCloseAllDialog}
                          ref={handleSubmitForm}
                          workFollowStatus={workFollowStatus}
                          checkerAPI={checkerAPI}
                          checkerApprove={checkerApprove}
                        />
                      );
                    }
                    case "TDExpriredForm": {
                      // HĐĐT - TD - Đáo hạn
                      const TDExpriredForm = dynamic<any>(
                        () =>
                          import(
                            "../BuiltFormComponent/investment/time-deposit/TDExpriredForm"
                          ).then(mod => mod.TDExpriredForm),
                        { ssr: false },
                      );
                      return (
                        <TDExpriredForm
                          currentId={currentId}
                          parentId={parentRecordId?.[parentIdName]}
                          onlyShow={isDisabled}
                          onCloseDialog={onCloseAllDialog}
                          ref={handleSubmitForm}
                          workFollowStatus={workFollowStatus}
                          checkerAPI={checkerAPI}
                          checkerApprove={checkerApprove}
                        />
                      );
                    }
                    case "TDContractSettlementPrematureForm": {
                      // HĐĐT - TD - Tất toán HD - Tất toán trước hạn
                      const TDContractSettlementPrematureForm = dynamic<any>(
                        () =>
                          import(
                            "../BuiltFormComponent/investment/time-deposit/TDContractSettlementPrematureForm"
                          ).then(mod => mod.TDContractSettlementPrematureForm),
                        { ssr: false },
                      );

                      return (
                        <TDContractSettlementPrematureForm
                          currentId={currentId}
                          parentId={parentRecordId?.[parentIdName]}
                          onlyShow={isDisabled}
                          onCloseDialog={onCloseAllDialog}
                          ref={handleSubmitForm}
                          workFollowStatus={workFollowStatus}
                          checkerAPI={checkerAPI}
                          checkerApprove={checkerApprove}
                        />
                      );
                    }
                    case "TDContractSettlementForm": {
                      // HĐĐT - TD - Tất toán HD - Tất toán đúng hạn
                      const TDContractSettlementForm = dynamic<any>(
                        () =>
                          import(
                            "../BuiltFormComponent/investment/time-deposit/TDContractSettlementForm"
                          ).then(mod => mod.TDContractSettlementForm),
                        { ssr: false },
                      );

                      return (
                        <TDContractSettlementForm
                          currentId={currentId}
                          parentId={parentRecordId?.[parentIdName]}
                          onlyShow={isDisabled}
                          onCloseDialog={onCloseAllDialog}
                          ref={handleSubmitForm}
                          workFollowStatus={workFollowStatus}
                          checkerAPI={checkerAPI}
                          checkerApprove={checkerApprove}
                        />
                      );
                    }
                    default: {
                      return <></>;
                    }
                  }
                }
              }
            })}
          </Box>
        ) : (
          <DialogContent className={classes.dialogContent}>
            {steps?.length > 1 && renderHeaderTabStep()}
            {dialogConfig?.type === DIALOG_TYPE.IMPORT_EXCEL ? (
              <>
                {!!dialogConfig?.importExcelConfig ? (
                  <BaseImportDataFromExcelForm
                    onCloseDialog={onCloseAllDialog}
                    parentId={parentRecordId?.[parentIdName]}
                    importExcelConfig={dialogConfig?.importExcelConfig}
                  />
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                {steps?.map((formName: string, formIndex: number) => (
                  <TabPanel value={activeTab} key={formIndex} index={formIndex}>
                    {dialogConfig &&
                      dialogConfig?.children[activeTab].children.length > 0 &&
                      dialogConfig?.children[activeTab].children.map(
                        (item, index) => {
                          switch (item.type) {
                            case ITypeComponent.DYNAMIC: {
                              return (
                                <Box>
                                  <BaseFormDynamicSteps
                                    currentRecord={
                                      currentRecord &&
                                      typeof currentRecord === "object"
                                        ? currentRecord
                                        : {}
                                    }
                                    currentId={currentId}
                                    isDisableField={isDisabled}
                                    formType={currentStatus}
                                    key={formIndex}
                                    ref={handleSubmitForm}
                                    formSettingSubmitStep={
                                      dialogConfig?.children[activeTab]
                                    }
                                    formCode={item?.code}
                                    parentId={parentRecordId}
                                    isRefresh={isRefreshForm}
                                  />

                                  <ContractInformationWrapper
                                    currentId={
                                      getCustomId() ? getCustomId() : currentId
                                    }
                                    customView={item?.customView}
                                  />
                                </Box>
                              );
                            }

                            case ITypeComponent.TABLE:
                              return (
                                <BaseTableFormDynamicSteps
                                  onlyShow={isDisabled}
                                  ref={handleSubmitForm}
                                  formSettingSubmitStep={
                                    dialogConfig?.children[activeTab]
                                  }
                                  parentId={
                                    useCurrentRecordId
                                      ? currentId
                                      : parentRecordId
                                      ? Object.values(parentRecordId)[0]
                                      : ""
                                  }
                                  tableCode={item?.code}
                                  submitParentData={submitData}
                                  entryProp={{
                                    fundId: globalFundId,
                                  }}
                                />
                              );
                            case ITypeComponent.BUILD:
                              switch (item.code) {
                                // NAV - Quỹ
                                case "NAVCycle": {
                                  return (
                                    <NAVCycle
                                      onlyShow={isDisabled}
                                      ref={handleSubmitForm}
                                      parentId={parentRecordId?.[parentIdName]}
                                    />
                                  );
                                }
                                // Kế toán đồ - Quỹ
                                case "FundAccountSystemAddNewForm": {
                                  return (
                                    <FundAccountSystemAddNewForm
                                      currentId={currentId}
                                      parentId={parentRecordId?.[parentIdName]}
                                      parentIdName={parentIdName}
                                      onlyShow={isDisabled}
                                      ref={handleSubmitForm}
                                    />
                                  );
                                }
                                // Table Builder
                                case "TableBuilderForm": {
                                  const TableBuilderForm = dynamic<any>(
                                    () =>
                                      import("../TableBuilderForm").then(
                                        mod => mod.TableBuilderForm,
                                      ),
                                    { ssr: false },
                                  );
                                  return (
                                    <TableBuilderForm id={currentId || ""} />
                                  );
                                }
                                // Nhập Số Dư Ban Đầu - SDBD
                                case "AddBalance": {
                                  return (
                                    <AddBalance
                                      currentId={currentId}
                                      parentId={parentRecordId?.[parentIdName]}
                                      onlyShow={isDisabled}
                                      formType={currentStatus || "create"}
                                      ref={handleSubmitForm}
                                      onCloseDialog={onCloseAllDialog}
                                      workFollowStatus={workFollowStatus}
                                      checkerAPI={checkerAPI}
                                      checkerApprove={checkerApprove}
                                    />
                                  );
                                }
                                // Nhập số dư Tài khoản ngân hàng - SDBD
                                case "AddBankAccountBalance": {
                                  return (
                                    <AddBankAccountBalance
                                      currentId={currentId}
                                      parentId={parentRecordId?.[parentIdName]}
                                      onlyShow={isDisabled}
                                      formType={currentStatus || "create"}
                                      ref={handleSubmitForm}
                                      onCloseDialog={onCloseAllDialog}
                                      workFollowStatus={workFollowStatus}
                                      checkerAPI={checkerAPI}
                                      checkerApprove={checkerApprove}
                                    />
                                  );
                                }
                                // Nhập Chi tiết Số dư tài khoản ngân hàng - SDBD
                                case "AddBankAccountBalanceTrans": {
                                  return (
                                    <AddBankAccountBalanceTrans
                                      currentId={currentId}
                                      parentId={parentRecordId?.[parentIdName]}
                                      onlyShow={isDisabled}
                                      ref={handleSubmitForm}
                                      onCloseDialog={onCloseAllDialog}
                                      workFollowStatus={workFollowStatus}
                                      checkerAPI={checkerAPI}
                                      checkerApprove={checkerApprove}
                                    />
                                  );
                                }
                                // Nhập số dư Công nợ Tổ chức cung cấp dịch vụ - SDBD
                                case "AddOrganizeBalance": {
                                  return (
                                    <AddOrganizeBalance
                                      currentId={currentId}
                                      parentId={parentRecordId?.[parentIdName]}
                                      onlyShow={isDisabled}
                                      formType={currentStatus || "create"}
                                      ref={handleSubmitForm}
                                      onCloseDialog={onCloseAllDialog}
                                      workFollowStatus={workFollowStatus}
                                      checkerAPI={checkerAPI}
                                      checkerApprove={checkerApprove}
                                    />
                                  );
                                }
                                // Nhập Chi tiết Số dư công nợ tổ chức cung cấp dịch vụ - SDBD
                                case "AddOrganizeBalanceTrans": {
                                  return (
                                    <AddOrganizeBalanceTrans
                                      currentId={currentId}
                                      parentId={parentRecordId?.[parentIdName]}
                                      onlyShow={isDisabled}
                                      ref={handleSubmitForm}
                                      onCloseDialog={onCloseAllDialog}
                                      workFollowStatus={workFollowStatus}
                                      checkerAPI={checkerAPI}
                                      checkerApprove={checkerApprove}
                                    />
                                  );
                                }
                                // Nhập số dư Công nợ Nhà Đầu tư - SDBD
                                case "AddInvestorBalance": {
                                  return (
                                    <AddInvestorBalance
                                      currentId={currentId}
                                      parentId={parentRecordId?.[parentIdName]}
                                      onlyShow={isDisabled}
                                      formType={currentStatus || "create"}
                                      ref={handleSubmitForm}
                                    />
                                  );
                                }
                                // Huy Động vốn - Import Excel kết quả giao dịch CCQ
                                case "BaseImportDataFromExcelForm": {
                                  return <></>;
                                }
                                // Huy Động vốn - Chi tiết Kết quả giao dịch CCQ
                                case "FundRaisingTransResultForm": {
                                  const FundRaisingTransResultForm =
                                    dynamic<any>(
                                      () =>
                                        import(
                                          "../BuiltFormComponent/fund-raising/trans-result/FundRaisingTransResultForm"
                                        ).then(
                                          mod => mod.FundRaisingTransResultForm,
                                        ),
                                      { ssr: false },
                                    );
                                  return (
                                    <FundRaisingTransResultForm
                                      currentId={currentId}
                                      parentId={parentRecordId?.[parentIdName]}
                                    />
                                  );
                                }
                                // Huy Động vốn - Chi tiết Kết quả giao dịch CCQ
                                case "AccountingDistributionDetail": {
                                  const AccountingDistributionDetail =
                                    dynamic<any>(
                                      () =>
                                        import(
                                          "../BuiltFormComponent/fund-raising/accounting-distribution/AccountingDistributionDetail"
                                        ).then(
                                          mod =>
                                            mod.AccountingDistributionDetail,
                                        ),
                                      { ssr: false },
                                    );
                                  return (
                                    <AccountingDistributionDetail
                                      currentId={currentId}
                                    />
                                  );
                                }
                                // Huy Động vốn - Hạch toán giao dịch tiền - Form Thêm mới, Chi tiết
                                case "AccountingMoneyTransDetail": {
                                  return (
                                    <AccountingMoneyTransDetail
                                      currentId={currentId}
                                      parentId={parentRecordId?.[parentIdName]}
                                      onlyShow={isDisabled}
                                      formType={currentStatus || "create"}
                                      ref={handleSubmitForm}
                                    />
                                  );
                                }
                                // Hoạt động đầu tư - ĐT Tiền gửi TD
                                case "TimeDepositContractForm": {
                                  return (
                                    <TimeDepositContractForm
                                      currentId={currentId}
                                      parentId={parentRecordId?.[parentIdName]}
                                      onlyShow={isDisabled}
                                      ref={handleSubmitForm}
                                    />
                                  );
                                }
                                // Hoạt động đầu tư - Chứng khoán niêm yết - Chi tiết kết quả giao dịch
                                case "LSTransResultForm": {
                                  const LSTransResultForm = dynamic<any>(
                                    () =>
                                      import(
                                        "../BuiltFormComponent/investment/listed-securities/LSTransResultForm"
                                      ).then(mod => mod.LSTransResultForm),
                                    { ssr: false },
                                  );
                                  return (
                                    <LSTransResultForm
                                      currentId={currentId}
                                      parentId={parentRecordId?.[parentIdName]}
                                    />
                                  );
                                }
                                // Hoạt động đầu tư - Chứng khoán niêm yết - Hạch toán kết quả
                                case "LSAccountingDistribution": {
                                  const LSAccountingDistribution = dynamic<any>(
                                    () =>
                                      import(
                                        "../BuiltFormComponent/investment/listed-securities/LSAccountingDistribution"
                                      ).then(
                                        mod => mod.LSAccountingDistribution,
                                      ),
                                    { ssr: false },
                                  );
                                  return (
                                    <LSAccountingDistribution
                                      currentId={currentId}
                                      parentId={parentRecordId?.[parentIdName]}
                                    />
                                  );
                                }
                                // Giao dịch nội bộ - Bút toán thủ công -  Form thêm mới
                                case "SetManualAccountingFormImport": {
                                  return (
                                    <SetManualAccountingFormImport
                                      currentId={currentId}
                                      parentId={parentRecordId?.[parentIdName]}
                                      onlyShow={isDisabled}
                                      formType={currentStatus || "create"}
                                      ref={handleSubmitForm}
                                    />
                                  );
                                }
                                // Giao dịch nội bộ - Bút toán thủ công -  Form Chi tiết
                                case "SetManualAccountingFormDetail": {
                                  return (
                                    <SetManualAccountingFormDetail
                                      currentId={currentId}
                                      parentId={parentRecordId?.[parentIdName]}
                                      onlyShow={isDisabled}
                                      formType={currentStatus || "create"}
                                      ref={handleSubmitForm}
                                      onCloseDialog={onCloseAllDialog}
                                    />
                                  );
                                }
                                // Giao dịch nội bộ - Bút toán thủ công -  Form Thêm mới, Chi tiết
                                case "ManualAccountingForm": {
                                  const ManualAccountingForm = dynamic<any>(
                                    () =>
                                      import(
                                        "../BuiltFormComponent/investment/manual-accounting-form/ManualAccountingForm"
                                      ).then(mod => mod.ManualAccountingForm),
                                    { ssr: false },
                                  );
                                  return (
                                    <ManualAccountingForm
                                      currentId={currentId}
                                      parentId={parentRecordId?.[parentIdName]}
                                      entryProp={{
                                        fundId: globalFundId,
                                      }}
                                    />
                                  );
                                }
                                // Quy trình tính NAV - Đối chiếu số dư
                                case "BalanceReconciliationForm": {
                                  const BalanceReconciliationForm =
                                    dynamic<any>(
                                      () =>
                                        import(
                                          "../BuiltFormComponent/nav-calculation-process/balance-reconciliation/BalanceReconciliationForm"
                                        ).then(
                                          mod => mod.BalanceReconciliationForm,
                                        ),
                                      { ssr: false },
                                    );
                                  return (
                                    <BalanceReconciliationForm
                                    // currentId={currentId}
                                    // parentId={parentRecordId?.[parentIdName]}
                                    />
                                  );
                                }
                                // Quy trình tính NAV - Đối chiếu số dư - Chi tiết
                                case "BalanceCompareDetailForm": {
                                  const BalanceCompareDetailForm = dynamic<any>(
                                    () =>
                                      import(
                                        "../BuiltFormComponent/nav-balance-compare/balance-compare-detail"
                                      ).then(
                                        mod => mod.BalanceCompareDetailForm,
                                      ),
                                    { ssr: false },
                                  );
                                  return (
                                    <BalanceCompareDetailForm
                                      currentId={currentId}
                                      parentId={parentRecordId?.[parentIdName]}
                                    />
                                  );
                                }
                                // Quy trình tính NAV - Đối chiếu
                                case "BalanceCompareForm": {
                                  return (
                                    <BalanceCompareForm
                                      currentId={currentId}
                                      ref={handleSubmitForm}
                                      onlyShow={isDisabled}
                                    />
                                  );
                                }
                                case "ReportStaticNavScreen": {
                                  return (
                                    <ReportStaticNavScreen
                                      currentId={currentId}
                                      isDisableField={isDisabled}
                                      formType={currentStatus}
                                      ref={handleSubmitForm}
                                      formSettingSubmitStep={
                                        dialogConfig?.children[activeTab]
                                      }
                                      formCode={
                                        "REPORT_NAV/STATISTICAL/NAV_HISTORY"
                                      }
                                      parentId={parentRecordId}
                                      isRefresh={isRefreshForm}
                                    />
                                  );
                                }
                                case "ReportStaticInvestmentScreen": {
                                  return (
                                    <ReportStaticInvestmentScreen
                                      currentId={currentId}
                                      isDisableField={isDisabled}
                                      formType={currentStatus}
                                      ref={handleSubmitForm}
                                      formSettingSubmitStep={
                                        dialogConfig?.children[activeTab]
                                      }
                                      formCode={
                                        "REPORT_NAV/STATISTICAL/INVESTMENT_PORTFOLIO"
                                      }
                                      parentId={parentRecordId}
                                      isRefresh={isRefreshForm}
                                    />
                                  );
                                }
                                case "AccountAdd": {
                                  return (
                                    <AccountAdd
                                      currentId={currentId}
                                      parentId={parentRecordId?.[parentIdName]}
                                      parentIdName={parentIdName}
                                      onlyShow={isDisabled}
                                      ref={handleSubmitForm}
                                    />
                                  );
                                }

                                // Tài khoản và nhóm quyền - Nhóm quyền -  Thêm và sửa
                                case "DecentralizationFormImport": {
                                  return (
                                    <DecentralizationFormImport
                                      currentId={currentId}
                                      parentId={parentRecordId?.[parentIdName]}
                                      onlyShow={isDisabled}
                                      formType={currentStatus || "create"}
                                      ref={handleSubmitForm}
                                      isDisableField={false}
                                    />
                                  );
                                }
                                // Tài khoản và nhóm quyền - Nhóm quyền -  Xem chi tiết
                                case "DecentralizationFormDetail": {
                                  return (
                                    <DecentralizationFormDetail
                                      currentId={currentId}
                                      parentId={parentRecordId?.[parentIdName]}
                                      onlyShow={isDisabled}
                                      formType={currentStatus || "create"}
                                      ref={handleSubmitForm}
                                      isDisableField={false}
                                    />
                                  );
                                }
                                default:
                                  return <></>;
                              }
                            default:
                              return <></>;
                          }
                        },
                      )}
                  </TabPanel>
                ))}
              </>
            )}
            {(checkerApprove || checkerCancelAccountingEntry) &&
            currentStatus == "show" &&
            ((typeof dialogConfig?.customBottomButton === "undefined" &&
              dialogConfig?.customBottomButton !==
                ICustomTypeBottomButton.none) ||
              (typeof dialogConfig?.customBottomButton !== "undefined" &&
                dialogConfig?.customBottomButton !==
                  ICustomTypeBottomButton.none)) &&
            userRole == 1 ? (
              <Box
                className={classes.baseGroupBtn}
                sx={{
                  marginRight:
                    dialogConfig?.children[activeTab].children[0]
                      ?.customView === CustomView.viewContractDetail
                      ? window.innerWidth * 0.0202
                      : 0,
                }}
              >
                <GroupApprovedButtons
                  currentId={currentId}
                  workFollowStatus={workFollowStatus}
                  checkerAPI={checkerAPI}
                  onCloseDialog={onCloseAllDialog}
                />
              </Box>
            ) : (
              <></>
            )}
            {currentStatus != "show" &&
            ((typeof dialogConfig?.customBottomButton === "undefined" &&
              dialogConfig?.customBottomButton !==
                ICustomTypeBottomButton.none) ||
              (typeof dialogConfig?.customBottomButton !== "undefined" &&
                dialogConfig?.customBottomButton !==
                  ICustomTypeBottomButton.none)) ? (
              <Box
                className={classes.baseBackBtn}
                sx={{
                  marginRight:
                    dialogConfig?.children[activeTab].children[0]
                      ?.customView === CustomView.viewContractDetail
                      ? window.innerWidth * 0.0202
                      : 0,
                }}
              >
                {activeTab !== 0 ? (
                  <ButtonBase
                    className={classes.commonButtonBack}
                    onClick={handleBackStep}
                    ref={buttonSubmitRef}
                  >
                    Quay lại
                  </ButtonBase>
                ) : (
                  <></>
                )}

                <Box className={classes.baseSubmitBtn} />
                {renderBottomButton()}
              </Box>
            ) : (
              <></>
            )}
          </DialogContent>
        )}
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
        // ${dialogConfig?.title}`}
      />
    </Fragment>
  );
};
const BaseDialogCreate = React.memo(BaseDialog);
export { BaseDialogCreate };
