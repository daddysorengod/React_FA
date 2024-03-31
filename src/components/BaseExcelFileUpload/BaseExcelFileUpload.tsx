import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useStyles } from "./BaseExcelFileUpload.styles";
import useTranslation from "next-translate/useTranslation";
import {
  Box,
  Button,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Close as CloseIcon,
  InsertDriveFileOutlined as InsertDriveFileOutlinedIcon,
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { downloadExcelFileTemplate } from "@/src/helpers";
interface Props {
  fileExcel: File | null;
  headerRow: number | null;
  templateFileUrl?: string;
}
const BaseExcelFileUploadComponent = forwardRef(
  (props: Props, ref: any): JSX.Element => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { fileExcel, headerRow, templateFileUrl } = props;

    const [titleRow, setTitleRow] = useState<number>(1);
    const [fileInput, setFileInput] = useState<File | null>(null);

    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState<string>("");
    const [fileSize, setFileSize] = useState<number>(0);

    const handleDrop = (acceptedFiles: any) => {
      const file = acceptedFiles?.[0];
      if (file instanceof File) {
        setTitleRow(1);
        setProgress(0);
        setFileInput(file);
        setFileName(file.name);
        setFileSize(file.size);
        simulateFileUpload(file.size);
      }
    };

    const simulateFileUpload = (size: number) => {
      const totalSize = size;
      let uploadedSize = 0;
      const step = totalSize / 5;

      const simulateUploadProgress = () => {
        if (uploadedSize <= totalSize) {
          const percentage = Math.min(
            Math.round((uploadedSize / totalSize) * 100),
            100,
          );
          setProgress(percentage);
          uploadedSize += step;
          setTimeout(simulateUploadProgress, 200);
        } else {
          uploadedSize = totalSize;
        }
      };

      setTimeout(simulateUploadProgress, 200);
    };

    const handleClearFile = () => {
      setFileInput(null);
      setFileName("");
      setFileSize(0);
      setProgress(0);
    };

    const convertFileSizeString = (sizeInBytes: number): string => {
      const kiloBytes: number = 1024;
      const megaBytes: number = kiloBytes * 1024;

      if (sizeInBytes < kiloBytes) {
        return sizeInBytes + " B";
      } else if (sizeInBytes < megaBytes) {
        return (sizeInBytes / kiloBytes).toFixed(2) + " KB";
      } else {
        return (sizeInBytes / megaBytes).toFixed(2) + " MB";
      }
    };

    const {
      getRootProps,
      getInputProps,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      onDrop: handleDrop,
      maxFiles: 1,
      accept: {
        "application/vnd.ms-excel": [".xls"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
        ],
      },
    });

    const style = useMemo(
      () => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {}),
      }),
      [isFocused, isDragAccept, isDragReject],
    );

    const generateSubmitForm = (): any => {
      return {
        file: fileInput,
        titleRow: titleRow,
      };
    };

    useImperativeHandle(ref, () => ({
      onSubmitRef() {
        const payload = generateSubmitForm();
        if (payload) {
          return payload;
        }
        return null;
      },
    }));

    useEffect(() => {
      setFileInput(fileExcel);
      setProgress(100);
      setFileName(fileExcel?.name || "");
      setFileSize(fileExcel?.size || 0);
    }, [fileExcel]);

    useEffect(() => {
      setTitleRow(headerRow || 1);
    }, [headerRow]);

    return (
      <Box className={classes.root}>
        <Box className={classes.container}>
          <Box className={classes.top}>
            <Box className={classes.topTitle}>Chọn tệp</Box>
            {!!templateFileUrl ? (
              <Button
                className={classes.downloadBtn}
                onClick={async () => {
                  await downloadExcelFileTemplate(templateFileUrl);
                }}
              >
                <DownloadIcon className={classes.downloadIcon} />
                Tải file mẫu
              </Button>
            ) : (
              <></>
            )}
          </Box>
          <Box className={classes.content}>
            <Box className={classes.contentTitle}>Tải tên file</Box>
            <Box
              {...getRootProps({ style })}
              className={classes.dropUploadFile}
            >
              <Box>
                <Box className={classes.imageContainer}>
                  <img
                    src="/images/import-excel-csv.png"
                    alt="import-excel-file"
                  />
                </Box>
                <Box className={classes.labelUploadFileInput}>
                  <Box className={classes.textGray}>Kéo và thả file, hoặc</Box>
                  <Box className={classes.textGreen}>Chọn file</Box>
                </Box>
                <Box className={classes.description}>
                  Hỗ trợ file Excel dung lượng dưới 20MB
                </Box>
                <input {...getInputProps()} />
              </Box>
            </Box>
            {fileInput ? (
              <Box className={classes.fileUpload}>
                <Box className={classes.filesCount}>Số lượng file 1/1</Box>
                <Box className={classes.fileUploadContainer}>
                  <Box className={classes.topFileUploadContainer}>
                    <Box className={classes.topLeftFileUploadContainer}>
                      <Box className={classes.fileIcon}>
                        <InsertDriveFileOutlinedIcon />
                      </Box>
                      <Box className={classes.fileInfo}>
                        <Box className={classes.fileName}>{fileName}</Box>
                        <Box className={classes.fileSize}>
                          {convertFileSizeString(fileSize)}
                        </Box>
                      </Box>
                    </Box>
                    <IconButton size="small" onClick={handleClearFile}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <Box className={classes.progessUpload}>
                    <Box className={classes.progess}>
                      <LinearProgress variant="determinate" value={progress} />
                    </Box>
                    <Box className={classes.progessText}>{progress}%</Box>
                  </Box>
                </Box>
              </Box>
            ) : (
              <></>
            )}
          </Box>
          {fileInput ? (
            <Box>
              <Grid container columns={12} columnSpacing={2.5}>
                <Grid item xs={12}>
                  <label className={classes.inputLabel}>
                    Dòng tiêu đề là dòng số
                  </label>
                  <TextField
                    value={titleRow}
                    onChange={event => {
                      setTitleRow(Number(event.target.value) || 0);
                    }}
                    type="number"
                    fullWidth
                    className={classes.textFieldInput}
                    InputProps={{
                      inputProps: {
                        min: 1,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    );
  },
);
const BaseExcelFileUpload = React.memo(BaseExcelFileUploadComponent);
export { BaseExcelFileUpload };

const baseStyle = {
  borderColor: "#CFD6DD",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};
