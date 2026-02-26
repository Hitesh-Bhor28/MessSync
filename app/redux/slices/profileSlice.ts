import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
  name: string | null;
  email: string | null;
  role: "student" | "admin" | null;
  createdAt: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  name: null,
  email: null,
  role: null,
  createdAt: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProfileData: (
      state,
      action: PayloadAction<{
        name: string;
        email: string;
        role: "student" | "admin";
        createdAt: string;
      }>
    ) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.createdAt = action.payload.createdAt;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearProfile: (state) => {
      state.name = null;
      state.email = null;
      state.role = null;
      state.createdAt = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setProfileData,
  setError,
  clearProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
