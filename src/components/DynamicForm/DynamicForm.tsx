import React, {
  useState,
  useEffect,
  FormEvent,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import "jquery"; ///
import { useStyles } from "./DynamicForm.styles";
import { Grid } from "@mui/material";
import { BaseDropdown } from "../BaseDropdown";
import { BaseInput } from "../BaseInput";
import { BaseDatePicker } from "../BaseDatePicker";
import { IFormType } from "@/src/types/general";
import { BaseRadioGroup } from "../BaseRadioGroup";
import { BaseInputMultiLine } from "../BaseInputMultiLine";
import { BaseImageFileUpLoad } from "../BaseImageFileUpLoad";
import {
  IField,
  IForm,
  IFormSettingSubmitStep,
  IFieldValue,
  TextFieldType,
} from "@/src/types/field";
import { useSelector } from "react-redux";
import { RootStateProps } from "@/src/types/root";
import { insertOrUpdateRecord, lockNAV } from "@/src/store/reducers/general";
import { dispatch } from "@/src/store";
import { ITabConfig } from "@/src/constants/formConfigFiles";
import {
  getFieldGrid,
  useMapValueToForm,
  formatFormValues,
  getDependCalculate,
} from "@/src/helpers/formDynamicHelper";
import { BaseRadioInput } from "../BaseRadioInput";
import {
  getMapKeyToDependKey,
  getDependencyType,
  getEncodeFormCode,
  getTypeAutoComplete,
} from "@/src/helpers/getQueryURL";
import { BaseCheckBox } from "./components";
import { AccountingMoneyTransDetail } from "../AccountingMoneyTransDetail";
import { StockDetailTable } from "../StockDetailTable";
import { TableEditable } from "../TableEditable";
import { BaseInputSecond } from "../BaseInputSecond";
import { FormDynamicCustom } from "../DynamicFormCustom";
import { showErrorSnackBar } from "@/src/store/reducers/snackbar";
import { TableDetailEntry } from "../TableDetailEntry";
import { TableDetailEntryFixed } from "../TableDetailEntryFixxed";

interface Props {
  isDisableField: boolean;
  formType?: IFormType;
  formSettingSubmitStep?: ITabConfig;
  formCode?: string;
  currentRecord: IFieldValue;
  currentId?: string;
  parentId?: DynamicObject;
  formBuilderCurrentSetting?: IForm;
  formBuildMode?: boolean;
  isRefresh?: boolean;
}
interface IFieldError {
  [key: string]: string;
}
interface DynamicObject {
  [key: string]: any;
}

const BaseFormDynamicStepsComponent = forwardRef(
  (props: Props, ref): JSX.Element => {
    const classes = useStyles();
    const {
      currentRecord,
      isDisableField,
      formSettingSubmitStep,
      formType,
      formCode,
      currentId,
      parentId,
      formBuildMode,
      formBuilderCurrentSetting,
      isRefresh,
    } = props;

    const dataAPI = useSelector(
      (state: RootStateProps) => state.formBuilder.listForms,
    ).find(child => child.code === formCode);
    const globalFundData = useSelector(
      (state: RootStateProps) => state.general.globalFundData,
    );
    const [isLoading, setIsLoading] = useState(true);
    const [mounting, setMounting] = useState(false);
    const [initialValues, setInitialValues] = useState<DynamicObject>({});
    const [formErrors, setFormErrors] = useState<IFieldError>({});
    const [formGrid, setFromGrid] = useState<any>({});

    useEffect(() => {
      // if (formType !== "create") {
      //   setDataAPI(data);
      // }

      if (formBuildMode) {
        if (formBuilderCurrentSetting?.fields) {
          setFromGrid(getFieldGrid(formBuilderCurrentSetting?.fields));
        }
      } else {
        if (dataAPI?.fields) {
          setFromGrid(getFieldGrid(dataAPI?.fields));
          // setInitialValues(mapFieldTypeToInitialValue(dataAPI?.fields)); ???
        }
      }
    }, [dataAPI, formBuilderCurrentSetting]);

    useEffect(() => {
      if (mounting || !getEncodeFormCode(dataAPI?.code)) {
        return;
      }
      setUpJqueryValidation();
      setMounting(true);
    }, [getEncodeFormCode(dataAPI?.code)]);

    useMapValueToForm({
      currentRecord: currentRecord,
      setInitialValues: setInitialValues,
      listField: dataAPI?.fields,
      option: {
        fundId: globalFundData?.id || "",
        fetchByFundId: formSettingSubmitStep?.children[0]?.fetchByFundId,
        fetchUrl: formSettingSubmitStep?.children[0]?.fetchUrl,
      },
      isRefresh: isRefresh,
    });

    const onChangeValue = (
      value,
      item: IField,
      formatValue: string,
      keyName?: string,
    ) => {
      const getField =
        dataAPI?.fields && dataAPI?.fields.find(el => el.name === item?.name);
      if (!getField?.fieldType || !item.name) {
        return;
      }
      switch (getField?.fieldType) {
        case TextFieldType.checkbox: {
          setInitialValues(prevState => {
            const updatedValues = {
              ...prevState,
            };
            if (item && typeof item.name === "string") {
              updatedValues[item.name] = value ?? false;
            }
            return updatedValues;
          });
          break;
        }
        case TextFieldType.datePicker: {
          setInitialValues(prevState => {
            const updatedValues = {
              ...prevState,
            };
            if (item && typeof item.name === "string") {
              updatedValues[item.name] = formatValue;
            }
            return updatedValues;
          });
          break;
        }
        case TextFieldType.fileUpload: {
          setInitialValues(prevState => {
            const updatedValues = {
              ...prevState,
            };
            if (item.name) {
              updatedValues[item.name] = formatValue;
            }

            return updatedValues;
          });
          break;
        }
        case TextFieldType.radioMultipleSelect: {
          setInitialValues(prevState => {
            const updatedValues = {
              ...prevState,
            };
            if (item.name) {
              updatedValues[item.name] = formatValue;
            }
            return updatedValues;
          });
          break;
        }
        case TextFieldType.detailsOfJournalEntryTableFixed: {
          setInitialValues(prevState => {
            const updatedValues = {
              ...prevState,
            };
            if (keyName && typeof keyName !== "undefined") {
              updatedValues[keyName] =
                typeof value === "boolean"
                  ? value
                    ? value
                    : false
                  : value
                  ? value
                  : null;
            }
            return updatedValues;
          });
          break;
        }
        default: {
          setInitialValues(prevState => {
            const updatedValues = {
              ...prevState,
            };
            if (item && typeof item.name === "string") {
              updatedValues[item.name] =
                typeof value === "boolean"
                  ? value
                    ? value
                    : false
                  : value
                  ? value
                  : null;
            }
            return updatedValues;
          });
          break;
        }
      }

      if (item?.fieldType === TextFieldType.selectOption) {
        updateErrorSelectOption(
          value,
          item?.validateAttribute?.isRequired !== undefined
            ? item?.validateAttribute?.isRequired
            : false,
        );
      }
    };

    const updateErrorSelectOption = (
      option: DynamicObject,
      isRequired: boolean,
    ) => {
      try {
        const { name, value } = option;
        if (!name || !value) {
          return;
        }
        if (!isRequired) {
          return;
        }
        if (!value) {
          setFormErrors(formErrors => ({
            ...formErrors,
            [name]: "Vui lòng nhập thông tin",
          }));
        } else {
          setFormErrors(formErrors => ({
            ...formErrors,
            [name]: "",
          }));
        }
      } catch (err) {}
    };

    const renderItem = (item: IField, index: number) => {
      switch (item.fieldType) {
        case TextFieldType.checkbox:
          return (
            <BaseCheckBox
              fieldSet={item}
              fieldIndex={index}
              initialValue={
                item?.name ? initialValues[item?.name] : false ?? false
              }
              onChangeValue={onChangeValue}
              isDisabled={
                isDisableField || item?.validateAttribute?.isRequired || false
              }
              customAttrs={item.customAttrs}
              isRequired={item?.validateAttribute?.isRequired}
            />
          );
        case TextFieldType.selectOption:
          return (
            <BaseDropdown
              label={item.label}
              formCode={getEncodeFormCode(dataAPI?.code)}
              isRequired={
                item.validateAttribute
                  ? item.validateAttribute?.isRequired
                  : false
              }
              fieldIndex={index}
              value={item?.name ? initialValues[item?.name] : null}
              name={item?.name ?? ""}
              url={item?.selectOption?.sourceDataApi}
              selectOption={item?.selectOption}
              onChange={event => {
                onChangeValue(event, item, "");
              }}
              isDisabled={isDisableField}
              errorField={item?.name ? formErrors[item?.name] : ""}
              onBlurSelectOption={event => {
                updateErrorSelectOption(
                  event.target,
                  item.validateAttribute
                    ? item.validateAttribute?.isRequired
                    : false,
                );
              }}
              initialState={{
                ...currentRecord,
                ...initialValues,
                ...(parentId && Object.keys(parentId).length ? parentId : null),
                globalFundId: globalFundData?.id ? globalFundData?.id : "",
              }}
              customAttrs={item?.customAttrs ? item.customAttrs : null}
              fieldSet={item}
              dropdownType={getTypeAutoComplete(item)}
              dependencies={getMapKeyToDependKey(item?.customAttrs)}
              dependencyTypes={getDependencyType(item?.customAttrs, parentId)}
            />
          );
        case TextFieldType.datePicker:
          return (
            <BaseDatePicker
              label={item?.label}
              isRequired={
                item?.validateAttribute
                  ? item?.validateAttribute?.isRequired
                  : false
              }
              fieldIndex={index}
              valueDatePicker={
                item?.name ? initialValues[item?.name] : null ?? ""
              }
              // maxDate={item?.validateAttribute?.isMaxDay ? dayjs(new Date()) : ""}
              // minDate={item?.validateAttribute?.isMinDay ? dayjs(new Date()) : ""}
              isDisabled={
                isDisableField ||
                item?.validateAttribute?.isReadOnly ||
                item?.validateAttribute?.isDisabled
              }
              initialState={{
                ...currentRecord,
                ...initialValues,
              }}
              name={item?.name ?? ""}
              onChange={newValue => {
                onChangeValue("", item, newValue);
              }}
              errorField={item?.name ? formErrors[item?.name] : ""}
              customAttrs={item?.customAttrs ? item.customAttrs : null}
              formCode={getEncodeFormCode(dataAPI?.code)}
            />
          );
        case TextFieldType.textBox:
          return (
            <BaseInput
              label={item?.label}
              isRequired={item?.validateAttribute?.isRequired}
              type="text"
              fieldName={item?.name ?? ""}
              initialValue={
                item?.name && initialValues[item?.name]
                  ? initialValues[item?.name]
                  : null ?? ""
              }
              onChange={event => {
                onChangeValue(event, item, "");
              }}
              isDisabled={
                isDisableField
                // ||
                // item?.validateAttribute?.isReadOnly ||
                // item?.validateAttribute?.isDisabled
              }
              fieldIndex={index}
              errorField={item?.name ? formErrors[item?.name] : ""}
              fieldSet={item}
              customAttrs={item.customAttrs}
              formCode={getEncodeFormCode(dataAPI?.code)}
              formType={formType}
              initialState={{
                ...currentRecord,
                ...initialValues,
                ...(parentId && Object.keys(parentId).length ? parentId : null),
              }}
            />
          );
        case TextFieldType.multiTextBox:
          return (
            <BaseInputMultiLine
              label={item?.label}
              isRequired={
                item?.validateAttribute
                  ? item?.validateAttribute?.isRequired
                  : false
              }
              type="text"
              fieldName={item?.name ?? ""}
              value={item?.name ? initialValues[item?.name] : null ?? ""}
              isDisabled={
                isDisableField || item?.validateAttribute?.isRequired || false
              }
              onChange={event => {
                onChangeValue(event, item, "");
              }}
              fieldIndex={index}
              errorField={item?.name ? formErrors[item?.name] : ""}
            />
          );
        case TextFieldType.numberInt:
          return (
            <BaseInput
              label={item?.label}
              isRequired={item?.validateAttribute?.isRequired}
              type="text"
              fieldName={item?.name ?? ""}
              initialValue={
                item?.name && initialValues[item?.name]
                  ? initialValues[item?.name]
                  : null ?? ""
              }
              isDisabled={isDisableField || false}
              onChange={event => {
                onChangeValue(event, item, "");
              }}
              fieldIndex={index}
              errorField={item?.name ? formErrors[item?.name] : ""}
              fieldSet={item}
              formType={formType}
              formCode={getEncodeFormCode(dataAPI?.code)}
              initialState={{
                ...currentRecord,
                ...initialValues,
                ...(parentId && Object.keys(parentId).length ? parentId : null),
                globalFundId: globalFundData?.id ? globalFundData?.id : "",
              }}
              customAttrs={item?.customAttrs ? item.customAttrs : null}
              dependVal={getDependCalculate(
                initialValues,
                item?.customAttrs?.dependVal || "",
              )}
            />
          );
        case TextFieldType.numberPercent:
          return (
            <BaseInput
              label={item?.label}
              isRequired={item?.validateAttribute?.isRequired}
              type="text"
              fieldName={item?.name ?? ""}
              initialValue={
                item?.name && initialValues[item?.name]
                  ? initialValues[item?.name]
                  : null ?? ""
              }
              isDisabled={isDisableField || false}
              onChange={event => {
                onChangeValue(event, item, "");
              }}
              fieldIndex={index}
              errorField={item?.name ? formErrors[item?.name] : ""}
              fieldSet={item}
              formCode={getEncodeFormCode(dataAPI?.code)}
              formType={formType}
              initialState={{
                ...currentRecord,
                ...initialValues,
                ...(parentId && Object.keys(parentId).length ? parentId : null),
                globalFundId: globalFundData?.id ? globalFundData?.id : "",
              }}
              customAttrs={item?.customAttrs ? item.customAttrs : null}
            />
          );
        case TextFieldType.numberFloat:
          return (
            <BaseInput
              label={item?.label}
              isRequired={item?.validateAttribute?.isRequired}
              type="text"
              fieldName={item?.name ?? ""}
              initialValue={
                item?.name && initialValues[item?.name]
                  ? initialValues[item?.name]
                  : null ?? ""
              }
              isDisabled={isDisableField || false}
              onChange={event => {
                onChangeValue(event, item, "");
              }}
              fieldIndex={index}
              errorField={item?.name ? formErrors[item?.name] : ""}
              fieldSet={item}
              formCode={getEncodeFormCode(dataAPI?.code)}
              formType={formType}
              initialState={{
                ...currentRecord,
                ...initialValues,
                ...(parentId && Object.keys(parentId).length ? parentId : null),
                globalFundId: globalFundData?.id ? globalFundData?.id : "",
              }}
              customAttrs={item?.customAttrs ? item.customAttrs : null}
              dependVal={getDependCalculate(
                initialValues,
                item?.customAttrs?.dependVal || "",
              )}
            />
          );
        case TextFieldType.label:
          return <label className={classes.label}>{item?.label}</label>;
        case TextFieldType.radio:
          return (
            <BaseRadioGroup
              label={item?.label}
              isRequired={
                item?.validateAttribute
                  ? item?.validateAttribute?.isRequired
                  : false
              }
              // value={item?.value}
              value={item?.name ? initialValues[item?.name] : null ?? ""}
              fieldName={item?.name}
              isDisabled={
                isDisableField || item?.validateAttribute?.isRequired || false
              }
              fieldIndex={index}
              onChange={event => {
                onChangeValue(event, item, "");
              }}
            />
          );
        case TextFieldType.fileUpload: {
          return (
            <BaseImageFileUpLoad
              label={item?.label}
              isRequired={item?.validateAttribute?.isRequired}
              isDisabled={
                isDisableField ||
                item?.validateAttribute?.isReadOnly ||
                item?.validateAttribute?.isDisabled
              }
              value={item?.name ? initialValues[item?.name] : null ?? ""}
              onChange={newValue => {
                onChangeValue("", item, newValue);
              }}
              fieldName={item?.name ?? ""}
              fieldIndex={index}
              errorField={item?.name ? formErrors[item?.name] : ""}
              formType={formType}
              fieldSet={item}
              initialState={initialValues}
            />
          );
        }
        case TextFieldType.radioMultipleSelect: {
          return (
            <BaseRadioInput
              label={item?.label}
              isRequired={item?.validateAttribute?.isRequired}
              isDisabled={
                isDisableField ||
                item?.validateAttribute?.isReadOnly ||
                item?.validateAttribute?.isDisabled
              }
              value={item?.name ? initialValues[item?.name] : null ?? ""}
              onChange={newValue => {
                onChangeValue("", item, newValue);
              }}
              fieldName={item?.name}
              fieldIndex={index}
              errorField={item?.name ? formErrors[item?.name] : ""}
              valueKey={item?.selectOption?.fieldValue || "cdVal"}
              labelKey={item?.selectOption?.fieldLabel || "vnCdContent"}
              url={item?.selectOption?.sourceDataApi || ""}
            />
          );
        }
        case TextFieldType.detailsOfJournalEntries: {
          return (
            <AccountingMoneyTransDetail
              initialState={{
                ...currentRecord,
                ...initialValues,
                ...(parentId && Object.keys(parentId).length ? parentId : null),
              }}
              // currentId={currentId}
              // parentId={"abc"}
              // onlyShow={false}
              // formType={"create"}
              // // ref={handleSubmitForm}
            />
          );
        }
        case TextFieldType.detailsOfJournalEntryTable: {
          return (
            <TableDetailEntry
              isDisabled={
                isDisableField ||
                item?.validateAttribute?.isReadOnly ||
                item?.validateAttribute?.isDisabled ||
                false
              }
              parentId={
                parentId && Object.keys(parentId).length
                  ? Object.keys(parentId)[0]
                  : ""
              }
              entryProp={{
                fundId: globalFundData?.id || "",
              }}
              tableCode={item?.customAttrs?.tableCode || ""}
              isRefresh={isRefresh}
              currentId={currentId}
              customAttrs={item?.customAttrs ? item.customAttrs : null}
              workFollowStatus={
                currentRecord?.workFollowStatus &&
                typeof currentRecord?.workFollowStatus === "string"
                  ? currentRecord?.workFollowStatus
                  : ""
              }
            />
          );
        }
        case TextFieldType.detailsOfJournalEntryTableFixed: {
          return (
            <TableDetailEntryFixed
              isDisabled={
                isDisableField ||
                item?.validateAttribute?.isReadOnly ||
                item?.validateAttribute?.isDisabled ||
                false
              }
              parentId={
                parentId && Object.keys(parentId).length
                  ? Object.keys(parentId)[0]
                  : ""
              }
              entryProp={{
                fundId: globalFundData?.id || "",
              }}
              onChange={data => {
                onChangeValue(data?.value, item, "", data?.keyName);
              }}
              initialState={{
                ...currentRecord,
                ...initialValues,
                ...(parentId && Object.keys(parentId).length ? parentId : null),
              }}
              tableCode={item?.customAttrs?.tableCode || ""}
              isRefresh={isRefresh}
              currentId={currentId}
              customAttrs={item?.customAttrs ? item.customAttrs : null}
              workFollowStatus={
                currentRecord?.workFollowStatus &&
                typeof currentRecord?.workFollowStatus === "string"
                  ? currentRecord?.workFollowStatus
                  : ""
              }
            />
          );
        }
        case TextFieldType.detailStockTable: {
          return (
            <StockDetailTable
              customAttrs={item?.customAttrs ? item.customAttrs : null}
              name={item?.name ?? ""}
              currentId={currentId}
              formCode={getEncodeFormCode(dataAPI?.code)}
              onChange={event => {
                onChangeValue(event, item, "");
              }}
              value={item?.name ? initialValues[item?.name] : null ?? ""}
              isDisabled={formType && formType !== "create"}
            />
          );
        }
        case TextFieldType.customLabel: {
          return (
            <BaseInputSecond
              label={item?.label}
              isRequired={item?.validateAttribute?.isRequired}
              type="text"
              fieldName={item?.name ?? ""}
              initialValue={item?.name ? initialValues[item?.name] : null ?? ""}
              onChange={event => {
                onChangeValue(event, item, "");
              }}
              isDisabled={isDisableField}
              fieldIndex={index}
              errorField={item?.name ? formErrors[item?.name] : ""}
              fieldSet={item}
              customAttrs={item.customAttrs}
              formCode={getEncodeFormCode(dataAPI?.code)}
              formType={formType}
              initialState={{
                ...currentRecord,
                ...initialValues,
                ...(parentId && Object.keys(parentId).length ? parentId : null),
              }}
            />
          );
        }
        case TextFieldType.editableTable: {
          return (
            <TableEditable
              isDisabled={false}
              parentId={
                parentId && Object.keys(parentId).length
                  ? Object.keys(parentId)[0]
                  : ""
              }
              entryProp={{
                fundId: globalFundData?.id || "",
              }}
              tableCode={item?.customAttrs?.tableCode || ""}
              isRefresh={isRefresh}
            />
          );
        }
        case TextFieldType.customForm: {
          return (
            <FormDynamicCustom
              currentRecord={currentRecord}
              currentId={currentId}
              isDisableField={isDisableField}
              formType={formType}
              // ref={ref}
              formCode={item?.customAttrs?.formCode}
              formSettingSubmitStep={formSettingSubmitStep}
              parentId={parentId}
            />
          );
        }
        default:
          break;
      }
    };

    const setUpJqueryValidation = () => {
      setIsLoading(true);
      const formValidator = dataAPI?.fields?.reduce(
        (jquerySetting: Record<string, any> = {}, item) => {
          const key = item.name;
          const fieldName = item.label;
          const value = item.validateAttribute;
          const customAttrs = item?.customAttrs || {};
          if (!key) {
            return;
          }
          jquerySetting.rules[key] = {};
          jquerySetting.messages[key] = {};
          for (let prop in value) {
            switch (true) {
              case prop === "isRequired" && value?.isRequired: {
                jquerySetting.rules[key]["required"] = true;
                jquerySetting.messages[key][
                  "required"
                ] = `${fieldName} không được bỏ trống`;
                break;
              }
              case value?.maxLength && prop === "maxLength": {
                jquerySetting.rules[key]["maxlength"] = value?.maxLength;
                jquerySetting.messages[key][
                  "maxlength"
                ] = `${fieldName} có độ dài không quá ${value?.maxLength} ký tự`;
                break;
              }
              case value?.minLength && prop === "minLength": {
                jquerySetting.rules[key]["minlength"] = value?.minLength;
                jquerySetting.messages[key][
                  "minlength"
                ] = `${fieldName} có độ dài tối thiểu ${value?.minLength} ký tự`;
                break;
              }

              case value?.regexPattern && prop === "regexPattern": {
                jquerySetting.rules[key]["regex"] = value?.regexPattern;
                jquerySetting.messages[key][
                  "regex"
                ] = `${fieldName} không hợp lệ`;
                break;
              }
              default:
                break;
            }
          }
          // if (
          //   typeof customAttrs === "object" &&
          //   Object.keys(customAttrs).length > 0 &&
          //   (item?.fieldType === TextFieldType.numberInt ||
          //     item?.fieldType === TextFieldType.numberFloat)
          // ) {
          //   Object.keys(customAttrs).forEach(attr => {
          //     switch (attr) {
          //       case "minValue": {
          //         jquerySetting.rules[key]["min"] = customAttrs?.minValue
          //           ? Number(customAttrs?.minValue)
          //           : 0;
          //         // jquerySetting.rules[key]["min"] = function () {
          //         //   return false;
          //         // };
          //         jquerySetting.messages[key][
          //           "min"
          //         ] = `${fieldName} không nhỏ hơn ${customAttrs?.minValue}`;
          //         break;
          //       }
          //       case "maxValue": {
          //         jquerySetting.rules[key]["max"] =
          //           // function () {
          //           //   return false;
          //           // };
          //           customAttrs?.maxValue ? Number(customAttrs?.maxValue) : 0;
          //         jquerySetting.messages[key][
          //           "max"
          //         ] = `${fieldName} không lớn hơn ${customAttrs?.maxValue}`;
          //         break;
          //       }
          //       default: {
          //         break;
          //       }
          //     }
          //   });
          // }
          return jquerySetting;
        },
        {
          rules: {},
          messages: {},
          errorElement: "i",
          errorClass: "material-icons",
          validClass: "",
          errorPlacement: function (error, element) {
            mapFieldErrorToFormError(element.attr("name"), error.text());
          },
          success: function (label, element) {
            $(`#icon-${element?.name}`).remove();
            $(element).removeClass("invalid");
            label.remove();
          },
        },
      );
      try {
        $(`#${getEncodeFormCode(dataAPI?.code)}`).validate({
          ...formValidator,
          onfocusout: function (element) {
            $(element).valid();
          },
        });

        $.validator.addMethod("regex", function (value, element, regexPattern) {
          var re = new RegExp(regexPattern);
          return this.optional(element) || re.test(value);
        });
        $.validator.addMethod("max", function (value, element, regexPattern) {
          // console.log("addMethod --- max: ", value, element, regexPattern);
          return false;
        });
      } catch (error) {
        dispatch(showErrorSnackBar(`Setup jquery ${error}`));
        console.log(error);
      }
      setIsLoading(false);
    };

    const mapFieldErrorToFormError = (name: string, message: string) => {
      setFormErrors(formErrors => ({
        ...formErrors,
        [name]: message,
      }));
    };

    useImperativeHandle(ref, () => ({
      async onSubmitRef() {
        const payload = await onSubmit();
        if (payload) {
          return payload;
        }
        return false;
      },
      async onSaveValueRef() {
        const payload = await onSaveValue();
        if (payload) {
          return payload;
        }
        return null;
      },
      handleUnFocus() {
        setFormErrors({});
        // setInitialValues({});
      },
      async saveLocalForm() {
        const payload = await onSaveValuesLocal();
        if (payload) {
          return payload;
        }
        return null;
      },
      async onSubmitCustomRef(dialogData: any) {
        const payload = await onSubmitCustom(dialogData);
        if (payload) {
          return payload;
        }
        return null;
      },
      async onSubmitLockNavRef() {
        const payload = await onSubmitLockNav();
        if (payload) {
          return payload;
        }
        return null;
      },
    }));

    const getValidForm = () => {
      try {
        const validForm =
          $(`#${getEncodeFormCode(dataAPI?.code)}`)?.valid() ?? false;
        const checkFormErrors: any = $(
          `#${getEncodeFormCode(dataAPI?.code)}`,
        )?.validate().errorList;
        setFormErrors(
          checkFormErrors?.reduce((obj, field) => {
            obj[field.element.name] = field.message;
            return obj;
          }, {}),
        );
        return { validForm: validForm };
      } catch (err) {
        // dispatch(showErrorSnackBar(`Setup jquery ${err}`));
        return { validForm: false };
      }
    };

    const onSubmit = async () => {
      const { validForm } = getValidForm();
      if (validForm && !isLoading && formSettingSubmitStep !== undefined) {
        if (formType === "update") {
          const response = await dispatch(
            insertOrUpdateRecord({
              url: formSettingSubmitStep?.apiSubmit?.url,
              params: {
                ...formatFormValues(initialValues, dataAPI?.fields),
                id: currentId,
              },
            }),
          );
          if (response) {
            return formSettingSubmitStep?.apiSubmit?.idName
              ? { [formSettingSubmitStep?.apiSubmit?.idName]: response }
              : { id: response };
          }
          return false;
        }
        let formValueId: string | null = null;
        if (currentRecord?.id) {
          const { id, ...otherValue } = currentRecord;
          formValueId = id ? id.toString() : null;
        }

        const response = await dispatch(
          insertOrUpdateRecord({
            url: formSettingSubmitStep?.apiSubmit.url,
            params: {
              ...formatFormValues(initialValues, dataAPI?.fields),
              id: formValueId,
            },
          }),
        );
        if (response) {
          return formSettingSubmitStep?.apiSubmit?.idName
            ? { [formSettingSubmitStep?.apiSubmit?.idName]: response }
            : { id: response };
        }
        return false;
      }
      return false;
    };

    const onSubmitLockNav = async () => {
      const { validForm } = getValidForm();
      if (
        validForm &&
        !isLoading &&
        formSettingSubmitStep !== undefined &&
        globalFundData?.id
      ) {
        if (formType === "create") {
          const response = await dispatch(
            lockNAV({
              url: formSettingSubmitStep?.apiSubmit?.url,
              id: globalFundData.id,
            }),
          );
          if (response) {
            return true;
          }
          return false;
        }
        // return {
        //   [formSettingSubmitStep?.apiSubmit?.idName
        //     ? formSettingSubmitStep?.apiSubmit?.idName
        //     : "id"]: currentId,
        //   ...formatFormValues(initialValues, dataAPI?.fields),
        // };
      }
      return false;
    };

    const onSaveValue = async () => {
      const { validForm } = getValidForm();
      if (validForm && !isLoading && formSettingSubmitStep !== undefined) {
        if (formType === "update") {
          return {
            [formSettingSubmitStep?.apiSubmit?.idName
              ? formSettingSubmitStep?.apiSubmit?.idName
              : "id"]: currentId,
            ...formatFormValues(initialValues, dataAPI?.fields),
          };
        }
        return { ...formatFormValues(initialValues, dataAPI?.fields) };
      }
      return false;
    };

    const onSaveValuesLocal = async () => {
      const { validForm } = getValidForm();
      if (validForm && !isLoading && formSettingSubmitStep !== undefined) {
        return { ...formatFormValues(initialValues, dataAPI?.fields) };
      }
      return false;
    };

    const onSubmitCustom = async (dialogData: any) => {
      try {
        const fieldSubmit = formSettingSubmitStep?.apiSubmit?.idName ?? null;
        if (!fieldSubmit) {
          return false;
        }
        if (!initialValues[fieldSubmit]) {
          return true;
        }
        const response = await dispatch(
          insertOrUpdateRecord({
            url: formSettingSubmitStep?.apiSubmit?.url,
            params: [...initialValues[fieldSubmit]],
          }),
        );
        if (response) {
          return true;
        }
        return false;
      } catch (error) {
        // dispatch(showErrorSnackBar(`Setup jquery ${error}`));
        console.log(`error: ${error}`);
        return false;
      }
    };

    return (
      <div style={{ borderRadius: 8 }}>
        <form id={getEncodeFormCode(dataAPI?.code)}>
          <div className={classes.formContainer}>
            {formGrid &&
              Object.values(formGrid)?.map((colItem: any, colIndex: number) => {
                return (
                  <Grid
                    className={classes.formRow}
                    container
                    columnSpacing={2.5}
                    key={colIndex}
                  >
                    {colItem?.map((rowItem, rowItemIndex) => {
                      return (
                        <Grid
                          key={`${colIndex}${rowItemIndex}`}
                          item
                          xs={rowItem?.cols}
                          height={"100%"}
                        >
                          {renderItem(rowItem, rowItemIndex)}
                        </Grid>
                      );
                    })}
                  </Grid>
                );
              })}
          </div>
        </form>
      </div>
    );
  },
);
const BaseFormDynamicSteps = React.memo(BaseFormDynamicStepsComponent);
export { BaseFormDynamicSteps };
