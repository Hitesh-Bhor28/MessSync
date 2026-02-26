import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminStudent {
  name: string;
  email: string;
  role: "student" | "admin";
  createdAt: string;
}

interface AdminMealCounts {
  date: string;
  breakfastCount: number;
  lunchCount: number;
  dinnerCount: number;
}

interface AdminState {
  students: AdminStudent[];
  mealCounts: AdminMealCounts | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  students: [],
  mealCounts: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setStudents: (
      state,
      action: PayloadAction<AdminStudent[]>
    ) => {
      state.students = action.payload;
      state.loading = false;
      state.error = null;
    },
    setMealCounts: (
      state,
      action: PayloadAction<AdminMealCounts>
    ) => {
      state.mealCounts = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearAdminState: (state) => {
      state.students = [];
      state.mealCounts = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setStudents,
  setMealCounts,
  setError,
  clearAdminState,
} = adminSlice.actions;

export default adminSlice.reducer;
