import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useStyles } from "./BaseMapKeyByFileDataColumnTable.styles";
import useTranslation from "next-translate/useTranslation";
import {
  Box,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TableContainer,
} from "@mui/material";
import { BaseAutocomplete } from "../BaseAutocomplete";
import { getValidateInfo } from "@/src/helpers";
import { VALIDATION_ERROR_INTERFACE } from "@/src/types";
interface Props {
  headerStrings: string[];
  mappedDataCols: any;
  fieldArr: {
    entityField: string;
    description: string;
    isRequired: boolean;
    defaultMapField?: string;
  }[];
}

const BaseMapKeyByFileDataColumnTableComponent = forwardRef(
  (props: Props, ref: any): JSX.Element => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { headerStrings, mappedDataCols, fieldArr } = props;

    const [mappedData, setMappedData] = useState<{
      [key: string]: string;
    }>({});
    const [validationError, setValidationError] = useState<any>({});

    //   Handle change
    const handleCellValueChange = (
      field: {
        entityField: string;
        description: string;
        isRequired: boolean;
        defaultMapField?: string;
      },
      value: any,
    ) => {
      const newMappedData = {
        ...mappedData,
        [field.entityField]: value,
      };
      setMappedData({
        ...newMappedData,
      });
      handleValidateCell(field, value);
    };

    //   Handle Validate
    const handleValidateCell = (
      field: {
        entityField: string;
        description: string;
        isRequired: boolean;
        defaultMapField?: string;
      },
      value: any,
    ) => {
      if (field?.entityField && field?.isRequired) {
        const info = getValidateInfo(value, `Cột ${field?.description || ""}`, {
          requiredValidate: true,
        });

        setValidationError({
          ...validationError,
          [field.entityField]: info.error ? info.errorMessage : "",
        });
      }
    };

    const validateAllCell = (): boolean => {
      let valid = true;
      let validation: any = {};
      {
        fieldArr.forEach(field => {
          const info: VALIDATION_ERROR_INTERFACE = getValidateInfo(
            mappedData[field.entityField || ""],
            `Cột ${field?.description || ""}`,
            { requiredValidate: !!field.isRequired },
          );

          if (info.error) {
            valid = false;
            validation[field.entityField] = info.errorMessage;
          }
        });

        setValidationError({ ...validation });
      }
      return valid;
    };
    useImperativeHandle(ref, () => ({
      onSubmitRef() {
        if (validateAllCell()) {
          return mappedData || null;
        }
        return null;
      },
    }));

    useEffect(() => {
      if (Object.keys(mappedDataCols || {}).length === 0) {
        let obj: {
          [key: string]: string;
        } = {};

        const arr = headerStrings.map(ele => ele.toLowerCase());
        fieldArr.forEach(ele => {
          const index = arr.findIndex(
            item =>
              ele.defaultMapField && item === ele.defaultMapField.toLowerCase(),
          );
          if (index !== -1) {
            obj[ele.entityField] = headerStrings[index];
          }
        });
        setMappedData(obj);
        return;
      }
      setMappedData(mappedDataCols || {});
    }, [mappedDataCols, headerStrings, fieldArr]);

    return (
      <Box>
        <Box className={classes.container}>
          <Box className={classes.title}>
            Ghép cột trên phần mềm với cột trên tệp dữ liệu
          </Box>
          <TableContainer className={classes.tableContainer}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeadCell}>
                    Cột trên phần mềm
                  </TableCell>
                  <TableCell className={classes.tableHeadCell}>
                    Cột trên tệp dữ liệu
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fieldArr.map(field => (
                  <TableRow
                    key={field.entityField}
                    className={classes.tableBodyRow}
                  >
                    <TableCell className={classes.tableBodyCell}>
                      <Box
                        component={"span"}
                        className={
                          field.isRequired ? classes.tableCellRequiredText : ""
                        }
                      >
                        {field.description}
                      </Box>
                    </TableCell>
                    <TableCell className={classes.tableBodyCell}>
                      <BaseAutocomplete
                        options={headerStrings}
                        value={mappedData[field.entityField]}
                        onChange={value => {
                          handleCellValueChange(field, value);
                        }}
                        valueKey={""}
                        labelKey={""}
                        error={!!validationError[field.entityField]}
                        errorMessage={validationError[field?.entityField] || ""}
                        onBlur={() => {
                          handleValidateCell(
                            field,
                            mappedData[field.entityField],
                          );
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    );
  },
);
const BaseMapKeyByFileDataColumnTable = React.memo(
  BaseMapKeyByFileDataColumnTableComponent,
);
export { BaseMapKeyByFileDataColumnTable };
