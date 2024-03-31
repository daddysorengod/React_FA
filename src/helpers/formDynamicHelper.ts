import { DynamicObject, IField, TextFieldType } from "../types/field";
import { useEffect } from "react";
import { toLowerCaseFirstChar } from "./onChangeHelper";
import { formatNumberStringToNumber } from "./formatMoney";
import { dispatch } from "../store";
import {
  getFormDataReducer,
  getGeneralData,
  setDetailContractUpdateSeparateKey,
} from "../store/reducers/general";

export const getFieldGrid = (listField: IField[]) => {
  try {
    return listField?.reduce((rows, el) => {
      if (el?.rows) {
        rows[el?.rows] = rows[el?.rows] || [];
        rows[el?.rows].push(el);
      }
      return rows;
    }, {});
  } catch (err) {
    // console.log(err);
    return [];
  }
};

export const mapFieldTypeToInitialValue = (listField: IField[]) => {
  try {
    listField?.reduce((initialValue, field) => {
      if (field.name) {
        switch (field?.fieldType) {
          case TextFieldType.selectOption: {
            if (
              field?.customAttrs?.overriding &&
              field?.customAttrs?.overriding == TextFieldType.checkbox
            ) {
              initialValue[field.name] = false;
              break;
            }
            initialValue[field.name] = null;
            break;
          }
          default: {
            initialValue[field.name] = field.value ?? null;
            break;
          }
        }
      }
      return initialValue;
    }, {});
    return listField;
  } catch (err) {
    // console.log(err);
    return {};
  }
};
interface IUseMapValue {
  currentRecord: DynamicObject;
  setInitialValues: React.SetStateAction<any>;
  listField?: IField[];
  option?: {
    fundId?: string;
    fetchByFundId?: boolean;
    fetchUrl?: string;
  };
  isRefresh?: boolean;
}
export const useMapValueToForm = ({
  currentRecord,
  setInitialValues,
  listField,
  option,
  isRefresh,
}: IUseMapValue) => {
  useEffect(() => {
    try {
      if (typeof isRefresh !== "undefined" && !isRefresh) {
        return;
      }
      const mapDataToForm = async () => {
        const globalData = await dispatch(getGeneralData());
        if (!option?.fetchByFundId) {
          if (
            currentRecord &&
            Object.keys(currentRecord).length > 0 &&
            listField
          ) {
            const updateFormData = getUpdateFormData(listField, currentRecord);

            setInitialValues(
              getMapData(updateFormData, currentRecord, globalData),
            );
          } else {
            setInitialValues({});
          }
        } else {
          if (!option?.fundId || !option?.fetchUrl) {
            return;
          }
          const recordData = await dispatch(
            getFormDataReducer({
              id: option?.fundId,
              url: option?.fetchUrl ?? "",
              key: "fundId",
            }),
          );
          if (recordData && Object.keys(recordData).length > 0 && listField) {
            const updateFormData = getUpdateFormData(listField, recordData);
            setInitialValues(
              getMapData(updateFormData, recordData, globalData),
            );
          }
        }
      };
      mapDataToForm();
    } catch (err) { }
  }, [
    currentRecord,
    listField,
    setInitialValues,
    option?.fetchByFundId ? option?.fundId : null,
    isRefresh,
  ]);
};

const getUpdateFormData = (
  listField: IField[],
  currentRecord: DynamicObject,
) => {
  return listField.map(item => {
    const { name, customAttrs,value } = item;
    if (!name) {
      return;
    }
    if (customAttrs?.preventFetch) {
      return {
        ...item,
        value: null,
      };
    }
    if (
      typeof currentRecord[name] === "number" &&
      customAttrs?.useAccounting === "ACTIVE" &&
      customAttrs?.accountingStorageKey
    ) {
      dispatch(
        setDetailContractUpdateSeparateKey({
          key: customAttrs?.accountingStorageKey,
          value: currentRecord[name],
        }),
      );
    }
    if (currentRecord[name]) {
      return {
        ...item,
        value: currentRecord[name] !== null ? currentRecord[name] : value || null,
      };
    } else if (currentRecord[`${toLowerCaseFirstChar(name)}`]) {
      return {
        ...item,
        value:
          currentRecord[`${toLowerCaseFirstChar(name)}`] !== null
            ? currentRecord[`${toLowerCaseFirstChar(name)}`]
            : value || null,
      };
    } else {
      return {
        ...item,
        value: currentRecord[name] !== null ? currentRecord[name] : value || null,
      };
    }
  });
};

