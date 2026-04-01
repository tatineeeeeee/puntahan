import type { Metadata } from "next";
import { LeaderboardPage } from "@/components/leaderboard/leaderboard-page";

export const metadata: Metadata = {
  title: "Leaderboard — puntahan",
  description: "Top contributors and highest-rated Philippine destinations.",
};

export default function Leaderboard() {
  return <LeaderboardPage />;
}
