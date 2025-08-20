import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },
  },
});

export const { setAuthUser } = authSlice.actions;
export default authSlice.reducer;

/* 
agr mei AuthSLice ko pura export karunga toh mujhe use karte time
 authSLice.reducer use karn padega or setAuthuser ko as a authSlice.actions use karna padega
*/