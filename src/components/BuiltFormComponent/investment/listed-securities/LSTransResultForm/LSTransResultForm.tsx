import React, { useState, useEffect, forwardRef } from "react";
import { useStyles } from "@/src/components/BuiltFormComponent/BuiltFormComponent.styles";
import useTranslation from "next-translate/useTranslation";
import { Box, Grid } from "@mui/material";
import { formatValueFromAPI, getItemById } from "@/src/helpers";
import { TABLE_OPTIONS_INTERFACE, VALIDATION_INTERFACE } from "@/src/types";
import {
  INPUT_FORMAT_TYPE,
  IN_RANGE_VALIDATE_TYPE,
} from "@/src/constants/built-form";
import { BaseTextField } from "@/src/components/BaseTextField";
import { BaseAutocomplete } from "@/src/components/BaseAutocomplete";
import { BaseDatePickerInput } from "@/src/components/BaseDatePickerInput";
import { dispatch } from "@/src/store";
import { getTableConfigStore } from "@/src/store/reducers/tableConfig";
import { BaseAccountingEntryDetailsTable } from "@/src/components/BaseTable/BaseAccountingEntryDetailsTable";
import { DynamicObject } from "@/src/types/field";
interface Props {
  parentId?: string;
  currentId?: string;
  isAccountingDistribution?: boolean;
}
const LSTransResultFormComponent = forwardRef(
  (props: Props, ref): JSX.Element => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { parentId, currentId, isAccountingDistribution } = props;

    const [formData, setFormData] = useState<DynamicObject>({});

    const [detailedTableConfig, setDetailedTableConfig] = useState<
      TABLE_OPTIONS_INTERFACE | undefined
    >(undefined);

    const getRecordById = async () => {
      if (!currentId) {
        return false;
      }
      const res = await getItemById(
        currentId,
        "fund-stock-invest/trans/find-by-id",
      );
      if (res) {
        const temp: any = { ...res };
        fieldsConfig
          .filter(ele => !!ele.key)
          .forEach(field => {
            if (field.formatConfig?.type) {
              temp[field.key] =
                res[field.key] !== undefined
                  ? formatValueFromAPI(res[field.key], field.formatConfig.type)
                  : "";
            }
          });
        setFormData(temp);
      }
      return res;
    };

    const getTableConfig = async () => {
      const res = await dispatch(
        getTableConfigStore(
          "INVESTMENT/LISTED-SECURITIES/ACCOUNTING-DISTRIBITION/ACCOUNTING-ENTRY-DETAILS",
        ),
      );

      if (res) {
        setDetailedTableConfig(res);
      }
    };

    const getValueProperty = (fieldConfig: FieldConfig): any => {
      if (
        fieldConfig.formatConfig?.type === INPUT_FORMAT_TYPE.NUMBER_VALUE &&
        !formData[fieldConfig.key]
      ) {
        return "0,00";
      }
      return typeof formData[fieldConfig.key] === "object"
        ? formData[fieldConfig.key]?.name
        : formData[fieldConfig.key] || "";
    };

    const getOptionsProperty = (fieldConfig: FieldConfig): any[] => {
      return [];
    };

    const getProps = (
      fieldConfig: FieldConfig,
    ): {
      value: any;
      label: string | undefined;
      disabled: boolean | undefined;
      options: any[];
    } => {
      let label = fieldConfig.label;
      let disabled = true;

      const value = getValueProperty(fieldConfig);
      const options: any[] = getOptionsProperty(fieldConfig);
      const unit = "";

      const res = {
        ...{
          label,
          disabled,
          value,
          unit,
        },
        ...{ options },
      };
      return res;
    };

    useEffect(() => {
      const asyncFunction = async () => {
        if (isAccountingDistribution) {
          getTableConfig();
        }
        if (currentId) {
          await getRecordById();
        }
      };

      asyncFunction();
    }, [currentId]);

    return (
      <Box
        sx={{
          marginTop: "20px",
        }}
      >
        <Grid
          container
          columns={12}
          columnSpacing={4}
          rowSpacing={2.5}
          sx={{ marginBottom: "40px" }}
        >
          {(isAccountingDistribution ? fieldsConfig : fieldsConfig)
            // .filter(
            //     ele => !["transNumber", "transDate"].includes(ele.key),
            //   )
            .map((field, index) => {
              switch (field.type) {
                case FIELD_TYPE.DATEPICKER: {
                  return (
                    <Grid item xs={field.position?.cols || 2} key={index}>
                      <BaseDatePickerInput
                        {...getProps(field)}
                        onChange={value => {}}
                      />
                    </Grid>
                  );
                }
                case FIELD_TYPE.AUTOCOMPLETE: {
                  return (
                    <Grid item xs={field.position?.cols || 2} key={index}>
                      <BaseAutocomplete
                        {...getProps(field)}
                        onChange={value => {}}
                        valueKey={field.valueKey || ""}
                        labelKey={field.nameKey || ""}
                      />
                    </Grid>
                  );
                }
                case FIELD_TYPE.TEXTFIELD: {
                  return (
                    <Grid item xs={field.position?.cols || 2} key={index}>
                      <BaseTextField
                        {...getProps(field)}
                        onChange={event => {}}
                      />
                    </Grid>
                  );
                }
                case FIELD_TYPE.LINE: {
                  return (
                    <Grid item xs={12} key={index}>
                      <Box
                        sx={{
                          borderBottom: "1px solid #E2E6EA",
                        }}
                      />
                    </Grid>
                  );
                }
                case FIELD_TYPE.NONE: {
                  return (
                    <Grid
                      item
                      xs={field.position?.cols || 2}
                      key={index}
                    ></Grid>
                  );
                }
                default: {
                  return (
                    <Grid
                      item
                      xs={field.position?.cols || 2}
                      key={index}
                    ></Grid>
                  );
                }
              }
            })}
        </Grid>
        {isAccountingDistribution && detailedTableConfig && currentId ? (
          <Box>
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: "700",
                lineHeight: "24px",
                marginBottom: "16px",
              }}
            >
              {"Chi tiết bút toán"}
            </Box>
            <BaseAccountingEntryDetailsTable
              tableOptions={detailedTableConfig}
              currentId={currentId || ""}
              onlyShow={true}
              configGetData={{
                url: "fund-stock-invest/trans/accounting-details-by-trans",
              }}
            />
          </Box>
        ) : (
          <></>
        )}
      </Box>
    );
  },
);
const LSTransResultForm = React.memo(LSTransResultFormComponent);
export { LSTransResultForm };

