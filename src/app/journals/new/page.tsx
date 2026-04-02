import type { Metadata } from "next";
import { JournalEditor } from "@/components/journals/journal-editor";

export const metadata: Metadata = {
  title: "New Journal — puntahan",
  description: "Write about your travel experience.",
};

export default function NewJournal() {
  return <JournalEditor />;
}
