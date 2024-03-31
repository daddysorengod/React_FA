import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useStyles } from "@/src/components/BuiltFormComponent/BuiltFormComponent.styles";
import { alpha, useTheme } from "@mui/material/styles";
import useTranslation from "next-translate/useTranslation";
import {
  Box,
  Checkbox,
  Grid,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TablePagination,
  Toolbar,
  IconButton,
  TableFooter,
} from "@mui/material";
import { SEARCH_CONDITIONS, api } from "@/src/constants";
import {
  generateSubRowsArray,
  getAllCode,
  getListDataBase,
  getItemById,
} from "@/src/helpers";
import {
  FETCH_DATA_API_CONFIG_INTERFACE,
  VALIDATION_ERROR_INTERFACE,
  TABLE_OPTIONS_INTERFACE,
} from "@/src/types";

import { BaseTextField } from "@/src/components/BaseTextField";
import { BaseAutocomplete } from "@/src/components/BaseAutocomplete";
import getConfig from "next/config";
import { getListPrivileges } from "@/src/helpers/getListPrivileges";
import {
  KeyboardArrowRight,
  FirstPage,
  LastPage,
  KeyboardArrowLeft,
} from "@mui/icons-material";
import { dispatch } from "@/src/store";
import { getTableConfigStore } from "@/src/store/reducers/tableConfig";

interface Props {
  parentId?: string;
  parentIdName?: string;
  currentId?: string;
  onlyShow: boolean;
}

const fieldLabels = {
  fullName: "Tên người dùng",
  username: "Tên đăng nhập",
  password: "Mật khẩu",
  role: "Vai trò",
};

interface privilege {
  value?: string;
  text?: string;
}

