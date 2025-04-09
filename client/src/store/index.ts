import { create } from "zustand";
import { createAuthSlice, AuthSlice } from "./slices/authSlices";

type AppState = AuthSlice;

export const useAppStore = create<AppState>()((...a) => ({
  ...createAuthSlice(...a),
}));
