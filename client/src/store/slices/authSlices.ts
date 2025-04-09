import { IUserData } from "@/types/Auth.types";
import { StateCreator } from "zustand";

export interface AuthSlice {
  userInfo?: IUserData;
  setUserInfo: (userInfo: IUserData | undefined) => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set: any) => ({
  userInfo: undefined,
  setUserInfo: (userInfo: IUserData | undefined) => set({ userInfo }),
});
