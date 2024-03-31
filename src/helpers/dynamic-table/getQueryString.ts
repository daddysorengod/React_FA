import {
  CO_FILTER_TYPE,
  EXPORT_EXCEL_TYPE,
  PARAM_TYPE,
  SEARCH_CONDITIONS,
} from "@/src/constants/generic-table";
import {
  COLUMN_OPTIONS_INTERFACE,
  SEARCH_TERMS_INTERFACE,
  PARAM_INTERFACE,
  FETCH_DATA_API_CONFIG_INTERFACE,
} from "@/src/types/generic-table";
import {
  MRT_PaginationState,
  MRT_RowSelectionState,
  MRT_SortingState,
} from "material-react-table";

export interface SearchParams {
  fieldName: string;
  fieldValue: string;
  condition: string;
}

export const getFetchDataConfig = (
  fetchDataURL?: string,
  filterParams?: any,
  listColumn?: COLUMN_OPTIONS_INTERFACE[],
  parentIdSearchTerm?: SEARCH_TERMS_INTERFACE,
  fetchDataURLSearchTemrs?: SEARCH_TERMS_INTERFACE[],
  fetchDataURLParams?: PARAM_INTERFACE[],
  rowSelection?: MRT_RowSelectionState,
  typeExport?: EXPORT_EXCEL_TYPE,
  exportedColumns?: string[],
  defaultSorting?: {
    fieldOrderBy: string;
    isDescending: boolean;
  },
  sorting?: MRT_SortingState,
  pagination?: MRT_PaginationState,
  globalFilter?: string,
  entryProp?: {
    [key: string]: any;
  },
  entryPropKeys?: {
    keyInEntryProp: string;
    paramType: PARAM_TYPE;
    paramKey?: string;
    condition?: SEARCH_CONDITIONS;
  }[],
): FETCH_DATA_API_CONFIG_INTERFACE => {
  let paramsArray: PARAM_INTERFACE[] = [];
  let searchTemrsArray: SEARCH_TERMS_INTERFACE[] = [];
  let exportedColumnsArray: string[] = [];

  if (entryProp) {
    (entryPropKeys || []).forEach(ele => {
      if (entryProp[ele.keyInEntryProp] !== undefined) {
        if (ele.paramType === PARAM_TYPE.PARAM) {
          paramsArray.push({
            paramKey: ele.paramKey || ele.keyInEntryProp,
            paramValue: entryProp[ele.keyInEntryProp],
          });
        } else if (ele.paramType === PARAM_TYPE.SEARCH_TERM) {
          searchTemrsArray.push({
            fieldName: ele.paramKey || ele.keyInEntryProp,
            fieldValue: entryProp[ele.keyInEntryProp],
            condition: ele.condition || SEARCH_CONDITIONS.EQUAL,
          });
        }
      }
    });
  }

  if (parentIdSearchTerm) {
    searchTemrsArray.push(parentIdSearchTerm);
  }
  if (fetchDataURLSearchTemrs) {
    searchTemrsArray = [...searchTemrsArray, ...fetchDataURLSearchTemrs];
  }
  if (typeExport === EXPORT_EXCEL_TYPE.SELECTED && rowSelection) {
    let rowSelectionArray = Object.keys(rowSelection);
    if (rowSelectionArray) {
      const fieldValue = JSON.stringify(rowSelectionArray);
      searchTemrsArray.push({
        fieldName: "id",
        fieldValue: fieldValue,
        condition: SEARCH_CONDITIONS.IN_ARRAY,
      });
    }
  }
  if (filterParams && Object.keys(filterParams) && listColumn) {
    for (const column of listColumn) {
      switch (column.typeFilter) {
        case CO_FILTER_TYPE.MIN_MAX_NUMBER: {
          if (
            filterParams[column.key + "-min"] !== "" &&
            filterParams[column.key + "-max"] !== ""
          ) {
            searchTemrsArray.push({
              fieldName: column.key,
              fieldValue: `[${filterParams[column.key + "-min"]},${
                filterParams[column.key + "-max"]
              }]`,
              condition: SEARCH_CONDITIONS.IN_RANGE,
            });
          } else if (filterParams[column.key + "-min"] !== "") {
            searchTemrsArray.push({
              fieldName: column.key,
              fieldValue: filterParams[column.key + "-min"],
              condition: SEARCH_CONDITIONS.GREATER_THAN_OR_EQUAL,
            });
          } else if (filterParams[column.key + "-max"] !== "") {
            searchTemrsArray.push({
              fieldName: column.key,
              fieldValue: filterParams[column.key + "-max"],
              condition: SEARCH_CONDITIONS.LESS_THAN_OR_EQUAL,
            });
          }
          break;
        }
        case CO_FILTER_TYPE.MIN_MAX_DATE: {
          if (
            filterParams[column.key + "-min"] !== "" &&
            filterParams[column.key + "-max"] !== ""
          ) {
            searchTemrsArray.push({
              fieldName: column.key,
              fieldValue: `['${filterParams[column.key + "-min"]}','${
                filterParams[column.key + "-max"]
              }']`,
              condition: SEARCH_CONDITIONS.IN_RANGE,
            });
          } else if (filterParams[column.key + "-min"] !== "") {
            searchTemrsArray.push({
              fieldName: column.key,
              fieldValue: filterParams[column.key + "-min"],
              condition: SEARCH_CONDITIONS.GREATER_THAN_OR_EQUAL,
            });
          } else if (filterParams[column.key + "-max"] !== "") {
            searchTemrsArray.push({
              fieldName: column.key,
              fieldValue: filterParams[column.key + "-max"],
              condition: SEARCH_CONDITIONS.LESS_THAN_OR_EQUAL,
            });
          }
          break;
        }
        case CO_FILTER_TYPE.SELECT: {
          if (filterParams[column.relatedKey || column.key] !== "") {
            searchTemrsArray.push({
              fieldName: column.relatedKey || column.key,
              fieldValue: filterParams[column.relatedKey || column.key],
            });
          }
          break;
        }
        case CO_FILTER_TYPE.NUMBER: {
          if (
            filterParams[column.key] !== "" &&
            filterParams[column.key] !== undefined
          ) {
            searchTemrsArray.push({
              fieldName: column.key,
              fieldValue: filterParams[column.key],
              condition: SEARCH_CONDITIONS.EQUAL,
            });
          }
          break;
        }
        case CO_FILTER_TYPE.TEXT: {
          if (
            filterParams[column.key] !== "" &&
            filterParams[column.key] !== undefined
          ) {
            searchTemrsArray.push({
              fieldName: column.key,
              fieldValue: filterParams[column.key],
              condition: SEARCH_CONDITIONS.CONTAINS,
            });
          }
          break;
        }
        default: {
          break;
        }
      }
    }
  }
  if (typeExport && exportedColumns) {
    exportedColumnsArray = [...exportedColumns];
  }
  if (sorting && sorting.length) {
    paramsArray.push({
      paramKey: "fieldOrderBy",
      paramValue: sorting[0].id,
    });
    paramsArray.push({
      paramKey: "isDescending",
      paramValue: sorting[0].desc,
    });
  } else if (!!defaultSorting) {
    paramsArray.push({
      paramKey: "fieldOrderBy",
      paramValue: defaultSorting.fieldOrderBy,
    });
    paramsArray.push({
      paramKey: "isDescending",
      paramValue: defaultSorting.isDescending,
    });
  } else {
    paramsArray.push({
      paramKey: "fieldOrderBy",
      paramValue: "createdDate",
    });
    paramsArray.push({
      paramKey: "isDescending",
      paramValue: true,
    });
  }
  if (pagination) {
    paramsArray.push({
      paramKey: "pageIndex",
      paramValue: pagination.pageIndex + 1,
    });
    paramsArray.push({
      paramKey: "pageSize",
      paramValue:
        typeExport === EXPORT_EXCEL_TYPE.ALL ? "1000000" : pagination.pageSize,
    });
  }
  if (fetchDataURLParams && Array.isArray(fetchDataURLParams)) {
    paramsArray = [...paramsArray, ...fetchDataURLParams];
  }
  if (globalFilter) {
    paramsArray.push({
      paramKey: "globalTerm",
      paramValue: globalFilter,
    });
  }

  return {
    url: fetchDataURL || "",
    params: paramsArray,
    searchTerms: searchTemrsArray,
    exportedColumns: exportedColumnsArray,
  };
};
