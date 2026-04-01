import type { Metadata } from "next";
import { ProfilePage } from "@/components/profile/profile-page";

export const metadata: Metadata = {
  title: "Profile — puntahan",
  description: "Your travel profile, tips, and saved destinations.",
};

export default function Profile() {
  return <ProfilePage />;
}
