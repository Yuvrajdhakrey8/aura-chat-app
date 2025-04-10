import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import { searchContacts } from "@/services/ContactServices";
import { ApiResponse } from "@/types/common.types";
import { IUserData } from "@/types/Auth.types";
import toast from "react-hot-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { HOST } from "@/utils/constants";

const NewDM: React.FC = () => {
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [contacts, setContacts] = useState<IUserData[]>([]);

  const findContacts = (searchTerm: string) => {
    if (!searchTerm || !searchTerm.trim()) return;

    searchContacts(searchTerm)
      .then((res) => {
        const { success, msg, data } = res as ApiResponse<IUserData[]>;
        if (!success) throw new Error(msg);

        if (data) {
          setContacts(data);
        }
      })
      .catch((err: Error) =>
        toast.error(err.message || "Internal server error")
      );
  };

  const selectNewContact = (contact: IUserData) => {
    setOpenNewContactModal(false);
    setContacts([]);
  };

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
              placeholder="Search Contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none focus:border-none focus:outline-none "
              onChange={(e) => findContacts(e.target.value)}
            />
          </div>
          {contacts.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {contacts?.map((user) => (
                  <div
                    key={user._id}
                    className="flex gap-3 items-center cursor-pointer"
                    onClick={() => selectNewContact(user)}
                  >
                    <div className="w-12 h-12 relative">
                      <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {user?.profileImage ? (
                          <AvatarImage
                            alt="profile"
                            src={`${HOST}/${user.profileImage}`}
                            className="object-cover w-full h-full bg-black rounded-full"
                          />
                        ) : (
                          <div
                            className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                              user?.selectedColor ?? 0
                            )}`}
                          >
                            {user?.firstName && user.lastName
                              ? `${user.firstName
                                  .split("")
                                  .shift()} ${user.lastName.split("").shift()}`
                              : user?.email.split("").shift()}
                          </div>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span>
                        {user?.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.email}
                      </span>
                      <span className="text-xs">{user.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {contacts.length <= 0 && (
            <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={false}
                height={150}
                width={150}
                options={animationDefaultOptions}
              />
              <div className="opacity-80 text-white flex flex-col items-center lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi<span className="text-purple-500">!</span> Search new{" "}
                  <span className="text-purple-500">Contact.</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
