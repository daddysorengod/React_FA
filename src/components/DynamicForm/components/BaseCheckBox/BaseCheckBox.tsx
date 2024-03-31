import React from "react";
import { useStyles } from "./BaseCheckBox.styles";
import { DynamicObject, IField } from "@/src/types/field";
import { Checkbox } from "@mui/material";

interface Props {
  fieldSet?: IField;
  fieldIndex: number;
  initialValue: boolean;
  onChangeValue: (value: any, item: IField, formatValue: string) => void;
  isDisabled: boolean;
  customAttrs?: DynamicObject | null;
  isRequired?: boolean;
}

const BaseCheckBoxComponent = (props: Props): JSX.Element => {
  const {
    fieldIndex,
    fieldSet,
    initialValue,
    onChangeValue,
    isDisabled,
    customAttrs,
    isRequired,
  } = props;
  const classes = useStyles();

  const getCustomStyles = () => {
    if (!customAttrs || !customAttrs?.customStyles) {
      return classes.checkbox;
    }
    const className = customAttrs?.customStyles;
    switch (className) {
      case "labelOnTOp":
        return classes.labelOnTOp;
      case "paddingTop":
        return classes.paddingTop;
      default:
        return classes.checkbox;
    }
  };
  return (
    <div
      key={`${
        fieldSet?.name ? fieldSet?.name.replace(/\s+/g, "_") : ""
      }-${fieldIndex}`}
      className={`${getCustomStyles()}`}
      onClick={() => {
        onChangeValue(!initialValue ?? false, fieldSet ?? {}, "");
      }}
    >
      <Checkbox
        color="success"
        name={fieldSet?.name ?? ""}
        checked={initialValue ?? false}
        disabled={isDisabled}
      />
      <label className={classes.checkboxLabel}>
        {fieldSet?.label}
        {isRequired ? <span style={{ color: "red" }}> *</span> : ""}
      </label>
    </div>
  );
};
const BaseCheckBox = React.memo(BaseCheckBoxComponent);
export { BaseCheckBox };
