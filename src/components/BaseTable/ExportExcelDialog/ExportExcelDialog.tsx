import React, { useState, memo, useEffect } from "react";
import {
  Box,
  Tooltip,
  Button,
  IconButton,
  MenuItem,
  Menu,
  Grid,
} from "@mui/material";
import { Close as CloseIcon, GetApp as GetAppIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useStyles } from "./ExportExcelDialog.styles";
import useTranslation from "next-translate/useTranslation";
import { CO_TYPE } from "@/src/constants/generic-table";

interface Props {}

const ExportExcelDialogComponent = (props: any): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { visibleDialog, onCloseDialog, onSubmit, visibleColumns } = props;
  const dataListColumn = props.dataListColumn.filter(
    item => item.key != CO_TYPE.SETTING,
  );

  const temp = React.useRef(1);
  const sodu = dataListColumn.length % 3;

  if (sodu != 0) {
    for (let i = 0; i < 3 - sodu; i++) {
      dataListColumn.push({ temp: temp.current });
      temp.current++;
    }
  }

  const [selectedColumns, setSelectedColumns] = useState<string[]>(() => {
    let listInVisible = Object.keys(visibleColumns).filter(
      ele => !visibleColumns[ele],
    );

    return dataListColumn
      .map(ele => ele.key)
      .filter(
        key =>
          !listInVisible.includes(key) && key != CO_TYPE.SETTING,
      );
  });

  const [selectAll, setSelectAll] = useState(false);

  const handleCloseDialog = () => {
    setSelectedColumns([]);
    setSelectAll(false);
    onCloseDialog();
  };

  const handleExport = () => {
    onSubmit(selectedColumns);
  };

  const handleColumnSelection = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const columnName = event.target.name;

    setSelectedColumns(prev => {
      if (event.target.checked) {
        return [...prev, columnName];
      } else {
        return prev.filter(item => item !== columnName);
      }
    });
  };

  useEffect(() => {
    if (
      selectedColumns.length ==
      dataListColumn.length - (sodu > 0 ? 3 - sodu : 0)
    ) {
      setSelectAll(true);
    } else setSelectAll(false);

    return () => {
      temp.current = 1;
    };
  }, [selectedColumns]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      // Add all product names to selectedProducts
      setSelectedColumns(() => {
        return dataListColumn.filter(item => item.key).map(item => item.key);
      });
    } else {
      // Clear selectedProducts
      setSelectedColumns([]);
    }
  };

  useEffect(() => {
    setSelectedColumns(() => {
      let listInVisible = Object.keys(visibleColumns).filter(
        ele => !visibleColumns[ele],
      );

      return dataListColumn
        .map(ele => ele.key)
        .filter(
          key =>
            !listInVisible.includes(key) && key != CO_TYPE.SETTING,
        );
    });
  }, [visibleDialog]);

  return (
    <Dialog open={visibleDialog} fullWidth={true} maxWidth={"md"}>
      <DialogTitle className={classes.dialogTitle}>
        <Box className={classes.dialogLabel}>Xuất Excel</Box>
        <IconButton
          onClick={() => {
            handleCloseDialog();
          }}
        >
          <CloseIcon className={classes.closeBtn}></CloseIcon>
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Box
          sx={{
            minHeight: "400px",
            padding: "0 20px 40px 20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              margin: "12px 0",
            }}
          >
            <Box
              sx={{
                fontWeight: "700",
                fontSize: "16px",
                lineHeight: "24px",
                marginRight: "16px",
              }}
            >
              Chọn cột muốn xuất excel
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  id={`export-excel-all`}
                  name={"all"}
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              }
              label={"Tất cả"}
            />
          </Box>
          <Box
            sx={{
              marginBottom: "140px",
            }}
          >
            <Grid container columns={12} rowSpacing={1}>
              {dataListColumn.map((item: any) => {
                if (item.key == CO_TYPE.SETTING) return;
                return (
                  <Grid
                    key={item?.key || item?.temp}
                    item
                    md={4}
                    sx={{
                      borderColor: "#E2E6EA",
                      borderStyle: "solid",
                      borderWidth: "0 0 1px 0",
                      padding: "0 16px 8px 0",
                    }}
                  >
                    {item.key ? (
                      <FormControlLabel
                        control={
                          <Checkbox
                            id={`export-excel-${item.key}`}
                            name={item.key}
                            checked={selectedColumns.includes(item.key)}
                            onChange={handleColumnSelection}
                          />
                        }
                        label={item.label}
                      />
                    ) : (
                      <></>
                    )}
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Box>
        <Box
          sx={{
            height: "76px",
            boxShadow: "inset 0px 1px 0px #E9E9E9",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 20px",

            "& .Mui-disabled": {
              bgcolor: "#008245 !important",
              color: "#caecdc !important",
            },
          }}
        >
          <Button
            variant="contained"
            startIcon={<GetAppIcon />}
            disabled={selectedColumns.length == 0}
            onClick={() => {
              handleExport();
            }}
            sx={{
              boxShadow: 0,
            }}
          >
            Tải Xuống File Excel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
const ExportExcelDialog = React.memo(ExportExcelDialogComponent);
export { ExportExcelDialog };
