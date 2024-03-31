import React, { useState, useEffect } from "react";
import { useStyles } from "./TableColumnStatusFA.styles";
import useTranslation from "next-translate/useTranslation";
import { MRT_Cell } from "material-react-table";
import { COLUMN_OPTIONS_INTERFACE } from "@/src/types";
import { Chip } from "@mui/material";
import { CO_TYPE } from "@/src/constants";
interface Props {
  cell: MRT_Cell<any>;
  columnOption: COLUMN_OPTIONS_INTERFACE;
}


const TableColumnStatusFAComponent = (props: Props): JSX.Element => {
  
  const classes = useStyles();
  
  // const { cell, columnOption } = props;

  return (
    <Chip
      size="small"
      label={<>{"Chưa duyệt"}</>}
      className={`${classes.root} ${classes.new}`}
      icon={<div className="dot"></div>}
    />
  );
};
const TableColumnStatusFA = React.memo(TableColumnStatusFAComponent);
export { TableColumnStatusFA };
