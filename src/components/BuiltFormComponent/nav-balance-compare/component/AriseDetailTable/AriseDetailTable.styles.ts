import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
export const useStyles = makeStyles((theme: Theme) => createStyles({
  tableContainer: {
    // overflowX: "auto",
    border: "1px solid #CFD6DD",
    borderRadius: "4px",
    width: "unset",
    "&::-webkit-scrollbar": {
      width: "8px",
      height: "8px",
      borderRadius: "4px"
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#c9c9c9",
      // outline: "1px solid #a0a0a0",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-track": {
      outline: "1px solid #CFD6DD",
      borderRadius: "8px",
      margin: 5
    },
    maxHeight:"600px"
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
    "&:last-child": {
      borderWidth: "0 1px 1px 0",
    },
    width: 300
  },
  tableBodyRow: {
    "&:last-child": {
      "& td": {
        borderWidth: "0 1px 0 0",
        "&:first-child": {
          borderWidth: "0 1px 0 0",
        },
        "&:last-child": {
          borderWidth: "0",
        },
      },
    },
    maxHeight: 40
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
  cellEditInput: {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      paddingRight: "0",

      "&.MuiInputBase-adornedEnd": {
        paddingRight: "0 !important",

        "& .MuiInputAdornment-positionEnd": {
          position: "relative",
          width: "34px",
          marginLeft: "0 !important",
        },
      },

      "& input": {

        "&.Mui-disabled": {
          "-webkit-text-fill-color": "#262626",
        },
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: "unset",
      borderWidth: 0,
      "&:focus": {
        borderWidth: 1,
      },
    },
  },
  cellEditInput2: {
    "& input": {
      textAlign: "end",
    },
    width: "100%",
    "& .MuiOutlinedInput-root": {
      paddingRight: "0",

      "&.MuiInputBase-adornedEnd": {
        paddingRight: "0 !important",

        "& .MuiInputAdornment-positionEnd": {
          position: "relative",
          width: "34px",
          marginLeft: "0 !important",
        },
      },

      "& input": {
        padding: "10px 12px",
        "&.Mui-disabled": {
          "-webkit-text-fill-color": "#262626",
        },
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: "unset",
      borderWidth: 0,
      "&:focus": {
        borderWidth: 1,
      },
    },
  },
  tableBodyEditCell: {
    // fontSize: "14px",
    // fontWeight: "400",
    padding: "0px",
    backgroundColor: "#FFF",
    // lineHeight: "20px",
    borderStyle: "solid",
    borderColor: "#CFD6DD",
    borderWidth: "0 1px 1px 0",
    // "&:last-child": {
    //   borderWidth: "0 0px 1px 0",
    // },
    // width:"100%",
    // padding:"0"
    marginLeft: "10px"
  },
  tableBodyNoEditCell: {
    fontSize: "14px",
    fontWeight: "400",
    backgroundColor: "#FFF",
    lineHeight: "20px",
    borderStyle: "solid",
    borderColor: "#CFD6DD",
    borderWidth: "0 1px 1px 0",
    "&:last-child": {
      borderWidth: "0 0px 1px 0",
    },
    width: "100%",
    padding:"0px 14px 0px 14px",
    maxHeight:"55px",
    height:"53px",
    overflow:"hidden",
    textOverflow: 'ellipsis',
    // whiteSpace: 'nowrap', // Ngăn chặn ngắt dòng nội dung

  },
  tableCellRequiredText: {
    "&::after": {
      content: '"*"',
      color: "red",
      marginLeft: "2px",
    },
  },
  customBgLight: {
    backgroundColor: "#F4F7FA"
  },
  customBgLight1: {

  },
  stickyHeaderSTK: {
    position: 'sticky',
    left: 0,
    zIndex: 4000,
    minWidth: '126px'
  },
  stickyHeaderTK: {
    position: 'sticky',
    left: 0,
    // zIndex: 4000,
    minWidth: '360px'
  },
  stickyHeaderFirst: {
    // position: 'sticky',
    // left: 0,
    // zIndex: 2000,
  },
  stickyHeaderSecond: {
    position: 'sticky',
    top: 33,
    zIndex: 3000,
  },
  stickyColumn: {
    position: 'sticky',
    left: 0,
    zIndex: 999,
  },
  stickyColumn2: {
    // position: 'sticky',
    // left: 54.5, 
    // zIndex: 2000, 
  },
  alignRightInput:{
    "& input": {
      textAlign: "end",
      margin: "0px 14px 0px 0px",
      "&:focus":{
        textAlign: "start",
      }
    },
  },
  maxHeightRow:{
    maxHeight : "55px !important"
  },
  chipBase: {
    "& div.dot": {
      width: "4px",
      aspectRatio: "1",
      borderRadius: "50%",
      margin: "0 0 0 10px !important",
    },
  },
  statusCode:{
    backgroundColor: "#D1E7FF",
      "& div.dot": {
        backgroundColor: "#00A3FF",
      },
      "& span": {
        color: "#00A3FF",
      },
  },
  statusCode1:{
    backgroundColor: "#D1E7FF",
      "& div.dot": {
        backgroundColor: "#00A3FF",
      },
      "& span": {
        color: "#00A3FF",
      },
  },
  statusCode2:{
    backgroundColor: "#D1E7FF",
      "& div.dot": {
        backgroundColor: "#04A857",
      },
      "& span": {
        color: "#04A857",
      },
  },
  statusCode3:{
    backgroundColor: "#D1E7FF",
      "& div.dot": {
        backgroundColor: "#E6544F",
      },
      "& span": {
        color: "#E6544F",
      },
  },
  statusCode4:{
    backgroundColor: "#D1E7FF",
      "& div.dot": {
        backgroundColor: "#FFB80B",
      },
      "& span": {
        color: "#FFB80B",
      },
  },
}));