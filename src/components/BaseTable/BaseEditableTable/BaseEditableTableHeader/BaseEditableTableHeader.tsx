import React from "react";
import { useStyles } from "./BaseEditableTableHeader.styles";
import useTranslation from "next-translate/useTranslation";
import { Box, Button, Tooltip, IconButton } from "@mui/material";
import { Add as AddIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { MRT_GlobalFilterTextField } from "material-react-table";
interface Props {
  table: any;
  tableTitle?: string;
  onlyShow: boolean;
  showAddNewButton: boolean;
  showRefreshButton: boolean;
  onAddNewRow: Function;
  onRefresh: Function;
}
const BaseEditableTableHeaderComponent = ({
  table,
  tableTitle,
  onlyShow,
  showAddNewButton,
  showRefreshButton,
  onAddNewRow,
  onRefresh,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();

  const handleAddNewRow = () => {
    onAddNewRow();
  };

  const handleRefresh = () => {
    onRefresh();
  };
  return (
    <>
      <Box className={classes.topTable}>
        <Box className={classes.topTableLeft}>
          {tableTitle ? (
            <Box className={classes.tableTitle}>{tableTitle || ""}</Box>
          ) : (
            <></>
          )}

          <MRT_GlobalFilterTextField table={table} />
        </Box>
        <Box>
          {showRefreshButton && !onlyShow ? (
            <Tooltip title="Refresh" arrow>
              <IconButton
                aria-label="refresh"
                sx={{
                  height: "40px",
                  padding: "5px",
                  margin: "0 3px",
                  "& .MuiSvgIcon-root": {
                    fontSize: "30px",
                  },
                }}
                onClick={() => {
                  handleRefresh();
                }}
              >
                <RefreshIcon
                  sx={{
                    color: "#04A857",
                    bgcolor: "#DDF6E8",
                    borderRadius: "4px",
                  }}
                />
              </IconButton>
            </Tooltip>
          ) : (
            <></>
          )}
          {showAddNewButton && !onlyShow ? (
            <Button
              variant="contained"
              className={classes.addNewBtn}
              startIcon={<AddIcon />}
              sx={{
                boxShadow: 0,
              }}
              onClick={() => {
                handleAddNewRow();
              }}
            >
              Thêm mới
            </Button>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </>
  );
};
const BaseEditableTableHeader = React.memo(BaseEditableTableHeaderComponent);
export { BaseEditableTableHeader };
