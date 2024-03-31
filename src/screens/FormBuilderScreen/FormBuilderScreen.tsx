import React, { useEffect, useState } from "react";
import { useStyles } from "./FormBuilderScreen.styles";
import Page from "@/src/components/third-party/Page";
import { useTheme } from "@emotion/react";
import { Theme } from "@mui/material/styles";
import { AddNewFormDialog } from "./AddNewFormDialog";
import { TableForm } from "./TableForm/TableForm";
import { dispatch } from "@/src/store";
import { getFormBuilderConfigReducer } from "@/src/store/reducers/formBuilder";

interface Props {
  code?: string | null;
}
const FormBuilderComponent = (props: Props): JSX.Element => {
  const theme = useTheme() as Theme;
  const classes = useStyles(theme);

  useEffect(() => {
    const getFormBuilderData = async () => {

      dispatch(getFormBuilderConfigReducer());
    };
    getFormBuilderData();
  }, []);
  const addNewField = async (e: any) => {
    e?.preventDefault();
  };
  const [visibleAddNewFormDialog, setVisibleAddNewFormDialog] = useState(false);
  const handleOpenAddNewFormDialog = () => {
    setVisibleAddNewFormDialog(true);
  };
  const handleCloseAddNewFormDialog = () => {
    setVisibleAddNewFormDialog(false);
  };

  return (
    <Page title="Form Builder">
      <TableForm
        handleOpenAddNewFormDialog={handleOpenAddNewFormDialog}
      ></TableForm>
      <AddNewFormDialog
        dialogTitle={"Thêm mới Form"}
        openAddNewFormDialog={visibleAddNewFormDialog}
        handleCloseAddNewFormDialog={handleCloseAddNewFormDialog}
        handleOpenAddNewFormDialog={handleOpenAddNewFormDialog}
      />
    </Page>
  );
};
const FormBuilderScreen = React.memo(FormBuilderComponent);
export { FormBuilderScreen };
