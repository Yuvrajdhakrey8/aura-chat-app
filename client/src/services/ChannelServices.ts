import { IChannelPayload } from "@/types/Channel.types";
import { axiosClient, Routes } from "@/utils/constants";
import { isAxiosError } from "axios";

export const createChannel = async (payload: IChannelPayload) => {
  try {
    const res = await axiosClient.post(
      `${Routes.CHANNEL_ROUTES}/create-channel`,
      payload,
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

export const getChannels = async () => {
  try {
    const res = await axiosClient.get(
      `${Routes.CHANNEL_ROUTES}/get-user-channels`,
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

export const getChannelMessages = async (channelId: string) => {
  try {
    const res = await axiosClient.get(
      `${Routes.CHANNEL_ROUTES}/get-channel-messages/${channelId}`,
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
