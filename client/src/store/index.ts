import { create } from "zustand";
import { createAuthSlice, AuthSlice } from "./slices/authSlices";
import { ChatSlice, createChatSlice } from "./slices/chatSlice";

type AppState = AuthSlice & ChatSlice;

export const useAppStore = create<AppState>()((...a) => ({
  ...createAuthSlice(...a),
  ...createChatSlice(...a),
}));
