import type { Metadata } from "next";
import { DestinationDetail } from "@/components/destinations/destination-detail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${name} — puntahan`,
    description: `Discover ${name} — travel tips, budget info, and community reviews on puntahan.`,
  };
}

export default async function DestinationPage({ params }: PageProps) {
  const { slug } = await params;

  return <DestinationDetail slug={slug} />;
}
