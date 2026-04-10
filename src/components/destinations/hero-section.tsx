"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale } from "@/lib/hooks/use-locale";
import { t } from "@/lib/i18n";

interface HeroSectionProps {
  scrollTargetId: string;
}

export function HeroSection({ scrollTargetId }: HeroSectionProps) {
  const stats = useQuery(api.destinations.stats);
  const topRated = useQuery(api.destinations.listTopRated);
  const allDests = useQuery(api.destinations.list, {});
  const { locale } = useLocale();

  const featured =
    topRated && topRated.length > 0
      ? topRated
      : allDests?.slice(0, 4) ?? [];
  const isLoading = topRated === undefined && allDests === undefined;

  const topTip = topRated?.find((d) => d.topTip)?.topTip;

  function handleScroll() {
    document
      .getElementById(scrollTargetId)
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative overflow-hidden bg-warm-white">
      {/* Warm ambient background — CSS vars for dark mode intensity */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom right, var(--hero-gradient-from), transparent, var(--hero-gradient-to))",
        }}
      />
      <div className="absolute -top-20 right-10 h-72 w-72 rounded-full bg-coral/10 blur-3xl dark:bg-coral/20 sm:h-96 sm:w-96" />
      <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-teal/8 blur-3xl dark:bg-teal/15 sm:h-80 sm:w-80" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:py-12 lg:py-14">
        <div className="grid items-end gap-8 lg:grid-cols-2 lg:gap-10">
          {/* ── Left: Brand + pitch ── */}
          <div>
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-coral">puntahan</span>
            </h1>

            <p className="mt-4 text-xl font-bold leading-snug text-charcoal sm:text-2xl">
              {t("hero.subtitle", locale)}
            </p>

            <p className="mt-3 max-w-lg text-[0.94rem] leading-relaxed text-warm-gray">
              {t("hero.description", locale)}
            </p>

            {/* Stats */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-warm-gray">
              <span>
                <strong className="text-charcoal">{stats?.total ?? "—"}</strong>{" "}
                {t("common.destinations", locale)}
              </span>
              <span className="text-warm-gray/40">·</span>
              <span>
                <strong className="text-charcoal">4</strong>{" "}
                {t("common.regions", locale)}
              </span>
              <span className="text-warm-gray/40">·</span>
              <span>{t("common.communityDriven", locale)}</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="mt-6"
              onClick={handleScroll}
            >
              {t("hero.cta", locale)}
            </Button>

            {/* Social proof — always visible */}
            <div className="mt-6 max-w-sm rounded-xl border border-warm-gray/10 bg-sand/60 px-4 py-3">
              {topTip ? (
                <>
                  <p className="text-xs italic leading-relaxed text-warm-gray">
                    &ldquo;{topTip.content}&rdquo;
                  </p>
                  <p className="mt-1 text-xs font-medium text-charcoal">
                    — {topTip.authorName}
                  </p>
                </>
              ) : (
                <p className="text-xs leading-relaxed text-warm-gray">
                  Join{" "}
                  <strong className="text-charcoal">
                    {stats?.total ?? "23"}
                  </strong>{" "}
                  destinations worth of community tips and honest peso
                  breakdowns.
                </p>
              )}
            </div>
          </div>

          {/* ── Right: Photo mosaic ── */}
          <div>
            {featured.length > 0 ? (
              <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
                {featured.slice(0, 4).map((dest) => (
                  <Link
                    key={dest._id}
                    href={`/destination/${dest.slug}`}
                    className="group overflow-hidden rounded-xl bg-sand shadow-md ring-1 ring-warm-gray/5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="relative aspect-4/3 bg-warm-gray/10">
                      {dest.heroImageUrl ? (
                        <Image
                          src={dest.heroImageUrl}
                          alt={dest.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 45vw, 200px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-warm-gray">
                          📸
                        </div>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="text-sm font-bold leading-tight text-charcoal truncate">
                        {dest.name}
                      </p>
                      {dest.tipsCount > 0 && (
                        <div className="mt-1 flex items-center gap-1">
                          <Rating value={dest.avgRating} size="sm" />
                          <span className="text-[10px] text-warm-gray">
                            {dest.tipsCount} tips
                          </span>
                        </div>
                      )}
                      <p className="mt-1 text-xs font-medium text-coral">
                        ₱{dest.budgetMin.toLocaleString()}–
                        {dest.budgetMax.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : isLoading ? (
              <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            ) : null}
          </div>
        </div>

      </div>
    </section>
  );
}
