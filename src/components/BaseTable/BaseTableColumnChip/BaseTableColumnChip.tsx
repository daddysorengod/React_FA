import React, { useState, useEffect } from "react";
import { useStyles } from "./BaseTableColumnChip.styles";
import useTranslation from "next-translate/useTranslation";
import { MRT_Cell } from "material-react-table";
import { COLUMN_OPTIONS_INTERFACE } from "@/src/types";
import { Chip } from "@mui/material";
import { CO_TYPE } from "@/src/constants";
interface Props {
  cell: MRT_Cell<any>;
  columnOption: COLUMN_OPTIONS_INTERFACE;
}

const OPTIONS = [
  {
    value: true,
    name: "Active",
    type: CO_TYPE.ENABLED,
  },
  {
    value: false,
    name: "InActive",
    type: CO_TYPE.ENABLED,
  },
  {
    value: "1",
    name: "Chưa hạch toán",
    type: CO_TYPE.STATUS,
  },
  {
    value: "2",
    name: "Đã hạch toán",
    type: CO_TYPE.STATUS,
  },
  {
    value: "1",
    name: "Khớp",
    type: CO_TYPE.MATCHED_STATUS,
  },
  {
    value: "2",
    name: "Không khớp",
    type: CO_TYPE.MATCHED_STATUS,
  },
];

const COLOR_OPTIONS = [
  {
    value: true,
    columnType: CO_TYPE.ENABLED,
    color: "#00A3FF",
    bgColor: "#D1E7FF",
  },
  {
    value: false,
    columnType: CO_TYPE.ENABLED,
    color: "#828D9A",
    bgColor: "#E2E6EA",
  },
  {
    value: "1",
    columnType: CO_TYPE.STATUS,
    color: "#828D9A",
    bgColor: "#E2E6EA",
  },
  {
    value: "2",
    columnType: CO_TYPE.STATUS,
    color: "#04A857",
    bgColor: "#DDF6E8",
  },
  {
    value: "1",
    columnType: CO_TYPE.MATCHED_STATUS,
    color: "#04A857",
    bgColor: "#DDF6E8",
  },
  {
    value: "2",
    columnType: CO_TYPE.MATCHED_STATUS,
    color: "#E6544F",
    bgColor: "#FFE2DF",
  },
];

const BaseTableColumnChipComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { cell, columnOption } = props;

  const [color, setColor] = useState<string>("#828D9A");
  const [bgColor, setBgColor] = useState<string>("#E2E6EA");
  const [item, setItem] = useState<any>({});
  const [nameField, setNameField] = useState<string>("name");
  const [valueField, setValueField] = useState<string>("value");

  useEffect(() => {
    const asyncData = async () => {
      const cellValue = cell.getValue();
      const valueOption = getOptionByValue(cellValue, columnOption);
      if (valueOption) {
        setItem(valueOption);
      }

      const colorOption = getColorOption(cellValue, columnOption.type);
      if (colorOption) {
        setColor(colorOption.color);
        setBgColor(colorOption.bgColor);
      }
    };

    asyncData();
  }, [cell, columnOption]);

  const getOptionByValue = (
    value: any,
    columnOption: COLUMN_OPTIONS_INTERFACE,
  ) => {
    const opt = OPTIONS.find(
      option =>
        option[valueField] === value && columnOption.type === option.type,
    );
    return opt;
  };

  const getColorOption = (value: any, columnType: CO_TYPE) => {
    const option = COLOR_OPTIONS.find(
      opt => opt[valueField] === value && opt.columnType === columnType,
    );
    return option;
  };

  return (
    <Chip
      size="small"
      label={<>{item?.[nameField] || cell.getValue() || ""}</>}
      className={classes.root}
      icon={<div className="dot"></div>}
      sx={{
        backgroundColor: bgColor,
        "& div.dot": {
          backgroundColor: color,
        },
        "& span": {
          color: color,
        },
      }}
    />
  );
};
const BaseTableColumnChip = React.memo(BaseTableColumnChipComponent);
export { BaseTableColumnChip };
