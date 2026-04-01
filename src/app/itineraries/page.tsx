import type { Metadata } from "next";
import { ItinerariesPage } from "@/components/itineraries/itineraries-page";

export const metadata: Metadata = {
  title: "My Itineraries — puntahan",
  description: "Plan and manage your Philippine travel itineraries.",
};

export default function Itineraries() {
  return <ItinerariesPage />;
}
