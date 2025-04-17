import { ISocketContext, useSocket } from "@/context/SocketContext";
import { useAppStore } from "@/store";
import { ApiResponse } from "@/types/common.types";
import { axiosClient, ChatTypes, Routes } from "@/utils/constants";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

const MessageBar: React.FC = () => {
  const emojiRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState("");
  const { socket } = useSocket() as ISocketContext;
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const handleAddEmoji = (emoji: EmojiClickData) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiRef.current &&
        !emojiRef.current?.contains(event.target as Node)
      ) {
        setEmojiPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleSendMessage = async () => {
    if (selectedChatType === ChatTypes.CONTACTS) {
      socket?.emit("sendMessage", {
        sender: userInfo?._id,
        content: message,
        recipient: selectedChatData?._id,
        messageType: "text",
        fileUrl: undefined,
      });
    } else if (selectedChatType === ChatTypes.CHANNEL) {
      socket?.emit("send-channel-message", {
        sender: userInfo?._id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData?._id,
      });
    }
    setMessage("");
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async () => {
    const fileInput = fileInputRef.current?.files?.[0];
    if (!fileInput) return;

    setIsUploading(true);
    setFileUploadProgress(0);

    const formData = new FormData();
    formData.append("file", fileInput);

    try {
      const res = await axiosClient.post(
        `${Routes.CONTACT_ROUTES}/upload-files`,
        formData,
        {
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              setFileUploadProgress(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              );
            }
          },
        }
      );

      const { msg, success, data } = res.data as ApiResponse<{
        fileUrl: string;
      }>;

      if (!success) throw new Error(msg);
      if (data?.fileUrl) {
        if (selectedChatType === ChatTypes.CONTACTS) {
          socket?.emit("sendMessage", {
            sender: userInfo?._id,
            content: undefined,
            recipient: selectedChatData?._id,
            messageType: "file",
            fileUrl: data.fileUrl,
          });
        } else if (selectedChatType === ChatTypes.CHANNEL) {
          socket?.emit("send-channel-message", {
            sender: userInfo?._id,
            content: undefined,
            messageType: "file",
            fileUrl: data.fileUrl,
            channelId: selectedChatData?._id,
          });
        }
        setMessage("");
      }
    } catch (error: any) {
      toast.error(error.message || "Error uploading file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="h-[10vh] border-[#1c1d25] flex items-center justify-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />

        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          onChange={handleAttachmentChange}
          ref={fileInputRef}
        />
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer"
            onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>

          <div className="absolute bottom-14 right-[-18px]" ref={emojiRef}>
            <EmojiPicker
              open={emojiPickerOpen}
              theme={Theme.DARK}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>

      <button
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
