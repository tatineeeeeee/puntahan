import type { Metadata } from "next";
import { FestivalCalendar } from "@/components/festivals/festival-calendar";

export const metadata: Metadata = {
  title: "Festival Calendar — puntahan",
  description: "Discover Philippine festivals and events by month.",
};

export default function Festivals() {
  return <FestivalCalendar />;
}
