"use client";
import React, { useEffect, useState } from "react";
import { useStyles } from "./AccountingInvestment.styles";
import useTranslation from "next-translate/useTranslation";
import { TransitionProps } from "@mui/material/transitions";
/// import store
import { useDispatch } from "react-redux";
import { dispatch, useSelector } from "@store/store";
import { RootStateProps } from "@app/types/root";
import { Close as CloseIcon } from "@mui/icons-material";
/// end import store
import {
  ButtonBase,
  Dialog,
  Slide,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Box,
  IconButton,
  InputAdornment,
  Tooltip,
  Typography,
  Grid,
} from "@mui/material";
import {
  accountingInvestment,
  getFormDataReducer,
  getSystemConfig,
} from "@/src/store/reducers/general";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { showErrorSnackBar } from "@/src/store/reducers/snackbar";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker, StaticDatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { formatNormalDate, formatParamsDate } from "@/src/helpers";
import { ImagesSvg } from "@/src/constants/images";
import { BaseConfirmModal } from "@/src/components";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
interface Props {}
const AccountingInvestmentComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const globalFundId = useSelector(
    (state: RootStateProps) => state.general.globalFundId,
  );
  const [navDate, setNavDate] = useState() as any;
  const [navDateErr, setNavDateErr] = useState() as any;
  const [visible, setVisible] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<number>(0);
  const role = useSelector(state => state.auth.role);
  const globalFundData = useSelector(
    (state: RootStateProps) => state.general.globalFundData,
  );
  const [recentAccountingDate, setRecentAccountingDate] = useState("");
  const [nextNavDate, setNextNavDate] = useState("");
  const [recentNavDate, setRecentNavDate] = useState("");
  const [currentDate, setCurrentDate] = useState(moment(new Date()));
  const [openDialogCancel, setOpenDialogCancel] = useState(false);

  const systemData =useSelector(
    (state: RootStateProps) => state.general.systemSetting,
  );
  
  useEffect(()=>{
    const getSystemData = ()=>{
      const res = dispatch(getSystemConfig({
        url:"/system-api/system-config",
        slice:"systemDate"
      }))
    }
    getSystemData()
  },[])  

  useEffect(() => {
    if (role) {
      setUserRole(role);
    }
  }, [role]);

  const onPressAccounting = () => {
    if (!navDate) {
      setNavDateErr("Bạn chưa nhập ngày hạch toán");
      return;
    } else {
      setNavDateErr("");
    }
    setOpenDialogCancel(true);
    //   setCurrentDate(moment(recentAccountingDate));
  };

  const submitNavDate = async navDate => {
    if (!navDate) {
      return;
    }
    const success = await dispatch(
      accountingInvestment({ accountingDate: navDate, fundId: globalFundId }),
    );
    if (success) {
      setVisible(false);
      setNavDate("");
      setNavDateErr("");
      const fundInfo = await dispatch(
        getFormDataReducer({
          url: "/fund-information-api/find-by-id",
          id: globalFundId,
        }),
      );
      if (fundInfo && Object.keys(fundInfo).length > 0) {
        dispatch({
          type: "general/setGlobalFundData",
          payload: fundInfo,
        });
      }
    }
  };

  const handleOpenDatePicker = async () => {
    if (!globalFundId) {
      setNavDateErr("Bạn chưa chọn quỹ");
      await dispatch(showErrorSnackBar("Bạn chưa chọn quỹ"));
      return;
    }
    setVisible(true);
    // setNavDate(
    //   recentAccountingDate ? moment(recentAccountingDate) : currentDate,
    // );
    setNavDate("");
    setNavDateErr("");
  };

  useEffect(() => {
    setRecentAccountingDate(globalFundData?.recentAccountingDate ?? "");
    setNextNavDate(globalFundData?.nextNavDate ?? "");
    setRecentNavDate(globalFundData?.recentNavDate ?? "");
  }, [globalFundData]);

  const onCloseConfirmModal = () => {
    setOpenDialogCancel(false);
  };

  const accountingOnPress = async () => {
    await submitNavDate(navDate);
    onCloseConfirmModal();
  };

  const renderRole = () => {
    try {
      switch (userRole) {
        case 1:
          return "Checker";
        case 2:
          return "Maker";
        default:
          return "";
      }
    } catch (err) {
      return "";
    }
  };

  return (
    <div className={classes.roleButtonContainer}>
      <Grid
        container
        className={`${classes.headerStyles}`}
        sx={{
          minWidth: { xs: "100%", md: 665 },
        }}
      >
        <Grid item>
          <ButtonBase
            className={classes.activeButton}
            onClick={handleOpenDatePicker}
            color={"white"}
            // disabled={!(userRole===2)}
          >
            Ngày hạch toán
          </ButtonBase>
        </Grid>
        
          <Grid
            item
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"start"}
          >
            <Grid container direction={"column"}>
              <Grid item>
                <Typography
                  
                  fontWeight={400}
                  className={`${classes.headerText} ${classes.typography}`}
                >
                  Ngày hạch toán gần nhất:
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  
                  fontWeight={600}
                  className={`${classes.headerText} ${classes.typography}`}
                >
                  {recentAccountingDate
                    ? formatNormalDate(moment(recentAccountingDate))
                    : "__/__/__"}
                </Typography>
              </Grid>{" "}
            </Grid>
          </Grid>
          <Grid
            item
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"start"}
          >
            <Grid container direction={"column"}>
              <Grid item>
                <Typography
                  
                  fontWeight={400}
                  className={`${classes.headerText} ${classes.typography}`}
                >
                  NAV tiếp theo:
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  
                  fontWeight={600}
                  className={`${classes.headerText} ${classes.typography}`}
                >
                  {nextNavDate
                    ? formatNormalDate(moment(nextNavDate))
                    : "__/__/__"}
                </Typography>
              </Grid>{" "}
            </Grid>
          </Grid>
          <Grid
            item
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"start"}
          >
            <Grid container direction={"column"}>
              <Grid item>
                <Typography
                  
                  fontWeight={400}
                  className={`${classes.headerText} ${classes.typography}`}
                >
                  NAV gần nhất:
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  
                  fontWeight={600}
                  className={`${classes.headerText} ${classes.typography}`}
                >
                  {recentNavDate
                    ? formatNormalDate(moment(recentNavDate))
                    : "__/__/__"}
                </Typography>
              </Grid>{" "}
            </Grid>
          </Grid>
          <Grid
            item
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"start"}
          >
            <Grid container direction={"column"}>
              <Grid item>
                <Typography
                  
                  fontWeight={400}
                  className={`${classes.headerText} ${classes.typography}`}
                >
                  Ngày hệ thống:
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  
                  fontWeight={600}
                  className={`${classes.headerText} ${classes.typography}`}
                >
                  {systemData?.systemDate?.bussinessDate
                    ? formatNormalDate(moment(systemData?.systemDate?.bussinessDate))
                    : "__/__/__"}
                </Typography>
              </Grid>{" "}
            </Grid>
          </Grid>
        
        <Grid
          item
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"start"}
        >
          <Grid container direction={"column"}>
            <Grid item>
              <Typography
                color={"#fff"}
                fontSize={12}
                fontWeight={400}
                className={`${classes.headerText} ${classes.typography}`}
              >
                Vai trò:
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                color={"#fff"}
                fontSize={12}
                fontWeight={600}
                className={`${classes.headerText} ${classes.typography}`}
              >
                {renderRole()}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={visible}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        maxWidth={"sm"}
        fullWidth={false}
        fullScreen={false}
        sx={{
          "& .MuiPaper-root": {
            height: 540,
            maxHeight: "100vh",
            minWidth: 200,
          },
        }}
      >
        <DialogTitle id="scroll-dialog-title" className={classes.dialogTitle}>
          <label className={classes.dialogLabel}>Ngày hạch toán</label>
          <IconButton
            onClick={() => {
              setVisible(false);
              setNavDate("");
              setNavDateErr("");
              // if (recentAccountingDate) {
              //   setCurrentDate(moment(recentAccountingDate));
              // }
            }}
            className={classes.closeBtn}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <div style={{ paddingTop: 14 }}></div>
          <div>
            <label className={classes.inputLabel}>
              {"Ngày hạch toán"}
              {<span style={{ color: "red" }}> *</span>}
            </label>
            <div className={classes.date}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  className={classes.datePickerInput}
                  format="DD/MM/YYYY"
                  value={!navDate ? null : moment(navDate)}
                  slotProps={{
                    textField: {
                      name: `${"Ngày hạch toán" ?? ""}`,
                      color: navDateErr ? "error" : "primary",
                      error: navDateErr ? true : false,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{ position: "absolute", right: "5%" }}
                          >
                            {navDateErr ? (
                              <Tooltip
                                placement="bottom-end"
                                title={
                                  <React.Fragment>
                                    <Typography color="inherit">
                                      {navDateErr}
                                    </Typography>
                                  </React.Fragment>
                                }
                              >
                                <img src={ImagesSvg.textFieldErrorIcon} />
                              </Tooltip>
                            ) : (
                              <></>
                            )}
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            sx={{ display: "none" }}
                          ></InputAdornment>
                        ),
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <StaticDatePicker
              orientation="landscape"
              className={classes.dateStaticStyles}
              defaultValue={
                !recentAccountingDate
                  ? currentDate
                  : moment(recentAccountingDate)
              }
              onChange={newValue => {
                if (formatNormalDate(newValue as any) != "Invalid date") {
                  setNavDate(formatParamsDate(newValue as any));
                  setCurrentDate(moment(newValue));
                }
              }}
              value={
                !recentAccountingDate
                  ? currentDate
                  : moment(recentAccountingDate)
              }
            />
          </LocalizationProvider>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              pt: 2,
            }}
          >
            <ButtonBase
              onClick={onPressAccounting}
              className={classes.commonButtonBack}
            >
              Xác nhận
            </ButtonBase>
          </Box>
        </DialogContent>
      </Dialog>
      <BaseConfirmModal
        icon={""}
        title={"Bạn có muốn thức hiện hạch toán không?"}
        content={""}
        textSubmit={"Có"}
        textClose={"Không"}
        visible={openDialogCancel}
        onClose={onCloseConfirmModal}
        onSubmit={accountingOnPress}
        // key={`fa-sub
        // ${dialogConfig?.title}`}
      />
    </div>
  );
};
const AccountingInvestment = React.memo(AccountingInvestmentComponent);
export { AccountingInvestment };
