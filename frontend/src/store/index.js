import { configureStore } from "@reduxjs/toolkit";
import memberAuthReducer from "./auth/memberAuthSlice.js";
import adminAuthReducer from "./auth/adminAuthSlice.js"
import bookReducer from "./admin/BookSlice.js"

const store = configureStore({
  reducer: {
    memberAuth: memberAuthReducer, 
    adminAuth:adminAuthReducer,
    books:bookReducer
  },
});

export default store;
