import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const planningSlice = createSlice({
  name: "planning",
  initialState,
  reducers: {
    addEventToStore: (state, action) => {
      if (!state.value.some((e) => e.id === action.payload.id)) {
        state.value.push(action.payload);
      }
    },
    removeEventFromStore: (state, action) => {
      state.value = state.value.filter((e) => e.id !== action.payload.id);
    },
  },
});

export const { addEventToStore, removeEventFromStore } = planningSlice.actions;
export default planningSlice.reducer;
