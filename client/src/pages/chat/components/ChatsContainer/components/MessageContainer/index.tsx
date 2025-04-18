import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { getChannelMessages } from "@/services/ChannelServices";
import { deleteMessage, getMessages } from "@/services/ContactServices";
import { useAppStore } from "@/store";
import { ApiResponse } from "@/types/common.types";
import { IMessageData, MESSAGE_TYPE } from "@/types/Message.types";
import { axiosClient, ChatTypes, HOST } from "@/utils/constants";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { MdDelete, MdFolderZip } from "react-icons/md";

const MessageContainer: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const {
    userInfo,
    selectedChatMessages,
    selectedChatType,
    selectedChatData,
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownloading,
  } = useAppStore();
  const [showImage, setShowImage] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<IMessageData | null>(
    null
  );

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
          toast.error(err.message || "Error fetching messages");
        });
    }
  };

  const fetchChannelMessages = async () => {
    if (selectedChatData) {
      getChannelMessages(selectedChatData?._id)
        .then((res) => {
          const { msg, success, data } = res as ApiResponse<IMessageData[]>;
          if (!success) {
            throw new Error(msg);
          }
          setSelectedChatMessages(data);
        })
        .catch((err: any) => {
          toast.error(err.message || "Error fetching messages");
        });
    }
  };

  useEffect(() => {
    if (selectedChatData) {
      fetchMessages();
    }
    if (selectedChatType === ChatTypes.CHANNEL) {
      fetchChannelMessages();
    }
  }, [selectedChatData]);

  const checkIfImage = (filePath: string) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate: any = null;

    return selectedChatMessages?.map((msg) => {
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
          {selectedChatType === ChatTypes.CHANNEL && renderChannelMessages(msg)}
        </div>
      );
    });
  };

  const downloadFile = async (url: string) => {
    try {
      setIsDownloading(true);
      setFileDownloadProgress(0);

      const response = await axiosClient.get(`${HOST}/${url}`, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setFileDownloadProgress(percentCompleted);
          }
        },
      });

      const blob = response.data;
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", url.split("/").pop() || "file");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (error: any) {
      toast.error(error?.message || "Error downloading file");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const result = await deleteMessage(messageId);
      const { success, msg } = result as ApiResponse<null>;

      if (success) {
        const updatedMessages = selectedChatMessages.filter(
          (message) => message._id !== messageId
        );
        setSelectedChatMessages(updatedMessages);
        toast.success("Message deleted successfully!");
        setSelectedMessage(null);
        setShowImage(false);
      } else {
        toast.error(msg || "Failed to delete message");
      }
    } catch (err: any) {
      toast.error(err.message || "Error deleting message");
    }
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
        {message.messageType === MESSAGE_TYPE.FILE && (
          <div
            className={`${
              message?.sender !== selectedChatData?._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 rounded-tr-[0] "
                : "bg-[#2a2b33]/5 text-white/80 border-[#fff]/20 rounded-tl-[0]"
            } border inline-block text-start rounded-lg max-w-[50%] break-words p-[6px] my-1`}
          >
            {checkIfImage(message?.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setSelectedMessage(message);
                  setShowImage(true);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  alt="file"
                  height={300}
                  width={300}
                  className="rounded-[6px]"
                />
              </div>
            ) : (
              <div className="flex justify-center items-center gap-4 flex-wrap">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span className="text-white">
                  {message?.fileUrl?.split("/").pop()}
                </span>
                <span
                  className="bg-black/20 p-3 duration-300 transition-all hover:bg-black/50 rounded-full text-2xl cursor-pointer"
                  onClick={() => downloadFile(message?.fileUrl)}
                  title="Download"
                >
                  <IoMdArrowRoundDown />
                </span>
                {(() => {
                  const isChannel =
                    selectedChatType === ChatTypes.CONTACTS &&
                    message?.sender === userInfo?._id;
                  if (isChannel) {
                    return (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full cursor-pointer duration-300 transition-all text-2xl"
                        onClick={() =>
                          message && handleDeleteMessage(message._id)
                        }
                        title="Delete"
                      >
                        <MdDelete />
                      </button>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-600 ">
          {moment(message.createdAt).format("LT")}
        </div>
      </div>
    );
  };

  const renderChannelMessages = (message: any) => {
    return (
      <div
        className={`${
          message?.sender?._id !== userInfo?._id ? "text-left" : "text-right"
        } mt-2`}
      >
        {message.messageType === MESSAGE_TYPE.TEXT && (
          <div
            className={`${
              message?.sender?._id === userInfo?._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 rounded-tr-[0] "
                : "bg-[#2a2b33]/5 text-white/80 border-[#fff]/20 rounded-tl-[0]"
            } border inline-block text-start rounded-lg max-w-[50%] break-words px-3 py-2 my-1 ml-9`}
          >
            {message?.content}
          </div>
        )}
        {message.messageType === MESSAGE_TYPE.FILE && (
          <div
            className={`${
              message?.sender?._id === userInfo?._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 rounded-tr-[0] "
                : "bg-[#2a2b33]/5 text-white/80 border-[#fff]/20 rounded-tl-[0]"
            } border inline-block text-start rounded-lg max-w-[50%] break-words p-[6px] my-1`}
          >
            {checkIfImage(message?.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setSelectedMessage(message);
                  setShowImage(true);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  alt="file"
                  height={300}
                  width={300}
                  className="rounded-[6px]"
                />
              </div>
            ) : (
              <div className="flex justify-center items-center gap-4 flex-wrap">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span className="text-white max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis">
                  {message?.fileUrl?.split("/").pop()}
                </span>
                <span
                  className="bg-black/20 p-3 duration-300 transition-all hover:bg-black/50 rounded-full text-2xl cursor-pointer"
                  onClick={() => downloadFile(message?.fileUrl)}
                  title="Download"
                >
                  <IoMdArrowRoundDown />
                </span>
                {(() => {
                  const isChannel =
                    selectedChatType === ChatTypes.CHANNEL &&
                    message?.sender?._id === userInfo?._id;
                  if (isChannel) {
                    return (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full cursor-pointer duration-300 transition-all text-2xl"
                        onClick={() =>
                          message && handleDeleteMessage(message._id)
                        }
                        title="Delete"
                      >
                        <MdDelete />
                      </button>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
          </div>
        )}

        {message?.sender?._id !== userInfo?._id ? (
          <div className="flex items-center gap-3 mt-1">
            <Avatar className="h-6 w-6 rounded-full overflow-hidden">
              {message.sender?.profileImage && (
                <AvatarImage
                  alt="profile"
                  src={`${HOST}/${message.sender.profileImage}`}
                  className="object-cover w-full h-full bg-black rounded-full"
                />
              )}

              <AvatarFallback
                className={`uppercase h-6 w-6 text-lg flex items-center justify-center rounded-full ${getColor(
                  message.sender?.selectedColor ?? 0
                )}`}
              >
                {message.sender?.firstName && message.sender?.lastName
                  ? `${message.sender.firstName
                      .split("")
                      .shift()} ${message.sender.lastName.split("").shift()}`
                  : message.sender?.email.split("").shift()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-60">
              {message.sender?.firstName} {message.sender?.lastName}
            </span>
            <span className="text-xs text-gray-600 ">
              {moment(message.createdAt).format("LT")}
            </span>
          </div>
        ) : (
          <div className="text-xs text-gray-600 ">
            {moment(message.createdAt).format("LT")}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scroll-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed inset-0 left-0 top-0 h-[100vh] w-[100vw] backdrop-blur-lg bg-black/80 flex justify-center items-center z-50">
          <div>
            <img
              src={`${HOST}/${selectedMessage?.fileUrl}`}
              alt="file"
              className="rounded-[6px] h-[80vh] w-full bg-cover"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/80 p-3 rounded-full hover:bg-white/10 cursor-pointer transition-all duration-300  text-red-200 text-2xl"
              onClick={() => {
                setShowImage(false);

                setSelectedMessage(null);
              }}
              title="Close"
            >
              <IoCloseSharp />
            </button>
            <button
              className="bg-black/80 p-3 rounded-full hover:bg-white/10 cursor-pointer transition-all duration-300  text-blue-400 text-2xl"
              onClick={() =>
                selectedMessage?.fileUrl &&
                downloadFile(selectedMessage?.fileUrl)
              }
              title="Download"
            >
              <IoMdArrowRoundDown />
            </button>

            {(() => {
              const isContacts =
                selectedChatType === ChatTypes.CONTACTS &&
                selectedMessage?.sender === userInfo?._id;
              const isChannel =
                selectedChatType === ChatTypes.CHANNEL &&
                selectedMessage?.sender?._id === userInfo?._id;

              if (isContacts || isChannel) {
                return (
                  <button
                    className="text-red-500 hover:text-red-600 p-2 rounded-full cursor-pointer duration-300 transition-all text-2xl"
                    onClick={() =>
                      selectedMessage &&
                      handleDeleteMessage(selectedMessage._id)
                    }
                    title="Delete"
                  >
                    <MdDelete />
                  </button>
                );
              }
              return null;
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
