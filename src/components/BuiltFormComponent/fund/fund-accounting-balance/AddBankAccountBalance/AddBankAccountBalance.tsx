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
const AddBankAccountBalanceComponent = forwardRef(
  (props: Props, ref): JSX.Element => {
    const { t } = useTranslation();
    return <AddBalance onCloseDialog={undefined} {...props} ref={ref} detailed={"bank"} />;
  },
);
const AddBankAccountBalance = React.memo(AddBankAccountBalanceComponent);
export { AddBankAccountBalance };
