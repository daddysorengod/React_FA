import { createSlice } from "@reduxjs/toolkit";
import { DynamicObject } from "@/src/types/field";

const initialState: {
  [key: string]: DynamicObject;
} = {};

const allCodeConfig = createSlice({
  name: "allCodeConfig",
  initialState,
  reducers: {
    setAllCodeConfig(state, action) {
      if (action.payload.code && action.payload.value)
        state[action.payload.code] = action.payload.value;
    },
  },
});

// Reducer
export default allCodeConfig.reducer;

export const { setAllCodeConfig } = allCodeConfig.actions;

// ----------------------------------------------------------------------


