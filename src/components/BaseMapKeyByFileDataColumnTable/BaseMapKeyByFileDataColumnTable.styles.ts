import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    container: {
      width: "620px",
      margin: "20px auto",
    },
    title: {
      fontSize: "20px",
      fontWeight: "700",
      lineHeight: "32px",
      marginBottom: "20px",
    },
    tableContainer: {
      maxHeight: "560px",
      overflowX: "auto",
      border: "1px solid #CFD6DD",
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#c9c9c9",
        outline: "1px solid #a0a0a0",
        borderRadius: "4px",
      },
    },
    tableHeadCell: {
      fontSize: "12px",
      fontWeight: "600",
      padding: "8px 12px",
      backgroundColor: "#E2E6EA",
      lineHeight: "16px",
      borderStyle: "solid",
      borderColor: "#CFD6DD",
      borderWidth: "0 1px 1px 0",
      width: "50%",
      "&:last-child": {
        borderWidth: "0 0px 1px 0",
      },
    },
    tableBodyRow: {
      "&:last-child": {
        "& td": {
          borderWidth: "0",
          "&:first-child": {
            borderWidth: "0 1px 0px 0px",
          },
        },
      },
    },
    tableBodyCell: {
      fontSize: "14px",
      fontWeight: "400",
      padding: "4px 12px",
      backgroundColor: "#FFF",
      lineHeight: "20px",
      borderStyle: "solid",
      borderColor: "#CFD6DD",
      borderWidth: "0 1px 1px 0",
      "&:last-child": {
        borderWidth: "0 0px 1px 0",
      },
    },
    tableCellRequiredText: {
      "&::after": {
        content: '"*"',
        color: "red",
        marginLeft: "2px",
      },
    },
  }),
);
