import React, { useState, useEffect, useRef } from "react";
import { useStyles } from "../BaseDialogCreate/BaseDialogCreate.styles";
import useTranslation from "next-translate/useTranslation";
import { Box, Step, StepButton, StepConnector, Stepper } from "@mui/material";
import { BaseExcelFileUpload } from "../BaseExcelFileUpload";
import { BaseMapKeyByFileDataColumnTable } from "../BaseMapKeyByFileDataColumnTable";
import { BaseFixImportedDataTable } from "../BaseTable/BaseFixImportedDataTable";
import { LoadingButton } from "@mui/lab";
import {
  getMappedFieldsData,
  getHeaderExcelFile,
  getDataReadFromExcelFile,
  addManyRecordsImportFromExcel,
} from "@/src/helpers";
import { dispatch } from "@/src/store";
import { TABLE_OPTIONS_INTERFACE } from "@/src/types";
import { getTableConfigStore } from "@/src/store/reducers/tableConfig";
import { openSnackbar } from "@/src/store/reducers/snackbar";
import { IMPORT_EXCEL_CONFIG } from "@/src/constants/formConfigFiles";
interface Props {
  onCloseDialog: Function;
  parentId?: string;
  importExcelConfig: IMPORT_EXCEL_CONFIG;
}

const BaseImportDataFromExcelFormComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { parentId, onCloseDialog, importExcelConfig } = props;

  const [activeTab, setActiveTab] = useState<number>(0);
  const childForm = useRef() as any;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //   data
  const [fileExcel, setFileExcel] = useState<File | null>(null);
  const [titleRow, setTitleRow] = useState<number | null>(1);
  const [headerStrings, setHeaderString] = useState<string[]>([]);
  const [fields, setFields] = useState<
    {
      entityField: string;
      description: string;
      isRequired: boolean;
    }[]
  >([]);
  const [mappedDataCols, setMappedDataCols] = useState<any>({});
  const [dataFromExcel, setDataFromExcel] = useState<any[]>([]);
  const [tableConfigData, setTableConfigData] =
    useState<TABLE_OPTIONS_INTERFACE | null>(null);

  const handleChangeStepTab = (index: number) => {
    setActiveTab(index);
  };

  const handleBack = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  const handleContinue = async () => {
    if (activeTab === 0) {
      const data: { file: File | null; titleRow: number | null } =
        childForm?.current.onSubmitRef();
      if (!data) {
        return;
      }
      setIsLoading(true);
      const res = await handleSubmitStep1(data);
      setIsLoading(false);
      if (!res) {
        return;
      }
    } else if (activeTab === 1) {
      const data: any = childForm?.current.onSubmitRef();
      if (!data) {
        return;
      }
      setIsLoading(true);
      const res = await handleSubmitStep2(data);
      setMappedDataCols(data);
      setIsLoading(false);
      if (!res) {
        return;
      }
    } else if (activeTab === 2) {
      const data: any = childForm?.current.onSubmitRef();
      if (!data) {
        return;
      }
      const res = await handleSubmitStep3(data);
      if (res) {
        onCloseDialog();
      }
    }

    if (activeTab < 2) {
      setActiveTab(activeTab + 1);
    } else setActiveTab(2);
  };

  const handleSubmitStep1 = async (data: {
    file: File | null;
    titleRow: number | null;
  }): Promise<boolean> => {
    try {
      setFileExcel(data?.file || null);
      setTitleRow(data?.titleRow || null);
      if (!data.file) {
        return false;
      }

      const arr = await getHeaderExcelFile(
        importExcelConfig.routes.getHeaderExcelFile,
        data?.file,
      );
      setHeaderString(arr);

      return true;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  };

  const handleSubmitStep2 = async (data: {
    [key: string]: string;
  }): Promise<boolean> => {
    if (!fileExcel) {
      return false;
    }

    const arr = await getDataReadFromExcelFile(
      importExcelConfig.routes.getDataReadFromExcelFile,
      fileExcel,
      data,
      parentId,
      importExcelConfig.partentIdName,
    );

    setDataFromExcel(arr);

    return true;
  };

  const handleSubmitStep3 = async (data: any[]): Promise<boolean> => {
    const res = await addManyRecordsImportFromExcel(
      importExcelConfig.routes.addManyRecordsImportFromExcel,
      data,
      parentId,
      importExcelConfig.partentIdName,
    );
    if (res?.data?.success) {
      dispatch(
        openSnackbar({
          open: true,
          message: res?.data?.message,
          variant: "alert",
          alert: {
            color: "success",
          },
          close: false,
          transition: "SlideLeft",
        }),
      );
      return true;
    } else {
      dispatch(
        openSnackbar({
          open: true,
          // message: JSON.stringify(res?.data?.message || res?.message || ""),
          message:
            res === "Thêm mới danh sách lỗi"
              ? " Quỹ không có TK Ngân hàng hoạt động mặc định"
              : res?.data?.message,
          variant: "alert",
          alert: {
            color: "error",
          },
          close: false,
          transition: "SlideLeft",
          anchorOrigin: { vertical: "top", horizontal: "left" },
        }),
      );
      return false;
    }
  };

  useEffect(() => {
    const asyncFunction = async () => {
      const fieldArr = await getMappedFieldsData(
        importExcelConfig.routes.getMappedFieldsData,
      );
      setFields(fieldArr);

      const res = await dispatch(
        getTableConfigStore(importExcelConfig.fixDataTableCode),
      );
      setTableConfigData(res || null);
    };

    asyncFunction();
  }, []);

  const DialogContent = (): JSX.Element => {
    switch (activeTab) {
      case 0: {
        return (
          <BaseExcelFileUpload
            fileExcel={fileExcel}
            headerRow={titleRow}
            templateFileUrl={importExcelConfig.templateFileUrl}
            ref={childForm}
          />
        );
      }
      case 1: {
        return (
          <BaseMapKeyByFileDataColumnTable
            headerStrings={headerStrings}
            mappedDataCols={mappedDataCols}
            fieldArr={fields}
            ref={childForm}
          />
        );
      }
      case 2: {
        if (!tableConfigData) return <></>;
        return (
          <BaseFixImportedDataTable
            tableOptions={tableConfigData}
            source={dataFromExcel}
            nameKey={importExcelConfig.nameKey}
            labelNameKey={importExcelConfig.labelNameKey}
            listOfRecordKey={importExcelConfig.listOfRecordKey}
            ref={childForm}
          />
        );
      }
      default:
        return <></>;
    }
  };

  return (
    <Box sx={{ height: "calc(100vh - 100px)" }}>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box>
          <Stepper
            activeStep={activeTab}
            connector={
              <StepConnector className={classes.stepConnectorStyles} />
            }
            sx={{ pt: 3, pb: 1 }}
          >
            <Step completed={activeTab > 0}>
              <StepButton
                color="inherit"
                onClick={() => handleChangeStepTab(0)}
              >
                {"Chọn tệp"}
              </StepButton>
            </Step>
            <Step completed={activeTab > 1}>
              <StepButton
                color="inherit"
                onClick={() => handleChangeStepTab(1)}
              >
                {"Ghép cột dữ liệu"}
              </StepButton>
            </Step>
            <Step completed={activeTab > 2}>
              <StepButton
                color="inherit"
                onClick={() => handleChangeStepTab(2)}
              >
                {"Kết quả ghép dữ liệu"}
              </StepButton>
            </Step>
          </Stepper>
        </Box>
        <Box sx={{ flexGrow: "1" }}>
          <Box>
            <DialogContent />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: activeTab > 0 ? "space-between" : "flex-end",
          }}
        >
          {activeTab > 0 ? (
            <LoadingButton
              onClick={handleBack}
              className={classes.commonButtonBack}
            >
              Quay lại
            </LoadingButton>
          ) : (
            <></>
          )}
          <LoadingButton
            onClick={handleContinue}
            className={classes.common_button}
            loading={isLoading}
            loadingPosition={"start"}
          >
            {activeTab < 2 ? "Tiếp tục" : "Xong"}
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
};
const BaseImportDataFromExcelForm = React.memo(
  BaseImportDataFromExcelFormComponent,
);
export { BaseImportDataFromExcelForm };
