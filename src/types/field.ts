export interface IValidate {
  isRequired: boolean;
  mask?: string;
  isReadOnly: boolean;
  isDisabled?: boolean;
  minLength?: number;
  maxLength?: number;
  equalTo?: string;
  regexPattern?: string;
  fileExtensions?: string[] | null | string;
  min?: number;
  max?: number;
}

export interface ISelectOption {
  firstOptionLabel?: string | null;
  allowMultiple?: boolean;
  sourceDataApi?: string | null;
  fieldValue?: string | null;
  fieldLabel?: string | null;
}

export interface DynamicObject {
  [key: string]: any;
}
export interface IField {
  isHidden?: boolean;
  name?: string;
  label?: string;
  placeholder?: string;
  fieldType?: IFormTypes;
  cols?: number;
  rows?: number;
  validateAttribute?: IValidate;
  value?: string | boolean | number;
  fontIcon?: string;
  order?: number;
  selectOption?: ISelectOption;
  customAttrs?: DynamicObject | null;
}

export type IFormTypes =
  | TextFieldType.textBox
  | TextFieldType.password
  | TextFieldType.emailAddress
  | TextFieldType.multiTextBox
  | TextFieldType.richText
  | TextFieldType.fileUpload
  | TextFieldType.datePicker
  | TextFieldType.dateTimePicker
  | TextFieldType.dateRangePicker
  | TextFieldType.selectOption
  | TextFieldType.hyperLink
  | TextFieldType.checkbox
  | TextFieldType.numberInt
  | TextFieldType.numberFloat
  | TextFieldType.label
  | TextFieldType.radio
  | TextFieldType.radioMultipleSelect
  | TextFieldType.none
  | TextFieldType.detailsOfJournalEntries
  | TextFieldType.detailsOfJournalEntryTable
  | TextFieldType.detailsOfJournalEntryTableFixed
  | TextFieldType.detailStockTable
  | TextFieldType.editableTable
  | TextFieldType.customForm
  | TextFieldType.customLabel
  | TextFieldType.searchButton
  | TextFieldType.groupButton
  | TextFieldType.submitValueHiddenView
  | TextFieldType.numberPercent
  | TextFieldType.submitValueIntegerHiddenView
  | TextFieldType.submitValueFloatHiddenView
  ;

export enum TextFieldType {
  textBox = "TEXT_BOX",
  password = "PASSWORD",
  emailAddress = "EMAIL_ADDRESS",
  multiTextBox = "MULTIPLE_TEXT",
  richText = "RICH_TEXT",
  fileUpload = "FILE_UPLOAD",
  datePicker = "DATE_PICKER",
  dateTimePicker = "DATE_TIME_PICKER",
  dateRangePicker = "DATE_RANGE_PICKER",
  selectOption = "SELECT_OPTION",
  hyperLink = "HYPER_LINK",
  checkbox = "CHECKBOX",
  numberInt = "NUMBER_ONLY",
  numberFloat = "FLOAT_POINT_NUMBER",
  label = "LABEL",
  radio = "RADIO",
  radioMultipleSelect = "RADIO2",
  none = "",
  detailsOfJournalEntries = "DETAIL_OF_JOURNAL_ENTRIES",
  detailsOfJournalEntryTable = "DETAIL_OF_JOURNAL_ENTRIES_TABLE",
  detailsOfJournalEntryTableFixed ="DETAIL_OF_JOURNAL_ENTRIES_TABLE_FIXED",
  detailStockTable = "DETAIL_STOCK_TABLE",
  editableTable = "EDITABLE_TABLE",
  customLabel = "CUSTOM_LABEL",
  customForm = "CUSTOM_FORM",
  numberPercent = "PERCENT_NUMBER",
  searchButton = "SEARCH_BTT",
  groupButton = "GROUP_BTT",
  submitValueHiddenView = "SUBMIT_VALUE_HIDDEN_VIEW",
  submitValueIntegerHiddenView = "SUBMIT_VALUE_INT_HIDDEN_VIEW",
  submitValueFloatHiddenView = "SUBMIT_VALUE_FLOAT_HIDDEN_VIEW",
}

export type IFromScreen =
  | "SUBMIT_IFRAME"
  | "SUBMIT_IFRAME_LARGE"
  | "SUBMIT_IFRAME_XLARGE"
  | "GRID_FORM"
  | null;
export interface IForm {
  addNewFormName?: string;
  updateFormName?: string;
  stepFormName?: string;
  code?: string;
  description?: string;
  feRoute?: string;
  formType?: IFromScreen;
  baseApiRoute?: string;
  route?: {
    fetchDataUrl?: string;
    fetchByIdUrl?: string;
    fetchByManyIdUrl?: string;
    insertUpdateUrl?: string;
    insertUpdateManyUrl?: string;
    deleteUrl?: string;
    deleteManyUrl?: string;
    activeDeActiveUrl?: string;
  };
  fields?: IField[];
  enabled?: boolean;
  id?: string | null;
  customAttrs?: DynamicObject | null | ICustomAttrs;
}

