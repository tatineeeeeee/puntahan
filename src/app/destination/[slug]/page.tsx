import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { DestinationDetail } from "@/components/destinations/destination-detail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const destination = await fetchQuery(api.destinations.getBySlug, { slug });
    if (!destination) {
      return { title: "Destination Not Found — puntahan" };
    }

    const title = `${destination.name}, ${destination.province} — puntahan`;
    const description = destination.description.slice(0, 160);
    const ogImage = destination.heroImageUrl ?? undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: ogImage ? [{ url: ogImage, width: 800, height: 600 }] : [],
        siteName: "puntahan",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch {
    const name = slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      title: `${name} — puntahan`,
      description: `Discover ${name} on puntahan.`,
    };
  }
}

export default async function DestinationPage({ params }: PageProps) {
  const { slug } = await params;

  return <DestinationDetail slug={slug} />;
}
