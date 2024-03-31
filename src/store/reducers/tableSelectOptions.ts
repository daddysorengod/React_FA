import { getListDataBase } from "@/src/helpers";
import {
  FETCH_DATA_API_CONFIG_INTERFACE,
  TABLE_SELECT_OPTIONS,
} from "@/src/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  [key: string]: TABLE_SELECT_OPTIONS;
} = {};

const tableSelectOptions = createSlice({
  name: "tableSelectOptions",
  initialState,
  reducers: {
    setTableSelectOptions(state, action) {
      if (
        action.payload.code &&
        (action.payload.value as TABLE_SELECT_OPTIONS).nameKey &&
        (action.payload.value as TABLE_SELECT_OPTIONS).valueKey
      )
        state[action.payload.code] = action.payload.value;
    },
  },
});

// Reducer
export default tableSelectOptions.reducer;

export const { setTableSelectOptions } = tableSelectOptions.actions;

// ----------------------------------------------------------------------

export const getTableSelectOptions = (
  config: FETCH_DATA_API_CONFIG_INTERFACE,
  nameKey: string,
  valueKey: string,
) => {
  return async (dispatch, getState) => {
    try {
      const old = getState().tableSelectOptions?.[config.url];
      if (old) {
        return old;
      }
      const res = await getListDataBase(config);
      const tableSelectOption: TABLE_SELECT_OPTIONS = {
        list: res.source,
        nameKey: nameKey,
        valueKey: valueKey,
      };
      if (tableSelectOption.list && !config.params?.length && !config.searchTerms?.length) {
        dispatch(
          setTableSelectOptions({
            code: config.url,
            value: tableSelectOption,
          }),
        );
      }
      return tableSelectOption;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  };
};
