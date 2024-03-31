import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useStyles } from "./ReportStaticInvestmentScreen.styles";
import useTranslation from "next-translate/useTranslation";
import {
  getMapKeyToDependKey,
  getDependencyType,
  getEncodeFormCode,
} from "@/src/helpers/getQueryURL";
/// import store
import { useDispatch } from "react-redux";
import { dispatch, useSelector } from "@store/store";
import { RootStateProps } from "@app/types/root";
import { Box, Button, ButtonBase, Grid } from "@mui/material";
import {
  AutoCompleteType,
  DynamicObject,
  IField,
  TextFieldType,
} from "@/src/types/field";
import {
  BaseDatePicker,
  BaseInput,
  BaseInputSecond,
  TableEditable,
} from "@/src/components";
import { ITabConfig } from "@/src/constants/formConfigFiles";
import { IFormType } from "@/src/types/general";
import { insertOrUpdateRecord } from "@/src/store/reducers/general";
import { getFieldGrid } from "@/src/helpers/formDynamicHelper";
import { BaseDropdownSecond } from "../components";
import { GetApp } from "@mui/icons-material";
import moment from "moment";
import { Typography } from "@mui/material";
/// end import store

interface Props {
  formCode?: string;
  isDisableField: boolean;
  currentId?: string;
  parentId?: DynamicObject;
  isRefresh?: boolean;
  formSettingSubmitStep?: ITabConfig;
  formType?: IFormType;
}
const ReportStaticInvestmentScreenComponent = forwardRef(
  (props: Props, ref): JSX.Element => {
    const { t } = useTranslation();
    const classes = useStyles();
    const {
      formCode,
      isDisableField,
      currentId,
      formSettingSubmitStep,
      isRefresh,
      parentId,
      formType,
    } = props;
    const [formGrid, setFromGrid] = useState<any>({});
    const [initialValues, setInitialValues] = useState<DynamicObject>({});
    const [formErrors, setFormErrors] = useState<DynamicObject>({});
    const [isLoading, setIsLoading] = useState(true);
    const [submitValues, setSubmitValues] = useState<DynamicObject>({});
    const [isFilterByDate, setIsFieldByDate] = useState(false);

    const dataAPI = useSelector(
      (state: RootStateProps) => state.formBuilder.listForms,
    ).find(child => child.code === formCode);
    const globalFundData = useSelector(
      (state: RootStateProps) => state.general.globalFundData,
    );

    useEffect(() => {
      if (dataAPI?.fields) {
        setFromGrid(getFieldGrid(dataAPI?.fields));
      }
    }, [dataAPI]);

    const handleRefreshInForm = React.useCallback(() => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }, []);

    // const onChangeIsFilter = () => {
    //   setIsFieldByDate(prev => !prev);
    //   if (!isFilterByDate) {
    //     setInitialValues(formData => ({
    //       ...formData,
    //       ["endDate"]: "",
    //       ["startDate"]: "",
    //     }));
    //   }
    // };

    useImperativeHandle(ref, () => ({
      async onSubmitRef() {
        return false;
      },
      async onSaveValueRef() {
        return null;
      },
      handleUnFocus() {
        setFormErrors({});
        // setInitialValues({});
      },
      async saveLocalForm() {
        return null;
      },
      async onSubmitCustomRef(dialogData: any) {
        return null;
      },
      async onSubmitLockNavRef() {
        return null;
      },
    }));

    const onSubmit = async () => {
      handleRefreshInForm();
      if (Object.values(formErrors).filter(item => !!item).length > 0) {
        return;
      }
      if (!initialValues?.fundNavBatchId) {
        setFormErrors(formErrors => ({
          ...formErrors,
          fundNavBatchId: "Vui lòng nhập thông tin",
        }));
        return;
      }
      setSubmitValues({
        ...initialValues,
        fundId: globalFundData?.id ?? "",
      });
    };

    // const validDateFilter = (formatValue, fieldName) => {
    //   try {
    //     if (fieldName === "startDate" && initialValues?.endDate) {
    //       if (!moment(formatValue).isBefore(initialValues?.endDate)) {
    //         setFormErrors(formErrors => ({
    //           ...formErrors,
    //           ["startDate"]:
    //             "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc",
    //         }));
    //         return;
    //       }
    //     }
    //     if (fieldName === "endDate" && initialValues?.startDate) {
    //       if (!moment(formatValue).isAfter(initialValues?.startDate)) {
    //         setFormErrors(formErrors => ({
    //           ...formErrors,
    //           ["endDate"]: "Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
    //         }));
    //         return;
    //       }
    //     }
    //     if (formErrors?.startDate || formErrors?.endDate) {
    //       setFormErrors(formErrors => ({
    //         ...formErrors,
    //         ["endDate"]: "",
    //         ["startDate"]: "",
    //       }));
    //     }
    //   } catch (err) {}
    // };

    const onChangeValue = (value, item: IField, formatValue: string) => {
      const getField =
        dataAPI?.fields && dataAPI?.fields.find(el => el.name === item?.name);
      if (!getField?.fieldType || !item.name) {
        return;
      }
      switch (getField?.fieldType) {
        // case TextFieldType.datePicker: {
        //   setInitialValues(prevState => {
        //     const updatedValues = {
        //       ...prevState,
        //     };
        //     if (item && typeof item.name === "string") {
        //       updatedValues[item.name] = formatValue;
        //     }
        //     return updatedValues;
        //   });
        //   validDateFilter(formatValue, item.name);
        //   break;
        // }
        default: {
          setInitialValues(prevState => {
            const updatedValues = {
              ...prevState,
            };
            if (item && typeof item.name === "string") {
              updatedValues[item.name] =
                typeof value === "boolean"
                  ? value
                    ? value
                    : false
                  : value
                  ? value
                  : null;
            }
            return updatedValues;
          });
          break;
        }
      }
    };

    const renderItem = (item: IField, index: number) => {
      switch (item.fieldType) {
        case TextFieldType.selectOption:
          return (
            <BaseDropdownSecond
              label={item.label}
              formCode={getEncodeFormCode(dataAPI?.code)}
              isRequired={
                item.validateAttribute
                  ? item.validateAttribute?.isRequired
                  : false
              }
              // isFilterByDate={isFilterByDate}
              // onChangeIsFilter={onChangeIsFilter}
              fieldIndex={index}
              value={item?.name ? initialValues[item?.name] : null}
              name={item?.name ?? ""}
              url={item?.selectOption?.sourceDataApi}
              selectOption={item?.selectOption}
              onChange={event => {
                onChangeValue(event, item, "");
              }}
              isDisabled={false}
              errorField={item?.name ? formErrors[item?.name] : ""}
              onBlurSelectOption={event => {
                if (
                  item.validateAttribute &&
                  item.validateAttribute?.isRequired &&
                  typeof item?.name !== "undefined"
                ) {
                  if (!event?.target?.value) {
                    setFormErrors(formErrors => ({
                      ...formErrors,
                      [`${item?.name}`]: "Vui lòng nhập thông tin",
                    }));
                  } else {
                    setFormErrors(formErrors => ({
                      ...formErrors,
                      [`${item?.name}`]: "",
                    }));
                  }
                }
              }}
              initialState={{
                ...initialValues,
                ...(parentId && Object.keys(parentId).length ? parentId : null),
                fundId: globalFundData?.id ? globalFundData?.id : "",
              }}
              customAttrs={item?.customAttrs ? item.customAttrs : null}
              fieldSet={item}
              dropdownType={AutoCompleteType.DropDownFetchByForm}
              dependencies={getMapKeyToDependKey(item?.customAttrs)}
              dependencyTypes={getDependencyType(item?.customAttrs, parentId)}
            />
          );
        // case TextFieldType.datePicker:
        //   return (
        //     <BaseDatePicker
        //       label={item?.label}
        //       isRequired={
        //         item?.validateAttribute
        //           ? item?.validateAttribute?.isRequired
        //           : false
        //       }
        //       fieldIndex={index}
        //       valueDatePicker={
        //         item?.name ? initialValues[item?.name] : null ?? ""
        //       }
        //       // maxDate={item?.validateAttribute?.isMaxDay ? dayjs(new Date()) : ""}
        //       // minDate={item?.validateAttribute?.isMinDay ? dayjs(new Date()) : ""}
        //       isDisabled={
        //         !isFilterByDate
        //         // isDisableField ||
        //         // item?.validateAttribute?.isReadOnly ||
        //         // item?.validateAttribute?.isDisabled
        //       }
        //       initialState={{
        //         ...initialValues,
        //       }}
        //       name={item?.name ?? ""}
        //       onChange={newValue => {
        //         onChangeValue("", item, newValue);
        //       }}
        //       errorField={
        //         item?.name && formErrors[item?.name]
        //           ? formErrors[item?.name]
        //           : ""
        //       }
        //       customAttrs={item?.customAttrs ? item.customAttrs : null}
        //     />
        //   );
        case TextFieldType.customLabel: {
          return (
            <BaseInputSecond
              label={item?.label}
              isRequired={item?.validateAttribute?.isRequired}
              type="text"
              fieldName={item?.name ?? ""}
              initialValue={item?.name ? initialValues[item?.name] : null ?? ""}
              onChange={event => {
                onChangeValue(event, item, "");
              }}
              isDisabled={isDisableField}
              fieldIndex={index}
              errorField={item?.name ? formErrors[item?.name] : ""}
              fieldSet={item}
              customAttrs={item.customAttrs}
              formCode={getEncodeFormCode(dataAPI?.code)}
              formType={formType}
              initialState={{
                ...initialValues,
                ...(parentId && Object.keys(parentId).length ? parentId : null),
              }}
            />
          );
        }
        case TextFieldType.textBox:
          return (
            <BaseInput
              label={item?.label}
              isRequired={item?.validateAttribute?.isRequired}
              type="text"
              fieldName={item?.name ?? ""}
              initialValue={
                item?.name && initialValues[item?.name]
                  ? initialValues[item?.name]
                  : null ?? ""
              }
              onChange={event => {
                onChangeValue(event, item, "");
              }}
              isDisabled={
                isDisableField
                // ||
                // item?.validateAttribute?.isReadOnly ||
                // item?.validateAttribute?.isDisabled
              }
              fieldIndex={index}
              errorField={item?.name ? formErrors[item?.name] : ""}
              fieldSet={item}
              customAttrs={item.customAttrs}
              formCode={getEncodeFormCode(dataAPI?.code)}
              formType={formType}
              initialState={{
                ...initialValues,
                ...(parentId && Object.keys(parentId).length ? parentId : null),
              }}
            />
          );
        case TextFieldType.label:
          return <label className={classes.label}>{item?.label}</label>;
        case TextFieldType.editableTable: {
          return (
            <TableEditable
              isDisabled={
                // isDisableField ||
                // item?.validateAttribute?.isReadOnly ||
                // item?.validateAttribute?.isDisabled
                false
              }
              parentId={
                parentId && Object.keys(parentId).length
                  ? Object.keys(parentId)[0]
                  : ""
              }
              entryProp={{
                // fundId: globalFundData?.id || "",
                ...submitValues,
              }}
              tableCode={item?.customAttrs?.tableCode || ""}
              isRefresh={isRefresh || isLoading}
              classesName={classes.setMinHeight}
            />
          );
        }
        case TextFieldType.groupButton: {
          return (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <ButtonBase
                className={`${classes.activeButton} ${classes.paddingTop} ${classes.paddingRight}`}
                onClick={onSubmit}
                color={"white"}
                // disabled={!(userRole===2)}
              >
                Xem báo cáo
              </ButtonBase>
              <Button
                variant="contained"
                startIcon={<GetApp />}
                className={`${classes.exportExcelButton} ${classes.paddingTop}`}
                // disabled={isLoading}
              >
                Xuất Excel
              </Button>
            </Box>
          );
        }
        case TextFieldType.searchButton: {
          return (
            <Box
              sx={{
                width: "95%",
                display: "flex",
                justifyContent: "end",
              }}
            >
              {/* <ButtonBase
                className={`${classes.activeButton} ${classes.paddingTop}`}
                onClick={onSubmit}
                color={"white"}
                // disabled={!(userRole===2)}
              >
                Xem báo cáo
              </ButtonBase> */}
            </Box>
          );
        }
        case TextFieldType.none: {
          return <></>;
        }
        default:
          break;
      }
    };

    return (
      <div style={{ borderRadius: 8 }}>
        <form id={getEncodeFormCode(dataAPI?.code)}>
          <div className={classes.formContainer}>
            {formGrid &&
              Object.values(formGrid)?.map((colItem: any, colIndex: number) => {
                return (
                  <Grid
                    className={classes.formRow}
                    container
                    columnSpacing={2.5}
                    key={colIndex}
                  >
                    {colItem?.map((rowItem, rowItemIndex) => {
                      return (
                        <Grid
                          key={`${colIndex}${rowItemIndex}`}
                          item
                          xs={rowItem?.cols}
                          height={"100%"}
                        >
                          {renderItem(rowItem, rowItemIndex)}
                        </Grid>
                      );
                    })}
                  </Grid>
                );
              })}
          </div>
        </form>
      </div>
    );
  },
);
const ReportStaticInvestmentScreen = React.memo(
  ReportStaticInvestmentScreenComponent,
);
export { ReportStaticInvestmentScreen };
