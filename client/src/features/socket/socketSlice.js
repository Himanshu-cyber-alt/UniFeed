import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    posts: [],
    connected: false,
  },
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
  },
});

export const { setConnected, setPosts } = socketSlice.actions;
export default socketSlice.reducer;
