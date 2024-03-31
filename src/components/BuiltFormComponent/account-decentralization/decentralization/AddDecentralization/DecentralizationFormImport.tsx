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
interface Props {
  isDisableField: boolean;
  currentId?: string;
  parentId?: string;
  onlyShow?: boolean;
  formType?: IFormType;
}

const DecentralizationFormImportComponent = forwardRef(
  (props: Props, ref): JSX.Element => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { currentId, parentId, onlyShow, formType, isDisableField } = props;

    const [name, setName] = useState<string>("");

    const [fullRole, setFullRole] = useState<boolean>(true);

    const [validationErrors, setValidationErrors] = useState<{
      [key: string]: string;
    }>({});

    const [dataTable, setDataTable] = useState<any[]>([]);

    //   Function

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
      console.log("dataTable: ", dataTable);

      let submitData = {};
      if (!!currentId) {
        submitData = {
          ...submitData,
          id: currentId,
          name,
          allowFullAccess: !fullRole,
          privilegesModelInfors: dataTable.map(item => ({
            isDelete: item.isDelete,
            id: item.idRole,
            privilegesRoleId: item.privilegesRoleId,
          })),
        };
      } else {
        submitData = {
          ...submitData,
          name,
          allowFullAccess: !fullRole,
          privilegesModelInfors: dataTable.map(item => ({
            isDelete: item.isDelete,
            identityUserAcRoleId: item.identityUserAcRoleId,
          })),
        };
      }
      return submitData;
    };

    const getFormData = async (): Promise<any> => {
      if (!currentId) {
        try {
          const arrCheck = await getItemById(
            "null",
            "dentity-user-ac-role-api/find",
          );
          if (Array.isArray(arrCheck)) {
            const importArrCheck = arrCheck.map((item, index) => {
              item.id = index;
              item.isDelete = true;
              item.identityUserAcRoleId = item.value;
              delete item.key;
              item.name = item.text;
              delete item.text;
              return item;
            });
            setDataTable(importArrCheck);
          } else {
            return;
          }
        } catch (error) {}
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
          item.idRole = item.id;
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

    const onChangeValue = value => {
      const updatedDataCheckTable = dataTable.map(item => {
        if (item.id === value) {
          return {
            ...item,
            isDelete: !item.isDelete,
          };
        }
        return item;
      });
      setDataTable(updatedDataCheckTable);
      const allArrDeleted = updatedDataCheckTable.every(function (obj) {
        return obj.isDelete === false;
      });
      !allArrDeleted ? setFullRole(true) : setFullRole(false);
    };

    const onChangeFullRoleValue = value => {
      setFullRole(!fullRole);
      const updatedArrCheck = dataTable.map((item, index) => {
        item.isDelete = fullRole ? false : true;
        return item;
      });

      setDataTable(updatedArrCheck);
    };

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
                required
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
                  onChangeValue={() => onChangeFullRoleValue(-1)}
                  isDisabled={false}
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
                    isDisabled={false}
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
      </Box>
    );
  },
);
const DecentralizationFormImport = React.memo(
  DecentralizationFormImportComponent,
);
export { DecentralizationFormImport };

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
