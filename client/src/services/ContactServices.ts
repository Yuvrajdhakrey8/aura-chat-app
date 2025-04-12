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

export const getMessages = async (contactId: string) => {
  try {
    const res = await axiosClient.post(
      `${Routes.CONTACT_ROUTES}/get-messages`,
      { contactId },
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

export const getContactsForDMList = async () => {
  try {
    const res = await axiosClient.get(`${Routes.CONTACT_ROUTES}/get-dm-list`, {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return error?.response?.data;
    }
    return error;
  }
};
