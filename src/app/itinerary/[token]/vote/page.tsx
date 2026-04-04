import type { Metadata } from "next";
import { VotingPage } from "@/components/itineraries/voting-page";

export const metadata: Metadata = {
  title: "Vote on Trip Destinations — puntahan",
  description: "Suggest and vote on destinations for a group trip.",
};

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function TripVotePage({ params }: PageProps) {
  const { token } = await params;
  return <VotingPage token={token} />;
}
