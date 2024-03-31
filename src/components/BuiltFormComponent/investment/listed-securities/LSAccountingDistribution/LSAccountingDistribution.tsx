import React from "react";
import { useStyles } from "./LSAccountingDistribution.styles";
import useTranslation from "next-translate/useTranslation";
import { LSTransResultForm } from "../LSTransResultForm";
interface Props {
  parentId?: string;
  currentId?: string;
}
const LSAccountingDistributionComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { parentId, currentId } = props;
  return (
    <>
      <LSTransResultForm
        parentId={parentId}
        currentId={currentId}
        isAccountingDistribution
      />
    </>
  );
};
const LSAccountingDistribution = React.memo(LSAccountingDistributionComponent);
export { LSAccountingDistribution };
