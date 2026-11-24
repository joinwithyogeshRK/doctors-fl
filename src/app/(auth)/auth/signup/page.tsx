import type { Metadata } from "next";
import { AuthFooterLink, AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";
import { DemoAccess } from "@/components/auth/DemoAccess";

export const metadata: Metadata = { title: "Create an account" };

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      lede="One account for appointments, records, prescriptions and medicine orders."
      footer={<AuthFooterLink prompt="Already have an account?" label="Sign in" href="/auth/login" />}
    >
      <SignupForm />
      <div className="mt-8">
        <DemoAccess />
      </div>
    </AuthShell>
  );
}
