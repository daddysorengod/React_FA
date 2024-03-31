import React, { useState, useRef, useEffect } from "react";
import { useStyles } from "./DialogViewJson.styles";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { TransitionProps } from "@mui/material/transitions";
import { ButtonBase } from "@mui/material";
import { ImagesSvg } from "@/src/constants/images";
import { Box, Button, Grid, IconButton, Tooltip } from "@mui/material";
import {
  ContentCopy as ContentCopyIcon,
  West as WestIcon,
  ContentPaste as ContentPasteIcon,
} from "@mui/icons-material";
import {
  Monaco,
  MonacoDiffEditor,
  DiffEditor,
  DiffOnMount,
} from "@monaco-editor/react";

import { IForm } from "@/src/types/field";
import { saveJsonReducer } from "@/src/store/reducers/formBuilder";
import { dispatch } from "@/src/store";
interface Props {
  visibleDialog: boolean;
  handleClose: any;
  formData: IForm;
  setFormData: React.Dispatch<React.SetStateAction<IForm>>;
}
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogViewJsonComponent = (props: Props): JSX.Element => {
  const classes = useStyles();
  const { visibleDialog, handleClose, formData, setFormData } = props;
  const onPressSaveJson = () => {
    try {
      dispatch(saveJsonReducer(formData));
    } catch (error) {
      console.log(error);
    }
  };
  const editorRefSubmitCode = useRef<any>(null);
  const [submitCode, setSubmitCode] = useState("");
  const [codeFromAPI, setCodeFromAPI] = useState("");

  const handleEditorSubmitCodeDidMount: DiffOnMount = (
    editor: MonacoDiffEditor,
    monaco: Monaco,
  ) => {
    editorRefSubmitCode.current = editor;
  };

  const getFormData = async () => {
    // if (!id) return;
    try {
      setCodeFromAPI(JSON.stringify(formData, undefined, 4));
      setSubmitCode(JSON.stringify(formData, undefined, 4));
    } catch (error) {
      console.log("getFormData (Parse string to JSON Error): ", error);
    }
  };

  useEffect(() => {
    const asyncFunction = async () => {
      await getFormData();
    };
    asyncFunction();
  }, [formData]);

  const handleSubmit = async () => {
    handleClose();
    try {
      const editValue: IForm = JSON.parse(
        editorRefSubmitCode.current?.getModifiedEditor()?.getValue(),
      );
      setFormData(editValue);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      open={visibleDialog}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
      id="ViewFieldModal"
      fullScreen
    >
      <DialogTitle
        id="json-view"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#272E36",
          padding: "20px",
        }}
      >
        <label style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
          {"Chi tiết cấu hình"}
        </label>
        <button
          onClick={handleClose}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <img src={ImagesSvg.closeIcon} />
        </button>
      </DialogTitle>
      <DialogContent style={{ backgroundColor: "#F4F7FA" }}>
        <div
          style={{
            borderRadius: 8,
            width: "100%",
            padding: "40px 0px",
            height: 500,
          }}
        >
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              sx={{
                position: "sticky",
                display: "flex",
                zIndex: 1000,
                padding: "0 0 20px 0",
                top: 0,
                right: 90,
                backgroundColor: "#F4F7FA",
              }}
            >
              <Grid item md={6}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "start",
                    height: "100%",
                  }}
                >
                  <ButtonBase
                    className={classes.common_button}
                    onClick={onPressSaveJson}
                  >
                    Tải về
                  </ButtonBase>
                </Box>
              </Grid>
              <Grid item md={6}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "end",
                    height: "100%",
                  }}
                >
                  <Button
                    color="inherit"
                    variant="contained"
                    onClick={() => {
                      handleClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    sx={{
                      marginLeft: "6px",
                    }}
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                columns={48}
                columnSpacing={0}
                className={classes.diffEditor}
              >
                <Grid item md={48}>
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
                            navigator.clipboard
                              .readText()
                              .then(clipboardText => {
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
                    height="680px"
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
              </Grid>
            </Grid>
          </Grid>
        </div>
      </DialogContent>
      <div></div>
    </Dialog>
  );
};
const DialogViewJson = React.memo(DialogViewJsonComponent);
export { DialogViewJson };
