import * as yup from "yup";

export enum LoginInput {
  EMAIL = "email",
  PASSWORD = "password",
  CONFIRM_PASSWORD = "confirmPassword",
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData extends LoginFormData {
  confirmPassword: string;
}

export const userLoginSchema = yup.object({
  [LoginInput.EMAIL]: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  [LoginInput.PASSWORD]: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const userSignupSchema = yup.object({
  [LoginInput.EMAIL]: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  [LoginInput.PASSWORD]: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  [LoginInput.CONFIRM_PASSWORD]: yup
    .string()
    .oneOf([yup.ref(LoginInput.PASSWORD)], "Passwords must match")
    .required("Confirm password is required"),
});
