import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useStyles } from "@/src/components/BuiltFormComponent/BuiltFormComponent.styles";
import useTranslation from "next-translate/useTranslation";
import { Box, Grid } from "@mui/material";
import { BaseTextField } from "@/src/components/BaseTextField";
import {
  DynamicObject,
  FETCH_DATA_API_CONFIG_INTERFACE,
  IField,
  TABLE_OPTIONS_INTERFACE,
  VALIDATION_ERROR_INTERFACE,
  VALIDATION_INTERFACE,
} from "@/src/types";
import {
  formatNumberStringToNumber,
  getItemById,
  getValidateInfo,
} from "@/src/helpers";
import { INPUT_FORMAT_TYPE } from "@/src/constants/built-form";

import { IFormType } from "@/src/types/general";
import { BaseCheckBox } from "@/src/components/DynamicForm/components";
import { BaseDynamicTable } from "@/src/components/BaseTable/BaseDynamicTable";
import { getTableConfigStore } from "@/src/store/reducers/tableConfig";
import { dispatch } from "@/src/store";
interface Props {
  isDisableField: boolean;
  currentId?: string;
  parentId?: string;
  onlyShow?: boolean;
  formType?: IFormType;
}

const DecentralizationFormDetailComponent = forwardRef(
  (props: Props, ref): JSX.Element => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { currentId, parentId, onlyShow, formType, isDisableField } = props;

    const [name, setName] = useState<string>("");
    const [fullRole, setFullRole] = useState<boolean>(true);

    const [validationErrors, setValidationErrors] = useState<{
      [key: string]: string;
    }>({});

    const [tableConfigData, setTableConfigData] = useState<{
      [key: number]: TABLE_OPTIONS_INTERFACE | undefined;
    }>({});

    const [dataTable, setDataTable] = useState<any[]>([]);
    //   Function

    const getTableConfigs = async () => {
      const categoryTableCode = "DECENTRALIZATION/LIST-STAFF";
      const res = await dispatch(getTableConfigStore(categoryTableCode));
      setTableConfigData({
        0: res,
      });
    };

    useImperativeHandle(ref, () => ({
      async onSubmitRef() {
        return false;
      },
      async onSaveValueRef() {
        const payload = await generateSubmitForm();
        if (payload) {
          return payload;
        }
        return null;
      },
      handleUnFocus() {},
    }));

    const generateSubmitForm = (): any => {
      if (!validateAll()) {
        return null;
      }

      const submitData = {
        name,
        privilegesModelInfors: dataTable.map(item => ({
          isDelete: item.isDelete,
          identityUserAcRoleId: item.identityUserAcRoleId,
        })),
      };
      return submitData;
    };

    const getFormData = async (): Promise<any> => {
      if (!currentId) {
        return;
      }
      const res = await getItemById(
        currentId,
        "group-privileges-api/find-by-id",
      );
      setName(res.name);
      setFullRole(!res.allowFullAccess);
      const resUpdate = res.privilegesRoleGroupMapSqlRes;
      if (Array.isArray(resUpdate)) {
        const updatedArrCheck = resUpdate.map((item, index) => {
          item.id = index;
          item.identityUserAcRoleId = item.value;
          if (!fullRole) {
            item.isDelete = true;
          }
          return item;
        });
        setDataTable(updatedArrCheck);
      } else {
        return;
      }
      return res;
    };

    useEffect(() => {
      const asyncFunction = async () => {
        if (currentId) {
          getFormData();
          await getTableConfigs();
        }
      };

      asyncFunction();
    }, [currentId, parentId]);

    useEffect(() => {
      const asyncFunction = async () => {
        getFormData();
      };

      asyncFunction();
    }, []);

    //    Handle Validate

    const handleValidate = (
      value: any,
      key: string,
    ): VALIDATION_ERROR_INTERFACE => {
      const fieldConfig: FieldConfig = fieldsConfig[key];

      const res = {
        error: false,
        errorMessage: "",
      };

      const formatValue =
        fieldsConfig[key]?.formatConfig?.type === INPUT_FORMAT_TYPE.NUMBER_VALUE
          ? formatNumberStringToNumber(value)
          : value;
      if (fieldConfig && fieldConfig.validationConfig) {
        const info = getValidateInfo(
          formatValue,
          fieldConfig.label,
          fieldConfig.validationConfig,
        );
        setValidationErrors({
          ...validationErrors,
          [key]: info.errorMessage,
        });
        return info;
      }
      return res;
    };

    const validateAll = (): boolean => {
      let valid = true;
      const validation: any = {};
      if (name === "") {
        validation[name] = "Tên nhóm quyền không để trống";
        valid = false;
      }
      setValidationErrors(validation);
      return valid;
    };

    const handleValidateName = (value): VALIDATION_ERROR_INTERFACE => {
      return handleValidate(value, "name");
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
      handleValidateName(event.target.value);
    };

    const onChangeValue = value => {};

    const onChangeFullRoleValue = value => {};

    return (
      <Box className={classes.formGroupFunction}>
        <Box className={classes.tableGroupFunction}>
          <Grid
            container
            columns={12}
            columnSpacing={4}
            className={classes.tableGroupFunctionTop}
          >
            <Grid item xs={12}>
              <BaseTextField
                label={fieldsConfig.name.label}
                value={name}
                onChange={handleNameChange}
                onBlur={() => {
                  handleValidateName(name);
                }}
                error={!!validationErrors.name}
                errorMessage={validationErrors.name}
                disabled={!!onlyShow}
                fullWidth={true}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={4} className={classes.checkboxGroupFunction}>
                <BaseCheckBox
                  // fieldSet={item}
                  fieldIndex={-1}
                  initialValue={!fullRole}
                  onChangeValue={() => onChangeFullRoleValue}
                  isDisabled={true}
                  // customAttrs={item.customAttrs}
                  // isRequired={}
                />
                <div>Tất cả các quyền</div>
              </Grid>
            </Grid>
            {dataTable ? (
              dataTable.map((item, index) => (
                <Grid item xs={4} className={classes.checkboxGroupFunction}>
                  <BaseCheckBox
                    fieldSet={item}
                    fieldIndex={index}
                    initialValue={!item.isDelete}
                    onChangeValue={() => onChangeValue(index)}
                    isDisabled={true}
                    // customAttrs={item.customAttrs}
                    isRequired={item?.validateAttribute?.isRequired}
                  />
                  <div>{item.name}</div>
                </Grid>
              ))
            ) : (
              <></>
            )}
          </Grid>
        </Box>
        <Box className={classes.tableAccountDetail}>
          <Box className={classes.styleTabName}>{"Danh sách tài khoản"}</Box>
          {tableConfigData[0] !== undefined ? (
            <Box className={classes.styleTabOption}>
              <BaseDynamicTable
                tableOptions={tableConfigData[0]}
                parentId={currentId}
                entryProp={{
                  privilegesGroupId: currentId,
                }}
                onlyShow
              />
            </Box>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    );
  },
);
const DecentralizationFormDetail = React.memo(
  DecentralizationFormDetailComponent,
);
export { DecentralizationFormDetail };

const fieldsConfig: {
  name: FieldConfig;
} = {
  name: {
    label: "Tên nhóm quyền",
    validationConfig: {
      requiredValidate: true,
      // maxLength: 255,
    },
  },
};

interface FieldConfig {
  label: string;
  validationConfig?: VALIDATION_INTERFACE;
  formatConfig?: {
    type: INPUT_FORMAT_TYPE;
  };
  valueKey?: string;
  nameKey?: string;
}
