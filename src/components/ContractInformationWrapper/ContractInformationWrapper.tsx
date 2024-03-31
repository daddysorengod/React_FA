import React, { useEffect, useState } from "react";
import { useStyles } from "./ContractInformationWrapper.styles";
import useTranslation from "next-translate/useTranslation";
import { ContractInfoFieldConfig } from "@/src/types";
import { ContractInformation } from "../ContractInformation/ContractInformation";
/// import store
import { dispatch } from "@store/store";
import {
  getFormDataReducer,
  storageDetailContract,
} from "@/src/store/reducers/general";
import { CustomView } from "@/src/constants/formConfigFiles";
import { Grid } from "@mui/material";
/// end import store

interface Props {
  currentId?: string;
  customView?: CustomView;
}
const ContractInformationWrapperComponent = (props: Props): JSX.Element => {

  const classes = useStyles();
  const { currentId, customView } = props;
  if (customView !== CustomView.viewContractDetail) {
    return (
      <></>
    )
  }
  const [data, setData] = useState<any>();
  useEffect(() => {
    const getData = async () => {
      if (!currentId) {
        return;
      }
      const res = await dispatch(
        getFormDataReducer({
          url: "/fund-deposit-contract-api/find-by-id",
          id: currentId,
        }),
      );
      if (res && Object.keys(res).length > 0) {
        setData(res);
        dispatch(storageDetailContract(res));
      }
    };
    getData();
  }, [currentId]);
  return (
    <>
      {customView === CustomView.viewContractDetail &&
        window.innerWidth &&
        window.innerWidth > 1060 ? (
        <Grid
          sx={{
            width: `${window.innerWidth ? window.innerWidth / 5.8 : 250}px`,
            maxWidth: `${window.innerWidth ? window.innerWidth / 5.8 : 250}px`,
          }}
          className={classes.contractInfoContainer}
        >
          <ContractInformation data={data} config={contractInfoFieldsConfig} />
        </Grid>
      ) : (
        <></>
      )}
    </>
  );
};
const ContractInformationWrapper = React.memo(
  ContractInformationWrapperComponent,
);
export { ContractInformationWrapper };

const contractInfoFieldsConfig: ContractInfoFieldConfig[] = [
  { label: "Mã quỹ", key: "fundCode" },
  { label: "Tên quỹ", key: "fundFullname" },
  { label: "Số TK TVLK", key: "custodyAccount" },
  {
    label: "Ngày chứng từ",
    key: "transDate",
    formatType: "DATE",
  },
  { label: "", key: "", type: "LINE" },
  {
    label: "Số hợp đồng",
    key: "contractNumber",
  },
  {
    label: "Ngày ký hợp đồng",
    key: "createdDate",
    formatType: "DATE",
  },
  {
    label: "Ngày hiệu lực HĐ",
    key: "valueDate",
    formatType: "DATE",
  },
  {
    label: "ID Hợp đồng",
    key: "a",
  },
  {
    label: "Ngày đáo hạn",
    key: "maturityDate",
    formatType: "DATE",
  },
  { label: "", key: "", type: "LINE" },

  {
    label: "Ngân hàng",
    key: "orgProviderFullname",
  },
  { label: "Loại tiền tệ", key: "currencyCode" },
  {
    label: "Tỷ giá HĐ",
    key: "exchangeRate",
  },
  {
    label: "Giá trị HĐ",
    key: "principal",
  },
  {
    label: "Giá trị HĐ quy đổi",
    key: "principalConvert",
  },

  { label: "Kỳ hạn", key: "e" },

  {
    label: "Lãi suất/Năm",
    key: "interestRate",
    formatType: "PERCENT",
  },
  {
    label: "Ngày hiệu lực",
    key: "valueDate",
    formatType: "DATE",
  },
  {
    label: "Ngày đáo hạn",
    key: "maturityDate",
    formatType: "DATE",
  },
  {
    label: "Số ngày thực gửi",
    key: "actualDepositDay",
  },
  {
    label: "Số ngày cơ sở",
    key: "dayBasicVal.name",
  },
  {
    label: "Chu kỳ trả lãi",
    key: "interestPeriodVal.name",
  },
  {
    label: "Tần suất trả lãi",
    key: "interestFrequencytVal.name",
  },
  {
    label: "Diễn giải",
    key: "description",
  },
];
