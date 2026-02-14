import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dashboardReducer from "./slices/dashboardSlice";
import mealReducer from "./slices/mealSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    meals: mealReducer,
    dashboard: dashboardReducer,
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
