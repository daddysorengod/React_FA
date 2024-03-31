import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    childTableGeneric: {
      "& .MuiPaper-root": {
        boxShadow: "none !important",
        backgroundColor: "transparent",
        minHeight: "unset",
      },

      "& .MuiTableContainer-root": {
        maxHeight: "480px",
        backgroundColor: "#ffffff",

        "& .Mui-selected td": {
          backgroundColor: "#DDF6E8 !important",
        },

        "& .Mui-selected:hover td": {
          backgroundColor: "#b3ebcf !important",
        },

        "& table": {
          borderWidth: "0",
          borderStyle: "solid",
          borderColor: "#CFD6DD",
          wordBreak: "break-word",

          "& thead": {
            "& tr": {
              "& th": {
                borderColor: "#CFD6DD",
                borderWidth: "1px 1px 2px 0",
                borderStyle: "solid",
                backgroundColor: "#E2E6EA",
                fontSize: "12px",
                lineHeight: "16px",
                verticalAlign: "middle",

                "& .Mui-checked": {
                  color: "#04A857",
                },
                "& .MuiCheckbox-indeterminate": {
                  color: "#04A857 ",
                },
                "& .Mui-TableHeadCell-ResizeHandle-Wrapper": {
                  right: "7px",
                  opacity: "0",
                  "& hr, hr:active": {
                    borderColor: "#000",
                    height: "38px",
                  },
                },
                "& .Mui-TableHeadCell-Content": {
                  flexDirection: "row",
                  "& .Mui-TableHeadCell-Content-Labels": {
                    padding: "0",

                    "& .Mui-TableHeadCell-Content-Wrapper": {
                      minWidth: "unset",
                    },
                  },
                  "& .Mui-TableHeadCell-Content-Actions": {
                    position: "absolute",
                    right: "0",
                  },
                },
                "& .MuiCollapse-entered.MuiCollapse-root.MuiCollapse-vertical":
                  {
                    display: "none",
                  },
              },
              "& th:nth-child(1)": {
                borderWidth: "1px 1px 2px 1px",
              },
              "& th:nth-last-child(1)": {
                borderWidth: "1px 1px 2px 1px",
                "& .Mui-TableHeadCell-ResizeHandle-Wrapper": {
                  right: "15px",
                },
              },
              "& th:nth-last-child(2)": {
                borderWidth: "1px 0 2px 0",
              },
              "& th:has(.MuiCheckbox-root)": {
                padding: "4px 12px !important",
                width: "22px",
                "& .Mui-TableHeadCell-Content": {
                  justifyContent: "center",
                },
              },
            },
          },
          "& tbody": {
            "& tr": {
              height: "auto !important",

              "& td:not(:only-child)": {
                borderColor: "#CFD6DD",
                borderWidth: "0 1px 1px 0",
                borderStyle: "solid",
                fontWeight: 400,
                fontSize: "14px !important",
                lineHeight: "20px",
                backgroundColor: "inherit",

                "& .Mui-checked": {
                  color: "#04A857",
                },
                "& .MuiSelect-select": {
                  paddingLeft: "12px",
                },
              },

              "& td:only-child": {
                borderWidth: "0 1px 1px 1px",
                borderStyle: "solid",
                borderColor: "#CFD6DD",
                "& p": {
                  maxWidth: "unset",
                },
              },

              "& td:nth-child(1)": {
                borderWidth: "0px 1px 1px 1px",
                padding: "0",
              },
              "& td:nth-last-child(1)": {
                borderWidth: "0 1px 1px 1px",
              },

              "& td:has(.MuiCheckbox-root)": {
                textAlign: "center",

                "& .MuiCheckbox-root": {
                  height: "36px !important",
                  width: "36px !important",
                  padding: "0",
                },
              },
            },
          },
        },
      },
    },
    validateTootip: {
      padding: "10px",
      cursor: "pointer",
    },
    autoValidateTootip: {
      padding: "6px",
      cursor: "pointer",
      right: "28px",
      position: "absolute",
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
    datePicker: {
      width: "100%",
      "& .MuiOutlinedInput-root": {
        paddingRight: "0",

        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#00a854",
        },

        "&.MuiInputBase-adornedEnd": {
          paddingRight: "0 !important",

          "& .MuiInputAdornment-positionEnd": {
            "& button": {
              right: "12px",
            },
          },
        },

        "& input": {
          padding: "10px 12px",
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
    datepickerValidateTootip: {
      padding: "10px",
      cursor: "pointer",
      position: "absolute",
      right: "0px",
      top: "50%",
      transform: "translate(-91%, -17%)",
    },
    timepicker: {
      width: "100%",
      "& .MuiOutlinedInput-root": {
        paddingRight: "8px",

        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#00a854",
        },

        "&.MuiInputBase-adornedEnd": {
          "& .MuiInputAdornment-positionEnd": {
            "& button": {
              right: "12px",
              color: "#00a854",
            },
          },
        },

        "& input": {
          padding: "10px 12px",
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

    requiredLabel: {
      fontWeight: "600",
      margin: "0 6px 8px 0",
      display: "inline-block",
      "&::after": {
        content: '"*"',
        color: "red",
        marginLeft: "2px",
      },
    },
    textFieldInput: {
      width: "100%",
      "& .MuiOutlinedInput-root": {
        paddingRight: "0",
        backgroundColor: "#fff",
      },
      "& .MuiOutlinedInput-root.Mui-disabled": {
        backgroundColor: "#E2E6EA",
        "& input": {
          "-webkit-text-fill-color": "#000",
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
    checkBox: {
      display: "flex",
      alignItems: "center",
      "& label": {
        fontSize: "14px",
        fontWeight: "400",
      },
    },
    textBold:{
      fontWeight: 600
    },
    textDeco:{
      textDecoration:"underline"
    },
    textItalic:{
      fontStyles:"italic"
    }
  }),
);
