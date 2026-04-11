import { LoginVisuals } from "@/components/auth/LoginVisuals";
import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in | Triplance",
  description: "Log in to your Triplance account to explore the world.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex w-full bg-white font-sans">
      <LoginVisuals />
      <LoginForm />
    </div>
  );
}