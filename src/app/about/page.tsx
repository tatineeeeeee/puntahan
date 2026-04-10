import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — puntahan",
  description:
    "Learn about puntahan, a community-driven travel guide for the Philippines with honest tips and real peso breakdowns.",
};

const howItWorks = [
  {
    icon: "🗺️",
    title: "Discover Destinations",
    description:
      "Browse destinations by region, filter by budget, and explore the map. Find your next adventure with ratings and photos from real travelers.",
  },
  {
    icon: "💬",
    title: "Share Your Tips",
    description:
      "Been somewhere amazing? Share your experience, budget breakdown, and photos. Upvote helpful tips so the best advice rises to the top.",
  },
  {
    icon: "📋",
    title: "Plan Your Trip",
    description:
      "Create itineraries, invite friends to vote on destinations, and organize your travel plans with checklists and journals.",
  },
];

const techStack = [
  "Next.js 16",
  "React 19",
  "Convex",
  "Clerk",
  "Tailwind CSS v4",
  "TypeScript",
  "Bun",
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-3xl font-bold text-charcoal sm:text-4xl">
          About puntahan
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-charcoal/80">
          A community-driven travel guide for the Philippines &mdash; honest
          tips and actual peso breakdowns from people who&apos;ve been there.
        </p>
      </section>

      {/* Mission */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-charcoal">Why puntahan?</h2>
        <p className="mt-3 leading-relaxed text-charcoal/80">
          Most travel sites show you hotel marketing prices and sponsored
          reviews. puntahan is different &mdash; every tip, rating, and budget
          breakdown comes from real Filipino travelers sharing their honest
          experience. Whether you&apos;re planning a weekend getaway to Batangas
          or a two-week island hop through the Visayas, you&apos;ll find real
          costs and practical advice here.
        </p>
      </section>

      {/* How It Works */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-charcoal">How It Works</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {howItWorks.map((item) => (
            <div
              key={item.title}
              className="rounded-xl bg-sand p-5 text-center"
            >
              <span className="text-3xl" role="img" aria-label={item.title}>
                {item.icon}
              </span>
              <h3 className="mt-3 font-bold text-charcoal">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-charcoal">Built With</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-warm-gray/10 px-3 py-1 text-sm text-warm-gray"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Credit */}
      <section className="mt-12 text-center">
        <p className="text-sm text-warm-gray">
          Built by Justine &mdash; a community project for Filipino travelers.
        </p>
      </section>
    </main>
  );
}
