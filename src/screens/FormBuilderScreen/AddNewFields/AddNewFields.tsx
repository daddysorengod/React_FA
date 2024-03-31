import React, { useEffect, useState } from "react";
import { useStyles } from "./AddNewFields.styles";
import {
  FormControl,
  MenuItem,
  Select,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import OutlinedInput from "@mui/material/OutlinedInput";
import { SwitchButtonIOS } from "@/src/components/SwitchButtonIOS/SwitchButtonIOS";
import { FieldSettingModal } from "../FieldSettingModal";
/// import store

import { dispatch, useSelector } from "@store/store";
import { RootStateProps } from "@app/types/root";
import {
  setCurrentFieldReducer,
  setCurrentFieldIndexReducer,
  addOrUpdateFormRecordReducer,
  setCurrentFieldType,
} from "@/src/store/reducers/formBuilder";
/// end import store
import { cloneDeep } from "lodash";
import { getValueWithType, nonNullValuesInObj } from "@/src/helpers";

import {
  FieldForm,
  IField,
  IForm,
  IValidate,
  ISelectOption,
} from "@/src/types/field";
import {
  setFormData as setFormDataGeneral,
  setListForm,
} from "@/src/store/reducers/general";
import { DialogViewJson } from "../DialogViewJson/DialogViewJson";
import { ButtonBase } from "@mui/material";
import {
  ISizeDialog,
  ITypeComponent,
  ITypeSubmit,
} from "@/src/constants/formConfigFiles";
import { BaseViewFormDialog } from "../ViewFormDialog";
import CommonFieldTypeOptions from "@/src/utils/enums/optionsBase/fieldTypeOptions";

interface IonChangeInput {
  event: any;
  fieldName: string;
  fieldIndex?: number;
  fieldValidateName?: string;
}

interface Props {
  handleCloseAddNewFormDialog: VoidFunction;
}

const AddNewFieldsComponent = (props: Props): JSX.Element => {
  const classes = useStyles();
  const formBuilder = useSelector((state: RootStateProps) => state.formBuilder);
  const { formBuilderConfig, currentFormData } = formBuilder;
  const [formData, setFormData] = useState<IForm>({});
  const [visibleAddNewFormDialog, setVisibleAddNewFormDialog] = useState(false);
  const { handleCloseAddNewFormDialog } = props;

  const handleClosePreview = () => {
    setVisibleAddNewFormDialog(false);
    dispatch(setFormDataGeneral({}));
    dispatch(setListForm([]));
  };
  const handleOpenPreview = () => {
    dispatch(setFormDataGeneral(formData));
    dispatch(setListForm([formData]));
    setVisibleAddNewFormDialog(true);
  };
  const [visibleAddNewFormDialogJson, setVisibleAddNewFormDialogJson] =
    useState(false);

  useEffect(() => {
    const getFieldsData = () => {
      setFormData(currentFormData);
    };
    getFieldsData();
  }, [currentFormData]);

  const handleOpenPreviewJson = () => {
    setVisibleAddNewFormDialogJson(true);
  };
  const handleClosePreviewJson = () => {
    setVisibleAddNewFormDialogJson(false);
  };

  const onPressAddField = () => {
    if (typeof formData?.fields !== "undefined") {
      setFormData({
        ...formData,
        fields: [...formData?.fields, new FieldForm()],
      });
    }
  };

  const onPressRemoveField = fieldIndex => {
    const tempField = cloneDeep(formData?.fields);
    tempField.splice(fieldIndex, 1);
    setFormData({ ...formData, fields: tempField });
  };

  const [visibleModalValidate, setVisibleModalValidate] = useState(false);

  const onOpenModalValidate = (fieldIndex: number, filedType?: string) => {
    if (typeof formData.fields !== "undefined") {
      dispatch(setCurrentFieldReducer(formData?.fields[fieldIndex]));
    }
    dispatch(setCurrentFieldIndexReducer(fieldIndex));
    dispatch(setCurrentFieldType(filedType));
    setVisibleModalValidate(true);
  };

  const handleCloseModalValidate = () => {
    setVisibleModalValidate(false);
    dispatch(setCurrentFieldReducer({}));
    dispatch(setCurrentFieldType(""));
    dispatch(setCurrentFieldIndexReducer(null));
  };

  const onSubmit = async () => {
    if (await dispatch(addOrUpdateFormRecordReducer(formData))) {
      handleCloseAddNewFormDialog();
    }
  };

  const onChangeValue = ({ event, fieldName, fieldIndex }: IonChangeInput) => {
    if (fieldIndex !== undefined) {
      const tempField = cloneDeep(formData?.fields);
      tempField[fieldIndex][`${fieldName}`] = !event.target.type
        ? event?.target?.value
        : event.target.type === "text"
        ? getValueWithType(
            tempField[fieldIndex][`${fieldName}`],
            event.target.type !== "text"
              ? event?.target?.checked
              : event?.target?.value,
          )
        : event?.target?.checked;

      setFormData({ ...formData, fields: tempField });
      return;
    }
    setFormData({
      ...formData,
      [`${fieldName}`]: !event.target.type
        ? event?.target?.value
        : event.target.type == "text" || event.target.type == "number"
        ? event?.target?.value
        : event?.target?.checked,
    });
    return;
  };

  const addOrUpdateFieldValidate = (
    val: {
      validateAttribute: IValidate;
      selectOption: ISelectOption;
    },
    index: number,
  ) => {
    if (val) {
      const tempField: IField[] = cloneDeep(formData?.fields);
      tempField[index] = {
        ...tempField[index],
        validateAttribute: val.validateAttribute,
        selectOption: val.selectOption,
      };
      setFormData({
        ...formData,
        fields: tempField,
      });
    }
  };

  const renderItemNewField = (field: IField, index: number) => {
    return (
      <div className={classes.newFieldContainer} key={index}>
        <Grid
          container
          spacing={2}
          paddingRight={2}
          paddingBottom={2}
          sx={{ backgroundColor: "#fff" }}
        >
          <Grid item xs={12} sm={1}>
            <label className={classes.inputLabel}>{"Row"}</label>
            <div style={{ display: "flex" }}>
              <OutlinedInput
                className={`${classes.commonInput} ${classes.outlinedInputSx}`}
                name={"input-field-row" ?? ""}
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
                value={field.rows}
                onChange={event => {
                  onChangeValue({
                    event: event,
                    fieldName: "rows",
                    fieldIndex: index,
                  });
                }}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={1}>
            <label className={classes.inputLabel}>{"Col"}</label>
            <div style={{ display: "flex" }}>
              <OutlinedInput
                name={"input-field-col" ?? ""}
                className={`${classes.commonInput} ${classes.outlinedInputSx}`}
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
                value={
                  typeof formData?.fields !== "undefined"
                    ? formData?.fields[index]?.cols
                    : ""
                }
                onChange={event => {
                  onChangeValue({
                    event: event,
                    fieldName: "cols",
                    fieldIndex: index,
                  });
                }}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={1}>
            <label className={classes.inputLabel}>{"Order"}</label>
            <div style={{ display: "flex" }}>
              <OutlinedInput
                name={"input-field-order" ?? ""}
                className={`${classes.commonInput} ${classes.outlinedInputSx}`}
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
                value={
                  typeof formData?.fields !== "undefined"
                    ? formData?.fields[index]?.order
                    : ""
                }
                onChange={event => {
                  onChangeValue({
                    event: event,
                    fieldName: "order",
                    fieldIndex: index,
                  });
                }}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={2}>
            <label className={classes.inputLabel}>
              {"Tên trường hiển thị"}
            </label>
            <OutlinedInput
              name={"input-field-name-display" ?? ""}
              className={`${classes.commonInput} ${classes.outlinedInputSx}`}
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
              value={
                typeof formData?.fields !== "undefined"
                  ? formData?.fields[index]?.label
                  : ""
              }
              onChange={event => {
                onChangeValue({
                  event: event,
                  fieldName: "label",
                  fieldIndex: index,
                });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <label className={classes.inputLabel}>{"Tên trường"}</label>
            <div style={{ display: "flex" }}>
              <OutlinedInput
                name={"input-field-name" ?? ""}
                className={`${classes.commonInput} ${classes.outlinedInputSx}`}
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
                value={
                  typeof formData?.fields !== "undefined"
                    ? formData?.fields[index]?.name
                    : ""
                }
                onChange={event => {
                  onChangeValue({
                    event: event,
                    fieldName: "name",
                    fieldIndex: index,
                  });
                }}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <label className={classes.inputLabel}>{"Loại dữ liệu"}</label>
            <FormControl className={classes.formControlSelectSx}>
              <Select
                displayEmpty
                placeholder="--Chọn--"
                value={field?.fieldType}
                onChange={event =>
                  onChangeValue({
                    event: event,
                    fieldName: "fieldType",
                    fieldIndex: index,
                  })
                }
                className={classes.dropdown}
              >
                {CommonFieldTypeOptions.toOptions() &&
                  CommonFieldTypeOptions.toOptions()?.length > 0 &&
                  CommonFieldTypeOptions.toOptions()?.map(
                    (field: any, index: number) => {
                      return (
                        <MenuItem key={index} value={field?.value || ""}>
                          {field?.text}
                        </MenuItem>
                      );
                    },
                  )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={1.5}>
            <label className={classes.inputLabel}>{"Setting"}</label>
            <OutlinedInput
              name={"code-input" ?? ""}
              className={`${classes.commonInput} ${classes.outlinedInputSx}`}
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
              placeholder=""
              value={
                `Đã chọn ${
                  typeof formData?.fields !== "undefined"
                    ? formData?.fields[index]?.validateAttribute
                      ? nonNullValuesInObj(field?.validateAttribute)
                      : 0
                    : ""
                }` ?? ""
              }
              onChange={event => {
                onChangeValue({
                  event: event,
                  fieldName: "validateAttribute",
                  fieldIndex: index,
                });
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => onOpenModalValidate(index, field?.fieldType)}
                  >
                    <AddIcon fontSize="small" color="primary" />
                  </IconButton>
                </InputAdornment>
              }
            />
          </Grid>
          <Grid item xs={12} sm={1} className={classes.colFlex}>
            <SwitchButtonIOS
              title={"IsHidden"}
              checked={
                typeof formData?.fields !== "undefined"
                  ? formData?.fields[index]?.isHidden ?? false
                  : false
              }
              onChange={event => {
                onChangeValue({
                  event: event,
                  fieldName: "isHidden",
                  fieldIndex: index,
                });
              }}
              disabled={false}
            />
          </Grid>
          <Grid item xs={12} sm={1} className={classes.justifyEnd}>
            <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
              <div className={classes.containerButton}>
                <div
                  className={classes.common_button3}
                  color="error"
                  onClick={() => {
                    onPressRemoveField(index);
                  }}
                >
                  Xoá
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  };

  const dialogViewJson = () => {
    return (
      <DialogViewJson
        visibleDialog={visibleAddNewFormDialogJson}
        handleClose={handleClosePreviewJson}
        formData={formData}
        setFormData={setFormData}
      />
    );
  };

  return (
    <div style={{ borderRadius: 8 }}>
      <form className="App-header" id={""}>
        <div>
          <div className={classes.formContainer}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={2}>
                <label className={classes.inputLabel}>{"Mã code"}</label>
                <OutlinedInput
                  name={"form-code" ?? ""}
                  className={`${classes.commonInput} ${classes.outlinedInputSx}`}
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                  value={formData?.code ?? ""}
                  onChange={event => {
                    onChangeValue({
                      event: event,
                      fieldName: "code",
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <label className={classes.inputLabel}>
                  {"Chọn loại popup"}
                </label>
                <FormControl className={classes.formControlSelectSx}>
                  <Select
                    displayEmpty
                    placeholder="--Chọn--"
                    name={"form-select-type"}
                    value={formData?.formType ?? ""}
                    onChange={event => {
                      onChangeValue({
                        event: event,
                        fieldName: "formType",
                      });
                    }}
                    className={classes.dropdown}
                  >
                    {formBuilderConfig?.FORM_TYPE &&
                      formBuilderConfig?.FORM_TYPE?.length > 0 &&
                      formBuilderConfig?.FORM_TYPE?.map(
                        (field: any, index: number) => {
                          return (
                            <MenuItem key={index} value={field?.value || ""}>
                              {field?.name}
                            </MenuItem>
                          );
                        },
                      )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <label className={classes.inputLabel}>{"Tên Form"}</label>
                <OutlinedInput
                  name={"form-name-input"}
                  className={`${classes.commonInput} ${classes.outlinedInputSx}`}
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                  value={formData?.addNewFormName ?? ""}
                  onChange={event => {
                    onChangeValue({
                      event: event,
                      fieldName: "addNewFormName",
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <label className={classes.inputLabel}>{"Tên cập nhật"}</label>
                <OutlinedInput
                  name={"form-name-input"}
                  className={`${classes.commonInput} ${classes.outlinedInputSx}`}
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                  value={formData?.updateFormName ?? ""}
                  onChange={event => {
                    onChangeValue({
                      event: event,
                      fieldName: "updateFormName",
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <label className={classes.inputLabel}>{"Active"}</label>
                <FormControl className={classes.formControlSelectSx}>
                  <Select
                    displayEmpty
                    placeholder="--Chọn--"
                    name="form-is-active"
                    value={1}
                    className={classes.dropdown}
                    disabled
                  >
                    <MenuItem value={1}>Active</MenuItem>
                    <MenuItem value={0}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3} className={classes.justifyEnd}>
                <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
                  <div className={classes.containerButton}>
                    <div className={classes.common_button} onClick={onSubmit}>
                      Lưu Form
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: "flex" }}>
                  <div className={classes.containerButton}>
                    <div
                      className={classes.common_button}
                      onClick={handleOpenPreview}
                    >
                      View Form
                    </div>
                  </div>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={2} className={classes.colFlex}>
                <label className={classes.inputLabel}>{"Tên bước"}</label>
                <OutlinedInput
                  name={"form-stepFormName" ?? ""}
                  className={`${classes.commonInput} ${classes.outlinedInputSx}`}
                  aria-describedby="outlined-weight-helper-text"
                  fullWidth={true}
                  inputProps={{
                    "aria-label": "weight",
                  }}
                  value={formData?.stepFormName ?? ""}
                  onChange={event => {
                    onChangeValue({
                      event: event,
                      fieldName: "stepFormName",
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={7} className={classes.colFlex}>
                <label className={classes.inputLabel}>{"Mô tả"}</label>
                <OutlinedInput
                  name={"form-description" ?? ""}
                  className={`${classes.commonInput} ${classes.outlinedInputSx}`}
                  aria-describedby="outlined-weight-helper-text"
                  fullWidth={true}
                  inputProps={{
                    "aria-label": "weight",
                  }}
                  value={formData?.description ?? ""}
                  onChange={event => {
                    onChangeValue({
                      event: event,
                      fieldName: "description",
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={3} className={classes.justifyEnd}>
                {/* <Grid item xs={12} sm={6} sx={{ display: "flex" }}> */}
                <div className={classes.containerButton}>
                  <ButtonBase
                    className={classes.common_button}
                    onClick={handleOpenPreviewJson}
                  >
                    Chi tiết
                  </ButtonBase>
                </div>
              </Grid>
              {/* </Grid> */}
            </Grid>

            {formData?.fields?.map((item: any, index: number) =>
              renderItemNewField(item, index),
            )}

            <div className={classes.justifyCenter}>
              <div className={classes.common_button2} onClick={onPressAddField}>
                <AddIcon />
                <span>Thêm trường</span>
              </div>
            </div>
          </div>
        </div>
      </form>
      <FieldSettingModal
        visibleDialog={visibleModalValidate}
        handleClose={handleCloseModalValidate}
        onChangeValue={val => onChangeValue(val)}
        addOrUpdateFieldValidate={(val, index) => {
          addOrUpdateFieldValidate(val, index);
        }}
        formData={formData}
      />
      {dialogViewJson()}
      <BaseViewFormDialog
        currentId={""}
        currentStatus={"create"}
        // isDisabled={false}
        data={{
          title: "FORM BUILDER",
          size: formData?.formType || ISizeDialog.SUBMIT_IFRAME_XLARGE,
          submitType: ITypeSubmit.ALL,
          apiSubmit: {
            url: "",
          },
          children: [
            {
              title: "",
              apiSubmit: {
                url: "",
                idName: "",
              },
              children: [
                {
                  title: "",
                  type: ITypeComponent.DYNAMIC,
                  code: "TableBuilderForm",
                  fieldName: "",
                  dialogCode: "",
                  fetchUrl: "",
                },
              ],
              fieldName: "",
            },
          ],
        }}
        visible={visibleAddNewFormDialog}
        onCloseDialogForm={handleClosePreview}
        handleRefresh={() => {
          console.log("handleRefresh");
        }}
        parentId={{
          id: "",
        }}
        submitParentData={{}}
        formBuilderCurrentSetting={formData}
      />
    </div>
  );
};
const AddNewFields = React.memo(AddNewFieldsComponent);
export { AddNewFields };
