import { createSlice } from "@reduxjs/toolkit";

// types
import { SnackbarProps } from "@app/types/snackbar";
import { ImagesSvg } from "@/src/constants/images";

const initialState: SnackbarProps = {
  action: false,
  open: false,
  message: "Note archived",
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "right",
  },
  variant: "default",
  alert: {
    color: "primary",
    variant: "filled",
  },
  transition: "Fade",
  close: true,
  actionButton: false,
  maxStack: 3,
  dense: false,
  iconVariant: "usedefault",
  title: "",
  svg: "",
};

// ==============================|| SLICE - SNACKBAR ||============================== //

const snackbar = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    openSnackbar(state, action) {
      const {
        open,
        message,
        anchorOrigin,
        variant,
        alert,
        transition,
        close,
        actionButton,
        title,
        svg,
      } = action.payload;
      state.svg = svg || initialState.svg;
      state.title = title || initialState.title;
      state.action = !state.action;
      state.open = open || initialState.open;
      state.message = message || initialState.message;
      state.anchorOrigin = anchorOrigin || initialState.anchorOrigin;
      state.variant = variant || initialState.variant;
      state.alert = {
        color: alert?.color || initialState.alert.color,
        variant: alert?.variant || initialState.alert.variant,
      };
      state.transition = transition || initialState.transition;
      state.close = close === false ? close : initialState.close;
      state.actionButton = actionButton || initialState.actionButton;
    },

    closeSnackbar(state) {
      state.open = false;
    },

    handlerIncrease(state, action) {
      const { maxStack } = action.payload;
      state.maxStack = maxStack;
    },
    handlerDense(state, action) {
      const { dense } = action.payload;
      state.dense = dense;
    },
    handlerIconVariants(state, action) {
      const { iconVariant } = action.payload;
      state.iconVariant = iconVariant;
    },
  },
});

export default snackbar.reducer;

export const {
  closeSnackbar,
  openSnackbar,
  handlerIncrease,
  handlerDense,
  handlerIconVariants,
} = snackbar.actions;

export function showSuccessSnackBar(response, title?: string) {
  return async (dispatch, getState) => {
    try {
      dispatch(
        openSnackbar({
          src: ImagesSvg.notifySuccessIcon,
          title: title ? title : "Thành công!",
          open: true,
          message: response.message,
          variant: "alert",
          alert: {
            color: "success",
          },
          close: false,
          transition: "SlideRight",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        }),
      );
    } catch (err) {
      console.log("Show snackbar fail", `${err}`);
    }
  };
}

export function showErrorSnackBar(message, title?: string) {
  return async (dispatch, getState) => {
    try {
      dispatch(
        openSnackbar({
          src: ImagesSvg.notifySuccessIcon,
          title: title ? title : "Có lỗi xảy ra!",
          open: true,
          message: `${message}` ?? "",
          variant: "alert",
          alert: {
            color: "error",
          },
          close: false,
          transition: "SlideRight",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        }),
      );
    } catch (err) {
      console.log("Show snackbar fail", `${err}`);
    }
  };
}

export function showExpiredSnackBar(message) {
  return async (dispatch, getState) => {
    try {
      dispatch(
        openSnackbar({
          src: ImagesSvg.notifySuccessIcon,
          title: "Phiên đăng nhập hết hạn!",
          open: true,
          message: message ?? "",
          variant: "alert",
          alert: {
            color: "error",
          },
          close: false,
          transition: "SlideRight",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        }),
      );
    } catch (err) {
      console.log("Show snackbar fail", `${err}`);
    }
  };
}
