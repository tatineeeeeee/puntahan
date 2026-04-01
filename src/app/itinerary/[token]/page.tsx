import type { Metadata } from "next";
import { SharedItineraryView } from "@/components/itineraries/shared-itinerary-view";

export const metadata: Metadata = {
  title: "Shared Itinerary — puntahan",
  description: "View a shared travel itinerary.",
};

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function SharedItineraryPage({ params }: PageProps) {
  const { token } = await params;
  return <SharedItineraryView token={token} />;
}
