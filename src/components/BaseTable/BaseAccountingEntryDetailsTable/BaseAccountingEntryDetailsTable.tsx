import React, {
  useState,
  useEffect,
  memo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useStyles } from "./BaseAccountingEntryDetailsTable.styles";
import useTranslation from "next-translate/useTranslation";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  COLUMN_OPTIONS_INTERFACE,
  FETCH_DATA_API_CONFIG_INTERFACE,
  PARAM_INTERFACE,
  SEARCH_TERMS_INTERFACE,
  TABLE_OPTIONS_INTERFACE,
  TABLE_SELECT_OPTIONS,
} from "@/src/types";
import { CO_ALIGN, CO_EDIT_TYPE, CO_TYPE } from "@/src/constants";
import {
  formatDate,
  formatNumberStringToNumber,
  formatNumberValueToString,
  formatOnChangeNumberValueToString,
  formatValueNameObject,
  getListDataBase,
  getValidateInfo,
} from "@/src/helpers";
import { BaseTextField } from "../../BaseTextField";
import { dispatch } from "@/src/store";
import { getTableSelectOptions } from "@/src/store/reducers/tableSelectOptions";
import { BaseAutocomplete } from "../../BaseAutocomplete";
interface Props {
  currentId?: string;
  tableOptions: TABLE_OPTIONS_INTERFACE;
  onlyShow: boolean;
  configGetData: {
    url: string;
    params?: PARAM_INTERFACE[];
    searchTerms?: SEARCH_TERMS_INTERFACE[];
    idName?: string;
  };
  customDetailEntryStyle?: string;
}

