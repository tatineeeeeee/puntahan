"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  scrollTargetId: string;
}

export function HeroSection({ scrollTargetId }: HeroSectionProps) {
  const stats = useQuery(api.destinations.stats);

  function handleScroll() {
    document
      .getElementById(scrollTargetId)
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden sm:min-h-[70vh]">
      <Image
        src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1600&q=80"
        alt="El Nido, Palawan — crystal-clear waters and limestone cliffs"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

      <div className="relative z-10 flex flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
        <h1 className="text-4xl font-bold text-coral sm:text-5xl lg:text-6xl">
          puntahan
        </h1>

        <p className="mt-4 text-xl font-bold text-white sm:text-2xl lg:text-3xl">
          Real tips. Real budgets. Real travelers.
        </p>

        <p className="mt-3 max-w-xl text-sm text-white/80 sm:text-base">
          Community-powered travel guide for the Philippines — honest tips and
          actual peso breakdowns from people who&apos;ve been there
        </p>

        <Button
          variant="primary"
          size="lg"
          className="mt-8"
          onClick={handleScroll}
        >
          Start Exploring
        </Button>

        <p className="mt-6 text-sm text-white/70">
          {stats?.total ?? "—"} destinations · 4 regions · community-driven
        </p>
      </div>
    </section>
  );
}
