import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableGeneric: {
      "& > div.MuiPaper-root": {
        boxShadow: "none !important",
        backgroundColor: "unset",
        maxHeight: "100%",
        display: "flex",
        flexDirection: "column",
      },

      "& .MuiTableContainer-root": {
        backgroundColor: "#ffffff",
        maxHeight: "100%",

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
                boxShadow: "none !important",

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
              backgroundColor: "#ffffff",

              "&:hover": {
                backgroundColor: "#f2f2f2",
              },

              "& td:not(:only-child)": {
                borderColor: "#CFD6DD",
                borderWidth: "0 1px 1px 0",
                borderStyle: "solid",
                fontWeight: 400,
                fontSize: "14px !important",
                lineHeight: "20px",
                backgroundColor: "inherit",
                boxShadow: "none !important",

                "& .Mui-checked": {
                  color: "#04A857",
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
              "& td:nth-last-child(2)": {
                borderWidth: "0 0 1px 0",
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
  }),
);
