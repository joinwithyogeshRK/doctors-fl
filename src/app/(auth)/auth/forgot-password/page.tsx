import type { Metadata } from "next";
import { AuthFooterLink, AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      lede="Enter the email on your account and we'll send you a link to set a new password."
      footer={<AuthFooterLink prompt="Remembered it?" label="Sign in" href="/auth/login" />}
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
