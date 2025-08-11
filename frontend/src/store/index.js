import { configureStore } from "@reduxjs/toolkit";
import memberAuthReducer from "./auth/memberAuthSlice.js";
import adminAuthReducer from "./auth/adminAuthSlice.js"
import bookReducer from "./admin/BookSlice.js"
import memberReducer from "./admin/memberSlice.js"
import requestsReducer from "./admin/requestsSlice.js"
import dashboardReducer from "./admin/dashboardSlice.js"

const store = configureStore({
  reducer: {
    memberAuth: memberAuthReducer, 
    adminAuth:adminAuthReducer,
    books:bookReducer,
    members:memberReducer,
    requests:requestsReducer,
    dashboard:dashboardReducer
  },
});

export default store;
