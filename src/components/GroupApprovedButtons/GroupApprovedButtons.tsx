import React from "react";
import { useStyles } from "./GroupApprovedButtons.styles";
import useTranslation from "next-translate/useTranslation";
import { Box, Button } from "@mui/material";

import {
  Close as CloseIcon,
  Check as CheckIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { dispatch } from "@/src/store";
import { approveRecord, lockNAV } from "@/src/store/reducers/general";
interface Props {
  workFollowStatus?: string;
  checkerAPI?: {
    approve?: string;
    deny?: string;
    cancelApprove?: string;
    cancelAccountingEntry?: {
      url?: string;
      id?: string;
    };
  };
  currentId?: string;
  onCloseDialog?: Function;
  smallSize?: boolean;
  onCallApi?: Function;
}
const GroupApprovedButtonsComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();

  const {
    workFollowStatus,
    checkerAPI,
    currentId,
    onCloseDialog,
    smallSize,
    onCallApi,
  } = props;

  const handleCallAPI = async (
    action: "approve" | "deny" | "cancelApprove" | "cancelAccountingEntry",
  ) => {
    if (action === "cancelAccountingEntry") {
      const url = checkerAPI?.[action]?.url || "";
      if (url) {
        try {
          const response = await dispatch(
            approveRecord({
              url,
              id: checkerAPI?.[action]?.id,
            }),
          );
          if (response) {
            if (onCloseDialog) {
              onCloseDialog();
            }
          }

          if (onCallApi) {
            onCallApi();
          }
        } catch (err) {}
      } else {
        if (onCloseDialog) {
          onCloseDialog();
        }
      }
      return false;
    }
    const url = checkerAPI?.[action] || "";
    if (url) {
      try {
        const response = await dispatch(
          approveRecord({
            url,
            id: currentId,
          }),
        );
        if (response) {
          if (onCloseDialog) {
            onCloseDialog();
          }
        }
        if (onCallApi) {
          onCallApi();
        }
      } catch (err) {}
    } else {
      if (onCloseDialog) {
        onCloseDialog();
      }
    }
    return false;
  };

  const handleApproveRecord = async () => {
    await handleCallAPI("approve");
  };

  const handleApproveLockNav = async () => {
    const url = checkerAPI?.approve || "";
    if (url) {
      try {
        const response = await dispatch(
          lockNAV({
            url: "fund-accounting-api/approved-nav",
            id: currentId,
          }),
        );
        if (response) {
          if (onCloseDialog) {
            onCloseDialog();
          }
        }
      } catch (err) {}
    } else {
      if (onCloseDialog) {
        onCloseDialog();
      }
    }
    return false;
  };

  const handleDenyRecord = async () => {
    await handleCallAPI("deny");
  };

  const handleCancelApproveRecord = async () => {
    await handleCallAPI("cancelApprove");
  };

  const handleCancelAccountingEntry = async () => {
    await handleCallAPI("cancelAccountingEntry");
  };

  return (
    <Box>
      {typeof checkerAPI?.cancelAccountingEntry !== undefined &&
      checkerAPI?.cancelAccountingEntry?.url ? (
        <Button
          startIcon={<RefreshIcon />}
          onClick={handleCancelAccountingEntry}
          className={classes.common_button6}
        >
          Hủy bút toán
        </Button>
      ) : (
        <>
          {workFollowStatus == "1" && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                startIcon={<CloseIcon />}
                onClick={handleDenyRecord}
                className={
                  smallSize
                    ? classes.common_button4_small
                    : classes.common_button4
                }
              >
                Từ chối
              </Button>
              <Button
                startIcon={<CheckIcon />}
                className={
                  smallSize
                    ? classes.common_button3_small
                    : classes.common_button3
                }
                onClick={handleApproveRecord}
                sx={{ ml: 1 }}
              >
                Duyệt
              </Button>
            </Box>
          )}
          {(workFollowStatus == "2" || workFollowStatus == "3") && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                startIcon={<RefreshIcon />}
                onClick={handleCancelApproveRecord}
                className={
                  smallSize
                    ? classes.common_button5_small
                    : classes.common_button5
                }
              >
                Hủy Duyệt
              </Button>
            </Box>
          )}
           {workFollowStatus == "5" && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                startIcon={<CheckIcon />}
                className={
                  smallSize
                    ? classes.common_button3_small
                    : classes.common_button3
                }
                onClick={handleApproveLockNav}
                sx={{ ml: 1 }}
              >
                Duyệt
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
const GroupApprovedButtons = React.memo(GroupApprovedButtonsComponent);
export { GroupApprovedButtons };
