import React, { useState, useEffect, Children } from "react";
import { useStyles } from "./FieldSettingModal.styles";
import useTranslation from "next-translate/useTranslation";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { TransitionProps } from "@mui/material/transitions";
import { Grid, OutlinedInput } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { SwitchButtonIOS } from "@/src/components";
import { ImagesSvg } from "@/src/constants/images";
/// import store
import { useDispatch } from "react-redux";
import { dispatch, useSelector } from "@store/store";
import { RootStateProps } from "@app/types/root";
import { IForm, ISelectOption, IValidate } from "@/src/types/field";
/// end import store
import { getValueWithType } from "@/src/helpers";
interface IonChangeInput {
  event: any;
  fieldName: string;
  fieldIndex?: number;
  fieldValidateName?: string;
}
interface Props {
  visibleDialog: boolean;
  handleClose: any;
  onChangeValue: (value: IonChangeInput) => void;
  formData: IForm;
  addOrUpdateFieldValidate: (
    val: any,
    index: number,
    // option: "validateAttribute" | "selectOption",
  ) => void;
}
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FieldSettingModalComponent = (props: Props): JSX.Element => {
  const classes = useStyles();
  const [fieldValidateData, setFieldValidateData] = useState<IValidate>({
    isRequired: false,
    mask: "",
    isReadOnly: false,
    isDisabled: false,
    minLength: 0,
    maxLength: 255,
    equalTo: "",
    regexPattern: "",
    fileExtensions: [],
    // min: 0,
    // max: 0,
  });
  const [fieldSelectData, setFieldSelectData] = useState<ISelectOption>({
    firstOptionLabel: "",
    allowMultiple: false,
    sourceDataApi: "",
    fieldValue: "",
    fieldLabel: "",
  });
  const {
    visibleDialog,
    handleClose,
    onChangeValue,
    formData,
    addOrUpdateFieldValidate,
  } = props;
  const { currentField, currentFieldIndex, currentFieldType } = useSelector(
    (state: RootStateProps) => state.formBuilder,
  );
  const handleCloseSetting = () => {
    handleClose();
    setFieldSelectData({
      firstOptionLabel: "",
      allowMultiple: false,
      sourceDataApi: "",
      fieldValue: "",
      fieldLabel: "",
    });
    setFieldValidateData({
      isRequired: false,
      mask: "",
      isReadOnly: false,
      isDisabled: false,
      minLength: 0,
      maxLength: 255,
      equalTo: "",
      regexPattern: "",
      fileExtensions: [],
      min: 0,
      max: 0,
    });
  };

  useEffect(() => {
    const getFieldValidateData = () => {
      if (currentFieldType !== "SELECT_OPTION") {
        if (Object.keys(currentField)?.length < 1) {
          setFieldValidateData({
            isRequired: false,
            mask: "",
            isReadOnly: false,
            isDisabled: false,
            minLength: 0,
            maxLength: 255,
            equalTo: "",
            regexPattern: "",
            fileExtensions: [],
            min: 0,
            max: 0,
          });
          return;
        }
        setFieldValidateData({
          ...fieldValidateData,
          ...currentField?.validateAttribute,
        });
        return;
      }
      if (Object.keys(currentField)?.length < 1) {
        setFieldSelectData({
          firstOptionLabel: "",
          allowMultiple: false,
          sourceDataApi: "",
          fieldValue: "",
          fieldLabel: "",
        });
        return;
      }
      if (currentField.selectOption) {
        setFieldSelectData(
          // ...fieldSelectData,
          currentField.selectOption,
        );
      }
    };
    getFieldValidateData();
  }, [currentFieldIndex]);

  const onChangeValidateField = ({
    event,
    fieldName,
    fieldIndex,
    fieldValidateName,
  }: IonChangeInput) => {
    setFieldValidateData({
      ...fieldValidateData,
      [`${fieldValidateName}`]: getValueWithType(
        fieldValidateData?.[`${fieldValidateName}`],
        event.target.type == "text" || event.target.type == "number"
          ? event?.target?.value
          : event?.target?.checked,
      ),
    });
  };
  const onSubmitSetting = async () => {
    const validateSetting = {
      ...fieldValidateData,
      fileExtensions:
        typeof fieldValidateData.fileExtensions === "string" &&
        fieldValidateData.fileExtensions
          ? fieldValidateData.fileExtensions?.split(",")
          : [],
    };
    const selectSetting = fieldSelectData;
    addOrUpdateFieldValidate(
      { selectOption: selectSetting, validateAttribute: validateSetting },
      currentFieldIndex,
    );
    handleClose();
  };
  // const onSubmitValidateField = async () => {
  //   await addOrUpdateFieldValidate(
  //     {
  //       ...fieldValidateData,
  //       fileExtensions:
  //         typeof fieldValidateData.fileExtensions === "string" &&
  //         fieldValidateData.fileExtensions
  //           ? fieldValidateData.fileExtensions?.split(",")
  //           : [],
  //     },
  //     currentFieldIndex,
  //     "validateAttribute",
  //   );
  //   // handleClose();
  // };

  const onChangeSelectField = ({
    event,
    fieldName,
    fieldIndex,
    fieldValidateName,
  }: IonChangeInput) => {
    setFieldSelectData({
      ...fieldSelectData,
      [`${fieldValidateName}`]: getValueWithType(
        fieldValidateData?.[`${fieldValidateName}`],
        event.target.type == "text" || event.target.type == "number"
          ? event?.target?.value
          : event?.target?.checked,
      ),
    });
  };

  // const onSubmitSelectField = async () => {
  //   await addOrUpdateFieldValidate(
  //     {
  //       ...fieldSelectData,
  //     },
  //     currentFieldIndex,
  //     "selectOption",
  //   );
  //   // handleClose();
  // };

  return (
    <Dialog
      open={visibleDialog}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
      id="ValidateFieldModal"
      maxWidth={"lg"}
      fullWidth
    >
      <DialogTitle
        id="ValidateFieldTittleModal"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#272E36",
          padding: "20px",
        }}
      >
        <label style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
          {"Thiết lập trường dữ liệu "} {currentField?.label}
        </label>
        <button
          onClick={() => {
            handleCloseSetting();
          }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <img src={ImagesSvg.closeIcon} />
        </button>
      </DialogTitle>
      <DialogContent style={{ backgroundColor: "#F4F7FA" }}>
        <div style={{ borderRadius: 8 }}>
          <form className="App-header" id={"field-validate"}>
            <div className={classes.formContainer}>
              <Grid container spacing={3}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  className={classes.colFlex}
                  padding={"12px 0 20px 0"}
                >
                  <label className={classes.label}>Validations:</label>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={2} className={classes.colFlex}>
                  <SwitchButtonIOS
                    title={"Required"}
                    checked={
                      typeof fieldValidateData?.isRequired !== undefined
                        ? fieldValidateData?.isRequired ?? false
                        : false
                    }
                    onChange={event => {
                      onChangeValidateField({
                        event: event,
                        fieldName: "validateAttribute",
                        fieldIndex: currentFieldIndex,
                        fieldValidateName: "isRequired",
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2} className={classes.colFlex}>
                  <SwitchButtonIOS
                    title={"isDisable"}
                    checked={
                      typeof fieldValidateData?.isDisabled !== undefined
                        ? fieldValidateData?.isDisabled ?? false
                        : false
                    }
                    onChange={event => {
                      onChangeValidateField({
                        event: event,
                        fieldName: "validateAttribute",
                        fieldIndex: currentFieldIndex,
                        fieldValidateName: "isDisabled",
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2} className={classes.colFlex}>
                  <SwitchButtonIOS
                    title={"isReadOnly"}
                    checked={
                      typeof fieldValidateData?.isDisabled !== undefined
                        ? fieldValidateData?.isReadOnly ?? false
                        : false
                    }
                    onChange={event => {
                      onChangeValidateField({
                        event: event,
                        fieldName: "validateAttribute",
                        fieldIndex: currentFieldIndex,
                        fieldValidateName: "isReadOnly",
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} className={classes.colFlex}>
                  <label className={classes.inputLabel}>{"regexPattern"}</label>
                  <OutlinedInput
                    name={"form-name-input"}
                    className={`${classes.commonInput} ${classes.outlinedInputSx}`}
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                      "aria-label": "weight",
                    }}
                    value={fieldValidateData?.regexPattern}
                    onChange={event => {
                      onChangeValidateField({
                        event: event,
                        fieldName: "validateAttribute",
                        fieldIndex: currentFieldIndex,
                        fieldValidateName: "regexPattern",
                      });
                    }}
                    disabled={
                      currentField?.fieldType === "CHECKBOX" ||
                      currentField?.fieldType === "FILE_UPLOAD" ||
                      currentField?.fieldType === "LABEL"
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4} className={classes.colFlex}>
                  <label className={classes.inputLabel}>{"Equal to"}</label>
                  <OutlinedInput
                    name={"form-name-input"}
                    className={`${classes.commonInput} ${classes.outlinedInputSx}`}
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                      "aria-label": "weight",
                    }}
                    value={fieldValidateData?.equalTo}
                    onChange={event => {
                      onChangeValidateField({
                        event: event,
                        fieldName: "validateAttribute",
                        fieldIndex: currentFieldIndex,
                        fieldValidateName: "equalTo",
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4} className={classes.colFlex}>
                  <label className={classes.inputLabel}>{"Mask"}</label>
                  <OutlinedInput
                    name={"form-name-input"}
                    className={`${classes.commonInput} ${classes.outlinedInputSx}`}
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                      "aria-label": "weight",
                    }}
                    value={fieldValidateData?.mask}
                    onChange={event => {
                      onChangeValidateField({
                        event: event,
                        fieldName: "validateAttribute",
                        fieldIndex: currentFieldIndex,
                        fieldValidateName: "mask",
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4} className={classes.colFlex}>
                  <label className={classes.inputLabel}>
                    {"File extensions"}
                  </label>
                  <OutlinedInput
                    name={"form-name-input"}
                    className={`${classes.commonInput} ${classes.outlinedInputSx}`}
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                      "aria-label": "weight",
                    }}
                    value={fieldValidateData?.fileExtensions?.toString()}
                    onChange={event => {
                      onChangeValidateField({
                        event: event,
                        fieldName: "validateAttribute",
                        fieldIndex: currentFieldIndex,
                        fieldValidateName: "fileExtensions",
                      });
                    }}
                    disabled={currentField?.fieldType !== "FILE_UPLOAD"}
                  />
                </Grid>
                <Grid item xs={12} sm={2} className={classes.colFlex}>
                  <label className={classes.inputLabel}>{"MinLenght"}</label>
                  <div style={{ display: "flex" }}>
                    <OutlinedInput
                      className={`${classes.commonInput} ${classes.outlinedInputSx}`}
                      name={"code-input-MinLenght" ?? ""}
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        "aria-label": "weight",
                      }}
                      value={fieldValidateData?.minLength}
                      onChange={event => {
                        onChangeValidateField({
                          event: event,
                          fieldName: "validateAttribute",
                          fieldIndex: currentFieldIndex,
                          fieldValidateName: "minLength",
                        });
                      }}
                      disabled={
                        currentField?.fieldType === "FLOAT_POINT_NUMBER" ||
                        currentField?.fieldType === "CHECKBOX" ||
                        currentField?.fieldType === "DATE_PICKER" ||
                        currentField?.fieldType === "DATE_RANGE_PICKER" ||
                        currentField?.fieldType === "SELECT_OPTION"
                      }
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={2} className={classes.colFlex}>
                  <label className={classes.inputLabel}>{"MaxLenght"}</label>
                  <div style={{ display: "flex" }}>
                    <OutlinedInput
                      className={`${classes.commonInput} ${classes.outlinedInputSx}`}
                      name={"code-input-MaxLenght" ?? ""}
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        "aria-label": "weight",
                      }}
                      value={fieldValidateData?.maxLength}
                      onChange={event => {
                        onChangeValidateField({
                          event: event,
                          fieldName: "validateAttribute",
                          fieldIndex: currentFieldIndex,
                          fieldValidateName: "maxLength",
                        });
                      }}
                      disabled={
                        currentField?.fieldType === "FLOAT_POINT_NUMBER" ||
                        currentField?.fieldType === "CHECKBOX" ||
                        currentField?.fieldType === "DATE_PICKER" ||
                        currentField?.fieldType === "DATE_RANGE_PICKER" ||
                        currentField?.fieldType === "SELECT_OPTION"
                      }
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={2} className={classes.colFlex}>
                  <label className={classes.inputLabel}>{"Min"}</label>
                  <div style={{ display: "flex" }}>
                    <OutlinedInput
                      className={`${classes.commonInput} ${classes.outlinedInputSx}`}
                      name={"code-input-Min" ?? ""}
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        "aria-label": "weight",
                      }}
                      value={fieldValidateData?.min}
                      onChange={event => {
                        onChangeValidateField({
                          event: event,
                          fieldName: "validateAttribute",
                          fieldIndex: currentFieldIndex,
                          fieldValidateName: "min",
                        });
                      }}
                      disabled={
                        currentField?.fieldType !== "NUMBER_ONLY" &&
                        currentField?.fieldType !== "FLOAT_POINT_NUMBER"
                      }
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={2} className={classes.colFlex}>
                  <label className={classes.inputLabel}>{"Max"}</label>
                  <div style={{ display: "flex" }}>
                    <OutlinedInput
                      className={`${classes.commonInput} ${classes.outlinedInputSx}`}
                      name={"code-input-Max" ?? ""}
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        "aria-label": "weight",
                      }}
                      fullWidth={true}
                      value={fieldValidateData?.max}
                      onChange={event => {
                        onChangeValidateField({
                          event: event,
                          fieldName: "validateAttribute",
                          fieldIndex: currentFieldIndex,
                          fieldValidateName: "max",
                        });
                      }}
                      disabled={
                        currentField?.fieldType !== "NUMBER_ONLY" &&
                        currentField?.fieldType !== "FLOAT_POINT_NUMBER"
                      }
                    />
                  </div>
                </Grid>
              </Grid>
              {currentFieldType === "SELECT_OPTION" ? (
                <></>
              ) : (
                <div className={classes.justifyEnd}>
                  <div
                    className={classes.common_button}
                    onClick={() => {
                      // onSubmitValidateField();
                      // handleClose();
                      onSubmitSetting();
                    }}
                  >
                    <span>Lưu thông tin</span>
                  </div>
                </div>
              )}
            </div>
            {currentFieldType === "SELECT_OPTION" ||
            currentFieldType === "RADIO2" ? (
              <div className={classes.formContainer}>
                <Grid container spacing={3}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    className={classes.colFlex}
                    padding={"12px 0 20px 0"}
                  >
                    <label className={classes.label}>
                      Select option setting:
                    </label>
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} className={classes.colFlex}>
                    <label className={classes.inputLabel}>
                      {"First option label"}
                    </label>
                    <OutlinedInput
                      name={"form-name-input"}
                      className={`${classes.commonInput} ${classes.outlinedInputSx}`}
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        "aria-label": "weight",
                      }}
                      value={fieldSelectData?.firstOptionLabel}
                      onChange={event => {
                        onChangeSelectField({
                          event: event,
                          fieldName: "selectOption",
                          fieldIndex: currentFieldIndex,
                          fieldValidateName: "firstOptionLabel",
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} className={classes.colFlex}>
                    <label className={classes.inputLabel}>
                      {"Source data api"}
                    </label>
                    <OutlinedInput
                      name={"form-name-input"}
                      className={`${classes.commonInput} ${classes.outlinedInputSx}`}
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        "aria-label": "weight",
                      }}
                      value={fieldSelectData?.sourceDataApi}
                      onChange={event => {
                        onChangeSelectField({
                          event: event,
                          fieldName: "selectOption",
                          fieldIndex: currentFieldIndex,
                          fieldValidateName: "sourceDataApi",
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} className={classes.colFlex}>
                    <label className={classes.inputLabel}>
                      {"Field Value"}
                    </label>
                    <OutlinedInput
                      name={"form-name-input"}
                      className={`${classes.commonInput} ${classes.outlinedInputSx}`}
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        "aria-label": "weight",
                      }}
                      value={fieldSelectData?.fieldValue}
                      onChange={event => {
                        onChangeSelectField({
                          event: event,
                          fieldName: "selectOption",
                          fieldIndex: currentFieldIndex,
                          fieldValidateName: "fieldValue",
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} className={classes.colFlex}>
                    <label className={classes.inputLabel}>
                      {"Field label"}
                    </label>
                    <OutlinedInput
                      name={"form-name-input"}
                      className={`${classes.commonInput} ${classes.outlinedInputSx}`}
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        "aria-label": "weight",
                      }}
                      value={fieldSelectData?.fieldLabel}
                      onChange={event => {
                        onChangeSelectField({
                          event: event,
                          fieldName: "selectOption",
                          fieldIndex: currentFieldIndex,
                          fieldValidateName: "fieldLabel",
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} className={classes.colFlex}>
                    <SwitchButtonIOS
                      title={"Allow multiple"}
                      checked={
                        typeof fieldSelectData?.allowMultiple !== undefined
                          ? fieldSelectData?.allowMultiple ?? false
                          : false
                      }
                      onChange={event => {
                        onChangeSelectField({
                          event: event,
                          fieldName: "selectOption",
                          fieldIndex: currentFieldIndex,
                          fieldValidateName: "allowMultiple",
                        });
                      }}
                    />
                  </Grid>
                </Grid>

                <div className={classes.justifyEnd}>
                  <div
                    className={classes.common_button}
                    onClick={async () => {
                      // await onSubmitValidateField();
                      // await onSubmitSelectField();
                      // handleClose();
                      onSubmitSetting();
                    }}
                  >
                    <span>Lưu thông tin</span>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </form>
        </div>
      </DialogContent>
      <div></div>
    </Dialog>
  );
};
const FieldSettingModal = React.memo(FieldSettingModalComponent);
export { FieldSettingModal };
