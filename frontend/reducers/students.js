import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    addStudentToStore: (state, action) => {
      if (!state.value.some((e) => e.id === action.payload.id)) {
        state.value.push(action.payload);
      }
    },
  },
});

export const { addStudentToStore } = studentSlice.actions;
export default studentSlice.reducer;
