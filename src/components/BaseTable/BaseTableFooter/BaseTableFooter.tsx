import React from "react";
import { Box } from "@mui/material";
import {
  MRT_TablePagination,
  MRT_ToolbarAlertBanner,
} from "material-react-table";
import { useStyles } from "./BaseTableFooter.styles";
import useTranslation from "next-translate/useTranslation";

interface Props {
  table: any;
}
const BaseTableFooterComponent = (props: Props): JSX.Element => {
  const { table } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #CFD6DD",
        borderWidth: "1px 2px 2px 2px",
      }}
    >
      <Box
        sx={{
          "& .MuiAlert-message": {
            bgcolor: "#fff !important",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "20px",
            margin: "0",
          },
        }}
      >
        <MRT_ToolbarAlertBanner stackAlertBanner table={table} />
      </Box>
      <Box
        sx={{
          bgcolor: "#fff !important",
          "& .MuiTablePagination-toolbar": {
            minHeight: "32px",
            paddingTop: "4px",
            paddingBottom: "4px",
          },
        }}
      >
        <MRT_TablePagination table={table} />
      </Box>
    </Box>
  );
};
const BaseTableFooter = React.memo(BaseTableFooterComponent);
export { BaseTableFooter };
