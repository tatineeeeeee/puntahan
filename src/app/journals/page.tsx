import type { Metadata } from "next";
import { JournalFeed } from "@/components/journals/journal-feed";

export const metadata: Metadata = {
  title: "Travel Journals — puntahan",
  description: "Read travel stories from the puntahan community.",
};

export default function Journals() {
  return <JournalFeed />;
}
