import { IUserData } from "@/types/Auth.types";
import { IChannelData } from "@/types/Channel.types";
import { IMessageData } from "@/types/Message.types";
import { ChatTypes } from "@/utils/constants";
import { StateCreator } from "zustand";

export interface ChatSlice {
  selectedChatType?: ChatTypes;
  selectedChatData?: IUserData;
  selectedChatMessages: IMessageData[];
  directMessagesContacts: IUserData[];
  isUploading: boolean;
  isDownloading: boolean;
  fileUploadProgress: number;
  fileDownloadProgress: number;
  channels: IChannelData[];
  setIsUploading: (isUploading: boolean) => void;
  setIsDownloading: (isDownloading: boolean) => void;
  setFileUploadProgress: (fileUploadProgress: number) => void;
  setFileDownloadProgress: (fileDownloadProgress: number) => void;
  setSelectedChatType: (selectedChatType: ChatTypes | undefined) => void;
  setSelectedChatData: (selectedChatData: IUserData | undefined) => void;
  setDirectMessagesContacts: (
    directMessagesContacts: IUserData[] | undefined
  ) => void;
  setSelectedChatMessages: (
    selectedChatMessages: IMessageData[] | undefined
  ) => void;
  closeChat: () => void;
  removeMessage: (messageId: string) => void;
  addMessage: (message: IMessageData) => void;
  addChannel: (channel: IChannelData) => void;
  setChannels: (channels: IChannelData[]) => void;
  addChannelInChannelList: (message: IMessageData) => void;
  addContactsInDMContacts: (message: IMessageData) => void;
}

export const createChatSlice: StateCreator<ChatSlice> = (
  set: any,
  get: any
) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContacts: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channels: [],
  setChannels: (channels: IChannelData[]) => set({ channels }),
  setIsUploading: (isUploading: boolean) => set({ isUploading }),
  setIsDownloading: (isDownloading: boolean) => set({ isDownloading }),
  setFileUploadProgress: (fileUploadProgress: number) =>
    set({ fileUploadProgress }),
  setFileDownloadProgress: (fileDownloadProgress: number) =>
    set({ fileDownloadProgress }),
  setSelectedChatType: (selectedChatType: ChatTypes | undefined) =>
    set({ selectedChatType }),
  setSelectedChatData: (selectedChatData: IUserData | undefined) =>
    set({ selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages: IMessageData[] | undefined) =>
    set({ selectedChatMessages }),
  setDirectMessagesContacts: (
    directMessagesContacts: IUserData[] | undefined
  ) => set({ directMessagesContacts }),
  closeChat: () =>
    set({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessages: [],
    }),
  addChannel: (channel: IChannelData) => {
    const channels = get().channels;
    set({
      channels: [...channels, channel],
    });
  },
  addMessage: (message: IMessageData) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient:
            selectedChatType === ChatTypes.CHANNEL
              ? message?.recipient
              : message?.recipient?._id,
          sender:
            selectedChatType === ChatTypes.CHANNEL
              ? message?.sender
              : message?.sender?._id,
        },
      ],
    });
  },
  removeMessage: (messageId: string) => {
    const currentMessages = get().selectedChatMessages;
    const updatedMessages = currentMessages.filter(
      (msg: IMessageData) => msg._id !== messageId
    );
    set({ selectedChatMessages: updatedMessages });
  },
  addChannelInChannelList: (message: IMessageData) => {
    const channels = get().channels;
    const data = channels.find(
      (channel: IChannelData) => channel._id === message.channelId
    );
    const index = channels.findIndex(
      (channel: IChannelData) => channel._id === message.channelId
    );

    if (index !== -1 && index !== undefined) {
      channels.splice(index, 1);
      channels.unshift(data as IChannelData);
    }
  },
  addContactsInDMContacts: (message: IMessageData) => {
    const userId = get().userInfo._id;
    const fromId =
      message.sender._id === userId
        ? message?.recipient?._id
        : message.sender._id;
    const fromData =
      message.sender._id === userId ? message.recipient : message.sender;
    const dmContacts = get().directMessagesContacts;
    const data = dmContacts.find(
      (contact: IUserData) => contact._id === fromId
    );
    const index = dmContacts.findIndex(
      (contact: IUserData) => contact._id === fromId
    );

    if (index !== -1 && index !== undefined) {
      dmContacts.splice(index, 1);
      dmContacts.unshift(data);
    } else {
      dmContacts.unshift(fromData);
    }

    set({ directMessagesContacts: dmContacts });
  },
});
