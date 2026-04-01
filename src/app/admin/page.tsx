import type { Metadata } from "next";
import { AdminPage } from "@/components/admin/admin-page";

export const metadata: Metadata = {
  title: "Admin — puntahan",
  description: "Admin dashboard for puntahan.",
};

export default function Admin() {
  return <AdminPage />;
}
