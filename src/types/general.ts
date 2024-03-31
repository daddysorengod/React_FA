import { DynamicObject, IForm, IFormSettingSubmitStep } from "./field";
export type IFormType =
  | "show"
  | "update"
  | "inactive"
  | "active"
  | "delete"
  | "create";
export type GeneralProps = {
  currentFormSetting: IForm[];
  currentFormData: IForm;
  currentIdRecord: string;
  listForms: IForm[];
  autoFill: DynamicObject | {};
  globalFundId: string;
  globalRecentNavDate: string;
  globalFundData: any | {};
  systemSetting: any | {};
  detailContract: any | {};
};

export interface IRouteConfig {
  fetchDataUrl: string;
  fetchByIdUrl: string;
  fetchByManyIdUrl: string;
  insertUpdateUrl: string;
  insertUpdateManyUrl: string;
  deleteUrl: string;
  deleteManyUrl: string;
  activeDeActiveUrl: string;
}
