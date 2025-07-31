import { configureStore } from "@reduxjs/toolkit";
import memberAuthReducer from "./auth/memberAuthSlice.js";
import adminAuthReducer from "./auth/adminAuthSlice.js"

const store = configureStore({
  reducer: {
    memberAuth: memberAuthReducer, 
    adminAuth:adminAuthReducer
  },
});

export default store;
