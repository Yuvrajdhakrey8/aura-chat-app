import { IUserData } from "@/types/Auth.types";
import { StateCreator } from "zustand";

export interface AuthSlice {
  userInfo?: IUserData;
  setUserInfo: (userInfo: IUserData | undefined) => void;
  isInfoLoaded: boolean;
  setIsInfoLoaded: (value: boolean) => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set: any) => ({
  userInfo: undefined,
  isInfoLoaded: false,
  setUserInfo: (userInfo: IUserData | undefined) => set({ userInfo }),
  setIsInfoLoaded: (value: boolean) => set({ isInfoLoaded: value }),
});
