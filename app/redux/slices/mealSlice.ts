import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MealState {
  selectedDate: string;
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  loading: boolean;
  error: string | null;
}

const initialState: MealState = {
  selectedDate: "tomorrow",
  meals: {
    breakfast: true,
    lunch: false,
    dinner: true,
  },
  loading: false,
  error: null,
};

const mealSlice = createSlice({
  name: "meals",
  initialState,
  reducers: {
    setDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },

    setMeals: (
      state,
      action: PayloadAction<{
        breakfast: boolean;
        lunch: boolean;
        dinner: boolean;
      }>
    ) => {
      state.meals = action.payload;
      state.loading = false;
      state.error = null;
    },

    toggleMeal: (
      state,
      action: PayloadAction<"breakfast" | "lunch" | "dinner">
    ) => {
      state.meals[action.payload] =
        !state.meals[action.payload];
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    saveSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },

    saveFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setDate,
  setMeals,
  toggleMeal,
  setLoading,
  saveSuccess,
  saveFailure,
} = mealSlice.actions;

export default mealSlice.reducer;
