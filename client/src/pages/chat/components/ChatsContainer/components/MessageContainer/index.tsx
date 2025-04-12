import { useAppStore } from "@/store";
import React, { useEffect, useRef } from "react";
import moment from "moment";
import { ChatTypes } from "@/utils/constants";
import { IMessageData, MESSAGE_TYPE } from "@/types/Message.types";
import { getMessages } from "@/services/ContactServices";
import { ApiResponse } from "@/types/common.types";

const MessageContainer: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const {
    selectedChatMessages,
    selectedChatType,
    selectedChatData,
    setSelectedChatMessages,
  } = useAppStore();

  const fetchMessages = async () => {
    if (selectedChatData) {
      getMessages(selectedChatData?._id)
        .then((res) => {
          const { msg, success, data } = res as ApiResponse<IMessageData[]>;
          if (!success) {
            throw new Error(msg);
          }
          setSelectedChatMessages(data);
        })
        .catch((err: any) => {
          console.log("Error fetching messages:", err);
        });
    }
  };

  useEffect(() => {
    if (selectedChatData) {
      fetchMessages();
    }
  }, [selectedChatData]);

  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate: any = null;

    return selectedChatMessages.map((msg) => {
      const messageDate = moment(msg.createdAt).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={msg._id}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(msg.createdAt).format("LL")}
            </div>
          )}
          {selectedChatType === ChatTypes.CONTACTS && renderDMMessages(msg)}
        </div>
      );
    });
  };

  const renderDMMessages = (message: any) => {
    return (
      <div
        className={`${
          message?.sender === selectedChatData?._id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === MESSAGE_TYPE.TEXT && (
          <div
            className={`${
              message?.sender !== selectedChatData?._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 rounded-tr-[0] "
                : "bg-[#2a2b33]/5 text-white/80 border-[#fff]/20 rounded-tl-[0]"
            } border inline-block text-start rounded-lg max-w-[50%] break-words px-4 py-2 my-1`}
          >
            {message?.content}
          </div>
        )}
        <div className="text-xs text-gray-600 ">
          {moment(message.createdAt).format("LT")}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scroll-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
    </div>
  );
};

export default MessageContainer;