enum FIELD_TYPE {
  TEXTFIELD = "TEXTFIELD",
  DATEPICKER = "DATEPICKER",
  AUTOCOMPLETE = "AUTOCOMPLETE",
  NONE = "NONE",
  LINE = "LINE",
}

const fieldsConfig: FieldConfig[] = [
  {
    label: "Tên quỹ",
    key: "fundName",
    type: FIELD_TYPE.TEXTFIELD,
    position: {
      cols: 6,
    },
  },
  {
    label: "Mã quỹ",
    key: "fundCode",
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "STK TVLK",
    key: "custodyAccount",
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "Công ty CK",
    key: "fundOrgProBrokerName",
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "",
    key: "",
    type: FIELD_TYPE.NONE,
  },
  {
    label: "",
    key: "",
    type: FIELD_TYPE.LINE,
  },
  {
    key: "tradeDate",
    label: "Ngày giao dịch",
    type: FIELD_TYPE.DATEPICKER,
  },
  {
    label: "Ngày thanh toán",
    key: "settleDate",
    type: FIELD_TYPE.DATEPICKER,
  },
  {
    label: "Ngày hạch toán",
    key: "transDate",
    type: FIELD_TYPE.DATEPICKER,
  },
  {
    key: "fundOrgProBrokerCode",
    label: "Mã CTCK",
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    key: "tradingId",
    label: "ID Giao dịch",
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    label: "Số chứng từ",
    key: "transNumber",
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    key: "transTypeVal",
    label: "Mua / Bán",
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    key: "stockSymbol",
    label: "Mã CK",
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    key: "tradeTypeVal",
    label: "Loại giao dịch",
    type: FIELD_TYPE.TEXTFIELD,
  },
  {
    key: "quantity",
    label: "Số lượng",
    type: FIELD_TYPE.TEXTFIELD,
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
  },
  {
    key: "price",
    label: "Giá",
    type: FIELD_TYPE.TEXTFIELD,
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
  },
  {
    key: "grossAmount",
    label: "Giá trị thực hiện",
    type: FIELD_TYPE.TEXTFIELD,
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
  },
  {
    key: "brokerFee",
    label: "Phí môi giới",
    type: FIELD_TYPE.TEXTFIELD,
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
  },
  {
    key: "tax",
    label: "Thuế",
    type: FIELD_TYPE.TEXTFIELD,
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
  },
  {
    key: "netAmount",
    label: "Giá trị thanh toán",
    type: FIELD_TYPE.TEXTFIELD,
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
  },
  {
    key: "cleanAmount",
    label: "Giá clean",
    type: FIELD_TYPE.TEXTFIELD,
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
  },
  {
    key: "coupon",
    label: "Coupon",
    type: FIELD_TYPE.TEXTFIELD,
    formatConfig: {
      type: INPUT_FORMAT_TYPE.NUMBER_VALUE,
    },
  },
];

interface FieldConfig {
  label: string;
  key: string;
  validationConfig?: VALIDATION_INTERFACE;
  formatConfig?: {
    type: INPUT_FORMAT_TYPE;
  };
  valueKey?: string;
  nameKey?: string;
  type: FIELD_TYPE;
  position?: {
    cols: number;
  };
}
