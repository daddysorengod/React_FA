import { TABLE_OPTIONS_INTERFACE } from "@/src/types";
import { getTableConfigFromAPI } from "@/src/helpers";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  [key: string]: TABLE_OPTIONS_INTERFACE;
} = {};

const tableConfig = createSlice({
  name: "tableConfig",
  initialState,
  reducers: {
    setTableConfig(state, action) {
      if (action.payload.code && action.payload.value)
        state[action.payload.code] = action.payload.value;
    },
  },
});

// Reducer
export default tableConfig.reducer;

export const { setTableConfig } = tableConfig.actions;

// ----------------------------------------------------------------------

export const getTableConfigStore = (code: string) => {
  return async (dispatch, getState) => {
    if (!code) return;
    try {
      const oldTableConfig = getState().tableConfig?.[code];
      if (oldTableConfig) {
        return oldTableConfig;
      }
      const item = await getTableConfigFromAPI(code);
      if (item) {
        dispatch(
          setTableConfig({
            code: code,
            value: item,
          }),
        );
        return item;
      }
    } catch (error) {
      console.log("error", error);
      return false;
    }
  };
};
