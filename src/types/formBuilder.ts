import { IForm, IFormTypes, IValidate, IField } from "./field";
export interface ICommonComboboxes {
  name: string;
  value: string;
}

export interface IFormBuilderConfig {
  FORM_TYPE?: ICommonComboboxes[];
  FIELD_TYPE?: ICommonComboboxes[];
}

export type FormBuilderProps = {
  formBuilderConfig: IFormBuilderConfig;
  currentFormData: IForm;
  currentField: IField;
  currentFieldIndex: number;
  listForms: IForm[];
  currentFieldType: null | IFormTypes;
};
