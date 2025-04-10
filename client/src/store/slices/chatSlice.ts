import { StateCreator } from "zustand";

export interface ChatSlice {
  selectedChatType?: string;
  selectedChatData?: string;
  selectedChatMessages: [];
  setSelectedChatType: (selectedChatType: string | undefined) => void;
  setSelectedChatData: (selectedChatData: string | undefined) => void;
  setSelectedChatMessages: (selectedChatMessages: string | undefined) => void;
  closeChat: () => void;
}

export const createChatSlice: StateCreator<ChatSlice> = (set: any) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  setSelectedChatType: (selectedChatType: string | undefined) =>
    set({ selectedChatType }),
  setSelectedChatData: (selectedChatData: string | undefined) =>
    set({ selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages: string | undefined) =>
    set({ selectedChatMessages }),
  closeChat: () =>
    set({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessages: [],
    }),
});
