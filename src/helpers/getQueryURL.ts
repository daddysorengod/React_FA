import {
  AutoCompleteType,
  DependencyType,
  DynamicObject,
  ElementOverriding,
  IDependencyType,
  IDropDown,
  IField,
} from "../types/field";

export const getQueryURL = (
  rootURL: string,
  params: any,
  fixedParams?: string,
) => {
  const esc = encodeURIComponent;
  for (var propName in params) {
    if (params[propName] === null || params[propName] === undefined) {
      delete params[propName];
    }
  }
  const query = Object.keys(params)
    .map(
      k =>
        esc(k) +
        "=" +
        params[k].toString().replace(/%5B/g, "[").replace(/%5D/g, "]"),
    )
    .join("&");
  return `${rootURL}${rootURL.includes("?") ? "&" : "?"}${query}${
    fixedParams ? fixedParams : ""
  }`;
};

export const formatListObjToOptions = (
  res: DynamicObject[],
  customOption: { fieldValue: string; fieldLabel: string },
  customLabel?: string,
) => {
  try {
    if (!res || !Array.isArray(res)) {
      return [];
    }
    if (customOption?.fieldLabel && customOption?.fieldValue) {
      const { fieldLabel, fieldValue } = customOption;
      if (customLabel) {
        const listKeyCustom = customLabel.split("&");
        const customsOption = res.map((item: DynamicObject) => {
          const customText = listKeyCustom
            ?.map(key =>
              item[key]
                ? typeof item[key] === "object"
                  ? item[key]?.name
                  : item[key]
                : "",
            )
            .filter(avail => avail)
            .join(" - ");
          return {
            text: customText,
            value:
              typeof item[fieldValue] === "object"
                ? item[fieldValue]?.value
                : item[fieldValue],
            ...item,
          };
        });
        return customsOption;
      }
      const customsOption = res.map((item: DynamicObject) => {
        return {
          text:
            typeof item[fieldLabel] === "object"
              ? item[fieldLabel]?.name
              : item[fieldLabel],
          value:
            typeof item[fieldValue] === "object"
              ? item[fieldValue]?.value
              : item[fieldValue],
          ...item,
        };
      });
      return customsOption;
    }
    const customsOption = res.map((item: DynamicObject) => {
      return {
        text: item?.vnCdContent ?? null,
        value: item?.cdVal ?? null,
        ...item,
      };
    });
    return customsOption;
    // return res;
  } catch (err) {
    return [];
  }
};

export const compareObjectsNotNull = (
  prevObj: DynamicObject,
  newObj: DynamicObject,
) => {
  try {
    if (prevObj !== null && Object.keys(prevObj).length < 1) {
      return false;
    }
    const keys = Object.keys(prevObj);

    for (let key of keys) {
      if (!newObj[key] || prevObj[key] !== newObj[key]) {
        return false;
      }
    }

    return true;
  } catch (err) {
    return false;
  }
};

export const getObjChild = (initObj, dependObj) => {
  try {
    const childObj = Object.keys(dependObj).reduce((acc, key) => {
      if (initObj[dependObj[key]] !== undefined) {
        acc[dependObj[key]] = initObj[dependObj[key]];
      }
      return acc;
    }, {});
    return childObj;
  } catch {
    return {};
  }
};

export const getDependenciesStore = (storeData, dependObj, formCode) => {
  try {
    const childObj = Object.keys(dependObj).reduce((acc, key) => {
      if (storeData[dependObj[key]] !== undefined) {
        const storeObj = storeData[`${formCode}_${dependObj[1]}`];
        const fillValue = storeObj[`${dependObj[2]}`]
          ? storeObj[`${dependObj[2]}`]
          : null;
        acc[dependObj[key]] = storeData[dependObj[key]];
      }
      return acc;
    }, {});
    return childObj;
  } catch {
    return {};
  }
};

export const isObjectValuesNotEmpty = (obj?: DynamicObject) => {
  if (obj && Object.values(obj).every(value => value !== "")) {
    return obj;
  }
  return {};
};

export const getTypeAutoComplete = (dropDownItem: IField) => {
  const { isHidden, validateAttribute, selectOption, customAttrs } =
    dropDownItem;
  if (
    customAttrs?.overriding &&
    customAttrs?.overriding === ElementOverriding.IsCheckBox
  ) {
    return AutoCompleteType.DropDownYesNo;
  } else if (selectOption?.sourceDataApi && !customAttrs?.dependencies) {
    return AutoCompleteType.DropDownPreFetch;
  } else if (
    selectOption?.sourceDataApi &&
    customAttrs &&
    customAttrs?.dependencies
  ) {
    return AutoCompleteType.DropDownFetchByForm;
  } else {
    return AutoCompleteType.Null;
  }
};

