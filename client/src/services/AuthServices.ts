import { ISignupAuthPayload } from "@/types/Auth.types";
import { axiosClient, Routes } from "@/utils/constants";
import { isAxiosError } from "axios";

export const signup = async (paylod: ISignupAuthPayload) => {
  try {
    const res = await axiosClient.post(`${Routes.AUTH_ROUTES}/signup`, paylod, {
      withCredentials: true, // this enables backend to store cookies
    });

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return error?.response?.data;
    }
    return error;
  }
};

export const login = async (paylod: ISignupAuthPayload) => {
  try {
    const res = await axiosClient.post(`${Routes.AUTH_ROUTES}/login`, paylod, {
      withCredentials: true, // this enables backend to store cookies
    });

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return error?.response?.data;
    }
    return error;
  }
};