const getMapData = (
  updateFormData: any,
  currentRecord: DynamicObject,
  globalData: any,
) => {
  return updateFormData?.reduce((obj, field) => {
    if (field && field.fieldType && field.name) {
      if (field?.customAttrs?.autoFillFromGeneral) {
        const value = getGlobalKeyData(
          globalData,
          field?.customAttrs?.autoFillFromGeneral,
        );
        switch (field.fieldType) {
          case TextFieldType.textBox: {
            obj[field.name] = value ? value : "";
            break;
          }
          case TextFieldType.numberFloat: {
            obj[field.name] = value ? value : "0";
            break;
          }
          case TextFieldType.numberInt: {
            obj[field.name] = value ? value : "0";
            break;
          }
          case TextFieldType.datePicker: {
            obj[field.name] = value ? value : null;
            break;
          }

          default: {
            break;
          }
        }
      } else {
        if (field?.customAttrs?.preventFetch) {
          obj[field.name] = null;
        } else {
          switch (field.fieldType) {
            case TextFieldType.checkbox: {
              obj[field.name] = field.value ? field.value : false;
              break;
            }
            case TextFieldType.datePicker: {
              obj[field.name] = field.value ? field.value : null;
              break;
            }
            case TextFieldType.selectOption: {
              if (field.customAttrs?.overriding === TextFieldType.checkbox) {
                obj[field.name] = field.value ? field.value : false;
                break;
              }
              obj[field.name] = field.value ? field.value : null;
              break;
            }
            case TextFieldType.numberInt: {
              obj[field.name] = field.value ? field.value : "0";
              break;
            }
            case TextFieldType.numberFloat: {
              obj[field.name] = field.value ? field.value : "0";
              break;
            }
            case TextFieldType.fileUpload: {
              obj[field.name] =
                field?.customAttrs && field?.customAttrs?.fileUrl
                  ? currentRecord[field?.customAttrs?.fileUrl]
                  : "0";
              break;
            }
            case TextFieldType.submitValueHiddenView: {
              obj[field.name] = field.value ? field.value : null;
              break;
            }
            case TextFieldType.none: {
              // obj[field.name] = field.value ? field.value : null; /// warning
              break;
            }
            case TextFieldType.label: {
              break;
            }
            case TextFieldType.editableTable: {
              break;
            }
            case TextFieldType.customLabel: {
              obj[field.name] = field.value ? field.value : null;
              break;
            }
            case TextFieldType.customForm: {
              break;
            }
            case TextFieldType.detailStockTable: {
              break;
            }
            case TextFieldType.detailsOfJournalEntries: {
              break;
            }
            default: {
              obj[field.name] = field.value ? field.value : null;
              break;
            }
          }
          if (
            typeof field.value === "number" &&
            field?.customAttrs?.useAccounting === "ACTIVE" &&
            field?.customAttrs?.accountingStorageKey
          ) {
            dispatch(
              setDetailContractUpdateSeparateKey({
                key: field?.customAttrs?.accountingStorageKey,
                value: formatNumberStringToNumber(field.value),
              }),
            );
          }
        }
      }
    }
    return obj;
  }, {});
};

export const formatFormValues = (
  initialValues: DynamicObject,
  formSet?: IField[],
) => {
  const updatedValues = formSet?.reduce((obj, item) => {
    if (item.name && !item.validateAttribute?.isReadOnly) {
      switch (item?.fieldType) {
        case TextFieldType.numberFloat: {
          obj[item.name] = formatNumberStringToNumber(initialValues[item.name]);
          break
        }
        case TextFieldType.numberInt: {
          obj[item.name] = formatNumberStringToNumber(initialValues[item.name]);
          break
        }
        case TextFieldType.textBox: {
          if (initialValues[item.name] && typeof initialValues[item.name] === 'string') {
            obj[item.name] = initialValues[item.name].trim();
          } else {
            obj[item.name] = null;
          }
          break;
        }
        case TextFieldType.submitValueFloatHiddenView: {
          obj[item.name] = formatNumberStringToNumber(initialValues[item.name]);
          break
        }
        case TextFieldType.submitValueIntegerHiddenView: {
          obj[item.name] = formatNumberStringToNumber(initialValues[item.name]);
          break
        }
        case TextFieldType.detailsOfJournalEntries: {

          break
        }
        case TextFieldType.detailsOfJournalEntryTable: {

          break
        }
        case TextFieldType.detailsOfJournalEntryTableFixed: {

          break
        }
        case TextFieldType.detailStockTable: {

          break
        }
        case TextFieldType.editableTable: {

          break
        }
        case TextFieldType.customForm: {

          break
        }
        default: {
          obj[item.name] = initialValues[item.name];
          break
        }

      }
    }
    return obj;
  }, {});

  return updatedValues;
};

const getGlobalKeyData = (generalData: any, keyString: string) => {
  try {
    const key = keyString.split("/");
    if (key.length !== 2) {
      return;
    }
    const storeObj = generalData[`${key[0]}`][`${key[1]}`];
    if (!storeObj) {
      return;
    }
    const fillValue = storeObj ? storeObj : "";
    return fillValue;
  } catch (err) {
    // console.log("autoFillValue global field", err);
  }
};

export const getDependCalculate = (
  initialValue: DynamicObject,
  dependString: string,
) => {
  try {
    let dependVal = {};
    if (!dependString || typeof dependString !== "string") {
      return {};
    }
    if (
      typeof initialValue !== "object" &&
      Object.keys(initialValue).length < 1
    ) {
      return {};
    }
    const dependKeys = dependString.split("&");
    if (dependKeys.length < 1) {
      return {};
    }
    dependKeys.forEach(item => {
      if (item && typeof item === "string") {
        if (initialValue[`${item}`]) {
          dependVal[item] = formatNumberStringToNumber(initialValue[`${item}`]);
        } else {
          dependVal[item] = 0;
        }
      }
    });
    return dependVal;
  } catch (error) {
    return {};
  }
};
