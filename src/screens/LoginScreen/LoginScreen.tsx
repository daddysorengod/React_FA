import React, { useEffect, useState } from "react";
import { useStyles } from "./LoginScreen.styles";
import useTranslation from "next-translate/useTranslation";
import {
  FormControl,
  TextField,
  InputLabel,
  Input,
  Grid,
  Stack,
  Button,
  InputAdornment,
  IconButton,
  OutlinedInput,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AuthWrapper } from "@/src/layouts";
import AnimateButton from "@/src/components/AnimateButton/AnimateButton";
import { login } from "@/src/store/reducers/auth";
import { useDispatch } from "@store/store";
import "jquery";
import { useRouter } from "next/router";
/// import store
import { dispatch, useSelector } from "@store/store";
import { RootStateProps } from "@app/types/root";
import { DynamicObject } from "@/src/types/field";
import { Loader } from "@/src/components";
/// end import store

interface Props {}
const LoginScreenComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loginOption, setLoginOption] = React.useState("Checker");
  const [options] = useState(["Checker", "Maker"]);
  const [isSaveInfo, setIsSaveInfo] = useState(false);
  const [value, setValue] = useState({
    userName: "",
    password: "",
  });
  const dispatch = useDispatch();
  const handleClickShowPassword = () => setShowPassword(show => !show);
  const onHandleChange = (e: any) => {
    setLoginOption(e.target.value);
  };
  
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };
  const handleChangeCheckbox = () => {
    setIsSaveInfo(!isSaveInfo);
  };
  const [formErrors, setFormErrors] = useState<DynamicObject>({});

  const { activeTab,isLoading } = useSelector((state: RootStateProps) => state.menu);
  const mapFieldErrorToFormError = (name: string, message: string) => {
    setFormErrors(formErrors => ({
      ...formErrors,
      [name]: message,
    }));
  };
  
  const onChangeEmail = e => {
    setValue({
      ...value,
      userName: e.target.value,
    });
  };

  const onChangePassword = e => {
    setValue({
      ...value,
      password: e.target.value,
    });
  };

  useEffect(() => {
    setValue({
      ...value,
      userName: localStorage.getItem("userName") ?? "",
    });
    setIsSaveInfo(Boolean(localStorage.getItem("isSaveInfo") ?? ""));
    $("#login_form").validate({
      rules: {
        userName: {
          required: true,
          // email: true,
        },
        password: {
          required: true,
        },
      },
      messages: {
        userName: {
          required: "Vui lòng nhập thông tin",
          // email: "Tên đăng nhập không đúng định dạng",
        },
        password: {
          required: "Vui lòng nhập mật khẩu",
        },
      },
      errorElement: "p",
      errorClass: "material-icons",
      validClass: "",
      errorPlacement: function (error, element:any) {
        // error.insertAfter(`#${element[0]?.name}`);
        // error.css({ margin: "6px 0 0 0", color: "red", fontSize: 13 });
        // .css({ border: "1px solid red" });
        mapFieldErrorToFormError(element.attr("name"), error.text());
      },
      success: function (label, element: any) {
        $(`#icon-${element?.name}`).remove();
        $(element).removeClass("invalid");
        label.remove();
      },
      onfocusout: function (element) {
        $(element).valid();
      },
    });
  }, []);

  const onLogin = async (e: any) => {
    const formValid = $("#login_form").valid();
    if (formValid) {
      if (isSaveInfo) {
        localStorage.setItem("userName", value?.userName);
        localStorage.setItem("isSaveInfo", isSaveInfo.toString());
      } else {
        localStorage.removeItem("userName");
        localStorage.removeItem("isSaveInfo");
      }
      const isLogin = dispatch(
        login(
          value?.userName,
          value?.password,
          loginOption === "Checker" ? 1 : 2,
        ),
      );
      try {
        if (await isLogin) {
          // direct home
          router.push(activeTab ? activeTab : "/general/bank-api");
        }
      } catch (error) {
        router.push("/general/bank-api");
      }
    } else{
      const checkFormErrors: any = $(
        `#login_form`,
      )?.validate().errorList;
      setFormErrors(
        checkFormErrors?.reduce((obj, field) => {
          obj[field.element.name] = field.message;
          return obj;
        }, {}),
      );
    }
  };

  return (
    <AuthWrapper title={"Đăng nhập"}>
      {isLoading && <Loader />}
      <form
        id="login_form"
        style={{
          width: "100%",
          // margin: "0 0 20px 0"
        }}
      >
        <Grid container spacing={2} className={classes.login}>
          <Grid item xs={12}>
            <Stack spacing={1} id="userName">
              <InputLabel className={classes.label}>Tên đăng nhập</InputLabel>
              <OutlinedInput
                fullWidth
                className={classes.input}
                value={value?.userName}
                name="userName"
                placeholder=""
                required
                onChange={event => onChangeEmail(event)}
                endAdornment={
                  <InputAdornment position="end">
                    <div id={`tooltip-login-userName`}></div>
                  </InputAdornment>
                }
              />
              {formErrors?.userName ? <span className={classes.err}>{formErrors?.userName}</span> : <></>}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1} id="password">
              <InputLabel className={classes.label}>Mật khẩu</InputLabel>
              <OutlinedInput
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                className={classes.input}
                onChange={event => {
                  onChangePassword(event);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <div id={"tooltip-login-password"}></div>
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {formErrors?.password ? <span className={classes.err}>{formErrors?.password}</span> : <></>}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel className={classes.label}>Vai trò</InputLabel>
              <FormControl fullWidth={true}>
                <Select
                  className={classes.input}
                  fullWidth={true}
                  value={loginOption}
                  displayEmpty
                  onChange={e => onHandleChange(e)}
                >
                  {options?.map((item: any, index: number) => (
                    <MenuItem key={`${item}-option-${index}`} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isSaveInfo}
                  onChange={handleChangeCheckbox}
                />
              }
              label={<InputLabel>Lưu mã truy cập?</InputLabel>}
            />
          </Grid>

          <Grid item xs={12}>
            <AnimateButton>
              <Button
                className={classes.buttonLogin}
                disableElevation
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                onClick={e => {
                  e.preventDefault();
                  if(isLoading){
                    return
                  }
                  onLogin(e)
                }}
              >
                Đăng nhập
              </Button>
            </AnimateButton>
          </Grid>
        </Grid>
      </form>
      {/* </FormControl> */}
    </AuthWrapper>
  );
};

const LoginScreen = React.memo(LoginScreenComponent);
export { LoginScreen };
