import { IUserData } from "@/types/Auth.types";
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
  addMessage: (message: IMessageData) => void;
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
});
