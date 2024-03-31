import React, { useMemo } from "react";
import MaterialReactTable, {
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit, Refresh as RefreshIcon } from "@mui/icons-material";
// import { data, states } from "./makeData";
import { useStyles } from "./TableForm.styles";
/// import store
import { dispatch, useSelector } from "@store/store";
import { RootStateProps } from "@app/types/root";
import { FormBuilder, IForm } from "@/src/types/field";
import {
  deleteFormSetting,
  getFormDataSetting,
  getListFormConfigFromCodesFormBuilder,
  setFormBuilderSettings,
} from "@/src/store/reducers/formBuilder";
import { setIsLoading } from "@/src/store/reducers/menu";
/// end import store

interface Props {
  handleOpenAddNewFormDialog: VoidFunction;
}

const TableFormComponent = (props: Props): JSX.Element => {
  // const [tableData, setTableData] = useState<any>(() => []);
  const classes = useStyles();
  const { handleOpenAddNewFormDialog } = props;
  const tableData =
    useSelector((state: RootStateProps) => state.formBuilder.listForms) ?? [];

  const handleEditRow = async (row: MRT_Row<IForm>) => {
    handleOpenAddNewFormDialog();
    await dispatch(getFormDataSetting(row?.original?.id));
  };

  const handleRefresh = async () => {
    dispatch(setIsLoading(true));
    await dispatch(getListFormConfigFromCodesFormBuilder());
    dispatch(setIsLoading(false));
  };

  const handleDeleteRow = (row: MRT_Row<IForm>) => {
    dispatch(deleteFormSetting(row?.original?.id));
  };

  const columns = useMemo<MRT_ColumnDef[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: "addNewFormName",
        header: "Tên cấu hình",
        size: 140,
      },
      {
        accessorKey: "code",
        header: "Mã code",
      },
      {
        accessorKey: "formType",
        header: "Loại cấu hình",
      },
      {
        accessorKey: "description",
        header: "Mô tả",
        size: 180,
      },
    ],
    [],
  );

  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            },
            size: 120,
          },
        }}
        columns={columns}
        data={tableData}
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        onEditingRowSave={() => {}}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => handleEditRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Box>
            <Button
              className={classes.common_button}
              // color="secondary"
              onClick={() => {
                handleOpenAddNewFormDialog();
                dispatch(setFormBuilderSettings({ ...new FormBuilder() }));
              }}
              variant="contained"
            >
              Thêm mới
            </Button>
            <Tooltip title="Refresh" arrow>
              <IconButton
                aria-label="refresh"
                className={classes.refreshButton}
                onClick={() => {
                  handleRefresh();
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
    </>
  );
};

const TableForm = React.memo(TableFormComponent);
export { TableForm };
