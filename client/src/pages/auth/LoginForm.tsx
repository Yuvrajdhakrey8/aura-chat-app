import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginFormData, LoginInput, userLoginSchema } from "./const";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(userLoginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("Login Data:", data);
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
