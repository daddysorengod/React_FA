import { SyntheticEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { Alert, Button, Grow, Slide, SlideProps } from "@mui/material";
import MuiSnackbar from "@mui/material/Snackbar";

// project-import
import IconButton from "./IconButton";

// assets
import { CloseOutlined } from "@ant-design/icons";

import { KeyedObject, RootStateProps } from "@app/types/root";
import { closeSnackbar } from "@store/reducers/snackbar";

// animation function
function TransitionSlideLeft(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

function TransitionSlideUp(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

function TransitionSlideRight(props: SlideProps) {
  return <Slide {...props} direction="right" />;
}

function TransitionSlideDown(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

function GrowTransition(props: SlideProps) {
  return <Grow {...props} />;
}

// animation options
const animation: KeyedObject = {
  SlideLeft: TransitionSlideLeft,
  SlideUp: TransitionSlideUp,
  SlideRight: TransitionSlideRight,
  SlideDown: TransitionSlideDown,
  Grow: GrowTransition,
  Slide,
};

// ==============================|| SNACKBAR ||============================== //

const Snackbar = () => {
  const dispatch = useDispatch();
  const snackbar = useSelector((state: RootStateProps) => state.snackbar);
  const {
    actionButton,
    anchorOrigin,
    alert,
    close,
    message,
    open,
    transition,
    variant,
    title,
    svg,
  } = snackbar;

  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(closeSnackbar());
  };

  return (
    <>
      {/* default snackbar */}
      {variant === "default" && (
        <MuiSnackbar
          anchorOrigin={anchorOrigin}
          open={open}
          autoHideDuration={2000}
          onClose={handleClose}
          message={message}
          TransitionComponent={animation[transition]}
          action={
            <>
              <Button color="secondary" size="small" onClick={handleClose}>
                UNDO
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
                sx={{ mt: 0.25 }}
              >
                <CloseOutlined />
              </IconButton>
            </>
          }
        />
      )}

      {/* alert snackbar */}
      {variant === "alert" && (
        <MuiSnackbar
          TransitionComponent={animation[transition]}
          anchorOrigin={anchorOrigin}
          open={open}
          autoHideDuration={2000}
          onClose={handleClose}
        >
          <Alert
            variant={alert.variant}
            color={alert.color}
            action={
              <>
                {actionButton !== false && (
                  <Button
                    color={alert.color}
                    size="small"
                    onClick={handleClose}
                  >
                    UNDO
                  </Button>
                )}
                {close !== false && (
                  <IconButton
                    sx={{ mt: 0.25 }}
                    size="small"
                    aria-label="close"
                    variant="contained"
                    color={alert.color}
                    onClick={handleClose}
                  >
                    <CloseOutlined />
                  </IconButton>
                )}
              </>
            }
            sx={{
              ...(alert.variant === "outlined" && {
                bgcolor: "grey.0",
              }),
            }}
            icon={<img src={svg} />}
          >
            <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{message}</div>
          </Alert>
        </MuiSnackbar>
      )}
    </>
  );
};

export default Snackbar;
