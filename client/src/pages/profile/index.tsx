import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/types/common.types";
import { IUserData } from "@/types/Auth.types";
import toast from "react-hot-toast";
import { updateUserData } from "@/services/AuthServices";
import { useNavigate } from "react-router";
import { RoutesEnum } from "@/routes/const";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [image, setImage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo?.isSetUpComplete) {
      setFirstName(userInfo?.firstName ?? "");
      setLastName(userInfo?.lastName ?? "");
      setSelectedColor(userInfo?.selectedColor ?? 0);
    }
  }, []);

  const validator = () => {
    if (!firstName) {
      toast.error("First Name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required");
      return false;
    }

    return true;
  };

  const updateUser = () => {
    const valid = validator();

    if (!valid) return;

    const payload = {
      firstName,
      lastName,
      selectedColor,
      // profileImage: image,
    };

    updateUserData(payload)
      .then((res) => {
        const { success, msg, data } = res as ApiResponse<IUserData>;
        if (!success) throw new Error(msg);

        if (data) {
          if (data?.isSetUpComplete) {
            toast.success(msg);
            // navigate("/");
          } else {
            // navigate("/profile");
          }
        }
      })
      .catch((err: Error) =>
        toast.error(err.message || "Internal server error")
      );
  };

  const handleNavigate = () => {
    return navigate(RoutesEnum.AUTH);
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <IoArrowBack
            className="text-4xl lg:text-6xl text-white/90 cursor-pointer"
            onClick={() => handleNavigate()}
          />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  alt="profile"
                  src={image}
                  className="object-cover h-full w-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo?.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full">
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
          </div>
          <div className="flex min-w-32 md:max-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                type="email"
                placeholder="Email"
                disabled
                value={userInfo?.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                type="text"
                placeholder="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                    selectedColor === index ? "outline-2 outline-white/50" : ""
                  }`}
                  onClick={() => setSelectedColor(index)}
                  key={index}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-10 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 rounded-t-lg text-white"
            onClick={updateUser}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
