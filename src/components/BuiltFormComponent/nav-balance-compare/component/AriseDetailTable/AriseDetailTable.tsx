import React, { Fragment, useEffect, useState } from "react";
import { useStyles } from "./AriseDetailTable.styles";
import useTranslation from "next-translate/useTranslation";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
} from "@mui/material";
import { BaseTextFieldAccounting } from "../../../../AccountingMoneyTransDetail/components";
/// import store
import { useDispatch } from "react-redux";
import { dispatch, useSelector } from "@store/store";
import { RootStateProps } from "@app/types/root";
import { getListObject } from "@/src/store/reducers/general";
import { getQueryURL } from "@/src/helpers/getQueryURL";
import { DynamicObject } from "@/src/types/field";
import { cloneDeep, debounce, merge } from "lodash";

import {
  formatMoney,
  formatNumberStringToNumber,
  isValidMoney,
} from "@/src/helpers/formatMoney";
import CommonStatusFaOption from "@/src/utils/enums/optionsBase/statusFaOptions";
import moment from "moment";
import { GroupApprovedButtons } from "../../../../GroupApprovedButtons";
import { BaseWorkFollowStatusIcon } from "../../../../BaseWorkFollowStatusIcon";
import { formatNumber } from "@/src/helpers";
/// end import store

interface IValidation {
  string?: boolean;
  number?: boolean;
  required?: boolean;
}
enum TypeCellTable {
  status = "status",
  textbox = "textbox",
  date = "date",
  action = "action",
  workFollowStatus = "workFollowStatus",
}
interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  classCss?: string;
  editable?: boolean;
  isPin?: boolean;
  formatMoney?: boolean;
  type?: TypeCellTable;
  validation?: IValidation;
}

const columns: Column[] = [
  // { id: "stockCode", label: "Mã CK", minWidth: 170 },
  {
    id: "marketCode",
    label: "FA",
    minWidth: 130,
    type: TypeCellTable.textbox,
    align: "center",
  },
  {
    id: "finalPrice",
    label: "CB",
    minWidth: 130,
    editable: true,
    align: "center",
    formatMoney: true,
    type: TypeCellTable.textbox,
    validation: {
      number: true,
    },
  },
  {
    id: "unrealizedPrice",
    label: "Chênh lệch",
    minWidth: 130,
    align: "center",
    formatMoney: true,
    type: TypeCellTable.textbox,
  },
  {
    id: "marketCode",
    label: "FA",
    minWidth: 130,
    type: TypeCellTable.textbox,
    align: "center",
  },
  {
    id: "finalPrice",
    label: "CB",
    minWidth: 130,
    editable: true,
    align: "center",
    formatMoney: true,
    type: TypeCellTable.textbox,
    validation: {
      number: true,
    },
  },
  {
    id: "unrealizedPrice",
    label: "Chênh lệch",
    minWidth: 130,
    align: "center",
    formatMoney: true,
    type: TypeCellTable.textbox,
  },
  {
    id: "marketCode",
    label: "FA",
    minWidth: 130,
    type: TypeCellTable.textbox,
    align: "center",
  },
  {
    id: "finalPrice",
    label: "CB",
    minWidth: 130,
    editable: true,
    align: "center",
    formatMoney: true,
    type: TypeCellTable.textbox,
    validation: {
      number: true,
    },
  },
  {
    id: "unrealizedPrice",
    label: "Chênh lệch",
    minWidth: 130,
    align: "center",
    formatMoney: true,
    type: TypeCellTable.textbox,
  },
  {
    id: "marketCode",
    label: "FA",
    minWidth: 130,
    type: TypeCellTable.textbox,
    align: "center",
  },
  {
    id: "finalPrice",
    label: "CB",
    minWidth: 130,
    editable: true,
    align: "center",
    formatMoney: true,
    type: TypeCellTable.textbox,
    validation: {
      number: true,
    },
  },
  {
    id: "unrealizedPrice",
    label: "Chênh lệch",
    minWidth: 130,
    align: "center",
    formatMoney: true,
    type: TypeCellTable.textbox,
  },
];

