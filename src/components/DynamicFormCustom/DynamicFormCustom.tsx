import React, {
  useState,
  useEffect,
  FormEvent,
  forwardRef,
  useImperativeHandle,
} from "react";
import "jquery"; ///
import { useStyles } from "./DynamicFormCustom.styles";
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
import { insertOrUpdateRecord } from "@/src/store/reducers/general";
import { dispatch } from "@/src/store";
import { ITabConfig } from "@/src/constants/formConfigFiles";
import {
  getFieldGrid,
  useMapValueToForm,
  formatFormValues,
} from "@/src/helpers/formDynamicHelper";
import { BaseRadioInput } from "../BaseRadioInput";
import {
  getMapKeyToDependKey,
  getDependencyType,
  getEncodeFormCode,
  getTypeAutoComplete,
} from "@/src/helpers/getQueryURL";
import { AccountingMoneyTransDetail } from "../AccountingMoneyTransDetail";
import { StockDetailTable } from "../StockDetailTable";
import { TableEditable } from "../TableEditable";
import { BaseInputSecond } from "../BaseInputSecond";
import { BaseCheckBox } from "../DynamicForm/components";

interface Props {
  // data: IForm;
  isDisableField: boolean;
  formType?: IFormType;
  formSettingSubmitStep?: ITabConfig;
  formCode?: string;
  currentRecord: IFieldValue;
  currentId?: string;
  parentId?: DynamicObject;
  formBuilderCurrentSetting?: IForm;
  formBuildMode?: boolean;
}
interface IFieldError {
  [key: string]: string;
}
interface DynamicObject {
  [key: string]: any;
}

const FormDynamicCustomComponent = forwardRef(
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
      if (dataAPI?.fields) {
        setFromGrid(getFieldGrid(dataAPI?.fields));
        // setInitialValues(mapFieldTypeToInitialValue(dataAPI?.fields)); ???
      }
    }, [dataAPI, formBuilderCurrentSetting]);

    useMapValueToForm({
      currentRecord: currentRecord,
      setInitialValues: setInitialValues,
      listField: dataAPI?.fields,
      option: {
        fundId: globalFundData?.id || "",
        fetchByFundId: formSettingSubmitStep?.children[0]?.fetchByFundId,
        fetchUrl: formSettingSubmitStep?.children[0]?.fetchUrl,
      },
    });

    const onChangeValue = (value, item: IField, formatValue: string) => {};

    const updateErrorSelectOption = (
      option: DynamicObject,
      isRequired: boolean,
    ) => {
      try {
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
            />
          );
        case TextFieldType.textBox:
          return (
            <BaseInput
              label={item?.label}
              isRequired={item?.validateAttribute?.isRequired}
              type="text"
              fieldName={item?.name ?? ""}
              initialValue={item?.name ? initialValues[item?.name] : null ?? ""}
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
              initialValue={item?.name ? initialValues[item?.name] : null ?? ""}
              isDisabled={
                isDisableField ||
                item?.validateAttribute?.isReadOnly ||
                item?.validateAttribute?.isDisabled
              }
              onChange={event => {
                onChangeValue(event, item, "");
              }}
              fieldIndex={index}
              errorField={item?.name ? formErrors[item?.name] : ""}
              fieldSet={item}
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
              initialValue={item?.name ? initialValues[item?.name] : null ?? ""}
              onChange={event => {
                onChangeValue(event, item, "");
              }}
              isDisabled={
                isDisableField ||
                item?.validateAttribute?.isReadOnly ||
                item?.validateAttribute?.isDisabled
              }
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
        case TextFieldType.emailAddress:
          return (
            <BaseInput
              label={item?.label}
              isRequired={item?.validateAttribute?.isRequired}
              type="email"
              initialValue={item?.name ? initialValues[item?.name] : null ?? ""}
              fieldName={item?.name ?? ""}
              onChange={event => {
                onChangeValue(event, item, "");
              }}
              isDisabled={
                isDisableField ||
                item?.validateAttribute?.isReadOnly ||
                item?.validateAttribute?.isDisabled
              }
              fieldIndex={index}
              errorField={item?.name ? formErrors[item?.name] : ""}
              fieldSet={item}
              formType={formType}
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
        case TextFieldType.detailStockTable: {
          return (
            <StockDetailTable
              customAttrs={item?.customAttrs ? item.customAttrs : null}
              name={item?.name ?? ""}
              formCode={getEncodeFormCode(dataAPI?.code)}
              onChange={event => {
                onChangeValue(event, item, "");
              }}
              value={item?.name ? initialValues[item?.name] : null ?? ""}
              isDisabled={
                isDisableField ||
                item?.validateAttribute?.isReadOnly ||
                item?.validateAttribute?.isDisabled
              }
            />
          );
        }
        case TextFieldType.editableTable: {
          return (
            <TableEditable
              isDisabled={
                // isDisableField ||
                // item?.validateAttribute?.isReadOnly ||
                // item?.validateAttribute?.isDisabled
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
              tableCode={
                item?.customAttrs?.tableCode ||
                "NAV-CALCULATION-PROCESS/ASSET-VALUATION-PROCESS/SUMMARY-OF-PRICE-POLICY"
              }
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
              isDisabled={
                // isDisableField ||
                // item?.validateAttribute?.isReadOnly ||
                // item?.validateAttribute?.isDisabled
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
            />
          );
        }
        default:
          break;
      }
    };

    useImperativeHandle(ref, () => ({}));

    return (
      <div style={{ borderRadius: 8, marginTop: "-5px" }}>
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
                      >
                        {renderItem(rowItem, rowItemIndex)}
                      </Grid>
                    );
                  })}
                </Grid>
              );
            })}
        </div>
      </div>
    );
  },
);
const FormDynamicCustom = React.memo(FormDynamicCustomComponent);
export { FormDynamicCustom };
