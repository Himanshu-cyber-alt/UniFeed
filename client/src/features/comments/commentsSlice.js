import { createSlice } from "@reduxjs/toolkit";

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    commentsByPost: {}, // { postId: [comments] }
  },
  reducers: {
    setComments: (state, action) => {
      const { postId, comments } = action.payload;
      state.commentsByPost[postId] = comments;
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      if (!state.commentsByPost[postId]) state.commentsByPost[postId] = [];
      state.commentsByPost[postId].push(comment);
    },
  },
});

export const { setComments, addComment } = commentsSlice.actions;
export default commentsSlice.reducer;
