import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const planningSlice = createSlice({
  name: "planning",
  initialState,
  reducers: {
    addEventToStore: (state, action) => {
      state.value.push(action.payload);
    },
  },
});

export const { addEventToStore } = planningSlice.actions;
export default planningSlice.reducer;
