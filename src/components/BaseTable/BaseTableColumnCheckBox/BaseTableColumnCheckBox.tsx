import React, { useState, useEffect, Fragment } from "react";
import { useStyles } from "./BaseTableColumnCheckBox.styles";
import useTranslation from "next-translate/useTranslation";
import {
  Done as DoneIcon,
  AccessTime as AccessTimeIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { MRT_Cell } from "material-react-table";
interface Props {
  cell: MRT_Cell<any>;
}


const BaseTableColumnCheckBoxComponent = (props: Props): JSX.Element => {
  const { cell } = props;
  const checkValue = cell.getValue<any>()

  return (

    <Fragment>
      {typeof checkValue !== "undefined" ? (<Tooltip title={checkValue ? "Có" : "Không"} arrow>
        {
          checkValue ? <DoneIcon sx={{ color: "#04A857" }} /> : <ClearIcon sx={{ color: "#FFB80B" }} />
        }
      </Tooltip>) : (<></>)}
    </Fragment>
  )
};

const BaseTableColumnCheckBox = React.memo(BaseTableColumnCheckBoxComponent);
export { BaseTableColumnCheckBox };
