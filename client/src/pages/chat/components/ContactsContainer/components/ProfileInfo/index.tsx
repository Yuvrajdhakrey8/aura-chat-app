import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React, { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router";
import { IoPower } from "react-icons/io5";
import { logOutUser } from "@/services/AuthServices";
import { ApiResponse } from "@/types/common.types";
import toast from "react-hot-toast";
import { RoutesEnum } from "@/routes/const";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ProfileInfo: React.FC = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [confirmationModal, setConfirmationModal] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    logOutUser()
      .then((res) => {
        const { success, msg } = res as ApiResponse<null>;
        if (!success) throw new Error(msg);

        toast.success(msg);
        setUserInfo(undefined);
        navigate(RoutesEnum.AUTH);
      })
      .catch((err: Error) =>
        toast.error(err.message || "Internal server error")
      );
  };

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-6 w-full bg-[#2a2b33] ">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-10 h-10 relative rounded-full">
          <Avatar className="h-10 w-10 rounded-full overflow-hidden">
            {userInfo?.profileImage ? (
              <AvatarImage
                alt="profile"
                src={`${HOST}/${userInfo.profileImage}`}
                className="object-cover w-full h-full bg-black rounded-full"
              />
            ) : (
              <div
                className={`uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo?.selectedColor ?? 0
                )}`}
              >
                {userInfo?.firstName && userInfo.lastName
                  ? `${userInfo.firstName.split("").shift()} ${userInfo.lastName
                      .split("")
                      .shift()}`
                  : userInfo?.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>

        <div>
          {userInfo?.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                className="text-purple-500 text-xl font-medium cursor-pointer"
                onClick={() => navigate(RoutesEnum.PROFILE)}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white ">
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPower
                className="text-red-500 text-xl font-medium cursor-pointer"
                onClick={() => setConfirmationModal(true)}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white ">
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Dialog open={confirmationModal} onOpenChange={setConfirmationModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[150px] flex flex-col ">
          <DialogHeader>
            <DialogTitle>Logout</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col justify-between  gap-5">
            <div>Are You Sure You want To Log Out ?</div>
            <div className="flex gap-5 justify-end">
              <Button
                className="border-2 text-sky-300 cursor-pointer"
                onClick={() => setConfirmationModal(false)}
              >
                Cancle
              </Button>
              <Button
                className="border-2 text-red-400 cursor-pointer"
                onClick={logout}
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileInfo;
