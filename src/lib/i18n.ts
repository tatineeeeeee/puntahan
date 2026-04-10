export type Locale = "en" | "fil";

const translations: Record<string, Record<Locale, string>> = {
  // Navigation
  "nav.home": { en: "Home", fil: "Home" },
  "nav.itineraries": { en: "Itineraries", fil: "Mga Itinerary" },
  "nav.leaderboard": { en: "Leaderboard", fil: "Ranggo" },
  "nav.profile": { en: "Profile", fil: "Profile" },
  "nav.admin": { en: "Admin", fil: "Admin" },
  "nav.signIn": { en: "Sign in", fil: "Mag-sign in" },

  // Bottom nav
  "nav.browse": { en: "Browse", fil: "Tuklasin" },
  "nav.trips": { en: "Trips", fil: "Biyahe" },
  "nav.top": { en: "Top", fil: "Top" },

  // Hero section
  "hero.title": { en: "puntahan", fil: "puntahan" },
  "hero.subtitle": {
    en: "Real tips. Real budgets. Real travelers.",
    fil: "Totoong tips. Totoong budget. Totoong manlalakbay.",
  },
  "hero.description": {
    en: "Community-powered travel guide for the Philippines — honest tips and actual peso breakdowns from people who've been there",
    fil: "Travel guide para sa Pilipinas mula sa komunidad — tapat na tips at totoong presyo mula sa mga nakapunta na",
  },
  "hero.cta": { en: "Start Exploring", fil: "Magsimulang Mag-explore" },

  // Browse page
  "browse.gridView": { en: "Grid view", fil: "Grid view" },
  "browse.mapView": { en: "Map view", fil: "Map view" },
  "browse.communityPicks": { en: "Community Picks", fil: "Pili ng Komunidad" },
  "browse.topContributors": { en: "Top Contributors", fil: "Mga Top Contributor" },
  "browse.viewAll": { en: "View All", fil: "Tingnan Lahat" },

  // Destination detail
  "dest.about": { en: "About", fil: "Tungkol" },
  "dest.photos": { en: "Photos", fil: "Mga Litrato" },
  "dest.tips": { en: "Travel Tips", fil: "Mga Travel Tip" },
  "dest.nearby": { en: "Nearby Destinations", fil: "Mga Kalapit na Destinasyon" },
  "dest.notFound": { en: "Destination not found", fil: "Hindi nahanap ang destinasyon" },
  "dest.bestTime": { en: "Best Time to Visit", fil: "Pinakamainam na Oras" },
  "dest.festivals": { en: "Festivals & Events", fil: "Mga Pista at Evento" },
  "dest.community": { en: "Community", fil: "Komunidad" },
  "dest.tips_label": { en: "Tips", fil: "Tips" },
  "dest.bookmarks": { en: "Bookmarks", fil: "Mga Bookmark" },

  // Tips
  "tips.share": { en: "Share a Tip", fil: "Magbahagi ng Tip" },
  "tips.shareCta": { en: "Share your tip", fil: "Ibahagi ang iyong tip" },
  "tips.signIn": {
    en: "Sign in to share your travel tips.",
    fil: "Mag-sign in para magbahagi ng travel tips.",
  },
  "tips.noTips": {
    en: "No tips yet. Be the first to share!",
    fil: "Wala pang tips. Maging una kang magbahagi!",
  },
  "tips.yourRating": { en: "Your Rating", fil: "Iyong Rating" },
  "tips.yourTip": { en: "Your Tip", fil: "Iyong Tip" },
  "tips.budget": { en: "Budget Breakdown (optional)", fil: "Breakdown ng Budget (opsyonal)" },
  "tips.photos": { en: "Photos (max 3)", fil: "Mga Litrato (max 3)" },
  "tips.submit": { en: "Submit Tip", fil: "I-submit ang Tip" },
  "tips.cancel": { en: "Cancel", fil: "Kanselahin" },

  // Common
  "common.loading": { en: "Loading...", fil: "Naglo-load..." },
  "common.destinations": { en: "destinations", fil: "mga destinasyon" },
  "common.regions": { en: "regions", fil: "mga rehiyon" },
  "common.communityDriven": { en: "community-driven", fil: "mula sa komunidad" },

  // Footer
  "footer.explore": { en: "Explore", fil: "Tuklasin" },
  "footer.account": { en: "Account", fil: "Account" },
  "footer.about": { en: "About", fil: "Tungkol" },
  "footer.aboutPuntahan": { en: "About puntahan", fil: "Tungkol sa puntahan" },
  "footer.replayTour": { en: "Replay Tour", fil: "Ulitin ang Tour" },
  "footer.builtBy": { en: "Built by Justine", fil: "Ginawa ni Justine" },
};

export function t(key: string, locale: Locale = "en"): string {
  return translations[key]?.[locale] ?? key;
}