const BaseAccountingEntryDetailsTableComponent = forwardRef(
  (props: Props, ref): JSX.Element => {
    const { t } = useTranslation();
    const classes = useStyles();

    const {
      currentId,
      tableOptions,
      onlyShow,
      configGetData,
      customDetailEntryStyle,
    } = props;

    const [dataTable, setDataTable] = useState<any[]>([]);
    const [sumData, setSumData] = useState<{
      [key: string]: any;
    }>({});
    // Object chứa các list select của các trường
    const [selectOptionsListField, setSelectOptionsListField] = useState<{
      [key: string]: TABLE_SELECT_OPTIONS;
    }>({});
    const [validationErrors, setValidationErrors] = useState<{
      [rowIndex: number]: {
        [key: string]: string;
      };
    }>({});

    //   Function
    useImperativeHandle(ref, () => ({
      async onRefresh() {
        getData();
        return true;
      },
    }));

    const getData = async () => {
      if (!configGetData || !currentId) {
        setDataTable([]);
        return;
      }
      const config: FETCH_DATA_API_CONFIG_INTERFACE = {
        url: configGetData.url,
        params: [
          {
            paramKey: configGetData.idName || "id",
            paramValue: currentId,
          },
          ...(configGetData.params ? configGetData.params : []),
        ],
        searchTerms: [
          ...(configGetData.searchTerms ? configGetData.searchTerms : []),
        ],
      };
      const res = await getListDataBase(config);
      if (!res || !res.source) {
        return;
      }
      const newList = res.source.map(item => {
        const newFormatItem = { ...item };

        tableOptions.listColumn.forEach(columnOption => {
          if (columnOption.editType === CO_EDIT_TYPE.NUMBER) {
            newFormatItem[columnOption.key] = formatNumberValueToString(
              item?.[columnOption.key] || 0,
            );
          }
        });

        return newFormatItem;
      });
      setDataTable(newList);

      const obj: any = {};
      tableOptions.listColumn.forEach(columnOption => {
        if (!columnOption.hasSummary || columnOption.type !== CO_TYPE.NUMBER) {
          return "";
        }
        const sumReducer = (accumulator: number, currentValue: any) => {
          return (
            accumulator +
            (!currentValue?.[columnOption.key] ||
            isNaN(currentValue?.[columnOption.key]) ||
            currentValue.isNotAddedToSum
              ? 0
              : currentValue[columnOption.key])
          );
        };
        const totalSum = res.source.reduce(sumReducer, 0);
        obj[columnOption.key] = formatNumberValueToString(totalSum);
      });
      setSumData({ ...obj });
    };

    const getSelectOptionsListField = async () => {
      let res: { [key: string]: TABLE_SELECT_OPTIONS } = {};
      for (var key in tableOptions.selectOptionsListField) {
        let config: FETCH_DATA_API_CONFIG_INTERFACE = {
          url: tableOptions.selectOptionsListField[key].url,
          searchTerms: [],
        };

        // if (
        //   object[key].parentIdName &&
        //   parentId &&
        //   typeof config.searchTerms !== "undefined"
        // ) {
        //   config.searchTerms.push({
        //     fieldName: object[key].parentIdName as string,
        //     fieldValue: parentId,
        //   });
        // }

        const obj = await dispatch(
          getTableSelectOptions(
            config,
            tableOptions.selectOptionsListField[key].nameKey,
            tableOptions.selectOptionsListField[key].valueKey,
          ),
        );
        res[key] = obj;
      }
      setSelectOptionsListField(res);
    };

    const handleValidateCell = (
      value: any,
      rowIndex: number,
      columnOption: COLUMN_OPTIONS_INTERFACE,
    ) => {
      const info = getValidateInfo(
        value,
        columnOption.label,
        columnOption.validations,
      );
      let newErrors = {};
      if (info.error) {
        newErrors = {
          ...validationErrors,
          [rowIndex]: {
            ...validationErrors[rowIndex],
            [columnOption.key]: info.errorMessage,
          },
        };
      } else {
        newErrors = {
          ...validationErrors,
          [rowIndex]: {
            ...validationErrors[rowIndex],
            [columnOption.key]: "",
          },
        };
      }
      setValidationErrors(newErrors);
    };

    const handleInputChange = (
      event: React.ChangeEvent,
      rowIndex: number,
      columnOption: COLUMN_OPTIONS_INTERFACE,
    ) => {
      if (columnOption.editType === CO_EDIT_TYPE.NUMBER) {
        handleTypeNumberInputChange(event, rowIndex, columnOption);
      } else if (columnOption.editType === CO_EDIT_TYPE.TEXT) {
        handleTypeTextInputChange(event, rowIndex, columnOption);
      }
    };

    const handleTypeTextInputChange = (
      event: React.ChangeEvent,
      rowIndex: number,
      columnOption: COLUMN_OPTIONS_INTERFACE,
    ) => {
      const updatedList = [...dataTable];
      updatedList[rowIndex][columnOption.key] = (event as any).target.value;
      setDataTable([...updatedList]);

      handleValidateCell((event as any).target.value, rowIndex, columnOption);
    };

    const handleTypeNumberInputChange = (
      event: React.ChangeEvent,
      rowIndex: number,
      columnOption: COLUMN_OPTIONS_INTERFACE,
    ) => {
      const updatedList = [...dataTable];
      const formatValue = formatOnChangeNumberValueToString(
        event as any,
        dataTable[rowIndex][columnOption.key],
        false,
        false,
      );
      updatedList[rowIndex][columnOption.key] = formatValue;
      setDataTable([...updatedList]);

      handleValidateCell((event as any).target.value, rowIndex, columnOption);

      const numberValue = formatNumberStringToNumber(formatValue);
      let sum = numberValue;
      dataTable.forEach((rowData, idx) => {
        if (idx !== rowIndex) {
          sum += formatNumberStringToNumber(rowData[columnOption.key]);
        }
      });
    };

    const handleAutocompleteChange = (
      value: any,
      rowIndex: number,
      columnOption: COLUMN_OPTIONS_INTERFACE,
    ) => {
      const updatedList = [...dataTable];
      updatedList[rowIndex][columnOption.key] = value;
      setDataTable([...updatedList]);

      handleValidateCell(value, rowIndex, columnOption);
    };

    useEffect(() => {
      const asyncFunction = async () => {
        await getData();
        await getSelectOptionsListField();
      };

      asyncFunction();
    }, [currentId, tableOptions, configGetData]);

    const RenderedTableCell = memo(
      (props: {
        columnOption: COLUMN_OPTIONS_INTERFACE;
        item: any;
        rowIndex: number;
      }): JSX.Element => {
        const { columnOption, item, rowIndex } = props;
        const generalProperties = {
          width: columnOption.size.xxl,
          align: columnOption.align,
          className: classes.tableBodyCell,
        };

        let cellValue = "";
        switch (columnOption.type) {
          case CO_TYPE.TEXT: {
            cellValue = item[columnOption.key] || "";
            break;
          }
          case CO_TYPE.NUMBER: {
            cellValue = item[columnOption.key] || "0,00";
              // ? formatNumberValueToString(item[columnOption.key])
              // : "";
            break;
          }
          case CO_TYPE.DATE: {
            cellValue = !!item[columnOption.key]
              ? formatDate(item[columnOption.key])
              : "";
            break;
          }
          case CO_TYPE.VALUE_NAME_OBJECT: {
            cellValue = formatValueNameObject(item[columnOption.key]);
            break;
          }
          case CO_TYPE.VALUE_NAME_OBJECT_ID: {
            cellValue =
              (columnOption.relatedKey
                ? item[columnOption.relatedKey]?.name
                : item[columnOption.key]) || "";
            break;
          }
        }
        return <TableCell {...generalProperties}>{cellValue}</TableCell>;
      },
    );

    const RenderSummaryRow = (): JSX.Element => {
      const hasSummaryCols: COLUMN_OPTIONS_INTERFACE[] =
        tableOptions.listColumn.filter(item => item.hasSummary);
      const noSummaryColsCount: number =
        tableOptions.listColumn.length - hasSummaryCols.length;

      return (
        <TableRow className={`${classes.tableBodyRow} ${
          customDetailEntryStyle ? classes.stickyRow : ""
        }`}>
          <TableCell
            colSpan={noSummaryColsCount}
            className={`${classes.tableBodyCell} ${
              customDetailEntryStyle ? classes.borderTop : ""
            } ${classes.fw600}`}
            align={"left"}
          >
            {"Tổng"}
          </TableCell>
          {hasSummaryCols.map((columnOption, index) => (
            <TableCell
              key={index}
              width={columnOption.size.xxl}
              align={onlyShow ? columnOption.align : CO_ALIGN.LEFT}
              className={`${classes.tableBodyCell} ${
                customDetailEntryStyle ? classes.borderTop : ""
              } ${classes.fw600}`}
            >
              {sumData[columnOption.key] || ""}
            </TableCell>
          ))}
        </TableRow>
      );
    };
    ///customDetailEntryStyle
    return (
      <Box className={classes.container}>
        <TableContainer
          className={`${classes.tableContainer} ${
            customDetailEntryStyle ? customDetailEntryStyle : ""
          }`}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow className={classes.tableBodyRow}>
                {tableOptions.listColumn.map((columnOption, index) => (
                  <TableCell
                    key={index}
                    width={columnOption.size.xxl}
                    align={onlyShow ? columnOption.align : CO_ALIGN.LEFT}
                    className={classes.tableHeadCell}
                  >
                    {columnOption.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataTable.map((item: any, rowIndex: number) => (
                <TableRow key={rowIndex} className={classes.tableBodyRow}>
                  {onlyShow ? (
                    <>
                      {tableOptions.listColumn.map(
                        (columnOption, cellIndex) => (
                          <RenderedTableCell
                            columnOption={columnOption}
                            item={item}
                            rowIndex={rowIndex}
                            key={cellIndex}
                          />
                        ),
                      )}
                    </>
                  ) : (
                    <>
                      {tableOptions.listColumn.map(
                        (columnOption, cellIndex) => (
                          <TableCell
                            key={cellIndex}
                            width={columnOption.size.xxl}
                            sx={{
                              padding: "0 !important",
                            }}
                            className={classes.tableBodyCell}
                          >
                            {columnOption.editType &&
                            [
                              CO_EDIT_TYPE.TEXT,
                              CO_EDIT_TYPE.NUMBER,
                              CO_EDIT_TYPE.EMAIL,
                              CO_EDIT_TYPE.TEL,
                            ].includes(columnOption.editType) ? (
                              <BaseTextField
                                value={item[columnOption.key]}
                                onChange={event => {
                                  handleInputChange(
                                    event,
                                    rowIndex,
                                    columnOption,
                                  );
                                }}
                                onBlur={() => {
                                  handleValidateCell(
                                    item[columnOption.key],
                                    rowIndex,
                                    columnOption,
                                  );
                                }}
                                error={
                                  !!validationErrors?.[rowIndex]?.[
                                    columnOption.key
                                  ]
                                }
                                errorMessage={
                                  validationErrors?.[rowIndex]?.[
                                    columnOption.key
                                  ] || ""
                                }
                                fullWidth
                                className={classes.cellEditInput}
                              />
                            ) : CO_EDIT_TYPE.SELECT ===
                              columnOption.editType ? (
                              <BaseAutocomplete
                                options={
                                  selectOptionsListField?.[columnOption.key]
                                    ?.list || []
                                }
                                value={item[columnOption.key]}
                                onChange={handleAutocompleteChange}
                                onBlur={() => {
                                  handleValidateCell(
                                    item[columnOption.key],
                                    rowIndex,
                                    columnOption,
                                  );
                                }}
                                valueKey={
                                  selectOptionsListField?.[columnOption.key]
                                    ?.valueKey || ""
                                }
                                labelKey={
                                  selectOptionsListField?.[columnOption.key]
                                    ?.nameKey || ""
                                }
                                error={
                                  !!validationErrors?.[rowIndex]?.[
                                    columnOption.key
                                  ]
                                }
                                errorMessage={
                                  validationErrors?.[rowIndex]?.[
                                    columnOption.key
                                  ] || ""
                                }
                                fullWidth
                                className={classes.cellEditAutocomplete}
                              />
                            ) : (
                              <></>
                            )}
                          </TableCell>
                        ),
                      )}
                    </>
                  )}
                </TableRow>
              ))}
              {tableOptions.hasSummaryRow ? <RenderSummaryRow /> : <></>}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  },
);
const BaseAccountingEntryDetailsTable = React.memo(
  BaseAccountingEntryDetailsTableComponent,
);
export { BaseAccountingEntryDetailsTable };
