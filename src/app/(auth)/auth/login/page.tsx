import type { Metadata } from "next";
import { AuthFooterLink, AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { DemoAccess } from "@/components/auth/DemoAccess";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      lede="Sign in to see your appointments, prescriptions and orders."
      footer={<AuthFooterLink prompt="New to Meridian Health?" label="Create an account" href="/auth/signup" />}
    >
      <LoginForm />
      <div className="mt-8">
        <DemoAccess />
      </div>
    </AuthShell>
  );
}
