import React, { useState, useEffect, useRef } from "react";
import { useStyles } from "./TableBuilderForm.styles";
import useTranslation from "next-translate/useTranslation";
import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  ContentCopy as ContentCopyIcon,
  West as WestIcon,
  ContentPaste as ContentPasteIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import axios from "@/src/helpers/axios";
import { api, declareTableTypeContant } from "@/src/constants";
import {
  Editor,
  Monaco,
  MonacoDiffEditor,
  DiffEditor,
  DiffOnMount,
  BeforeMount,
  OnMount,
} from "@monaco-editor/react";
import { IKeyboardEvent, editor } from "monaco-editor";
import { getItemById, getListDataBase, tsEval } from "@/src/helpers";
import { FETCH_DATA_API_CONFIG_INTERFACE } from "@/src/types";
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

interface Props {
  id: string;
}
const TableBuilderFormComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { id } = props;
  const [formSubmit, setFormSubmit] = useState({
    type: "",
    code: "",
    name: "",
  });
  const editorRefCodeFromFile = useRef<any>(null);
  const editorRefSubmitCode = useRef<any>(null);
  const [codeFromFile, setCodeFromFile] = useState("");
  const [submitCode, setSubmitCode] = useState("");
  const [codeFromAPI, setCodeFromAPI] = useState("");

  const handleEditorCodeFromFileDidWillMount: BeforeMount = (
    monaco: Monaco,
  ) => {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      declareTableTypeContant,
    );
  };

  const handleEditorCodeFromFileDidMount: OnMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => {
    editor.onKeyDown(handleKeyDownSave);
    editorRefCodeFromFile.current = editor;
  };

  const handleEditorSubmitCodeDidMount: DiffOnMount = (
    editor: MonacoDiffEditor,
    monaco: Monaco,
  ) => {
    editorRefSubmitCode.current = editor;
  };

  const handleKeyDownSave = (event: IKeyboardEvent) => {
    if (event.ctrlKey && event.keyCode === 49) {
      // Xử lý sự kiện Ctrl + S ở đây
      event.preventDefault(); // Ngăn chặn lưu trang
      handleSave();
    }
  };

  const getFormData = async () => {
    if (!id) return;
    try {
      const item = await getItemById(
        id,
        "form-builder-api/find-form-table-by-id",
      );
      if (item?.type && item?.code) {
        setFormSubmit({
          type: item.type,
          code: item.code,
          name: item?.name || "",
        });

        try {
          if (item?.jsonString) {
            setCodeFromAPI(item.jsonString);
            setSubmitCode(item.jsonString);
          }
          if (item?.codeString) {
            setCodeFromFile(item.codeString);
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log("getFormData (Parse string to JSON Error): ", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${publicRuntimeConfig.ORIGIN_URL}/form-builder-api/add-or-update-table-form`,
        {
          type: formSubmit.type,
          code: formSubmit.code,
          name: formSubmit.name,
          codeString: codeFromFile,
          jsonString: submitCode,
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    handleConvertCodeFromFileToSubmitCodeJson();
    await handleSubmit();
    await getFormData();
  };

  useEffect(() => {
    if (id) {
      const asyncFunction = async () => {
        await getFormData();
      };

      asyncFunction();
      return () => {
        editorRefSubmitCode.current = null;
        editorRefCodeFromFile.current = null;
      };
    }
  }, [id]);

  const handleConvertCodeFromFileToSubmitCodeJson = async () => {
    try {
      const startIndex = codeFromFile.indexOf("{");
      const endIndex = codeFromFile.lastIndexOf("}");
      const objStr = codeFromFile.substring(startIndex, endIndex + 1);
      const res = tsEval(`(${objStr})`);
      if (res) {
        const str = JSON.stringify(res, undefined, 4);
        if (str) {
          setSubmitCode(str);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownLoadAllCodeString = async () => {
    try {
      const config: FETCH_DATA_API_CONFIG_INTERFACE = {
        url: "form-builder-api/find-form-table?pageIndex=1&pageSize=100",
      };
      const res = await getListDataBase(config);
      const codeStrings =
        declareTableTypeContant +
        `\n\n\n` +
        res.source.map(item => item.codeString).join(`\n\n\n`);

      const blob = new Blob([codeStrings], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const date = new Date();
      const formattedDate = `${date.getHours()}:${date.getMinutes()}_${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;
      link.download = `${formattedDate}_Table_Config.ts`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Box className={classes.root}>
      <Grid
        sx={{
          marginBottom: "24px",
        }}
        container
        columns={12}
        columnSpacing={4}
      >
        <Grid item md={2}>
          <label className="required-label" htmlFor="type">
            Type
          </label>
          <TextField
            fullWidth
            value={formSubmit.type}
            name="type"
            select
            onChange={event => {
              setFormSubmit({
                ...formSubmit,
                type: event.target.value,
              });
            }}
          >
            <MenuItem value={"TABLE"}>TABLE</MenuItem>
            <MenuItem value={"FROM"} disabled>
              FROM
            </MenuItem>
            <MenuItem value={"DIALOG"} disabled>
              DIALOG
            </MenuItem>
          </TextField>
        </Grid>
        <Grid item md={3}>
          <label htmlFor="code" className="required-label">
            {"Table Code"}
          </label>
          <TextField
            name="code"
            value={formSubmit.code}
            fullWidth
            onChange={event => {
              setFormSubmit({
                ...formSubmit,
                code: event.target.value,
              });
            }}
          />
        </Grid>
        <Grid item md={3}>
          <label htmlFor="name" className="required-label">
            {"Name"}
          </label>
          <TextField
            name="name"
            value={formSubmit.name}
            fullWidth
            onChange={event => {
              setFormSubmit({
                ...formSubmit,
                name: event.target.value,
              });
            }}
          />
        </Grid>
        <Grid item md={4}>
          <Box
            sx={{
              display: "flex",
              alignItems: "end",
              justifyContent: "end",
              height: "100%",
            }}
          >
            <Tooltip title="DOWNLOAD ALL TABLE CONFIG CODE STRING" arrow>
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
                onClick={handleDownLoadAllCodeString}
              >
                <DownloadIcon
                  sx={{
                    color: "#04A857",
                    bgcolor: "#DDF6E8",
                    borderRadius: "4px",
                  }}
                />
              </IconButton>
            </Tooltip>
            <Button
              sx={{
                marginLeft: "6px",
              }}
              variant="contained"
              onClick={handleSave}
            >
              Save
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Grid
        container
        columns={48}
        columnSpacing={0}
        className={classes.diffEditor}
        sx={{ height: "calc(100% - 24px)" }}
      >
        <Grid item md={27}>
          <Box
            display={"flex"}
            alignItems={"center"}
            marginBottom={"4px"}
            padding={"3px 0"}
            justifyContent={"space-between"}
          >
            <label>
              {"Code From API "}
              <Tooltip title="Copy">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => {
                    navigator.clipboard.writeText(codeFromAPI);
                  }}
                >
                  <ContentCopyIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </label>
            <label className="required-label">
              <Tooltip title="Paste">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => {
                    navigator.clipboard.readText().then(clipboardText => {
                      setSubmitCode(clipboardText);
                    });
                  }}
                >
                  <ContentPasteIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
              {" Submit Code (jsonString)"}
            </label>
          </Box>
          <DiffEditor
            height="calc(100vh - 300px)"
            language="json"
            original={codeFromAPI}
            modified={submitCode}
            onMount={handleEditorSubmitCodeDidMount}
            theme="vs-dark"
            options={{
              wordWrap: "on",
            }}
          />
        </Grid>
        <Grid item md={1}>
          <Tooltip title="Convert code to JSON">
            <IconButton
              color="primary"
              sx={{
                backgroundColor: "#d6d6d6",
              }}
              size="small"
              edge="end"
              onClick={handleConvertCodeFromFileToSubmitCodeJson}
            >
              <WestIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item md={20}>
          <Box display={"flex"} alignItems={"center"} marginBottom={"4px"}>
            <label className="required-label" htmlFor="type">
              {"Code From File (codeString)"}
            </label>
            <Tooltip title="Paste">
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  navigator.clipboard.readText().then(clipboardText => {
                    setCodeFromFile(clipboardText);
                  });
                }}
              >
                <ContentPasteIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Box className={classes.formatCodeEx}>
              <Tooltip title="Copy">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "const TABLE_OPTIONS: TABLE_OPTIONS_INTERFACE = {};",
                    );
                  }}
                >
                  <ContentCopyIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
              <span>
                <span>{"const "}</span>
                <span>{"TABLE_OPTIONS"}</span>
                <span>{":"}</span>
                <span>{"TABLE_OPTIONS_INTERFACE "}</span>
                <span>{"="}</span>
                <span>{"{"}</span>
                <span>{"..."}</span>
                <span>{"}"}</span>
                <span>{";"}</span>
              </span>
            </Box>
          </Box>
          <Editor
            height="calc(100vh - 300px)"
            defaultLanguage="typescript"
            value={codeFromFile}
            beforeMount={handleEditorCodeFromFileDidWillMount}
            onMount={handleEditorCodeFromFileDidMount}
            onChange={(value, event) => {
              if (!value) return;
              setCodeFromFile(value);
            }}
            theme="vs-dark"
            options={{
              readOnly: false,
              formatOnPaste: true,
              formatOnType: true,
              renderWhitespace: "all",
              wordWrap: "on",
              fontSize: 12,
            }}
          />
        </Grid>
      </Grid>

      <style lang="scss">
        {`
                .MuiTooltip-popper {
                  .MuiTooltip-tooltip {
                    background-color: white !important;
                    color: #262626;
                  }
                }
      `}
      </style>
    </Box>
  );
};
const TableBuilderForm = React.memo(TableBuilderFormComponent);
export { TableBuilderForm };
