import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: "14px",
      color: " #272E36",
      lineHeight: "20px",
      letterSpacing: "-0.14px",
      fontWeight: "400",
      marginTop: "16px",
    },
    title: {
      fontSize: "20px",
      fontWeight: "700",
      lineHeight: "32px",
      letterSpacing: "-0.4px",
      marginBottom: "16px",
    },
    label: {
      fontSize: "14px",
      fontWeight: "600",
      margin: "0 6px 12px 0",
    },
    requiredLabel: {
      fontWeight: "600",
      margin: "0 6px 12px 0",
      "&::after": {
        content: '"*"',
        color: "red",
        marginLeft: "2px",
      },
    },
    inputLabel: {
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "4px",
      display: "inline-block !important",
      cursor: "pointer",
    },
    requiredInputLabel: {
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "4px",
      display: "inline-block !important",
      cursor: "pointer",
      "&::after": {
        content: '"*"',
        color: "red",
        marginLeft: "2px",
      },
    },
    datepickerValidateTootip: {
      padding: "10px",
      cursor: "pointer",
      position: "absolute",
      right: "0px",
      top: "32%",
      transform: "translate(-90%, -30%)",
    },
    select: {
      backgroundColor: "#fff",
      "& .MuiInputBase-root": {
        padding: "0 40px 0 0",
        "&.Mui-disabled": {
          "-webkit-text-fill-color": "#262626",
          backgroundColor: "#E2E6EA",
        },
        "& input": {
          boxSizing: "border-box",
          fontSize: "14px",
          lineHeight: "20px",
          height: "32px",
          padding: "6px 8px !important",
          borderRadius: "4px",
          "-webkit-text-fill-color": "inherit",
        },
        "&.MuiInputBase-adornedEnd": {
          paddingRight: "0 !important",
          "& .MuiInputAdornment-positionEnd": {
            position: "relative",
            width: "65px",
            marginLeft: "0 !important",
          },
          "& .MuiAutocomplete-endAdornment": {
            right: "4px !important",
            paddingRight: "0 !important",
            "& .MuiAutocomplete-clearIndicator": {
              display: "none",
            },
          },
        },
      },
    },
    autoValidateTootip: {
      padding: "6px",
      cursor: "pointer",
      right: "28px",
      position: "absolute",
    },
    textFieldInputValidateTootip: {
      padding: "6px",
      cursor: "pointer",
      right: "8px",
      position: "absolute",
    },
    textFieldInput: {
      width: "100%",
      "& .MuiOutlinedInput-root": {
        paddingRight: "0",
        backgroundColor: "#fff",
        color: "#262626",
      },
      "& .MuiOutlinedInput-root.Mui-disabled": {
        backgroundColor: "#E2E6EA",
        "& input": {
          "-webkit-text-fill-color": "#262626",
        },
      },
      "& input": {
        boxSizing: "border-box",
        display: "block",
        fontSize: "14px",
        lineHeight: "20px",
        height: "32px",
        padding: "6px 40px 6px 8px",
        borderRadius: "4px",
        border: "none !important",
      },
    },
    autocompleteWithHeader: {
      width: "100%",
      "& .MuiOutlinedInput-root": {
        paddingRight: "0",
        backgroundColor: "#fff",
      },
      "& .MuiOutlinedInput-root.Mui-disabled": {
        backgroundColor: "#E2E6EA",
        "& input": {
          "-webkit-text-fill-color": "#262626",
        },
      },
      "& input": {
        boxSizing: "border-box",
        display: "block",
        fontSize: "14px",
        lineHeight: "20px",
        height: "32px",
        padding: "6px 12px 6px 8px",
        borderRadius: "4px",
        border: "none !important",
      },
    },
    datePicker: {
      width: "100%",
      "& .MuiOutlinedInput-root": {
        paddingRight: "0",
        backgroundColor: "#fff",
      },
      "& .MuiOutlinedInput-root.Mui-disabled": {
        backgroundColor: "#E2E6EA",
        "& input": {
          "-webkit-text-fill-color": "#262626",
        },
      },
      "& input": {
        boxSizing: "border-box",
        display: "block",
        fontSize: "14px",
        lineHeight: "20px",
        height: "32px",
        padding: "6px 40px 6px 8px",
        borderRadius: "4px",
        border: "none !important",
      },

      "& .MuiInputAdornment-positionEnd": {
        "& .MuiIconButton-root": {
          marginRight: "0",
        },
      },
    },
    form: {
      minHeight: "328px",
      marginBottom: "20px",
    },
    topForm: {
      marginBottom: "20px",
    },
    formSelectMonth: {
      marginBottom: "20px",
      "& label": {
        cursor: "pointer",
      },
    },
    formSelectDay: {},
    checkBox: {
      display: "flex",
      alignItems: "center",
    },
    tableContainer: {
      overflowX: "auto",
      border: "1px solid #CFD6DD",
      borderRadius: "4px",
      width: "unset",
      "&::-webkit-scrollbar": {
        width: "8px",
        height: '10px',
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#c9c9c9",
        outline: "1px solid #a0a0a0",
        borderRadius: "4px",
        height: '50px',
      },
      "&::-webkit-scrollbar-track": {
        outline: "1px solid #CFD6DD",
        borderRadius: "4px",
        height: '10px',
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
      "&:last-child": {
        borderWidth: "0 1px 1px 0",
      },
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
    },
    tableBodyCell: {
      fontSize: "14px",
      fontWeight: "400",
      padding: "8px 12px",
      backgroundColor: "#FFF",
      lineHeight: "20px",
      borderStyle: "solid",
      borderColor: "#CFD6DD",
      borderWidth: "0 1px 1px 0",
      "&:last-child": {
        borderWidth: "0 0px 1px 0",
      },
    },
    tableBodyEditCell: {
      fontSize: "14px",
      fontWeight: "400",
      padding: "0",
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

    cellEditAutocomplete: {
      width: "100%",
      "& .MuiOutlinedInput-root": {
        paddingRight: "0",

        "& input.MuiOutlinedInput-input": {
          height: "20px",
        },

        "&.MuiInputBase-adornedEnd": {
          paddingRight: "0 !important",

          // AutoComplete Edit cell
          "& .MuiInputAdornment-positionEnd": {
            position: "relative",
            width: "65px",
            marginLeft: "0 !important",
          },
          "& .MuiAutocomplete-endAdornment": {
            right: "4px !important",
            paddingRight: "0 !important",
            "& .MuiAutocomplete-clearIndicator": {
              display: "none",
            },
          },
        },
        "& .MuiAutocomplete-endAdornment": {
          paddingRight: "30px !important",
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
    cellEditManual:{
      width: "150px",
      "& .MuiOutlinedInput-root": {
        paddingRight: "0",

        "& input.MuiOutlinedInput-input": {
          height: "20px",
        },

        "&.MuiInputBase-adornedEnd": {
          paddingRight: "0 !important",

          // AutoComplete Edit cell
          "& .MuiInputAdornment-positionEnd": {
            position: "relative",
            width: "65px",
            marginLeft: "0 !important",
          },
          "& .MuiAutocomplete-endAdornment": {
            right: "4px !important",
            paddingRight: "0 !important",
            "& .MuiAutocomplete-clearIndicator": {
              display: "none",
            },
          },
        },
        "& .MuiAutocomplete-endAdornment": {
          paddingRight: "30px !important",
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
    cellEditTextManual:{
      width: "300px",
      "& .MuiOutlinedInput-root": {
        paddingRight: "0",

        "& input.MuiOutlinedInput-input": {
          height: "20px",
        },

        "&.MuiInputBase-adornedEnd": {
          paddingRight: "0 !important",

          // AutoComplete Edit cell
          "& .MuiInputAdornment-positionEnd": {
            position: "relative",
            width: "65px",
            marginLeft: "0 !important",
          },
          "& .MuiAutocomplete-endAdornment": {
            right: "4px !important",
            paddingRight: "0 !important",
            "& .MuiAutocomplete-clearIndicator": {
              display: "none",
            },
          },
        },
        "& .MuiAutocomplete-endAdornment": {
          paddingRight: "30px !important",
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
    
    cellEditNameManual:{
      width: "450px",
      "& .MuiOutlinedInput-root": {
        paddingRight: "0",

        "& input.MuiOutlinedInput-input": {
          height: "20px",
        },

        "&.MuiInputBase-adornedEnd": {
          paddingRight: "0 !important",

          // AutoComplete Edit cell
          "& .MuiInputAdornment-positionEnd": {
            position: "relative",
            width: "65px",
            marginLeft: "0 !important",
          },
          "& .MuiAutocomplete-endAdornment": {
            right: "4px !important",
            paddingRight: "0 !important",
            "& .MuiAutocomplete-clearIndicator": {
              display: "none",
            },
          },
        },
        "& .MuiAutocomplete-endAdornment": {
          paddingRight: "30px !important",
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
    stickyAmount :{
      position: 'sticky',
      right: 60,
      zIndex: 5000,
    },
    stickyTableCell :{
      position: 'sticky',
      right: 0,
      zIndex: 4000,
    },
    common_button: {
      width: 138,
      display: "inline-block",

      padding: "8px 16px",
      backgroundColor: "#04A857",
      border: "1px solid #04A857",
      color: "#fff",
      textAlign: "center",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
      borderRadius: "4px",
      "&:hover": {
        backgroundColor: "#04954d",
        borderColor: "#04954d",
      },
      "& .MuiLoadingButton-loadingIndicator": {
        top: "50%",
        left: "16%",
        transform: "translate(-50%, -50%)",
      },
    },
    commonButtonBack: {
      width: 138,
      display: "inline-block",
      padding: "8px 16px",
      backgroundColor: "#E2E6EA",
      border: "1px solid #E2E6EA",
      color: "#454D59",
      textAlign: "center",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
      borderRadius: "4px",
    },

    //style contract settlement form
    formContract : {
      backgroundColor: "#f4f7fa", 
      height: "100%"
    },
    formContractContainer : {
      height: "100%",
      "& .MuiGrid-item": {
        height: "100%",
      },
    },
    formContractContent : {
      padding: "20px 0 20px 20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "calc(100% - 40px)",
    },
    formContractContentTop : {
      marginBottom: "40px"
    },
    //table chi tiết bút toán
    formAccountingEntry : {
      fontSize: "16px",
      fontWeight: "700",
      lineHeight: "24px",
      marginBottom: "16px",
    },
    customDetailEntry: {
      maxHeight: "22vh",
    },

    //form balance compare
    marginGrid : {
      marginTop: "25px"
    },
    styleTabTable:{
      marginBottom: "20px"
    },
    styleTabName:{
      fontSize: "16px",
      fontWeight: "700",
      lineHeight: "24px",
      marginBottom: "8px",
    },
    styleTabOption:{
      height: "calc(55% - 20px)"
    },
    styleTab:{
      marginBottom: "8px",
      borderBottom: "1px solid #E2E6EA",
    },
    styleTabContent:{
      height: "360px"
    },
    styleTabEvent:{
      height: "70%"
    },
    eventAccounting:{
      height: "30%"
    },
    //check tab
   ariseDetailTable:{
      height: "100%",
      marginTop: "30px",
    },
    displayNone:{
      display:"none"
    },

    //style account and group function
    tableFooter: {
      padding: "0px !important",
      // backgroundColor:"red",
      // color:"red"
      "& .MuiTablePagination-toolbar": {
        padding: 0,
        border: "1px #CFD6DD solid",
      },
    },
    checkBoxHeader: {
      backgroundColor: "#E2E6EA",
    },
    tableHeaderCell : {
      border: "1px #CFD6DD solid",
      paddingLeft: "10px",
      fontSize: "14px",
      fontWeight: "600",
      
    },
    borderRow: {
      border: "1px #CFD6DD solid",
    },
    borderRowPadding: {
      border: "1px #CFD6DD solid",
      paddingLeft: "10px",
    },
    tableAccount:{
      width: "100%", 
      marginTop: "40px"
    },
    tableAccountHead:{
      minWidth: '750px', 
      border: "1px #CFD6DD solid"
    },
    formGroupFunction:{
      marginTop: "20px",
    },
    tableGroupFunction:{
      marginBottom: "48px", 
    },
    tableGroupFunctionTop:{
      marginBottom: "20px"
    },
    checkboxGroupFunction:{
      margin: "20px 0",
      display: "flex",
      alignItems: "center",
    },
    tableAccountDetail:{
      marginBottom: "20px",
      "& .MuiPaper-root":{
        minHeight: '300px',
      }
    },
  }),
);
