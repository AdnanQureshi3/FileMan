import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slice/auth.js";
import fileReducer from "./Slice/file/fileSlice.js";

const store=configureStore({
    reducer:{
      auth:authReducer,
      file:fileReducer,
    },
    devTools:true
})

export default store;