const AccountAddFormComponent = forwardRef((props: Props, ref): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { parentId, parentIdName, currentId, onlyShow } = props;

  const [listRole, setListRole] = useState([]);
  const [listPrivileges, setListPrivileges] = useState<Array<privilege>>([]);
  const [fullName, setFullName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [privilegesGroups, setPrivilegesGroups] = useState<any>([]);
  const [totalRecord, setTotalRecord] = useState(0);

  //#region table State
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);

  //#endregion

  const [tableConfigData, setTableConfigData] = useState<{
    [key: number]: TABLE_OPTIONS_INTERFACE | undefined;
  }>({});
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  // ---------
  // List option select
  const [parentAccountIdOptions, setParentAccountIdOptions] = useState<any[]>(
    [],
  );
  const [roleUser, setRoleUser] = useState<any[]>([]);
  // ---------
  // FUNCTION
  useImperativeHandle(ref, () => ({
    async onSubmitRef() {
      return false;
    },
    async onSaveValueRef() {
      const payload = await generateSubmitForm();
      if (payload) {
        return payload;
      }
      return null;
    },
    handleUnFocus() {
      // setFormErrors({});
    },
  }));

  // Get Data Here <=========
  // Submit Here <==========
  const generateSubmitForm = async () => {
    if (handleValidateAll()) {
      const submitData = {
        fullName: fullName,
        userName: userName,
        password: password,
        role: role,
        privilegesGroups: privilegesGroups,
      };
      return { ...submitData };
    } else return false;
  };

  const handleValidateField = (
    value: any,
    key: string,
  ): VALIDATION_ERROR_INTERFACE => {
    if (key === "fullName") {
    }
    if (key === "userName") {
    }
    if (key === "password") {
    }

    // if (
    //   key === "accountNumber" &&
    //   !isAccountNumberStartWithParentAccountNumber(value) &&
    //   value &&
    //   !isParent
    // ) {
    //   const info: VALIDATION_ERROR_INTERFACE = {
    //     error: true,
    //     errorMessage: "Số tài khoản kế toán phải bắt đầu bằng số tài khoản mẹ",
    //   };
    //   setValidationErrors({
    //     ...validationErrors,
    //     [key]: info.errorMessage,
    //   });
    //   return info;
    // }
    // if (key === "accountNumber" && value === parentAccountNumber && !isParent) {
    //   const info: VALIDATION_ERROR_INTERFACE = {
    //     error: true,
    //     errorMessage: "Số tài khoản kế toán phải khác số tài khoản mẹ",
    //   };
    //   setValidationErrors({
    //     ...validationErrors,
    //     [key]: info.errorMessage,
    //   });
    //   return info;
    // }
    // if (validationConfig[key] && fieldLabels[key]) {
    //   const info = getValidateInfo(
    //     value,
    //     fieldLabels[key],
    //     validationConfig[key],
    //   );
    //   setValidationErrors({
    //     ...validationErrors,
    //     [key]: info.errorMessage,
    //   });
    //   return info;
    // }
    return {
      error: false,
      errorMessage: "",
    };
  };

  const getTableConfigs = async () => {
    const categoryTableCode =
      "DECENTRALIZATION/DECENTRALIZATION-GROUP-FUNCTION/ACCOUNT-LIST/MAIN";
    const res = await dispatch(getTableConfigStore(categoryTableCode));
    setTableConfigData({
      0: res,
    });
  };

  const getParentAccountIdOptions = async (searchString?: string) => {
    try {
      const config: FETCH_DATA_API_CONFIG_INTERFACE = {
        url: "fund-accounting-plan-api/find",
        params: [
          {
            paramKey: "pageIndex",
            paramValue: "1",
          },
          {
            paramKey: "pageSize",
            paramValue: "40",
          },
        ],
        searchTerms: [
          {
            fieldName: "fundId",
            fieldValue: parentId,
          },
          {
            fieldName: "accountNumber",
            fieldValue: searchString || "",
            condition: SEARCH_CONDITIONS.CONTAINS,
          },
        ],
      };
      const res = await getListDataBase(config);
      if (res.source) {
        const arr = generateSubRowsArray(res.source);
        setParentAccountIdOptions(arr);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleValidatePassword = (value): VALIDATION_ERROR_INTERFACE => {
    return handleValidateField(value, "passowrd");
  };

  const handleValidateFullName = (value): VALIDATION_ERROR_INTERFACE => {
    return handleValidateField(value, "fullName");
  };

  const handleValidateUserName = (value): VALIDATION_ERROR_INTERFACE => {
    return handleValidateField(value, "useName");
  };

  const handleValidateRole = (value): VALIDATION_ERROR_INTERFACE => {
    return handleValidateField(value, "role");
  };

  const handleChangeUserName = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUserName(event.target.value);
    handleValidateUserName(event.target.value);
  };

  const handleChangePassword = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPassword(event.target.value);
    handleValidatePassword(event.target.value);
  };

  const handleChangeFullName = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFullName(event.target.value);
    handleValidateFullName(event.target.value);
  };

  const handleChangeRole = (value: any) => {
    setRole(value);
    handleValidateRole(role);
  };

  // VALIDATION
  const handleValidateAll = (): boolean => {
    let validation: any = {};
    let valid = true;

    const obj = {
      fullName,
      userName,
      password,
      role,
    };

    for (const key in fieldLabels) {
      //   if (
      //     key === "accountNumber" &&
      //     !isAccountNumberStartWithParentAccountNumber(obj[key]) &&
      //     obj[key] &&
      //     !isParent
      //   ) {
      //     const info: VALIDATION_ERROR_INTERFACE = {
      //       error: true,
      //       errorMessage:
      //         "Số tài khoản kế toán phải bắt đầu bằng số tài khoản mẹ",
      //     };
      //     if (info.error) {
      //       validation[key] = info.errorMessage;
      //       valid = false;
      //     }
      //   }
      //   if (
      //     key === "accountNumber" &&
      //     obj[key] === parentAccountNumber &&
      //     !isParent
      //   ) {
      //     const info: VALIDATION_ERROR_INTERFACE = {
      //       error: true,
      //       errorMessage: "Số tài khoản kế toán phải khác số tài khoản mẹ",
      //     };
      //     if (info.error) {
      //       validation[key] = info.errorMessage;
      //       valid = false;
      //     }
      //   }
      //   if (validationConfig[key]) {
      //     const info: VALIDATION_ERROR_INTERFACE = getValidateInfo(
      //       obj[key],
      //       fieldLabels[key],
      //       validationConfig[key],
      //     );
      //     if (info.error) {
      //       validation[key] = info.errorMessage;
      //       valid = false;
      //     }
      //   }
    }
    // setValidationErrors({ ...validation });
    return valid;
  };

  // END VALIDATION ------------------
  // END FUNCTION ------------------

  const getDatePrivilege = (pPageIndex: number, pPageSize: number) => {};

  useEffect(() => {
    const fetchData = async () => {
      // setValidationErrors({});
      getParentAccountIdOptions();
      //   getAccountTypeOptions();
      //   getFollowByOptions();

      if (!currentId) {
        // setChildHasTransaction(false);
        return;
      } else {
        // await getFormData();
      }
    };
    fetchData();
  }, [currentId]);

  useEffect(() => {
    getAllCode("USERTYPE", "TLPROFILE")
      .then(res => {
        
        setRoleUser(res.source);
      })
      .catch(err => {
        console.log("err => ", err);
        setRoleUser([])
      });
  }, []);

  useEffect(() => {
    getListPrivileges(page, rowsPerPage)
      .then(res => {
        setListPrivileges(res.source);
        setTotalRecord(res.totalRecords);
      })
      .catch(err => {
        console.log("err => ", err);
        setListPrivileges([])
      });
  }, [page, rowsPerPage]);

  const getFormData = async (): Promise<any> => {
    if (!currentId) {
      return;
    }
    const res = await getItemById(currentId, "identity-user-api/find-by-id");
    // setName(res.name);
    // const resUpdate = res.privilegesRoleGroupMapSqlRes;
    // if (Array.isArray(resUpdate)) {
    //   const updatedArrCheck = resUpdate.map((item, index) => {
    //     item.id = index;
    //     item.identityUserAcRoleId = item.value;
    //     return item;
    //   });
    //   setDataTable(updatedArrCheck);
    // } else {
    //   return;
    // }
    setFullName(res.fullName);
    setUserName(res.userName);
    setPassword(res.password);
    setRole(res.role);
   
    setPrivilegesGroups(res.privilegesUserRoleMapSqlRes  && res.privilegesUserRoleMapSqlRes.length > 0  ? res.privilegesUserRoleMapSqlRes?.map(e => e.id) : []);
    return res;
  };

  useEffect(() => {
    const asyncFunction = async () => {
      if (currentId) {
        getFormData();
        await getTableConfigs();
      }
    };

    asyncFunction();
  }, [currentId, parentId]);

  //#region table

  // define header table
  interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
  }

  const headCells: readonly HeadCell[] = [
    {
      id: "groupName",
      numeric: false,
      disablePadding: true,
      label: "Nhóm quyền",
    },
  ];

  interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement>,
      newPage: number,
    ) => void;
  }

  interface EnhancedTableToolbarProps {
    numSelected: number;
  }

  function EnhancedTableToolbar() {
    return (
      <Toolbar>
        {/* <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
          </Typography> */}
      </Toolbar>
    );
  }

  interface EnhancedTableProps {
    numSelected: number;
    // onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onlyShow: boolean;
  }

  function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, numSelected, onlyShow } = props;

    return (
      <TableHead>
        <TableRow className={classes.checkBoxHeader}>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              // indeterminate={numSelected > 0 && numSelected < rowCount}

              checked={
                listPrivileges.length > 0 &&
                listPrivileges?.length == privilegesGroups?.length
              }
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
              disabled={onlyShow}
            />
          </TableCell>
          {headCells.map(headCell => (
            <TableCell
              className={classes.tableHeaderCell}
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
            >
              {headCell.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && !onlyShow) {
      const newSelected = listPrivileges.map(e => e.value);
      setPrivilegesGroups(newSelected);
      return;
    }
    setPrivilegesGroups([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, record: privilege) => {
    if (privilegesGroups.find(e => e === record.value) !== undefined) {
      setPrivilegesGroups(privilegesGroups.filter(e => e !== record.value));
    } else {
      setPrivilegesGroups([...privilegesGroups, record.value]);
    }

    // const selectedIndex = selected.indexOf(id);
    // let newSelected: readonly number[] = [];

    // if (selectedIndex === -1) {
    //   newSelected = newSelected.concat(selected, id);
    // } else if (selectedIndex === 0) {
    //   newSelected = newSelected.concat(selected.slice(1));
    // } else if (selectedIndex === selected.length - 1) {
    //   newSelected = newSelected.concat(selected.slice(0, -1));
    // } else if (selectedIndex > 0) {
    //   newSelected = newSelected.concat(
    //     selected.slice(0, selectedIndex),
    //     selected.slice(selectedIndex + 1),
    //   );
    // }
    // setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const isSelected = (value: string) => privilegesGroups?.indexOf(value) !== -1;

  function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      onPageChange(event, 1);
    };

    const handleBackButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {};

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 1}
          aria-label="first page"
        >
          {theme.direction === "rtl" ? <LastPage /> : <FirstPage />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 1}
          aria-label="previous page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(totalRecord / rowsPerPage) }
          aria-label="next page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(totalRecord / rowsPerPage)}
          aria-label="last page"
        >
          {theme.direction === "rtl" ? <FirstPage /> : <LastPage />}
        </IconButton>
      </Box>
    );
  }

  //#endregion

  return (
    <Box className={classes.root}>
      <Box className={classes.form}>
        <Box className={classes.topForm}>
          <Grid container columns={6} columnSpacing={4} rowSpacing={3}>
            <Grid item md={2}>
              <BaseTextField
                label={fieldLabels.fullName}
                required={true}
                value={fullName}
                onChange={handleChangeFullName}
                onBlur={event => {
                  handleValidateFullName(event.target.value);
                }}
                disabled={onlyShow}
                error={!!validationErrors.fullName}
                errorMessage={validationErrors.fullName}
                className={classes.textFieldInput}
                fullWidth
              />
            </Grid>
            <Grid item md={2}>
              <BaseTextField
                label={fieldLabels.username}
                required={true}
                value={userName}
                onChange={handleChangeUserName}
                onBlur={event => {
                  handleValidateUserName(event.target.value);
                }}
                disabled={onlyShow}
                error={!!validationErrors.userName}
                errorMessage={validationErrors.userName}
                className={classes.textFieldInput}
                fullWidth
              />
            </Grid>
            <Grid item md={2}>
              <BaseTextField
                label={fieldLabels.password}
                required={true}
                value={password}
                onChange={handleChangePassword}
                onBlur={event => {
                  handleValidatePassword(event.target.value);
                }}
                disabled={onlyShow}
                error={!!validationErrors.password}
                errorMessage={validationErrors.password}
                className={classes.textFieldInput}
                fullWidth
              />
            </Grid>
            <Grid item md={2}>
              <BaseAutocomplete
                label={fieldLabels.role}
                required={true}
                options={roleUser || []}
                value={role}
                onChange={handleChangeRole}
                onBlur={() => {
                  handleValidateRole(role);
                }}
                valueKey={"cdVal"}
                labelKey={"vnCdContent"}
                fullWidth
                disabled={onlyShow}
                error={!!validationErrors.role}
                errorMessage={validationErrors.role}
              />
            </Grid>
          </Grid>
          <Box className={classes.tableAccount}>
            {/* <EnhancedTableToolbar /> */}
            <Box className={classes.styleTabName}>{"Danh sách nhóm quyền"}</Box>
            <TableContainer>
              <Table
                className={classes.tableAccountHead}
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                  onlyShow={onlyShow}
                />
                <TableBody>
                  {listPrivileges.map((row: privilege, index) => {
                    const isItemSelected = isSelected(row?.value || "");
                    return (
                      <TableRow
                        hover
                        onClick={event => {
                          if (!onlyShow) {
                            handleClick(event, row);
                          }
                        }}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.value}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell
                          padding="checkbox"
                          className={classes.borderRow}
                        >
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            disabled={onlyShow}
                            // inputProps={{
                            //   "aria-labelledby": labelId,
                            // }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={row.value}
                          scope="row"
                          padding="none"
                          className={classes.borderRowPadding}
                        >
                          {row.text}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      className={classes.tableFooter}
                      rowsPerPageOptions={[5, 10, 20, 50, 100]}
                      colSpan={3}
                      count={listPrivileges.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      labelRowsPerPage={"Số hàng/trang"}
                      labelDisplayedRows={x =>
                        ` ${(page-1) * rowsPerPage + 1} - ${(page-1) * rowsPerPage + rowsPerPage} trên ${totalRecord}`
                      }
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
});
const AccountAdd = React.memo(AccountAddFormComponent);
export { AccountAdd };
