import React, { useState, useRef, SyntheticEvent, useEffect } from "react";
import { useStyles } from "./ProfileLayout.styles";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  ClickAwayListener,
  Paper,
  Popper,
  Typography,
  useMediaQuery,
  FormControl,
  Stack,
  CardContent,
  ButtonBase,
} from "@mui/material";

// project import
import { MainCard } from "@components/MainCard";
import Transitions from "@components/@extended/Transitions";

// assets
import {
  LogoutOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  PropertySafetyOutlined,
} from "@ant-design/icons";
import { ImagesSvg } from "@/src/constants/images";
import { logout } from "@/src/store/reducers/auth";
/// import store
import { useDispatch } from "react-redux";
import { dispatch, useSelector } from "@store/store";
import { RootStateProps } from "@app/types/root";
import { removeCommonAuthorizationToken } from "@/src/helpers";
/// end import store

interface Props {}
const ProfileLayoutComponent = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const [read, setRead] = useState(2);
  const [userName, setUserName] = useState("");
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const matchesXs = useMediaQuery(theme.breakpoints.down("md"));

  const { profile } = useSelector((state: RootStateProps) => state.auth);

  useEffect(() => {
    setUserName(profile?.userName);
  }, [profile]);

  const anchorRef = useRef<any>(null);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleLogout = async () => {
    setOpen(false);
    removeCommonAuthorizationToken();
    dispatch(logout());
    router.push({
      pathname: "/login",
      query: {},
    });
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const xxlScreen = useMediaQuery(theme.breakpoints.between(1340, 1450));

  const iconBackColorOpen =
    theme.palette.mode === "dark" ? "grey.200" : "grey.300";
  return (
    <div
      style={{
        // backgroundColor: "#1f764b",
        height: "41.3px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{ flexShrink: 0, ml: 0.75 }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? "profile-grow" : undefined}
        aria-haspopup="true"
      >
        <FormControl sx={{ width: { xs: "100%", md: 160 } }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            {/* <Badge badgeContent={read} color="error">
              <BellOutlined style={{color:"#fff"}}/>
            </Badge> */}
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              justifyContent="end"
              sx={{ p: 0.25, px: 0.75, maxHeight: "50px" }}
              onClick={handleToggle}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#fff",
                  "&::selection": {
                    backgroundColor: "transparent",
                    color: "inherit",
                  },
                  cursor: "pointer",
                  "&::-moz-selection": {
                    backgroundColor: "transparent",
                    color: "inherit",
                  },
                  maxWidth: xxlScreen ? 100 : "100%",
                  textAlign: "start",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {" "}
                {userName}
              </Typography>
              <ButtonBase
                sx={{
                  padding: "4.09px",
                  background: "#fff",
                  borderRadius: "3.6px",
                  border: "0.9px solid #E2E6EA",
                }}
              >
                <Avatar
                  alt={"VinaCapital"}
                  src={ImagesSvg.logoVpb}
                  sx={{ width: 30, height: 30 }}
                />
              </ButtonBase>
            </Stack>
          </div>
        </FormControl>
      </Box>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: 250,
                minWidth: 211,
                maxWidth: 250,
                [theme.breakpoints.down("md")]: {
                  maxWidth: 250,
                },
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false} content={false}>
                  <CardContent sx={{ px: 2.5, pt: 1.2, pb: 1.2 }}>
                    {/* <Grid
                      container
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid item> */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      sx={{ width: "100%" }}
                    >
                      {/* <Avatar alt={"user.name"} src={"user.avatar"} /> */}
                      <Stack sx={{ width: "100%" }} justifyContent="start">
                        <ButtonBase
                          sx={{
                            height: "44px",
                            width: "100%",
                            // bgcolor: open ? iconBackColorOpen : "transparent",
                            borderRadius: 1,
                            "&:hover": {
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? "secondary.light"
                                  : "secondary.lighter",
                            },
                            "&:focus-visible": {
                              outline: `2px solid ${theme.palette.secondary.dark}`,
                              outlineOffset: 2,
                            },
                            justifyContent: "start",
                          }}
                          onClick={() => {}}
                        >
                          <UserOutlined
                            style={{ fontSize: "20px", paddingRight: 12 }}
                          />
                          <Typography
                            alignItems={"start"}
                            variant="h6"
                            fontWeight={500}
                            fontFamily={"Inter"}
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace:"nowrap"
                            }}
                          >
                            {userName}
                          </Typography>
                        </ButtonBase>
                        {/* <ButtonBase
                          sx={{
                            height: "44px",
                            width: "100%",
                            // bgcolor: open ? iconBackColorOpen : "transparent",
                            borderRadius: 1,
                            "&:hover": {
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? "secondary.light"
                                  : "secondary.lighter",
                            },
                            "&:focus-visible": {
                              outline: `2px solid ${theme.palette.secondary.dark}`,
                              outlineOffset: 2,
                            },
                            justifyContent: "start",
                          }}
                        >
                          <PropertySafetyOutlined
                            style={{ fontSize: "20px", paddingRight: 12 }}
                          />
                          <Typography
                            alignItems={"start"}
                            variant="h6"
                            fontWeight={500}
                            fontFamily={"Inter"}
                          >
                            Bảo mật và đăng nhập
                          </Typography>
                        </ButtonBase> */}
                        {/* <ButtonBase
                          sx={{
                            height: "44px",
                            width: "100%",
                            // bgcolor: open ? iconBackColorOpen : "transparent",
                            borderRadius: 1,
                            "&:hover": {
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? "secondary.light"
                                  : "secondary.lighter",
                            },
                            "&:focus-visible": {
                              outline: `2px solid ${theme.palette.secondary.dark}`,
                              outlineOffset: 2,
                            },
                            justifyContent: "start",
                          }}
                        >
                          <QuestionCircleOutlined
                            style={{ fontSize: "20px", paddingRight: 12 }}
                          />
                          <Typography
                            alignItems={"start"}
                            variant="h6"
                            fontWeight={500}
                            fontFamily={"Inter"}
                          >
                            Trợ giúp
                          </Typography>
                        </ButtonBase> */}
                        <ButtonBase
                          sx={{
                            height: "44px",
                            width: "100%",
                            // bgcolor: open ? iconBackColorOpen : "transparent",
                            borderRadius: 1,
                            "&:hover": {
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? "secondary.light"
                                  : "secondary.lighter",
                            },
                            "&:focus-visible": {
                              outline: `2px solid ${theme.palette.secondary.dark}`,
                              outlineOffset: 2,
                            },
                            justifyContent: "start",
                          }}
                          onClick={handleLogout}
                        >
                          <LogoutOutlined
                            style={{
                              color: "red",
                              fontSize: "20px",
                              paddingRight: 12,
                            }}
                          />
                          <Typography
                            color={"error"}
                            alignItems={"start"}
                            variant="h6"
                            fontWeight={500}
                            fontFamily={"Inter"}
                          >
                            Đăng xuất
                          </Typography>
                        </ButtonBase>
                      </Stack>
                    </Stack>
                  </CardContent>
                  {open && (
                    <>
                      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Paper />
                      </Box>
                    </>
                  )}
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </div>
  );
};
const ProfileLayout = React.memo(ProfileLayoutComponent);
export { ProfileLayout };
