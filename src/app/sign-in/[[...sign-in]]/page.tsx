import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign In — puntahan",
};

export default function SignInPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center">
      <SignIn />
    </main>
  );
}
