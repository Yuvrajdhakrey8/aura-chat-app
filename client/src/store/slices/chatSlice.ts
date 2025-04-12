import { IUserData } from "@/types/Auth.types";
import { IMessageData } from "@/types/Message.types";
import { ChatTypes } from "@/utils/constants";
import { StateCreator } from "zustand";

export interface ChatSlice {
  selectedChatType?: ChatTypes;
  selectedChatData?: IUserData;
  selectedChatMessages: IMessageData[];
  directMessagesContacts: IUserData[];
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
