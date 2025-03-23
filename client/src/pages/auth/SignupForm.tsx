import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignupFormData, LoginInput, userSignupSchema } from "./const";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignupForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(userSignupSchema),
  });

  const onSubmit = (data: SignupFormData) => {
    console.log("Signup Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
          className="rounded-full p-4"
          placeholder="Password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Input
          {...register(LoginInput.CONFIRM_PASSWORD)}
          type="password"
          className="rounded-full p-4"
          placeholder="Confirm Password"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full rounded-full bg-purple-500 text-white cursor-pointer">
        Signup
      </Button>
    </form>
  );
};

export default SignupForm;
