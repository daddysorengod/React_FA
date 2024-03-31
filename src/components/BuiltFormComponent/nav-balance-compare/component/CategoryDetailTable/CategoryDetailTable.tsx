import React, { Fragment, useEffect, useState } from "react";
import { useStyles } from "./CategoryDetailTable.styles";
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
import { IFormType } from "@/src/types/general";
import {
  formatMoney,
  formatNumberStringToNumber,
  isValidMoney,
} from "@/src/helpers/formatMoney";
import CommonStatusFaOption from "@/src/utils/enums/optionsBase/statusFaOptions";
import moment from "moment";
import { GroupApprovedButtons } from "../../../../GroupApprovedButtons";
import { BaseWorkFollowStatusIcon } from "../../../../BaseWorkFollowStatusIcon";
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
    id: "",
    label: "FA",
    minWidth: 126,
    type: TypeCellTable.textbox,
    align: "center",
  },
  {
    id: "",
    label: "CB",
    minWidth: 126,
    editable: true,
    align: "center",
    formatMoney: true,
    type: TypeCellTable.textbox,
    validation: {
      number: true,
    },
  },
  {
    id: "",
    label: "Chênh lệch",
    minWidth: 126,
    align: "center",
    formatMoney: true,
    type: TypeCellTable.textbox,
  },
  {
    id: "",
    label: "FA",
    minWidth: 126,
    type: TypeCellTable.textbox,
    align: "center",
  },
  {
    id: "",
    label: "CB",
    minWidth: 126,
    editable: true,
    align: "center",
    formatMoney: true,
    type: TypeCellTable.textbox,
    validation: {
      number: true,
    },
  },
  {
    id: "",
    label: "Chênh lệch",
    minWidth: 126,
    align: "center",
    formatMoney: true,
    type: TypeCellTable.textbox,
  },
  {
    id: "",
    label: "FA",
    minWidth: 126,
    type: TypeCellTable.textbox,
    align: "center",
  },
  {
    id: "",
    label: "CB",
    minWidth: 126,
    editable: true,
    align: "center",
    formatMoney: true,
    type: TypeCellTable.textbox,
    validation: {
      number: true,
    },
  },
  {
    id: "",
    label: "Chênh lệch",
    minWidth: 126,
    align: "center",
    formatMoney: true,
    type: TypeCellTable.textbox,
  },
  {
    id: "",
    label: "FA",
    minWidth: 126,
    type: TypeCellTable.textbox,
    align: "center",
  },
  {
    id: "",
    label: "CB",
    minWidth: 126,
    editable: true,
    align: "center",
    formatMoney: true,
    type: TypeCellTable.textbox,
    validation: {
      number: true,
    },
  },
  {
    id: "",
    label: "Chênh lệch",
    minWidth: 126,
    align: "center",
    formatMoney: true,
    type: TypeCellTable.textbox,
  },
  {
    id: "",
    label: "FA",
    minWidth: 126,
    type: TypeCellTable.textbox,
    align: "center",
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
  entryProp?: {
    [key: string]: any;
  };
}

const CategoryDetailTableComponent = (props: Props): JSX.Element => {
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
    entryProp,
  } = props;
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [totalRecord, setTotalRecord] = useState(0);
  const globalFundId = useSelector(
    (state: RootStateProps) => state.general.globalFundId,
  );
  const globalFundData = useSelector(
    (state: RootStateProps) => state.general.globalFundData,
  );
  const [listStockDetail, setListStockDetail] = useState([]) as any;
  const [errorFields, setErrorField] = useState([]) as any;

  //table data
  const [dataTable, setDataTable] = useState<any[]>([]);

  const userRole = useSelector(state => state.auth.role);

  const getData = async () => {
    const customUrl = getQueryURL(
      "fund-money-statement-api/fund-stock-balance/find",
      {
        fundId: globalFundId,
        pageIndex: page,
        pageSize: rowsPerPage,
        fundMoneyStatementByNavBatchId: currentId,
      },
    );
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
  }, [customAttrs, page, rowsPerPage, currentId]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
  };

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer className={classes.tableContainer}>
        <Table stickyHeader>
          <TableHead>
            <TableRow className={classes.tableBodyRow}>
              <TableCell
                align="center"
                key={"accountNumber"}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderStockSymbol}`}
                rowSpan={2}
              >
                Mã CK
              </TableCell>
              <TableCell
                align="center"
                key={"assetType"}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderStockSymbol}`}
                rowSpan={2}
              >
                Loại CK
              </TableCell>
              <TableCell
                align="center"
                key={"debitAmount"}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderStockSymbol}`}
                colSpan={1}
              >
                FA
              </TableCell>
              <TableCell
                align="center"
                key={"ariseCode"}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderStockSymbol}`}
                colSpan={1}
              >
                CB
              </TableCell>
              <TableCell
                key={"ariseCode"}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderStockSymbol}`}
                colSpan={1}
              >
                Chênh lệch
              </TableCell>
              <TableCell
                align="center"
                key={"ariseCode"}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderStockSymbol}`}
                colSpan={1}
              >
                FA
              </TableCell>
              <TableCell
                align="center"
                key={"ariseCode"}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderStockSymbol}`}
                colSpan={1}
              >
                CB
              </TableCell>
              <TableCell
                key={"ariseCode"}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderStockSymbol}`}
                colSpan={1}
              >
                Chênh lệch
              </TableCell>
              <TableCell
                align="center"
                key={"ariseCode"}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderStockSymbol}`}
                colSpan={1}
              >
                FA
              </TableCell>
              <TableCell
                align="center"
                key={"ariseCode"}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderStockSymbol}`}
                colSpan={1}
              >
                CB
              </TableCell>
              <TableCell
                key={"ariseCode"}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderStockSymbol}`}
                colSpan={1}
              >
                Chênh lệch
              </TableCell>
              <TableCell
                align="center"
                key={"ariseCode"}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderStockSymbol}`}
                colSpan={1}
              >
                FA
              </TableCell>
              <TableCell
                align="center"
                key={"ariseCode"}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderStockSymbol}`}
                colSpan={1}
              >
                CB
              </TableCell>
              <TableCell
                key={"ariseCode"}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderStockSymbol}`}
                colSpan={1}
              >
                Chênh lệch
              </TableCell>
              <TableCell
                align="center"
                key={"ariseCode"}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderStockSymbol}`}
                colSpan={1}
              >
                FA
              </TableCell>
            </TableRow>
            <TableRow className={classes.tableBodyRow}>
              <TableCell
                align="center"
                colSpan={3}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderFirst}`}
              >
                Tổng số lượng
              </TableCell>
              <TableCell
                align="center"
                colSpan={3}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderFirst}`}
              >
                CK giao dịch
              </TableCell>
              <TableCell
                align="center"
                colSpan={3}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderFirst}`}
              >
                CK giao dịch
              </TableCell>
              <TableCell
                align="center"
                colSpan={3}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderFirst}`}
              >
                CK chờ nhận
              </TableCell>
              <TableCell
                align="center"
                colSpan={1}
                className={`${classes.tableHeadCell} ${classes.stickyHeaderFirst}`}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              <TableCell colSpan={10}>
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
const CategoryDetailTable = React.memo(CategoryDetailTableComponent);
export { CategoryDetailTable };
