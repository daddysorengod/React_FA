import { IFormType } from "../types/general";

export const inputDisable = (type: IFormType) => {
  const listTypeDisable = ["show"];
  if (listTypeDisable.includes(type)) {
    return true;
  }
  return false;
};
