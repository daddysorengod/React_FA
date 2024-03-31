import React, { useState } from "react";
import { useStyles } from "./AccountingMoneyTransDetail.styles";
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
import { BaseDropdown } from "../BaseDropdown";
import { BaseTextField } from "../BaseTextField";
import { VALIDATION_ERROR_INTERFACE } from "@/src/types";
import { BaseTextFieldAccounting } from "./components";
import { AutocompleteAccounting } from "./components/AutocompleteAccounting";
import { AutoCompleteType, DynamicObject } from "@/src/types/field";
import { formatMoney } from "@/src/helpers/formatMoney";

interface Props {
  formCode?: string;
  initialState?: DynamicObject;
}
const AccountingMoneyTransDetailComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const { formCode, initialState } = props;
  const classes = useStyles();
  const [accountingEntryName, setAccountingEntryName] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const handleAccountingEntryNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAccountingEntryName(event.target.value);
    // handleValidateAccountingEntryName(event.target.value);
  };

  return (
    <Box>
      <Box
        sx={{
          fontSize: "16px",
          fontWeight: "700",
          lineHeight: "24px",
          marginBottom: "16px",
        }}
      >
        {"Chi tiết bút toán"}
      </Box>
      <TableContainer className={classes.tableContainer}>
        <Table stickyHeader>
          <TableHead>
            <TableRow className={classes.tableBodyRow}>
              <TableCell className={classes.tableHeadCell}>Diễn giải</TableCell>
              <TableCell className={classes.tableHeadCell}>TK nợ</TableCell>
              <TableCell className={classes.tableHeadCell}>TK có</TableCell>
              <TableCell
                align={true ? "right" : "left"}
                className={classes.tableHeadCell}
              >
                Giá trị
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className={classes.tableBodyRow}>
              <TableCell className={classes.tableBodyEditCell}>
                <BaseTextFieldAccounting
                  value={initialState?.description}
                  onChange={handleAccountingEntryNameChange}
                  onBlur={() => {}}
                  disabled={true}
                  error={!!validationErrors.accountingEntryName}
                  errorMessage={validationErrors.accountingEntryName}
                  fullWidth={false}
                  className={classes.cellEditInput}
                />
              </TableCell>
              <TableCell className={classes.tableBodyEditCell}>
                <BaseTextFieldAccounting
                  value={initialState?.debitAccountNumber}
                  onChange={handleAccountingEntryNameChange}
                  onBlur={() => {}}
                  disabled={true}
                  error={!!validationErrors.accountingEntryName}
                  errorMessage={validationErrors.accountingEntryName}
                  fullWidth={false}
                  className={classes.cellEditInput}
                />
              </TableCell>
              <TableCell className={classes.tableBodyEditCell}>
                <BaseTextFieldAccounting
                  value={initialState?.creditAccountNumber}
                  onChange={handleAccountingEntryNameChange}
                  onBlur={() => {}}
                  disabled={true}
                  error={!!validationErrors.accountingEntryName}
                  errorMessage={validationErrors.accountingEntryName}
                  fullWidth={false}
                  className={classes.cellEditInput}
                />
              </TableCell>
              <TableCell
                align={true ? "right" : "left"}
                className={
                  !!true ? classes.tableBodyCell : classes.tableBodyEditCell
                }
              >
                <BaseTextFieldAccounting
                  value={formatMoney(initialState?.totalAmount, { decimal: 2 })}
                  onChange={handleAccountingEntryNameChange}
                  onBlur={() => {}}
                  disabled={true}
                  error={!!validationErrors.accountingEntryName}
                  errorMessage={validationErrors.accountingEntryName}
                  fullWidth={false}
                  className={classes.cellEditInput2}
                />
              </TableCell>
            </TableRow>
            <TableRow className={classes.tableBodyRow}>
              <TableCell
                colSpan={3}
                className={classes.tableBodyCell}
                sx={{ fontWeight: "600 !important" }}
              >
                {"Tổng"}
              </TableCell>
              <TableCell
                align={true ? "right" : "left"}
                className={classes.tableBodyCell}
                sx={{ fontWeight: "600 !important" }}
              >
                <BaseTextFieldAccounting
                  value={formatMoney(initialState?.totalAmount, { decimal: 2 })}
                  onChange={handleAccountingEntryNameChange}
                  onBlur={() => {}}
                  disabled={true}
                  error={!!validationErrors.accountingEntryName}
                  errorMessage={validationErrors.accountingEntryName}
                  fullWidth={false}
                  className={classes.cellEditInput2}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
const AccountingMoneyTransDetail = React.memo(
  AccountingMoneyTransDetailComponent,
);
export { AccountingMoneyTransDetail };
