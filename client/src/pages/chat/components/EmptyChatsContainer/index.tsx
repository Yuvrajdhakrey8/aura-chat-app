import { animationDefaultOptions } from "@/lib/utils";
import { useAppStore } from "@/store";
import React from "react";
import Lottie from "react-lottie";

const EmptyChatsContainer: React.FC = () => {
  const { userInfo } = useAppStore();
  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
      <Lottie
        isClickToPauseDisabled={false}
        height={300}
        width={300}
        options={animationDefaultOptions}
      />
      <div className="opacity-80 text-white flex flex-col items-center lg:text-4xl text-2xl transition-all duration-300 text-center">
        <h3 className="poppins-medium">
          Hi!
          <span className="text-purple-500">
            {" "}
            {userInfo?.firstName && userInfo?.lastName
              ? `${userInfo.firstName} ${userInfo.lastName}`
              : userInfo?.email}
          </span>{" "}
          <br /> Welcom to <span className="text-purple-500">Aura</span> Chat
          App
          <span className="text-purple-500">.</span>
        </h3>
      </div>
    </div>
  );
};

export default EmptyChatsContainer;
