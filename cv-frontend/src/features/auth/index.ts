export { useCurrentUser } from "./hooks/useCurrentUser";

export { loginAction } from "./actions/login.action";
export { signupAction } from "./actions/signup.action";
export { logoutAction } from "./actions/logout.action";
export { forgotPasswordAction } from "./actions/forgot-password.action";
export { resetPasswordAction } from "./actions/reset-password.action";
export { sendVerificationAction } from "./actions/send-verification.action";
export { changePasswordAction } from "./actions/change-password.action";

export { default as LoginForm } from "./ui/LoginForm";
export { default as SignupForm } from "./ui/SignupForm";
export { AuthTabs } from "./ui/AuthTabs";
export { LogoutButton } from "./ui/LogoutButton";
export { default as ForgotPasswordForm } from "./ui/ForgotPasswordForm";
export { default as ResetPasswordForm } from "./ui/ResetPasswordForm";
export { default as EmailVerificationForm } from "./ui/EmailVerificationForm";

export {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  type LoginFormData,
  type SignupFormData,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
  type ChangePasswordFormData,
} from "./schemas/auth.schema";
