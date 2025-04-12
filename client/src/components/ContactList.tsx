import { useAppStore } from "@/store";
import { IUserData } from "@/types/Auth.types";
import { ChatTypes, HOST } from "@/utils/constants";
import React from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { getColor } from "@/lib/utils";

interface IProps {
  contacts: IUserData[];
  isChannel?: boolean;
}

const ContactList: React.FC<IProps> = ({ contacts, isChannel }) => {
  const {
    // selectedChatType,
    // selectedChatMessages,
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleContactClick = (contact: IUserData) => {
    setSelectedChatType(isChannel ? ChatTypes.CHANNEL : ChatTypes.CONTACTS);
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData?._id !== contact?._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff]  "
              : "hover:bg-[#f1f1f111]"
          } `}
          onClick={() => handleContactClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel ? (
              <div className="w-10 h-10 relative">
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  {contact?.profileImage ? (
                    <AvatarImage
                      alt="profile"
                      src={`${HOST}/${contact.profileImage}`}
                      className="object-cover w-full h-full bg-black rounded-full"
                    />
                  ) : (
                    <div
                      className={`uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full ${
                        selectedChatData && selectedChatData._id === contact._id
                          ? "bg-[#ffffff22] border-2 border-white/50"
                          : getColor(contact?.selectedColor ?? 0)
                      }`}
                    >
                      {contact?.firstName && contact?.lastName
                        ? `${contact.firstName
                            .split("")
                            .shift()} ${contact.lastName.split("").shift()}`
                        : contact?.email.split("").shift()}
                    </div>
                  )}
                </Avatar>
              </div>
            ) : (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full ">
                #
              </div>
            )}

            {isChannel ? (
              <span>{contact.lastName}</span>
            ) : (
              <div>
                {contact?.firstName && contact?.lastName
                  ? `${contact?.firstName} ${contact?.lastName}`
                  : contact?.email}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
