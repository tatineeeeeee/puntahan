import { internalMutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// ---------------------------------------------------------------------------
// Seed users — 5 realistic Filipino traveler personas
// ---------------------------------------------------------------------------
const SEED_USERS = [
  {
    clerkUserId: "seed_user_001_maria",
    email: "maria.santos.seed@puntahan.ph",
    name: "Maria Santos",
    imageUrl: "https://api.dicebear.com/7.x/initials/svg?seed=MS&backgroundColor=coral",
  },
  {
    clerkUserId: "seed_user_002_juan",
    email: "juan.delacruz.seed@puntahan.ph",
    name: "Juan dela Cruz",
    imageUrl: "https://api.dicebear.com/7.x/initials/svg?seed=JC&backgroundColor=teal",
  },
  {
    clerkUserId: "seed_user_003_ana",
    email: "ana.reyes.seed@puntahan.ph",
    name: "Ana Reyes",
    imageUrl: "https://api.dicebear.com/7.x/initials/svg?seed=AR&backgroundColor=sunset",
  },
  {
    clerkUserId: "seed_user_004_carlo",
    email: "carlo.bautista.seed@puntahan.ph",
    name: "Carlo Bautista",
    imageUrl: "https://api.dicebear.com/7.x/initials/svg?seed=CB&backgroundColor=coral",
  },
  {
    clerkUserId: "seed_user_005_ria",
    email: "ria.mendoza.seed@puntahan.ph",
    name: "Ria Mendoza",
    imageUrl: "https://api.dicebear.com/7.x/initials/svg?seed=RM&backgroundColor=teal",
  },
] as const;

// ---------------------------------------------------------------------------
// Tips data — 3 tips per destination, realistic PH travel content
// ---------------------------------------------------------------------------
const TIPS_DATA = [
  // ─── BORACAY ────────────────────────────────────────────────────────────────
  {
    destinationSlug: "boracay",
    tips: [
      {
        userIndex: 0,
        content:
          "Book November to May for the best weather. Station 2 near D'Mall is the liveliest area with tons of restaurants and shops. Take the 10-minute tricycle from the port for only ₱25 and walk the beach at sunset — it's magical. Don't miss the fire dancers performing at Station 2 in the evenings!",
        rating: 5,
        budgetBreakdown: [
          { category: "Accommodation", amount: 2000 },
          { category: "Food", amount: 800 },
          { category: "Transport", amount: 500 },
          { category: "Activities", amount: 1500 },
        ],
        upvotes: 34,
        downvotes: 2,
      },
      {
        userIndex: 2,
        content:
          "Budget tip: stay in Station 3 instead of Station 1 for way cheaper accommodations with an equally beautiful beach but less crowd. Eat at the local carenderia near the market for ₱80 meals. Renting a beach umbrella costs ₱100/day. Avoid July–August when jellyfish season peaks.",
        rating: 4,
        budgetBreakdown: [
          { category: "Accommodation", amount: 1200 },
          { category: "Food", amount: 500 },
          { category: "Transport", amount: 300 },
          { category: "Activities", amount: 800 },
        ],
        upvotes: 28,
        downvotes: 1,
      },
      {
        userIndex: 4,
        content:
          "Buy fresh seafood at Talipapa Market and have it cooked by nearby restaurants for a small fee — a full feast for two runs ₱600–800, far cheaper than beachfront restaurants. The paluto system is a Boracay institution. Also try the chori burger stalls near D'Mall — crispy, filling, only ₱50.",
        rating: 5,
        budgetBreakdown: [
          { category: "Food", amount: 700 },
          { category: "Accommodation", amount: 1800 },
          { category: "Transport", amount: 400 },
          { category: "Activities", amount: 1200 },
        ],
        upvotes: 41,
        downvotes: 3,
      },
    ],
  },

  // ─── EL NIDO ─────────────────────────────────────────────────────────────
  {
    destinationSlug: "el-nido",
    tips: [
      {
        userIndex: 1,
        content:
          "Do Tour A first — it covers the Big and Small Lagoons. Book early morning to beat the crowds. Bring ₱200 for the El Nido Environmental Fee. Shimizu Island snorkeling has fish absolutely everywhere. Tours are fixed-price by barangay (₱1,200) so don't let operators overcharge you.",
        rating: 5,
        budgetBreakdown: [
          { category: "Tours", amount: 1200 },
          { category: "Accommodation", amount: 2500 },
          { category: "Food", amount: 800 },
          { category: "Transport", amount: 3500 },
        ],
        upvotes: 52,
        downvotes: 4,
      },
      {
        userIndex: 3,
        content:
          "Rent a motorbike for ₱500/day to explore the mainland. Nacpan Beach (45 mins away) is far less crowded than town and stunningly empty. The Twin Beach viewpoint is perfect for sunrise photography — 5am start recommended. El Nido is a photographer's paradise; even a phone camera produces stunning shots.",
        rating: 5,
        budgetBreakdown: [
          { category: "Transport", amount: 500 },
          { category: "Accommodation", amount: 2000 },
          { category: "Food", amount: 700 },
          { category: "Activities", amount: 1500 },
        ],
        upvotes: 38,
        downvotes: 2,
      },
      {
        userIndex: 2,
        content:
          "Take the overnight bus from Puerto Princesa to El Nido (₱450–600) to save one night's accommodation. Land fresh in the morning and head straight for Tour C. Dolarog Beach is the hidden gem most tourists skip. Skip the resort restaurants and eat at Altrove or Trattoria Altrove for Italian at Philippine prices.",
        rating: 4,
        budgetBreakdown: [
          { category: "Transport", amount: 600 },
          { category: "Tours", amount: 1200 },
          { category: "Food", amount: 700 },
          { category: "Accommodation", amount: 1800 },
        ],
        upvotes: 29,
        downvotes: 3,
      },
    ],
  },

  // ─── SIARGAO ─────────────────────────────────────────────────────────────
  {
    destinationSlug: "siargao",
    tips: [
      {
        userIndex: 1,
        content:
          "Cloud 9 is everything they say — but you don't need to surf to enjoy Siargao. Rent a motorbike (₱350/day) and visit Magpupungko Rock Pools and Sugba Lagoon (₱150 entrance). Crystal clear, impossibly blue. September is peak surf season so book accommodation months in advance if visiting then.",
        rating: 5,
        budgetBreakdown: [
          { category: "Transport", amount: 350 },
          { category: "Activities", amount: 800 },
          { category: "Accommodation", amount: 1500 },
          { category: "Food", amount: 600 },
        ],
        upvotes: 47,
        downvotes: 2,
      },
      {
        userIndex: 4,
        content:
          "Kermit Resort restaurant is worth it even if you're not staying — best pizza on the island and cocktails for ₱350. For budget eating, the paluto stalls near Cloud 9 do grilled fish for ₱150. The laid-back island vibe here is incomparable anywhere in the Philippines. Daku Island for the best beach lunch.",
        rating: 5,
        budgetBreakdown: [
          { category: "Food", amount: 700 },
          { category: "Accommodation", amount: 1200 },
          { category: "Transport", amount: 400 },
          { category: "Activities", amount: 600 },
        ],
        upvotes: 35,
        downvotes: 1,
      },
      {
        userIndex: 2,
        content:
          "Stay in General Luna town center in a hostel for ₱500–800/night. Renting a scooter is essential — trike rides are overpriced for tourists. Island hopping to Naked Island, Daku, and Guyam Island is ₱1,200 all-in shared. Bring a waterproof bag as the bancas can get splashed in open water.",
        rating: 4,
        budgetBreakdown: [
          { category: "Accommodation", amount: 600 },
          { category: "Transport", amount: 400 },
          { category: "Activities", amount: 1200 },
          { category: "Food", amount: 500 },
        ],
        upvotes: 31,
        downvotes: 2,
      },
    ],
  },

  // ─── BANAUE RICE TERRACES ────────────────────────────────────────────────
  {
    destinationSlug: "banaue-rice-terraces",
    tips: [
      {
        userIndex: 3,
        content:
          "The viewpoint is free. Go at 7am before tour buses arrive for clear skies and solitude. Then hike down to Batad for the actual amphitheater terraces with Tappiya Falls — 45 minutes down, 1.5 hours back up but completely worth every step. March–May the terraces glow electric green.",
        rating: 5,
        budgetBreakdown: [
          { category: "Transport", amount: 800 },
          { category: "Accommodation", amount: 800 },
          { category: "Food", amount: 400 },
          { category: "Guide Fee", amount: 500 },
        ],
        upvotes: 43,
        downvotes: 3,
      },
      {
        userIndex: 0,
        content:
          "Take the night bus from Manila (Ohayami Trans or Coda Lines, ₱450–550) and arrive at 5–6am in time for sunrise at the viewpoint. Stay 2 nights — one for the viewpoint, one for the Batad trek. Local guides charge ₱500 for Batad which is very fair. Bring cash as ATMs are unreliable in the area.",
        rating: 5,
        budgetBreakdown: [
          { category: "Transport", amount: 1000 },
          { category: "Accommodation", amount: 600 },
          { category: "Guide Fee", amount: 500 },
          { category: "Food", amount: 400 },
        ],
        upvotes: 38,
        downvotes: 2,
      },
      {
        userIndex: 2,
        content:
          "Share a jeepney or van from Banaue to Batad (₱300–400/person or ₱2,000 whole vehicle). Wear proper trekking shoes — the stone path is slippery when wet. At Tappiya Falls you can swim in the cold pool below. Bring snacks as food options in Batad are limited and overpriced by necessity.",
        rating: 4,
        budgetBreakdown: [
          { category: "Transport", amount: 400 },
          { category: "Food", amount: 350 },
          { category: "Accommodation", amount: 700 },
          { category: "Activities", amount: 200 },
        ],
        upvotes: 26,
        downvotes: 1,
      },
    ],
  },

  // ─── CORON ───────────────────────────────────────────────────────────────
  {
    destinationSlug: "coron",
    tips: [
      {
        userIndex: 1,
        content:
          "Kayangan Lake — arrive by 7am before the tour boats crowd the famous ladder photo spot. Crystal clear water with two distinct temperature layers you can feel while swimming. Book a private tour (₱3,000–4,000 for 2) for flexibility, or join a group tour (₱1,500) if on a budget.",
        rating: 5,
        budgetBreakdown: [
          { category: "Tours", amount: 2000 },
          { category: "Accommodation", amount: 2500 },
          { category: "Food", amount: 800 },
          { category: "Transport", amount: 2000 },
        ],
        upvotes: 56,
        downvotes: 4,
      },
      {
        userIndex: 3,
        content:
          "For WWII history, wreck diving here is world-class — 12+ Japanese warships sunk in 1944. Even beginners can snorkel Skeleton Wreck which sits in shallow water. Bring an underwater camera; visibility is 20–30m on good days. Coron Bay at sunset from the twin peaks viewpoint is unforgettable.",
        rating: 5,
        budgetBreakdown: [
          { category: "Diving", amount: 3500 },
          { category: "Accommodation", amount: 2000 },
          { category: "Food", amount: 700 },
          { category: "Transport", amount: 1500 },
        ],
        upvotes: 39,
        downvotes: 2,
      },
      {
        userIndex: 2,
        content:
          "Barracuda Lake is unique — hot spring water at the bottom, cold on top. Swim down and feel the sudden temperature change. Maquinit Hot Spring (₱250) soothes sore muscles after island hopping. Budget tip: tricycle rides in town are ₱10–15; don't overpay the tourist-priced trikes waiting at the pier.",
        rating: 4,
        budgetBreakdown: [
          { category: "Transport", amount: 500 },
          { category: "Tours", amount: 1500 },
          { category: "Food", amount: 600 },
          { category: "Accommodation", amount: 1800 },
        ],
        upvotes: 33,
        downvotes: 2,
      },
    ],
  },

  // ─── INTRAMUROS ──────────────────────────────────────────────────────────
  {
    destinationSlug: "intramuros",
    tips: [
      {
        userIndex: 4,
        content:
          "Rent a bamboo bicycle at the Intramuros Administration (₱150/hour) and explore the walled city at your own pace. Fort Santiago, Manila Cathedral, and Casa Manila Museum make for a full half-day. The dungeons where Rizal was held are hauntingly preserved. Go on a weekday morning to avoid school tours.",
        rating: 5,
        budgetBreakdown: [
          { category: "Entry Fees", amount: 200 },
          { category: "Transport", amount: 150 },
          { category: "Food", amount: 300 },
          { category: "Bike Rental", amount: 150 },
        ],
        upvotes: 45,
        downvotes: 3,
      },
      {
        userIndex: 0,
        content:
          "The Bambike Ecotour (₱800) is the best guided experience for first-timers — enthusiastic guides with great historical stories. Book dinner at Barbara's Heritage Restaurant inside the walls: pricey but the live folk performance and ancestral setting make it worth it for a special occasion.",
        rating: 4,
        budgetBreakdown: [
          { category: "Tour", amount: 800 },
          { category: "Entry Fees", amount: 150 },
          { category: "Food", amount: 600 },
          { category: "Transport", amount: 200 },
        ],
        upvotes: 31,
        downvotes: 2,
      },
      {
        userIndex: 2,
        content:
          "Walking inside the walls is free. Fort Santiago entrance is ₱75 and includes the museum. Calesa (horse carriage) tours are fun but negotiate first — agree on ₱300–400 for 30 minutes. Late afternoon golden hour hits the stone walls beautifully; perfect for photography. The moat area is great for Instagram shots.",
        rating: 4,
        budgetBreakdown: [
          { category: "Entry Fees", amount: 75 },
          { category: "Calesa", amount: 350 },
          { category: "Food", amount: 250 },
          { category: "Transport", amount: 200 },
        ],
        upvotes: 28,
        downvotes: 1,
      },
    ],
  },

  // ─── CHOCOLATE HILLS ─────────────────────────────────────────────────────
  {
    destinationSlug: "chocolate-hills",
    tips: [
      {
        userIndex: 3,
        content:
          "Arrive at the Carmen viewpoint by 6:30am for sunrise. The hills are lushest July–November but turn chocolate brown March–May. Combine with the Loboc River Cruise (₱450 all-in with folk music lunch) and Tarsier Conservation Area for a complete Bohol day. Entrance to the viewpoint complex is ₱50.",
        rating: 5,
        budgetBreakdown: [
          { category: "Entry Fees", amount: 50 },
          { category: "Transport", amount: 1200 },
          { category: "Activities", amount: 450 },
          { category: "Food", amount: 400 },
        ],
        upvotes: 36,
        downvotes: 2,
      },
      {
        userIndex: 1,
        content:
          "Rent a motorbike from Tagbilaran (₱400/day) for maximum flexibility. The Complex in Carmen is 55km away — about 1.5 hours. Also drive through the man-made forest in Bilar: a stunning 2km stretch of tall mahogany trees that creates a cool dark canopy even midday. Perfect photo backdrop.",
        rating: 4,
        budgetBreakdown: [
          { category: "Transport", amount: 400 },
          { category: "Entry Fees", amount: 50 },
          { category: "Food", amount: 350 },
          { category: "Activities", amount: 300 },
        ],
        upvotes: 29,
        downvotes: 1,
      },
      {
        userIndex: 4,
        content:
          "Don't just do the viewpoint — climb to the top of the observation hill inside the complex (214 steps) for a real 360° panorama. After, head to Loboc River for floating restaurant lunch with live folk music — ₱450 all-in. The river is gorgeous and peaceful. End the day with a swim at Panglao beach.",
        rating: 4,
        budgetBreakdown: [
          { category: "Food", amount: 450 },
          { category: "Entry Fees", amount: 100 },
          { category: "Transport", amount: 1000 },
          { category: "Activities", amount: 300 },
        ],
        upvotes: 22,
        downvotes: 1,
      },
    ],
  },

  // ─── KAWASAN FALLS ───────────────────────────────────────────────────────
  {
    destinationSlug: "kawasan-falls",
    tips: [
      {
        userIndex: 1,
        content:
          "Canyoneering from Badian to Kawasan Falls (₱1,500–1,800) is one of the best adventures in the Philippines. It ends with a bamboo raft float to the main falls — the turquoise color is absolutely surreal. Start at 8am to beat the afternoon crowds. Guide fees are fixed by the cooperative; don't overpay.",
        rating: 5,
        budgetBreakdown: [
          { category: "Canyoneering", amount: 1600 },
          { category: "Transport", amount: 400 },
          { category: "Food", amount: 300 },
          { category: "Gear Rental", amount: 200 },
        ],
        upvotes: 61,
        downvotes: 5,
      },
      {
        userIndex: 0,
        content:
          "Skip canyoneering and hike 30 minutes from the national highway junction to reach the falls directly (₱40 entrance). Rent a life vest (₱50) and bamboo raft (₱150) to float on the pool. The water is cold, clear, and impossibly blue. Bring a waterproof phone case — you will want photos from inside the falls spray.",
        rating: 5,
        budgetBreakdown: [
          { category: "Transport", amount: 300 },
          { category: "Entry Fees", amount: 40 },
          { category: "Raft Rental", amount: 150 },
          { category: "Food", amount: 250 },
        ],
        upvotes: 44,
        downvotes: 2,
      },
      {
        userIndex: 2,
        content:
          "Canyoneering fees are fixed by the cooperative — maximum ₱1,800. Ask your guide to take you to Falls 2 and 3 which most tourists skip. Falls 2 is equally stunning but nearly empty. Bring a full change of clothes and dry bag. The cliff jumps range from 3–8 meters; you can always skip any you're not comfortable with.",
        rating: 4,
        budgetBreakdown: [
          { category: "Guide", amount: 1500 },
          { category: "Transport", amount: 350 },
          { category: "Food", amount: 300 },
          { category: "Entry", amount: 100 },
        ],
        upvotes: 33,
        downvotes: 2,
      },
    ],
  },

  // ─── VIGAN ───────────────────────────────────────────────────────────────
  {
    destinationSlug: "vigan",
    tips: [
      {
        userIndex: 4,
        content:
          "Walk Calle Crisologo at night when the gas lamps are lit — it's like stepping into the 18th century. Must-eats: Vigan empanada (₱35, crispy unlike Ilocos Norte style), bagnet (₱150), and longganisa (₱80). The food here is the most uniquely Ilocano in the country. Try the okoy (shrimp fritters) too.",
        rating: 5,
        budgetBreakdown: [
          { category: "Food", amount: 500 },
          { category: "Transport", amount: 800 },
          { category: "Accommodation", amount: 1200 },
          { category: "Activities", amount: 300 },
        ],
        upvotes: 48,
        downvotes: 3,
      },
      {
        userIndex: 0,
        content:
          "Stay at one of the heritage hotels on Crisologo Street — sleeping inside a 200-year-old ancestral house is a genuine experience (₱1,500–2,500/night). Pair Vigan with Laoag City for a full Ilocos Norte-Sur trip: Paoay Church, Bangui Windmills, and Cape Bojeador Lighthouse are all within a day trip.",
        rating: 4,
        budgetBreakdown: [
          { category: "Accommodation", amount: 2000 },
          { category: "Food", amount: 600 },
          { category: "Transport", amount: 1500 },
          { category: "Activities", amount: 400 },
        ],
        upvotes: 35,
        downvotes: 2,
      },
      {
        userIndex: 2,
        content:
          "Kalesa (horse-drawn carriage) tours cost ₱150–200 — negotiate before boarding. Malasin Market sells Vigan burnay pottery and abel blankets at factory prices. The old cemetery at Camposanto has surprisingly beautiful Spanish-era mausoleums. Plaza Burgos at night has street food stalls — crispy bagnet sisig is incredible.",
        rating: 4,
        budgetBreakdown: [
          { category: "Transport", amount: 600 },
          { category: "Food", amount: 400 },
          { category: "Accommodation", amount: 1000 },
          { category: "Shopping", amount: 500 },
        ],
        upvotes: 24,
        downvotes: 1,
      },
    ],
  },

  // ─── SAGADA ──────────────────────────────────────────────────────────────
  {
    destinationSlug: "sagada",
    tips: [
      {
        userIndex: 3,
        content:
          "Hiring a local guide is MANDATORY for all caves and Echo Valley (₱700–900). The hanging coffins hike takes 30 minutes round trip. For Kiltepan Peak sunrise — wake up at 4am and hike 20 minutes to catch the sea of clouds forming below you. It's genuinely one of the most beautiful things you'll see in the Philippines.",
        rating: 5,
        budgetBreakdown: [
          { category: "Guide", amount: 800 },
          { category: "Entry Fees", amount: 100 },
          { category: "Accommodation", amount: 700 },
          { category: "Food", amount: 350 },
        ],
        upvotes: 52,
        downvotes: 4,
      },
      {
        userIndex: 0,
        content:
          "Sumaguing Cave spelunking (₱750 guide fee includes ropes and lamp) takes 2–3 hours inside. You'll squeeze through narrow passages, slide down rock formations, and wade through underground pools. Wear clothes you don't mind destroying. Absolutely worth every peso — one of the most physically fun adventures in Luzon.",
        rating: 5,
        budgetBreakdown: [
          { category: "Cave Guide", amount: 750 },
          { category: "Accommodation", amount: 600 },
          { category: "Food", amount: 300 },
          { category: "Transport", amount: 800 },
        ],
        upvotes: 44,
        downvotes: 3,
      },
      {
        userIndex: 2,
        content:
          "Bus from Baguio to Sagada takes 5–6 hours (₱220–300, Dangwa Terminal). Nights get very cold (10–15°C in December–January) so pack a jacket regardless of season. The Yoghurt House is legendary for homemade yogurt and strawberry shakes (₱120). Café by the Ruins inside Sagada is perfect for warming up with local coffee.",
        rating: 4,
        budgetBreakdown: [
          { category: "Transport", amount: 550 },
          { category: "Food", amount: 400 },
          { category: "Accommodation", amount: 600 },
          { category: "Activities", amount: 500 },
        ],
        upvotes: 38,
        downvotes: 2,
      },
    ],
  },

  // ─── CEBU CITY ───────────────────────────────────────────────────────────
  {
    destinationSlug: "cebu-city",
    tips: [
      {
        userIndex: 4,
        content:
          "Rico's Lechon on Nivel Hills is non-negotiable — the original Cebu lechon with crispy spiced skin is unlike anything in Manila. Arrive early as it sells out by noon (₱650/kilo). Walk through Carbon Market for the real Cebu street experience. The Basilica del Santo Niño is the oldest church in the Philippines.",
        rating: 5,
        budgetBreakdown: [
          { category: "Food", amount: 800 },
          { category: "Transport", amount: 400 },
          { category: "Accommodation", amount: 1500 },
          { category: "Activities", amount: 300 },
        ],
        upvotes: 67,
        downvotes: 5,
      },
      {
        userIndex: 1,
        content:
          "Oslob whale shark watching + Kawasan Falls in one day is the best Cebu day trip. Take the Ceres bus (₱200). Alternatively, RORO ferry to Bohol from the pier is only 2 hours and cheap. Cebu is the perfect hub for exploring all of Visayas — Malapascua, Bantayan, Moalboal are all reachable in under 3 hours.",
        rating: 5,
        budgetBreakdown: [
          { category: "Activities", amount: 1200 },
          { category: "Transport", amount: 600 },
          { category: "Food", amount: 500 },
          { category: "Accommodation", amount: 1800 },
        ],
        upvotes: 48,
        downvotes: 3,
      },
      {
        userIndex: 3,
        content:
          "The Tops Lookout (₱100 entrance) offers a stunning 360° city view at night — ride a habal-habal up (₱100–150 each way). For nightlife, Mango Avenue has everything from chill bars to clubs. Temple of Leah is a bizarre but fascinating free attraction built by a man for his deceased wife. Very photogenic at sunset.",
        rating: 4,
        budgetBreakdown: [
          { category: "Nightlife", amount: 700 },
          { category: "Transport", amount: 300 },
          { category: "Food", amount: 500 },
          { category: "Activities", amount: 300 },
        ],
        upvotes: 35,
        downvotes: 2,
      },
    ],
  },

  // ─── PUERTO PRINCESA UNDERGROUND RIVER ───────────────────────────────────
  {
    destinationSlug: "puerto-princesa-underground-river",
    tips: [
      {
        userIndex: 0,
        content:
          "Book your permit online at least 2 weeks ahead — it sells out fast especially November–May. The ₱250 permit + ₱150 environmental fee is worth it. The 45-minute boat tour takes you 1.5km inside the cave past formations nicknamed 'the face', 'the crucifix', and 'the cathedral'. Monkeys at Sabang will steal your food.",
        rating: 5,
        budgetBreakdown: [
          { category: "Boat Tour", amount: 1500 },
          { category: "Permits", amount: 400 },
          { category: "Food", amount: 400 },
          { category: "Transport", amount: 1200 },
        ],
        upvotes: 54,
        downvotes: 4,
      },
      {
        userIndex: 3,
        content:
          "Combine the Underground River with Sabang Beach (black sand, usually deserted) for the afternoon. The Mangrove Paddling Trail from Sabang (₱350 kayak for 2) is stunning — silent except for birds. Puerto Princesa city has excellent tuna belly BBQ on Rizal Avenue in the evening. Don't miss Ugong Rock Adventures (₱400).",
        rating: 5,
        budgetBreakdown: [
          { category: "Activities", amount: 2000 },
          { category: "Transport", amount: 1500 },
          { category: "Food", amount: 500 },
          { category: "Accommodation", amount: 1800 },
        ],
        upvotes: 39,
        downvotes: 2,
      },
      {
        userIndex: 2,
        content:
          "Van transfer from Puerto Princesa to Sabang is ₱200–250 and takes 1.5 hours on a bumpy road. Join a full-day tour from the city (₱1,800–2,500 all-in) for the most hassle-free experience. Watch monkeys closely — one grabbed my sandwich from my hand! They're fearless and surprisingly strong.",
        rating: 4,
        budgetBreakdown: [
          { category: "Tour Package", amount: 2000 },
          { category: "Food", amount: 400 },
          { category: "Accommodation", amount: 1500 },
          { category: "Shopping", amount: 300 },
        ],
        upvotes: 28,
        downvotes: 1,
      },
    ],
  },

  // ─── MAYON VOLCANO ───────────────────────────────────────────────────────
  {
    destinationSlug: "mayon-volcano",
    tips: [
      {
        userIndex: 3,
        content:
          "The perfect cone is best viewed from Cagsawa Ruins (₱30 entrance) in Daraga early morning before clouds roll in by 9am. ATV rides through the lava flow zone are ₱1,500 for 2 hours — mind-blowing experience driving past solidified lava with the cone towering above. Arrange through your hotel, not roadside touts.",
        rating: 5,
        budgetBreakdown: [
          { category: "ATV", amount: 1500 },
          { category: "Transport", amount: 600 },
          { category: "Entry Fees", amount: 80 },
          { category: "Food", amount: 400 },
        ],
        upvotes: 43,
        downvotes: 3,
      },
      {
        userIndex: 4,
        content:
          "Legazpi has fantastic Bicolano food — try laing (taro in coconut milk), Bicol Express (spicy pork), and pinangat. Smalltalk Café near the wharf has the best view of Mayon across the bay. Stay near Peñaranda Park for easy city access. The boulevard promenade at sunset with the volcano reflected in the water is surreal.",
        rating: 4,
        budgetBreakdown: [
          { category: "Food", amount: 500 },
          { category: "Accommodation", amount: 1200 },
          { category: "Transport", amount: 700 },
          { category: "Activities", amount: 800 },
        ],
        upvotes: 31,
        downvotes: 2,
      },
      {
        userIndex: 0,
        content:
          "Take the overnight bus from Manila (Peñafrancia Tours, ₱700–800) and arrive in Legazpi at dawn — perfect timing to catch Mayon in morning light with no clouds. The Legazpi Boulevard at sunset is a local favourite. Embarcadero park is free with great views. Check PHIVOLCS advisories before hiking near the volcano.",
        rating: 4,
        budgetBreakdown: [
          { category: "Transport", amount: 1500 },
          { category: "Accommodation", amount: 1000 },
          { category: "Activities", amount: 1500 },
          { category: "Food", amount: 450 },
        ],
        upvotes: 26,
        downvotes: 1,
      },
    ],
  },

  // ─── CAMIGUIN ────────────────────────────────────────────────────────────
  {
    destinationSlug: "camiguin",
    tips: [
      {
        userIndex: 2,
        content:
          "White Island sandbar (₱100 entrance + ₱200 boat from Agoho) appears at low tide and is postcard-perfect. Best 7–9am before midday boats crowd it. Combine with Ardent Hot Spring (₱100) in the evening. Rent a habal-habal for ₱500/day to circle the entire island in one day — it's tiny but packed with attractions.",
        rating: 5,
        budgetBreakdown: [
          { category: "Activities", amount: 600 },
          { category: "Transport", amount: 500 },
          { category: "Accommodation", amount: 1000 },
          { category: "Food", amount: 400 },
        ],
        upvotes: 48,
        downvotes: 3,
      },
      {
        userIndex: 1,
        content:
          "The Sunken Cemetery is eerie and beautiful — a huge cross marks where a whole cemetery sank after a volcanic eruption. Snorkeling reveals old tombstones underwater. Dive packages go for ₱2,000–2,500. Katibawasan Falls (₱30 entrance) has a huge pool for swimming. Old Volcano crater lake is a hidden gem most skip.",
        rating: 5,
        budgetBreakdown: [
          { category: "Diving", amount: 2200 },
          { category: "Activities", amount: 500 },
          { category: "Food", amount: 450 },
          { category: "Accommodation", amount: 1200 },
        ],
        upvotes: 39,
        downvotes: 2,
      },
      {
        userIndex: 4,
        content:
          "Camiguin lanzones during harvest (September–October) are the sweetest in the Philippines. Take the pump boat from Balingoan port in Misamis Oriental (₱200, 45 minutes) to reach the island. Camiguin feels untouched compared to other PH destinations — locals are incredibly friendly and the roads are well-maintained.",
        rating: 4,
        budgetBreakdown: [
          { category: "Transport", amount: 600 },
          { category: "Food", amount: 500 },
          { category: "Accommodation", amount: 1000 },
          { category: "Activities", amount: 400 },
        ],
        upvotes: 30,
        downvotes: 2,
      },
    ],
  },

  // ─── DAVAO CITY ──────────────────────────────────────────────────────────
  {
    destinationSlug: "davao-city",
    tips: [
      {
        userIndex: 0,
        content:
          "Philippine Eagle Center (₱200 entrance) in Malagos is the only place to see the national bird in person — genuinely impressive. Book a habal-habal (₱300) from the city. Try durian at Magsaysay Market: D24 and Puyat varieties, around ₱80–100/kilo. Durian ice cream is creamy, not as pungent — perfect for first-timers.",
        rating: 5,
        budgetBreakdown: [
          { category: "Activities", amount: 600 },
          { category: "Food", amount: 600 },
          { category: "Transport", amount: 400 },
          { category: "Accommodation", amount: 1500 },
        ],
        upvotes: 46,
        downvotes: 3,
      },
      {
        userIndex: 4,
        content:
          "The Roxas Avenue night market (8pm–2am) is one of the safest and most delicious in Mindanao. Isaw and tuna belly BBQ at ₱30–50 per stick. Eden Nature Park (₱400 entrance) provides cool mountain air and zip lines with city views. People's Park in the city is free and beautifully landscaped with giant fruit sculptures.",
        rating: 5,
        budgetBreakdown: [
          { category: "Food", amount: 600 },
          { category: "Activities", amount: 400 },
          { category: "Transport", amount: 300 },
          { category: "Accommodation", amount: 1500 },
        ],
        upvotes: 37,
        downvotes: 2,
      },
      {
        userIndex: 2,
        content:
          "Davao is genuinely one of the safest cities in Southeast Asia. Get around via Grab or K-van minibuses. Malagos Garden Resort has a great chocolate museum — Davao grows some of the world's best cacao. Mt. Apo day hike is possible from the city with a guide but needs 2 days for the summit; plan accordingly.",
        rating: 4,
        budgetBreakdown: [
          { category: "Transport", amount: 400 },
          { category: "Food", amount: 500 },
          { category: "Accommodation", amount: 1200 },
          { category: "Activities", amount: 700 },
        ],
        upvotes: 28,
        downvotes: 1,
      },
    ],
  },

  // ─── BATANES ─────────────────────────────────────────────────────────────
  {
    destinationSlug: "batanes",
    tips: [
      {
        userIndex: 3,
        content:
          "Book flights 2–3 months ahead — Manila to Basco runs ₱5,000–12,000 return and fills fast. Tours are mandatory (₱3,500/day for a van with driver-guide). The rolling hills of Marlboro Country look straight out of a fantasy film. Best months are April–June before typhoon season begins. Budget minimum ₱15,000 total for 3 nights.",
        rating: 5,
        budgetBreakdown: [
          { category: "Flights", amount: 8000 },
          { category: "Tours", amount: 7000 },
          { category: "Accommodation", amount: 3000 },
          { category: "Food", amount: 1500 },
        ],
        upvotes: 62,
        downvotes: 5,
      },
      {
        userIndex: 0,
        content:
          "Stay at a traditional Ivatan stone house inn (₱1,500–3,000/night) for the full local experience. Unique food to try: uvud balls (native pork), coconut crab (in season), and Ivatan bread. Sabtang Island by boat (₱800 return) has the most perfectly preserved stone villages — Savidug is like a living museum.",
        rating: 5,
        budgetBreakdown: [
          { category: "Accommodation", amount: 2500 },
          { category: "Boat to Sabtang", amount: 800 },
          { category: "Food", amount: 1200 },
          { category: "Activities", amount: 1000 },
        ],
        upvotes: 48,
        downvotes: 3,
      },
      {
        userIndex: 4,
        content:
          "The Naidi Hills lighthouse above Basco offers the most photogenic sunset in the Philippines — rolling green hills dropping into the Pacific. Rent a bicycle (₱150/day) for around Basco town. The Honesty Coffee Shop runs on an honor system: pick what you want, leave the payment in the box. Genuinely wholesome.",
        rating: 5,
        budgetBreakdown: [
          { category: "Accommodation", amount: 3000 },
          { category: "Bike Rental", amount: 150 },
          { category: "Food", amount: 1000 },
          { category: "Tours", amount: 3500 },
        ],
        upvotes: 54,
        downvotes: 4,
      },
    ],
  },

  // ─── APO ISLAND ──────────────────────────────────────────────────────────
  {
    destinationSlug: "apo-island",
    tips: [
      {
        userIndex: 1,
        content:
          "The sea turtle sanctuary is world-class — snorkeling with 5–10 turtles at once is common right off the beach. Best 7–9am before midday boats arrive. Boat from Malatapay pier (₱250/person round trip, 30 minutes each way) departs from 7am. Day trip from Dumaguete is totally viable — under ₱1,000 all-in.",
        rating: 5,
        budgetBreakdown: [
          { category: "Boat", amount: 500 },
          { category: "Entry Fee", amount: 100 },
          { category: "Transport", amount: 200 },
          { category: "Food", amount: 300 },
        ],
        upvotes: 58,
        downvotes: 4,
      },
      {
        userIndex: 3,
        content:
          "Stay overnight for the best experience — fewer than 10 small guesthouses on the island so book 2 months ahead. Sunrise with zero light pollution is magical. Diving with turtles (₱1,500–2,000 for 2 tanks) is among the best in Asia. Visibility is typically 20–30m and the turtle population is staggeringly healthy.",
        rating: 5,
        budgetBreakdown: [
          { category: "Accommodation", amount: 800 },
          { category: "Diving", amount: 1800 },
          { category: "Food", amount: 500 },
          { category: "Boat", amount: 250 },
        ],
        upvotes: 44,
        downvotes: 3,
      },
      {
        userIndex: 2,
        content:
          "No ATMs on the island — bring cash. Electricity runs on generators (limited hours, usually 6–10pm). Marine sanctuary fee is ₱100/person/day. Plastic bags are banned on the entire island. One of the most well-preserved marine sanctuaries in Asia — treat it with respect and pack all trash out with you.",
        rating: 4,
        budgetBreakdown: [
          { category: "Accommodation", amount: 700 },
          { category: "Food", amount: 400 },
          { category: "Marine Fee", amount: 100 },
          { category: "Boat", amount: 500 },
        ],
        upvotes: 35,
        downvotes: 1,
      },
    ],
  },

  // ─── HUNDRED ISLANDS ─────────────────────────────────────────────────────
  {
    destinationSlug: "hundred-islands",
    tips: [
      {
        userIndex: 0,
        content:
          "Rent a banca (₱1,200–1,500 for 4 hours) from Lucap Wharf to explore Governor's, Quezon, and Children's Islands. Governor's Island has the best snorkeling. Quezon Island has a zipline over water (₱100). Perfect for families and budget travelers — one of the cheapest island hopping experiences in the Philippines.",
        rating: 4,
        budgetBreakdown: [
          { category: "Boat Rental", amount: 1200 },
          { category: "Entry Fees", amount: 200 },
          { category: "Activities", amount: 200 },
          { category: "Food", amount: 300 },
        ],
        upvotes: 32,
        downvotes: 2,
      },
      {
        userIndex: 2,
        content:
          "Day trip from Manila is doable — 5 hours by Victory Liner bus from Cubao (₱350 one way). Catch the 4am bus, arrive by 9am, and you have a full day. Marcos Island has a 5–10 meter cliff jump into clear water that's a must. Rent snorkel gear at the pier (₱100). This is PH island hopping on a true budget.",
        rating: 4,
        budgetBreakdown: [
          { category: "Transport", amount: 700 },
          { category: "Boat", amount: 1200 },
          { category: "Food", amount: 300 },
          { category: "Activities", amount: 200 },
        ],
        upvotes: 27,
        downvotes: 2,
      },
      {
        userIndex: 1,
        content:
          "Kayaking between islands is magical and peaceful — rent kayaks at the eco-tourism hub (₱200/hour per kayak). Camping is allowed on select islands for ₱100/tent/night (bring all your own supplies). Early morning when the sea is calm and the light hits the limestone formations is the most beautiful time to be here.",
        rating: 5,
        budgetBreakdown: [
          { category: "Kayak", amount: 400 },
          { category: "Camping", amount: 100 },
          { category: "Food", amount: 400 },
          { category: "Transport", amount: 700 },
        ],
        upvotes: 36,
        downvotes: 2,
      },
    ],
  },

  // ─── BGC TAGUIG ──────────────────────────────────────────────────────────
  {
    destinationSlug: "bgc-taguig",
    tips: [
      {
        userIndex: 4,
        content:
          "BGC is the cleanest and most walkable part of Metro Manila. The street art murals along 5th Avenue are worth a self-guided hour-long walk. Free outdoor events at the amphitheater happen most weekends. Mind Museum's First Friday exhibits are free after 5pm and usually excellent. Perfect starting base before going to Tagaytay.",
        rating: 4,
        budgetBreakdown: [
          { category: "Food", amount: 800 },
          { category: "Transport", amount: 300 },
          { category: "Accommodation", amount: 3000 },
          { category: "Activities", amount: 400 },
        ],
        upvotes: 29,
        downvotes: 2,
      },
      {
        userIndex: 0,
        content:
          "Mercato Centrale night market (weekends, 10pm onwards) has gourmet street food at fair prices — truffle fries, craft burgers, and amazing desserts. Venice Grand Canal Mall in McKinley Hill has indoor gondola rides (₱250/person) which sounds cheesy but is genuinely charming. BGC has surprisingly good transport via Grab or the BGC bus loop (₱11).",
        rating: 4,
        budgetBreakdown: [
          { category: "Food", amount: 1200 },
          { category: "Accommodation", amount: 3000 },
          { category: "Activities", amount: 500 },
          { category: "Transport", amount: 300 },
        ],
        upvotes: 23,
        downvotes: 1,
      },
      {
        userIndex: 3,
        content:
          "Mind Museum is the best science museum in the Philippines (₱775 adults) — book weekday tickets online to avoid school groups. BGC Free Art Tour runs Saturday mornings; check their Instagram. The High Street and Bonifacio area has everything from budget to fine dining. Try Manam for Filipino food done with a modern twist.",
        rating: 5,
        budgetBreakdown: [
          { category: "Activities", amount: 1000 },
          { category: "Food", amount: 900 },
          { category: "Accommodation", amount: 3500 },
          { category: "Transport", amount: 300 },
        ],
        upvotes: 31,
        downvotes: 2,
      },
    ],
  },

  // ─── ENCHANTED RIVER ─────────────────────────────────────────────────────
  {
    destinationSlug: "enchanted-river",
    tips: [
      {
        userIndex: 1,
        content:
          "Noon feeding at exactly 12pm is the main event — hundreds of fish emerge from the deep spring simultaneously, it's magical. Arrive by 11am for a good spot. Swimming is allowed morning and afternoon but NOT during feeding time. The electric blue color of the water is something cameras simply can't capture accurately — it's that vivid.",
        rating: 5,
        budgetBreakdown: [
          { category: "Transport", amount: 800 },
          { category: "Entry Fee", amount: 50 },
          { category: "Food", amount: 300 },
          { category: "Accommodation", amount: 800 },
        ],
        upvotes: 49,
        downvotes: 3,
      },
      {
        userIndex: 3,
        content:
          "Combine with Tinuy-an Falls in Bislig — the widest falls in the Philippines at 95 meters across, 3 tiers. A bamboo raft can take you up to the higher tiers (₱200). Both are in Surigao del Sur, about 2 hours apart. The drive through Caraga region countryside is beautiful — rolling hills and very few tourists.",
        rating: 5,
        budgetBreakdown: [
          { category: "Transport", amount: 1200 },
          { category: "Entry Fees", amount: 150 },
          { category: "Food", amount: 350 },
          { category: "Activities", amount: 300 },
        ],
        upvotes: 42,
        downvotes: 3,
      },
      {
        userIndex: 2,
        content:
          "Bus from Butuan City to Hinatuan takes 3 hours (₱150). The river entrance fee is ₱50. No motorized boats allowed — only paddled bancas, which keeps the area serene. Snorkel down toward the spring source: the color shifts from cyan to deep blue as you descend to 8+ meters. One of the most surreal swimming spots in Asia.",
        rating: 4,
        budgetBreakdown: [
          { category: "Transport", amount: 500 },
          { category: "Food", amount: 250 },
          { category: "Entry", amount: 100 },
          { category: "Accommodation", amount: 700 },
        ],
        upvotes: 31,
        downvotes: 2,
      },
    ],
  },

  // ─── KALANGGAMAN ISLAND ──────────────────────────────────────────────────
  {
    destinationSlug: "kalanggaman-island",
    tips: [
      {
        userIndex: 1,
        content:
          "Kalanggaman is uninhabited with no stores — only basic cottage rentals. Two pristine sandbars extend far in both directions for that iconic drone shot. Speedboat from Palompon, Leyte departs at 6am (₱300–350/person, 45 minutes). Book the permit at the Municipal Tourism Office in Palompon at least 3 days ahead.",
        rating: 5,
        budgetBreakdown: [
          { category: "Boat", amount: 700 },
          { category: "Entry Fee", amount: 200 },
          { category: "Food", amount: 400 },
          { category: "Transport", amount: 500 },
        ],
        upvotes: 53,
        downvotes: 4,
      },
      {
        userIndex: 3,
        content:
          "The best photo shot is from the sandbar junction at low tide looking back at the island. Camping overnight (₱500 tent fee) means waking up to a private island — sleeping under stars with only wave sounds is priceless. Pack light and bring a waterproof bag as the banca can get splashed on the crossing.",
        rating: 5,
        budgetBreakdown: [
          { category: "Camping", amount: 500 },
          { category: "Boat", amount: 700 },
          { category: "Food", amount: 500 },
          { category: "Transport", amount: 500 },
        ],
        upvotes: 46,
        downvotes: 3,
      },
      {
        userIndex: 2,
        content:
          "Day trip from Cebu City is possible (4-hour bus to Palompon + 45-min boat) but very tiring — recommend 1 night on the island. Bring ALL food and water as nothing is sold there. Snorkel gear rentals available on the island (₱100–150 each). The coral reef is in outstanding condition with good visibility even in afternoon.",
        rating: 4,
        budgetBreakdown: [
          { category: "Transport", amount: 1000 },
          { category: "Boat", amount: 700 },
          { category: "Food", amount: 600 },
          { category: "Gear Rental", amount: 200 },
        ],
        upvotes: 33,
        downvotes: 2,
      },
    ],
  },

  // ─── MOUNT PULAG ─────────────────────────────────────────────────────────
  {
    destinationSlug: "mount-pulag",
    tips: [
      {
        userIndex: 3,
        content:
          "Book your permit through DENR La Trinidad 2 months ahead — Pulag limits trekkers to 200/day and slots fill fast online. Ambangeg trail is beginner-friendly (6–8 hours round trip), Akiki trail (12+ hours) is for serious hikers only. The sea of clouds at summit sunrise is genuinely worth waking at 3am. Bring very warm layers.",
        rating: 5,
        budgetBreakdown: [
          { category: "Permit", amount: 400 },
          { category: "Guide", amount: 800 },
          { category: "Transport", amount: 600 },
          { category: "Accommodation", amount: 500 },
        ],
        upvotes: 67,
        downvotes: 5,
      },
      {
        userIndex: 0,
        content:
          "Summit temperature drops to 4°C at night — dress in layers regardless of season. Rent sleeping bags and tents at Ambangeg base (₱200–300 each). Arriving the night before to camp at the base means an earlier summit attempt. The dwarf bamboo grassland near the summit looks like a Japanese garden — otherworldly beauty.",
        rating: 5,
        budgetBreakdown: [
          { category: "Equipment Rental", amount: 600 },
          { category: "Guide", amount: 800 },
          { category: "Transport", amount: 700 },
          { category: "Food", amount: 400 },
        ],
        upvotes: 54,
        downvotes: 4,
      },
      {
        userIndex: 2,
        content:
          "Form a group of 4–5 to split the mandatory guide fee (₱800–1,200 per group, not per person). Bus from Baguio to Ambangeg is only ₱80 — skip renting a van. Bring your own food and use the communal camp kitchen. Moonrise on the summit ridge with a full sky of stars is as spectacular as the sunrise sea of clouds.",
        rating: 4,
        budgetBreakdown: [
          { category: "Guide Share", amount: 300 },
          { category: "Permit", amount: 400 },
          { category: "Transport", amount: 250 },
          { category: "Food", amount: 400 },
        ],
        upvotes: 41,
        downvotes: 2,
      },
    ],
  },

  // ─── PANGLAO ISLAND ──────────────────────────────────────────────────────
  {
    destinationSlug: "panglao-island",
    tips: [
      {
        userIndex: 1,
        content:
          "Alona Beach is touristy — stay there for the dive shops and nightlife, but spend beach time at Dumaluan Beach (₱30 entrance, much quieter). Balicasag Island dive trip (₱1,500 for 2 guided dives) is world-class: walls, turtles, and huge schools of jacks. Book through any dive shop on Alona — competition keeps prices fair.",
        rating: 5,
        budgetBreakdown: [
          { category: "Diving", amount: 1500 },
          { category: "Transport", amount: 300 },
          { category: "Accommodation", amount: 1500 },
          { category: "Food", amount: 600 },
        ],
        upvotes: 50,
        downvotes: 3,
      },
      {
        userIndex: 4,
        content:
          "Morning dolphin watching tour (₱500–600/person, 2 hours) — Panglao waters have spinner dolphins in massive pods. Combine with a stop at Virgin Island (pristine sandbar, ₱100 entrance) and Balicasag. For non-divers, snorkeling off the pier on Alona's north end has free corals and fish just 20 meters from shore.",
        rating: 4,
        budgetBreakdown: [
          { category: "Tours", amount: 800 },
          { category: "Food", amount: 500 },
          { category: "Accommodation", amount: 1200 },
          { category: "Transport", amount: 400 },
        ],
        upvotes: 38,
        downvotes: 2,
      },
      {
        userIndex: 2,
        content:
          "Budget accommodation on Alona Beach runs ₱500–800/night for a fan room. Trike from Tagbilaran port to Panglao is ₱200–250 (30 minutes). Happy hour on the beachfront runs 5–7pm with San Miguel at ₱50–80. Most beachfront resorts offer free snorkel gear for guests. Ask around — the freebies are real here.",
        rating: 4,
        budgetBreakdown: [
          { category: "Accommodation", amount: 700 },
          { category: "Food", amount: 400 },
          { category: "Transport", amount: 250 },
          { category: "Activities", amount: 600 },
        ],
        upvotes: 29,
        downvotes: 1,
      },
    ],
  },
] as const;

// ---------------------------------------------------------------------------
// Seed mutation
// ---------------------------------------------------------------------------
export const seedTips = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Guard: skip if tips already exist
    const existingTips = await ctx.db.query("tips").take(1);
    if (existingTips.length > 0) {
      console.log("Tips already seeded, skipping.");
      return;
    }

    // Guard: destinations must exist first
    const destCheck = await ctx.db.query("destinations").take(1);
    if (destCheck.length === 0) {
      throw new Error("Run seed() first — destinations must exist before seeding tips.");
    }

    // ── Create seed users ──────────────────────────────────────────────────
    const seedUserIds: Id<"users">[] = [];

    for (const userData of SEED_USERS) {
      const existing = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", userData.clerkUserId))
        .first();

      if (existing) {
        seedUserIds.push(existing._id);
      } else {
        const userId = await ctx.db.insert("users", {
          clerkUserId: userData.clerkUserId,
          email: userData.email,
          name: userData.name,
          imageUrl: userData.imageUrl,
          role: "user",
          tipsCount: 0,
          upvotesReceived: 0,
          destinationsVisited: 0,
          bookmarksCount: 0,
          photosUploaded: 0,
        });
        seedUserIds.push(userId);
      }
    }

    // ── Insert tips ────────────────────────────────────────────────────────
    let totalInserted = 0;
    const now = Date.now();
    const DAY_MS = 86_400_000;

    for (const destData of TIPS_DATA) {
      const destination = await ctx.db
        .query("destinations")
        .withIndex("by_slug", (q) => q.eq("slug", destData.destinationSlug))
        .first();

      if (!destination) {
        console.warn(`Destination not found: ${destData.destinationSlug} — skipping`);
        continue;
      }

      let tipCount = 0;
      let ratingSum = 0;

      for (let i = 0; i < destData.tips.length; i++) {
        const tip = destData.tips[i];
        const userId = seedUserIds[tip.userIndex];
        const totalBudget = tip.budgetBreakdown.reduce(
          (sum, item) => sum + item.amount,
          0,
        );

        await ctx.db.insert("tips", {
          userId,
          destinationId: destination._id,
          content: tip.content,
          rating: tip.rating,
          budgetBreakdown: [...tip.budgetBreakdown],
          totalBudget,
          upvotes: tip.upvotes,
          downvotes: tip.downvotes,
          photosStorageIds: [],
          weightedScore: tip.upvotes - tip.downvotes,
          // Stagger creation dates: newest tip is most recent, oldest is ~2 months ago
          createdAt: now - (destData.tips.length - i) * DAY_MS * 20,
          isApproved: true,
        });

        tipCount++;
        ratingSum += tip.rating;
        totalInserted++;
      }

      // Update destination aggregate stats
      await ctx.db.patch(destination._id, {
        tipsCount: tipCount,
        avgRating: Math.round((ratingSum / tipCount) * 10) / 10,
      });
    }

    // Update each seed user's tip count
    for (let i = 0; i < SEED_USERS.length; i++) {
      const userId = seedUserIds[i];
      const userTipCount = TIPS_DATA.reduce(
        (sum, dest) =>
          sum + dest.tips.filter((t) => t.userIndex === i).length,
        0,
      );
      if (userTipCount > 0) {
        await ctx.db.patch(userId, { tipsCount: userTipCount });
      }
    }

    console.log(
      `Seeded ${totalInserted} tips across ${TIPS_DATA.length} destinations with ${SEED_USERS.length} seed users.`,
    );
  },
});

// ---------------------------------------------------------------------------
// Clear mutation — removes all tips + resets destination stats + removes seed users
// ---------------------------------------------------------------------------
export const clearTips = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Remove all tips
    const tips = await ctx.db.query("tips").collect();
    for (const tip of tips) {
      await ctx.db.delete(tip._id);
    }

    // Reset destination stats
    const destinations = await ctx.db.query("destinations").collect();
    for (const dest of destinations) {
      await ctx.db.patch(dest._id, { tipsCount: 0, avgRating: 0 });
    }

    // Remove seed users only
    for (const seedUser of SEED_USERS) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", seedUser.clerkUserId))
        .first();
      if (user) {
        await ctx.db.delete(user._id);
      }
    }

    console.log(`Cleared ${tips.length} tips and reset ${destinations.length} destination stats.`);
  },
});
