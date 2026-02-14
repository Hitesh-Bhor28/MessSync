import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Meals {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

interface Stats {
  weeklyMeals: number;
  savedMeals: number;
  participation: number;
}

interface DashboardState {
  name: string | null;
  email: string | null;
  todayMeals: Meals | null;
  tomorrowMeals: Meals | null;
  stats: Stats | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  name: null,
  email: null,
  todayMeals: null,
  tomorrowMeals: null,
  stats: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setDashboardData: (
      state,
      action: PayloadAction<{
        name: string;
        email: string;
        todayMeals: Meals;
        tomorrowMeals: Meals;
        stats: Stats;
      }>
    ) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.todayMeals = action.payload.todayMeals;
      state.tomorrowMeals = action.payload.tomorrowMeals;
      state.stats = action.payload.stats;
      state.loading = false;
      state.error = null;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearDashboard: (state) => {
      state.name = null;
      state.email = null;
      state.todayMeals = null;
      state.tomorrowMeals = null;
      state.stats = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setDashboardData,
  setError,
  clearDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
