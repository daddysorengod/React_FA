import React, { forwardRef } from "react";
import useTranslation from "next-translate/useTranslation";
import { AddBalance } from "../AddBalance";
import { IFormType } from "@/src/types/general";
interface Props {
  currentId?: string;
  parentId: string;
  onlyShow: boolean;
  formType: IFormType;
  detailed?: "bank" | "organize" | "investor";
  onCloseDialog?: Function;
  workFollowStatus?: string;
  checkerAPI?: {
    approve?: string;
    deny?: string;
    cancelApprove?: string;
  };
  checkerApprove?: boolean;
}
const AddOrganizeBalanceComponent = forwardRef(
  (props: Props, ref): JSX.Element => {
    const { t } = useTranslation();
    return <AddBalance {...props} ref={ref} detailed={"organize"} />;
  },
);
const AddOrganizeBalance = React.memo(AddOrganizeBalanceComponent);
export { AddOrganizeBalance };
