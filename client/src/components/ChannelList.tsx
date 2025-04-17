import React from "react";
import { useAppStore } from "@/store";
import { IChannelData } from "@/types/Channel.types";
import { ChatTypes } from "@/utils/constants";

interface IProps {
  channelsData?: IChannelData[];
}

const ChannelList: React.FC<IProps> = ({ channelsData }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleChannelClick = (channel: any) => {
    setSelectedChatType(ChatTypes.CHANNEL);
    setSelectedChatData(channel);
    if (selectedChatData && selectedChatData._id !== channel._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {channelsData?.map((channel) => (
        <div
          key={channel._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === channel._id
              ? "bg-[#8417ff]"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleChannelClick(channel)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full text-lg font-semibold">
              #
            </div>
            <div>
              <div className="font-medium">{channel.name}</div>
              <div className="text-xs text-neutral-400">
                {channel.members.length} member
                {channel.members.length !== 1 && "s"}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChannelList;
