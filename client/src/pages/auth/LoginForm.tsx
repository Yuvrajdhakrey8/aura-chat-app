import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginFormData, LoginInput, userLoginSchema } from "./const";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/services/AuthServices";
import toast from "react-hot-toast";
import { IUserData } from "@/types/Auth.types";
import { useNavigate } from "react-router";
import { ApiResponse } from "@/types/common.types";
import { useAppStore } from "@/store";
import { RoutesEnum } from "@/routes/const";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { setUserInfo, userInfo } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: yupResolver(userLoginSchema),
  });

  useEffect(() => {
    if (userInfo && userInfo?.isSetUpComplete) {
      navigate(RoutesEnum.CHATS);
    }
  }, []);

  const onSubmit = (formData: LoginFormData) => {
    const payload = { email: formData.email, password: formData.password };

    login(payload)
      .then((res) => {
        const { success, msg, data } = res as ApiResponse<IUserData>;
        if (!success) throw new Error(msg);

        if (data) {
          setUserInfo(data);
          if (data?.isSetUpComplete) {
            toast.success(msg);
            navigate(RoutesEnum.CHATS);
          } else {
            navigate(RoutesEnum.PROFILE);
          }
        }

        reset();
      })
      .catch((err: Error) =>
        toast.error(err.message || "Internal server error")
      );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <Input
          {...register(LoginInput.EMAIL)}
          className="rounded-full p-4"
          placeholder="Email"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Input
          {...register(LoginInput.PASSWORD)}
          type="password"
          placeholder="Password"
          className="rounded-full p-4"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full rounded-full bg-purple-500 text-white cursor-pointer"
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
