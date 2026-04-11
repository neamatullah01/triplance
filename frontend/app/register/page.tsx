import { SignupVisuals } from "@/components/auth/SignupVisuals";
import { SignupForm } from "@/components/auth/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Triplance",
  description: "Create your Triplance account as a traveler or register your travel agency.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex w-full bg-white font-sans overflow-hidden">
      <SignupVisuals />
      <SignupForm />
    </div>
  );
}
