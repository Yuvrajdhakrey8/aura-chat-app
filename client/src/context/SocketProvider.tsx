import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import React, { ReactNode, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { SocketContext } from "./SocketContext";
import { IMessageData } from "@/types/Message.types";

interface IProps {
  children?: ReactNode;
}

const SocketProvider: React.FC<IProps> = ({ children }) => {
  const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: {
          userId: userInfo._id,
        },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server", socket.current?.id);
      });

      const handleReceiveMessage = (message: IMessageData) => {
        const {
          addMessage,
          selectedChatType,
          selectedChatData,
          addContactsInDMContacts,
        } = useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          (selectedChatData?._id === message?.sender?._id ||
            selectedChatData?._id === message?.recipient?._id)
        ) {
          addMessage(message);
        }
        addContactsInDMContacts(message);
      };

      const handleReceiveChannelMessage = (message: IMessageData) => {
        const {
          addMessage,
          selectedChatType,
          selectedChatData,
          addChannelInChannelList,
        } = useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          selectedChatData?._id === message?.channelId
        ) {
          addMessage(message);
        }
        addChannelInChannelList(message);
      };

      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receive-channel-message", handleReceiveChannelMessage);

      return () => {
        socket.current?.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={{ socket: socket.current }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
