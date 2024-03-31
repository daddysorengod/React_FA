// third-party
import { createSlice } from "@reduxjs/toolkit";

// project imports
import { dispatch } from "../store";
import axios, { setCommonAuthorizationToken } from "@/src/helpers/axios";
import { api } from "@/src/constants/api";
import Cookies from "js-cookie";
import {
  openSnackbar,
  showErrorSnackBar,
  showSuccessSnackBar,
} from "./snackbar";
import { AuthProps } from "@/src/types/auth";
import { setIsLoading } from "./menu";
// types

// ----------------------------------------------------------------------
const initialState: AuthProps = {
  profile: {},
  role: 0,
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setProfile(state, action) {
      state.profile = action.payload;
    },
    setRoleType(state, action) {
      state.role = action.payload;
    },
    logoutEffect() {
      // state.role = action.payload
    },
  },
});

export const { logoutEffect } = auth.actions;
// Reducer
export default auth.reducer;

// ----------------------------------------------------------------------

export function login(userName: String, password: String, role: number) {
  return async () => {
    try {
      // const { userName, password } = payload;
      dispatch(setIsLoading(true));
      const response = await axios.post(api.ACCOUNTS_LOGIN, {
        userName,
        password,
        role: role,
      });
      if (response?.data.success) {
        dispatch(auth.actions.setRoleType(role));
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + 24 * 60 * 60 * 1000); //
        await Cookies.set("token", response?.data?.data?.token, {
          expires: expirationDate,
        });
        dispatch(auth.actions.setProfile(response?.data?.data));
        await setCommonAuthorizationToken();
        dispatch(showSuccessSnackBar(response?.data, "Đăng nhập thành công"));
        dispatch(setIsLoading(false));
        return response?.data?.success;
      } else {
        dispatch(
          showErrorSnackBar(
            response?.data?.message,
            "Đăng nhập không thành công",
          ),
        );
        dispatch(setIsLoading(false));
        return false;
      }
    } catch (err) {
      dispatch(showErrorSnackBar(`${err}`));
      dispatch(setIsLoading(false));
      return false;
    }
  };
}
export function logout() {
  return async () => {
    // window.location.href = `/login`
    dispatch(auth.actions.setProfile({}));
    dispatch(auth.actions.setRoleType(0));
  };
}
