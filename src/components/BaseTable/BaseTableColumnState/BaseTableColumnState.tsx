import React from "react";
import { useStyles } from "./BaseTableColumnState.styles";
import useTranslation from "next-translate/useTranslation";
import { MRT_Cell } from "material-react-table";
import { BaseWorkFollowStatusIcon } from "../../BaseWorkFollowStatusIcon";
interface Props {
  cell: MRT_Cell<any>;
}

const BaseTableColumnStateComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { cell } = props;

  return <BaseWorkFollowStatusIcon value={cell.getValue<any>()} />;
};

const BaseTableColumnState = React.memo(BaseTableColumnStateComponent);
export { BaseTableColumnState };
