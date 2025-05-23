import ContactList from "@/components/ContactList";
import { getChannels } from "@/services/ChannelServices";
import { getContactsForDMList } from "@/services/ContactServices";
import { useAppStore } from "@/store";
import { IUserData } from "@/types/Auth.types";
import { IChannelData } from "@/types/Channel.types";
import { ApiResponse } from "@/types/common.types";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import CreateChannel from "./components/CreateChannel";
import NewDM from "./components/NewDM";
import ProfileInfo from "./components/ProfileInfo";
import ChannelList from "@/components/ChannelList";

const ContactsContainer: React.FC = () => {
  const {
    directMessagesContacts,
    setDirectMessagesContacts,
    channels,
    setChannels,
  } = useAppStore();

  const fetchDMList = () => {
    getContactsForDMList()
      .then((res) => {
        const { msg, success, data } = res as ApiResponse<IUserData[]>;
        if (!success) {
          throw new Error(msg);
        }
        if (data) {
          setDirectMessagesContacts(data);
        }
      })
      .catch((err) => {
        toast.error(err.message || "Failed to fetch contacts");
      });
  };

  const fetchChannelsList = () => {
    getChannels()
      .then((res) => {
        const { msg, success, data } = res as ApiResponse<{
          channels: IChannelData[];
        }>;
        if (!success) {
          throw new Error(msg);
        }
        if (data) {
          setChannels(data.channels);
        }
      })
      .catch((err) => {
        toast.error(err.message || "Failed to fetch channels");
      });
  };

  useEffect(() => {
    fetchDMList();
    fetchChannelsList();
  }, []);

  return (
    <div className="relative w-full md:w-[35vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b]">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden ">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden ">
          <ChannelList channelsData={channels} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;

const Logo = () => {
  return (
    <div className="flex p-5  justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>{" "}
      </svg>
      <span className="text-3xl font-semibold ">Aura Chat</span>
    </div>
  );
};

const Title = ({ text }: { text: string }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light opacity-90 text-sm">
      {text}
    </h6>
  );
};