export const getMapKeyToDependKey = (customAttrs?: DynamicObject | null) => {
  if (
    customAttrs &&
    customAttrs?.dependencies &&
    typeof customAttrs?.dependencies === "string"
  ) {
    let count = 0;
    const listDepend = customAttrs?.dependencies
      .split("&")
      .reduce((dependObj, dependStr: string) => {
        let newDependVal = dependStr.split("*");

        if (newDependVal && newDependVal?.length == 2) {
          dependObj[newDependVal[0]] = newDependVal[1];
        } else if (newDependVal && newDependVal?.length == 3) {
          dependObj[`searchTerms[${count}].fieldValue`] = newDependVal[1];
          count++;
        } else if (newDependVal && newDependVal?.length == 4) {
          dependObj[newDependVal[0]] = newDependVal[1];
        }
        return dependObj;
      }, {});
    return listDepend;
  } else {
    return {};
  }
};

export const getDependencyType = (
  customAttrs?: DynamicObject | null,
  parentId?: DynamicObject | null,
) => {
  const parentKeyName =
    parentId && Object.keys(parentId).length ? Object.keys(parentId)[0] : null;
  if (
    customAttrs &&
    customAttrs?.dependencies &&
    typeof customAttrs?.dependencies === "string"
  ) {
    let dependencyTypes: IDependencyType = {};
    const listDependTypes = customAttrs?.dependencies
      .split("&")
      .forEach(dependStr => {
        let newDependVal = dependStr.split("*");
        if (!dependencyTypes?.paging) {
          let query = newDependVal[0]?.split("=");
          if (query[0] && query[0] === "pageIndex") {
            dependencyTypes = {
              ...dependencyTypes,
              paging: DependencyType.paging,
            };
          }
        }
        if (!dependencyTypes?.needParentID && parentKeyName) {
          if (
            newDependVal &&
            newDependVal.length > 1 &&
            newDependVal[1] === parentKeyName
          ) {
            dependencyTypes = {
              ...dependencyTypes,
              needParentID: DependencyType.needParentID,
            };
          }
        }
        if (!dependencyTypes?.needCurrentState) {
          if (
            newDependVal &&
            (newDependVal.length == 3 || newDependVal.length == 2)
          ) {
            dependencyTypes = {
              ...dependencyTypes,
              needCurrentState: DependencyType.needCurrentState,
            };
          }
        }
        if (!dependencyTypes?.needStorage) {
          if (newDependVal && newDependVal.length == 4) {
            dependencyTypes = {
              ...dependencyTypes,
              needStorage: DependencyType.needStorage,
            };
          }
        }
      });
    return dependencyTypes;
  } else {
    return {};
  }
};

export const isEmptyObject = obj => {
  if (typeof obj !== "object" || Object.keys(obj).length === 0) {
    return true;
  }

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
        return true;
      }
    }
  }

  return false;
};

export const getSearchTermInArray = (searchArr: string[] | undefined) => {
  try {
    if (
      !Array.isArray(searchArr) ||
      searchArr.length < 1 ||
      typeof searchArr === undefined
    ) {
      return "";
    }
    const jsonString = JSON.stringify(searchArr);
    const encodedString = encodeURIComponent(jsonString);

    const finalString = encodedString.replace("%5B", "[").replace("%5D", "]");
    return finalString;
  } catch (error) {
    console.log("getSearchTermInArray ==> err:", error);
    return "";
  }
};

export const getEncodeFormCode = (code?: string) => {
  if (!code) return "_";
  // const esc = encodeURIComponent;
  // return esc(code)
  return code.replaceAll("/", "_");
};

export const getCustomQuery = ({
  customAttrs,
  formValues,
  storageAutoFill,
  formCode,
}) => {
  const dependStr = customAttrs?.dependencies;
  const mapKeyToDepend = getMapKeyToDependKey(customAttrs);
  try {
    let fixedParams = {};
    let count = 0;
    const expandParams = dependStr.split("&").reduce((newParams, dependStr) => {
      let dependVal = dependStr.split("*");
      if (dependVal && dependVal?.length == 2) {
        newParams[dependVal[0]] = formValues[mapKeyToDepend[dependVal[0]]];
      } else if (dependVal && dependVal?.length == 3) {
        newParams[`searchTerms[${count}].fieldName`] = dependVal[0];
        newParams[`searchTerms[${count}].fieldValue`] =
          formValues[dependVal[1]] || null;
        newParams[`searchTerms[${count}].condition`] = dependVal[2];
        count++;
      } else if (dependVal && dependVal?.length == 4) {
        const storeObj = storageAutoFill[`${formCode}_${dependVal[1]}`];
        const fillValue = storeObj[`${dependVal[2]}`]
          ? storeObj[`${dependVal[2]}`]
          : null;
        newParams[dependVal[0]] = fillValue;
      } else {
        const newFixedParams = dependVal[0].split("=");
        if (newFixedParams.length !== 2) {
          return;
        }
        fixedParams = {
          ...fixedParams,
          [newFixedParams[0]]: newFixedParams[1],
        };
      }
      return newParams;
    }, {});
    return { fixedParams: fixedParams, expandParams: expandParams };
  } catch {
    return { fixedParams: {}, expandParams: {} };
  }
};