const rows = [
  {
    id: "dataRes.id",
    stockCode: "SSI",
    stockName: "SSI",
    stockType: "SSI",
    listed: "SSI",
    fixedPrice: "1000",
    priceDifference: "1000",
    note: "1000",
    denominations: "1000",
    capitalPrice: "1000",
    interest: "1000",
    valueInterest: "1000",
    priceInterest: "1000",
    navClosingPrice: "1000",
    lastNavDate: "1000",
    totalDay: "1000",
    totalDayNoTrans: "1000",
    lastNavPrice: "1000",
    totalStockAmount: "1000",
    totalSecuritiesTraded: "1000",
    totalSecuritiesWaiting: "1000",
    reasonablePrice: "1000",
    fixedPriceFA: "1000",
    fixedPriceSB: "1000",
    statusFixedFA: "1000",
    statusFixedSB: "1000",
  },
];

interface Props {
  name?: string;
  formCode?: string;
  customAttrs: DynamicObject | null;
  value: DynamicObject[];
  onChange: (event) => void;
  isDisabled?: boolean;
  currentId?: string;
}

const AriseDetailTableComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    name,
    formCode,
    customAttrs,
    onChange,
    value,
    isDisabled,
    currentId,
  } = props;
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [totalRecord, setTotalRecord] = useState(0);
  const globalFundId = useSelector(
    (state: RootStateProps) => state.general.globalFundId,
  );
  const [listStockDetail, setListStockDetail] = useState([]) as any;
  const [errorFields, setErrorField] = useState([]) as any;

  const userRole = useSelector(state => state.auth.role);

  const getData = async () => {
    const customUrl = getQueryURL("fund-accounting-api/stock-valuation", {
      fundId: globalFundId,
      pageIndex: page,
      pageSize: rowsPerPage,
      fundNavBatchId: currentId || null,
    });
    const res = await dispatch(
      getListObject({
        url: customUrl,
        formCode: formCode,
        fieldName: name,
        saveValues: customAttrs?.storageKeys,
      }),
    );
    if (Object.keys(res).length > 0) {
      setListStockDetail(() => {
        return res.source;
      });
      setTotalRecord(() => {
        return res?.totalRecords ? res?.totalRecords : 0;
      });
    }
  };

  useEffect(() => {
    const asyncFunction = async () => {
      await getData();
    };

    asyncFunction();
  }, [customAttrs, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
  };

  const formatDataSubmit = (dataSubmit: DynamicObject[]) => {
    return dataSubmit.map(item => {
      return {
        fundNavBatchId: item?.fundNavBatchId ?? null,
        securityId: item?.securityId ?? null,
        finalPrice: item?.finalPrice ?? null,
        description: item?.description ?? null,
      };
    });
  };

  const onChangeDataColumn = (
    index: number,
    fieldName: string,
    fieldValue: string,
    formatMoney?: boolean,
    validation?: IValidation,
  ) => {
    try {
      if (validation?.number) {
        if (!isValidMoney(fieldValue)) {
          return;
        }
      }
      if (
        typeof fieldName === "undefined" ||
        typeof index === "undefined" ||
        typeof fieldName === "undefined"
      ) {
        return;
      }
      if (formatMoney) {
        const updateState = [...cloneDeep(listStockDetail)];
        const updateStateNumber = [...cloneDeep(listStockDetail)];
        const updateField = { ...updateState[index] };
        const updateFieldNumber = { ...updateState[index] };
        updateField[fieldName] = fieldValue;
        updateFieldNumber[fieldName] = formatNumberStringToNumber(fieldValue);
        updateState[index] = updateField;
        updateStateNumber[index] = updateFieldNumber;
        setListStockDetail(updateState);
        onChange(formatDataSubmit(updateStateNumber));
      } else {
        const updateState = [...cloneDeep(listStockDetail)];
        const updateField = { ...updateState[index] };
        updateField[fieldName] = fieldValue;
        updateState[index] = updateField;
        setListStockDetail(updateState);
        onChange(formatDataSubmit(updateState));
      }
    } catch (err) {
      console.log("onChangeDataColumn => fail: ", `${err}`);
    }
  };
  const renderStatusLabel = (statusCode?: string) => {
    return (
      <Chip
        size="small"
        label={<>{CommonStatusFaOption.getDescription(statusCode)}</>}
        className={`${classes.chipBase} ${classes[`statusCode${statusCode}`]}`}
        icon={<div className="dot"></div>}
      />
    );
  };

  const renderCellTable = (row, rowIndex, column, columnIndex) => {
    const value = row[column.id];
    switch (column?.type) {
      case TypeCellTable.status:
        return (
          <TableCell
            key={column.id}
            align={"center"}
            className={`
                      ${classes.tableBodyNoEditCell} ${
              column?.classCss ? classes[column?.classCss] : ""
            } ${column?.isPin ? classes.stickyColumn2 : ""}`}
          >
            {renderStatusLabel(typeof value === "object" ? value?.name : value)}
          </TableCell>
        );
      case TypeCellTable.date:
        return (
          <Fragment>
            <TableCell
              key={column.id}
              align={"left"}
              className={`
                      ${classes.tableBodyNoEditCell} ${
                column?.classCss ? classes[column?.classCss] : ""
              } ${column?.isPin ? classes.stickyColumn2 : ""}`}
            >
              {value
                ? moment(typeof value === "object" ? value?.name : value)
                    .format("DD/MM/YYYY")
                    .toString()
                : ""}
            </TableCell>
          </Fragment>
        );
      case TypeCellTable.textbox:
        return (
          <Fragment>
            {column?.editable ? (
              <TableCell
                key={column.id}
                align={column.align}
                className={`${classes.tableBodyEditCell} ${
                  column?.classCss ? classes[column?.classCss] : ""
                }
                            ${column?.isPin ? classes.stickyColumn : ""}`}
              >
                <BaseTextFieldAccounting
                  value={
                    column.formatMoney
                      ? formatMoney(value,{decimal: 2})
                      : typeof value === "object"
                      ? value?.name
                      : value
                  }
                  onChange={event => {
                    onChangeDataColumn(
                      rowIndex,
                      column.id,
                      event?.target?.value,
                      column.formatMoney,
                      column?.validation,
                    );
                  }}
                  onBlur={() => {}}
                  disabled={isDisabled || userRole == 1}
                  error={false}
                  errorMessage={""}
                  fullWidth={false}
                  className={`${classes.cellEditInput} ${
                    column?.align === "right" ? classes.alignRightInput : ""
                  }`}
                />
              </TableCell>
            ) : (
              <TableCell
                key={column.id}
                align={column.align}
                className={`
                            ${classes.tableBodyNoEditCell} ${
                  column?.classCss ? classes[column?.classCss] : ""
                } ${column?.isPin ? classes.stickyColumn2 : ""}`}
              >
                {column.formatMoney
                  ? formatMoney(value,{decimal: 2})
                  : typeof value === "object"
                  ? value?.name
                  : value}
              </TableCell>
            )}
          </Fragment>
        );
      case TypeCellTable.workFollowStatus: {
        if (userRole != 1) {
          return <></>;
        }

        return (
          <TableCell
            key={column.id}
            align="center"
            className={`${classes.tableBodyEditCell} ${
              column?.classCss ? classes[column?.classCss] : ""
            }
          ${column?.isPin ? classes.stickyColumn : ""}`}
          >
            <BaseWorkFollowStatusIcon value={row?.workFollowStatus || ""} />
          </TableCell>
        );
      }
      case TypeCellTable.action:
        if (userRole != 1) {
          return <></>;
        }

        return (
          <TableCell
            key={column.id}
            align="center"
            className={`${classes.tableBodyEditCell} ${
              column?.classCss ? classes[column?.classCss] : ""
            }
              ${column?.isPin ? classes.stickyColumn : ""}`}
          >
            <GroupApprovedButtons
              smallSize
              currentId={row?.fundNavBatchStockId || ""}
              checkerAPI={{
                approve: "fund-stock-price-api/approve-batch-stock",
                deny: "fund-stock-price-api/reject-batch-stock",
                cancelApprove: "fund-stock-price-api/cancel-batch-stock",
              }}
              workFollowStatus={row?.workFollowStatus || ""}
              onCallApi={getData}
            />
          </TableCell>
        );
      default:
        return <></>;
    }
  };

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer className={classes.tableContainer}>
        <Table stickyHeader>
          <TableHead>
            <TableRow className={classes.tableBodyRow}>
              <TableCell
                key={"ariseCode"}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderSTK}`}
                rowSpan={2}
              >
                STK kế toán
              </TableCell>
              <TableCell
                key={"ariseName"}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderTK}`}
                rowSpan={2}
              >
                Tên TK kế toán
              </TableCell>
              <TableCell
                align="center"
                colSpan={3}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderFirst}`}
              >
                Số dư đầu kỳ
              </TableCell>
              <TableCell
                align="center"
                colSpan={3}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderFirst}`}
              >
                Phát sinh nợ
              </TableCell>
              <TableCell
                align="center"
                colSpan={3}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderFirst}`}
              >
                Phát sinh có
              </TableCell>
              <TableCell
                align="center"
                colSpan={3}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderFirst}`}
              >
                Số dư cuối kỳ
              </TableCell>
              {/* {userRole == 1 && (
                <TableCell
                  align="center"
                  colSpan={2}
                  className={`${classes.tableHeadCell} ${classes.stickyHeaderFirst}`}
                ></TableCell>
              )} */}
            </TableRow>
            <TableRow className={classes.tableBodyRow}>
              {columns.map(column => {
                if (
                  userRole != 1 &&
                  column.type &&
                  [
                    TypeCellTable.action,
                    TypeCellTable.workFollowStatus,
                  ].includes(column.type)
                ) {
                  return <></>;
                }
                return (
                  <TableCell
                    key={column.id}
                    align={column.align || "left"}
                    style={{ minWidth: column.minWidth }}
                    className={`${classes.tableHeadCell} ${
                      classes.stickyHeaderSecond
                    }
                ${column?.isPin ? classes.stickyColumn2 : ""}
                `}
                  >
                    {column.label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {Array.isArray(listStockDetail) && listStockDetail.length > 0 ? (
              listStockDetail?.map((row, rowIndex) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    className={classes.maxHeightRow}
                  >
                    <TableCell
                      key={"stockCode"}
                      align={"left"}
                      className={`${classes.tableBodyNoEditCell} ${classes.stickyColumn} ${classes.customBgLight}`}
                    >
                      {row?.securitySymbol}
                    </TableCell>
                    {columns.map((column, columnIndex) =>
                      renderCellTable(row, rowIndex, column, columnIndex),
                    )}
                  </TableRow>
                );
              })
            ) : ( */}
            <>
              <TableCell
                // key={column.id}
                // align={column.align}
                // style={{ minWidth: column.minWidth }}
                // className={`${classes.tableHeadCell}
                // ${column?.isPin ? classes.stickyColumn2 :
                //     ""
                //   }
                // `}
                colSpan={10}
              >
                <p
                  style={{
                    textAlign: "center",
                    maxWidth: "unset",
                    margin: "0",
                    fontSize: "0.875rem",
                    lineHeight: "1.57",
                    fontFamily: "'Inter',sans-serif",
                    fontWeight: "400",
                    color: "#8c8c8c",
                    fontStyle: "italic",
                    // maxWidth: 'min(100vw, 1612px)',
                    paddingTop: "2rem",
                    paddingBottom: "2rem",
                    width: "100%",
                  }}
                >
                  Không có dữ liệu
                </p>
              </TableCell>
            </>
            {/* )} */}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 50, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={"Số hàng/trang"}
        labelDisplayedRows={page =>
          `${listStockDetail?.length} trên ${totalRecord}`
        }
        showFirstButton
        showLastButton
      />
    </Paper>
  );
};
const AriseDetailTable = React.memo(AriseDetailTableComponent);
export { AriseDetailTable };