export class FieldForm implements IField {
  constructor() {
    //   isRequired: boolean; // public validateAttribute: { // public rows: number, // public cols: number, // public fieldType: string, // public placeholder: string, // public label: string, // public name: string, // public isHidden: boolean,
    (this.isHidden = false),
      (this.name = ""),
      (this.label = ""),
      (this.placeholder = ""),
      (this.fieldType = TextFieldType.none),
      (this.cols = 12),
      (this.rows = 1),
      (this.validateAttribute = {
        isRequired: false,
        mask: "",
        isReadOnly: false,
        isDisabled: false,
        minLength: 0,
        maxLength: 255,
        equalTo: "",
        regexPattern: "",
        fileExtensions: [],
      }),
      (this.value = ""),
      (this.fontIcon = ""),
      (this.order = 1),
      ((this.selectOption = {
        firstOptionLabel: "",
        allowMultiple: false,
        sourceDataApi: "",
        fieldValue: "",
        fieldLabel: "",
      }),
      (this.customAttrs = null));
  }
  isHidden: boolean;
  name: string;
  label: string;
  placeholder: string;
  fieldType: IFormTypes;
  cols: number;
  rows: number;
  validateAttribute: {
    isRequired: boolean;
    mask: string;
    isReadOnly: boolean;
    isDisabled: boolean;
    minLength: number;
    maxLength: number;
    equalTo: string;
    regexPattern: string;
    fileExtensions: string[];
  };
  value: string;
  fontIcon: string;
  order: number;
  selectOption: {
    firstOptionLabel: string;
    allowMultiple: boolean;
    sourceDataApi: string;
    fieldValue: string;
    fieldLabel: string;
  };
  customAttrs: DynamicObject | null | ICustomAttrs;
}

export class FormBuilder implements IForm {
  constructor() {
    (this.addNewFormName = ""),
      (this.updateFormName = ""),
      (this.stepFormName = ""),
      (this.code = ""),
      (this.description = ""),
      (this.feRoute = ""),
      (this.formType = "SUBMIT_IFRAME"),
      (this.baseApiRoute = ""),
      (this.route = {
        fetchDataUrl: "find",
        fetchByIdUrl: "find-by-id",
        fetchByManyIdUrl: "find-by-ids",
        insertUpdateUrl: "add-or-update-record",
        insertUpdateManyUrl: "add-or-update-many-records",
        deleteUrl: "delete",
        deleteManyUrl: "delete-many",
        activeDeActiveUrl: "active-or-deactivate-record",
      }),
      (this.fields = []),
      (this.enabled = false),
      (this.id = null);
  }
  addNewFormName?: string;
  updateFormName?: string;
  stepFormName?: string;
  code?: string;
  description?: string;
  feRoute?: string;
  formType?: IFromScreen;
  baseApiRoute?: string;
  route?: {
    fetchDataUrl?: string;
    fetchByIdUrl?: string;
    fetchByManyIdUrl?: string;
    insertUpdateUrl?: string;
    insertUpdateManyUrl?: string;
    deleteUrl?: string;
    deleteManyUrl?: string;
    activeDeActiveUrl?: string;
  };
  fields?: IField[];
  enabled?: boolean;
  id?: null;
  customAttrs?: DynamicObject | null | ICustomAttrs;
}
export interface IFieldValue {
  [key: string]: string | boolean | number | DynamicObject[];
}

export interface IFormCode {
  code: string;
  submit: string;
  formValue: IFieldValue[];
  currentStep: number;
  formCode: IFormCode[];
  stepValue: IFieldValue;
}
export interface IFormSettingSubmitStep {
  ITypeSubmit: "SINGLE" | "ALL" | "";
  formValue: IFieldValue[];
  submit: string;
  formCode: IFormCode[];
  currentStep: number;
  numberOfSteps: number;
  stepValue: IFieldValue;
}
export class FormSettingSubmitStep implements IFormSettingSubmitStep {
  constructor(numberOfSteps: number) {
    (this.numberOfSteps = numberOfSteps ?? 0),
      (this.ITypeSubmit = ""),
      (this.submit = ""),
      (this.currentStep = 0),
      (this.formValue = []),
      (this.formCode = []);
    this.stepValue = {};
  }
  numberOfSteps: number;
  ITypeSubmit: "" | "SINGLE" | "ALL";
  submit: string;
  formValue: IFieldValue[];
  currentStep: number;
  formCode: IFormCode[];
  stepValue: IFieldValue;
}
export type IDropDown =
  | AutoCompleteType.DropDownYesNo
  | AutoCompleteType.DropDownPreFetch
  | AutoCompleteType.DropDownFetchByForm
  | AutoCompleteType.Null;

export enum AutoCompleteType {
  DropDownYesNo = "DropDownYesNo",
  DropDownPreFetch = "DropDownPreFetch",
  DropDownFetchByForm = "DropDownFetchByForm",
  DropDownFetchByStore = "DropDownFetchByStore",
  Null = "",
}

export interface ICustomAttrs {
  overriding?: IOverriding;
  dependencies?: String;
  allowFill?: boolean;
  type?: String;
  customWidth?: string;
  customHeight?: string;
}

export type IOverriding = ElementOverriding.IsCheckBox;

export enum ElementOverriding {
  IsCheckBox = "CHECKBOX",
}
export enum DependencyType {
  needParentID = "NeedParentID",
  needCurrentState = "NeedCurrentState",
  needStorage = "NeedStorage",
  paging = "Paging",
}

export interface IDependencyType {
  needParentID?: DependencyType.needParentID;
  needCurrentState?: DependencyType.needCurrentState;
  needStorage?: DependencyType.needStorage;
  paging?: DependencyType.paging;
}
