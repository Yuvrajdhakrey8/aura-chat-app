import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { ChatTypes, HOST } from "@/utils/constants";
import React from "react";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader: React.FC = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-5 md:px-10 lg:px-15">
      <div className="flex items-center gap-5 justify-between w-full">
        <div className="flex gap-3 items-center justify-center">
          {selectedChatData && (
            <div className="flex gap-3">
              <div className="w-12 h-12 relative">
                {selectedChatType === ChatTypes.CONTACTS ? (
                  <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                    {selectedChatData?.profileImage ? (
                      <AvatarImage
                        alt="profile"
                        src={`${HOST}/${selectedChatData.profileImage}`}
                        className="object-cover w-full h-full bg-black rounded-full"
                      />
                    ) : (
                      <div
                        className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                          selectedChatData?.selectedColor ?? 0
                        )}`}
                      >
                        {selectedChatData?.firstName &&
                        selectedChatData?.lastName
                          ? `${selectedChatData.firstName
                              .split("")
                              .shift()} ${selectedChatData.lastName
                              .split("")
                              .shift()}`
                          : selectedChatData?.email.split("").shift()}
                      </div>
                    )}
                  </Avatar>
                ) : (
                  <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full ">
                    #
                  </div>
                )}
              </div>
              <div className="m-auto">
                {selectedChatType === ChatTypes.CONTACTS
                  ? selectedChatData?.firstName && selectedChatData.lastName
                    ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                    : selectedChatData.email
                  : selectedChatData?.name}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-5 items-center justify-center">
          <button
            className="text-neutral-500 focus:border-none focus:text-white duration-300 transition-all cursor-pointer"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
