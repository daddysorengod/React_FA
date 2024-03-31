import { IField } from "../types/field";

export const getValueWithType = (variable: string, value: string | number) => {
  const type = typeof variable;
  switch (type) {
    case "string":
      return value.toString();
    case "number":
      return Number(value);
    case "boolean":
      return value;
    default:
      return value;
  }
};

export const getValueTypeFromForm = (variable: IField, value: string) => {
  // const type = typeof variable;
  switch (variable.fieldType) {
    case "TEXT_BOX":
      return value?.toString();
    case "CHECKBOX":
      return JSON.parse(value);
    case "NUMBER_ONLY":
      return JSON.parse(value ?? "");
    default:
      return value?.toString();
  }
};

export const toLowerCaseFirstChar = (value?: String) => {
  return value ? value.charAt(0).toLocaleLowerCase() + value.slice(1) : "";
};

export const toUpperCaseFirstChar = (value?: String) => {
  return value ? value.charAt(0).toLocaleUpperCase() + value.slice(1) : "";
};
