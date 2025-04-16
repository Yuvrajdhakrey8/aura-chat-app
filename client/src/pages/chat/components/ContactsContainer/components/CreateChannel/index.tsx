import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MultipleSelector from "@/components/ui/multipleselect";
import { getAllContacts } from "@/services/ContactServices";
import { useAppStore } from "@/store";
import { ApiResponse } from "@/types/common.types";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";

interface IUser {
  label: string;
  _id: string;
}
interface IOptions {
  label: string;
  value: string;
}

const CreateChannel: React.FC = () => {
  const { setSelectedChatData, setSelectedChatType } = useAppStore();
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState<IUser[]>([]);
  const [allContacts, setAllContacts] = useState<IOptions[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<IOptions[]>([]);
  const [channelName, setChannelName] = useState("");

  const handleGetAllContacts = () => {
    getAllContacts()
      .then((res) => {
        const { success, msg, data } = res as ApiResponse<IUser[]>;
        if (!success) throw new Error(msg);

        if (data) {
          setAllContacts(
            data.map((c) => ({
              label: c.label,
              value: c._id,
            }))
          );
        }
      })
      .catch((err: Error) =>
        toast.error(err.message || "Internal server error")
      );
  };

  useEffect(() => {
    handleGetAllContacts();
  }, []);

  const createChannel = async () => {};

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col ">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Channel Name"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none focus:border-none focus:outline-none "
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg !bg-[#2c2e3b] border-none py-2 text-white backblack focus:border-none focus:outline-none"
              defaultOptions={allContacts}
              placeholder="Search Contacts"
              value={selectedContacts}
              onChange={(options) => {
                const selected = allContacts.filter((contact) =>
                  options.some((opt) => opt.value === contact.value)
                );
                setSelectedContacts(selected);
              }}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600  cursor-pointer ">
                  No results found
                </p>
              }
            />
          </div>
          <div>
            <Button
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={() => createChannel()}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
