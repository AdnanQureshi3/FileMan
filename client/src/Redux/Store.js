import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slice/auth.js";

const store=configureStore({
    reducer:{
      auth:authReducer
    },
    devTools:true
})

export default store;