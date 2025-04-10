import { axiosClient, Routes } from "@/utils/constants";
import { isAxiosError } from "axios";

export const searchContacts = async (searchTerm: string) => {
  try {
    const res = await axiosClient.post(
      `${Routes.CONTACT_ROUTES}/search-contacts`,
      { searchTerm },
      { withCredentials: true }
    );

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return error?.response?.data;
    }
    return error;
  }
};
