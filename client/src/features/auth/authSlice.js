// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { auth, provider } from "../../firebase.js";
// import { signInWithPopup } from "firebase/auth";
// import axios from "axios";

// // Google registration/login
// export const googleRegister = createAsyncThunk(
//   "auth/googleRegister",
//   async (_, { rejectWithValue }) => {
//     try {

//       const result = await signInWithPopup(auth, provider);
//       const idToken = await result.user.getIdToken();

//       // Send token to backend
//       const res = await axios.post("http://localhost:5000/api/auth/google-register", { token: idToken });
//       return res.data; // { user, token }

//       console.log(res.data)
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // Email/password registration
// export const emailRegister = createAsyncThunk(
//   "auth/emailRegister",
//   async ({ name, email, password }, { rejectWithValue }) => {
//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/email-register", { name, email, password });
//       return res.data; // { user, token }
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: null,
//     token: null,
//     loading: false,
//     error: null
//   },
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       localStorage.removeItem("token");
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(googleRegister.pending, (state) => { state.loading = true; })
//       .addCase(googleRegister.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         localStorage.setItem("token", action.payload.token);
//       })
//       .addCase(googleRegister.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(emailRegister.pending, (state) => { state.loading = true; })
//       .addCase(emailRegister.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         localStorage.setItem("token", action.payload.token);
//       })
//       .addCase(emailRegister.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   }
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, provider } from "../../firebase.js";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";

// Load saved user & token from localStorage
const storedUser = JSON.parse(localStorage.getItem("user"));
const storedToken = localStorage.getItem("token");

// Google registration/login
export const googleRegister = createAsyncThunk(
  "auth/googleRegister",
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const res = await axios.post(
        "http://localhost:5000/api/auth/google-register",
        { token: idToken }
      );

      return res.data; // { user, token }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Email/password registration
export const emailRegister = createAsyncThunk(
  "auth/emailRegister",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/email-register",
        { name, email, password }
      );
      return res.data; // { user, token }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser || null,
    token: storedToken || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Google Register
      .addCase(googleRegister.pending, (state) => {
        state.loading = true;
      })
      .addCase(googleRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(googleRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Email Register
      .addCase(emailRegister.pending, (state) => {
        state.loading = true;
      })
      .addCase(emailRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(emailRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
