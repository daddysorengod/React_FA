import {  createListenerMiddleware } from "@reduxjs/toolkit";
import { getFormDataEffect, getFormDataSetting } from "./reducers/formBuilder";
import { logout, logoutEffect } from "./reducers/auth";



// export const listenerMiddleware = createListenerMiddleware();
// listenerMiddleware.startListening({
//   actionCreator: getFormDataEffect,
//   // type: "formField/getFormDataEffect",
//   effect: async (action, listenerApi) => {
//     await listenerApi.dispatch(getFormDataSetting(action.payload));
//   },
// });

export const authMiddleware = createListenerMiddleware();
authMiddleware.startListening({
  actionCreator: logoutEffect,
  // type: "formField/getFormDataEffect",
  effect: async (action, listenerApi) => {
    await listenerApi.dispatch(logout());
  },
});