import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");

  if (!slug) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #0D9488 0%, #FF6B6B 100%)",
            fontFamily: "sans-serif",
          }}
        >
          {/* Logo mark — pin with sun + island scene inside */}
          <svg
            width="100"
            height="100"
            viewBox="0 0 32 32"
            fill="none"
            style={{ marginBottom: 24 }}
          >
            {/* Pin silhouette */}
            <path d="M16,30 C11,26 6,20 6,12 A10,10 0 0 1 26,12 C26,20 21,26 16,30Z" fill="#E8501A"/>
            {/* Sun — rays naturally contained within pin, no clipPath needed for Satori */}
            <path d="M16,4 L17.07,8.41 L20.95,6.05 L18.59,9.93 L23,11 L18.59,12.07 L20.95,15.95 L17.07,13.59 L16,18 L14.93,13.59 L11.05,15.95 L13.41,12.07 L9,11 L13.41,9.93 L11.05,6.05 L14.93,8.41Z" fill="#F5B314"/>
            <circle cx="16" cy="11" r="2.5" fill="#F5B314"/>
            {/* Ocean */}
            <path d="M9,21 Q12.5,19.5 16,21 Q19.5,22.5 23,21 L22,28 Q19,30.5 16,30 Q13,30.5 10,28Z" fill="#0D9488"/>
            {/* Mountain */}
            <path d="M9,22 Q13,16 16,18 Q19,16 23,22Z" fill="#0A4540"/>
            {/* Wave */}
            <path d="M9.5,23 Q13,21.5 16,23 Q19,24.5 22.5,23" stroke="#22C4B8" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
            {/* Palm trunk */}
            <path d="M19.5,22.5 Q20.5,20 19,18" stroke="#0D6B5C" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
            {/* Palm fronds */}
            <path d="M19,18 Q22,15.5 24,16.5 Q22,17.5 19,18 M19,18 Q22.5,17 23,19.5 Q21,18.5 19,18 M19,18 Q16.5,15.5 14.5,16.5 Q16.5,17.5 19,18" stroke="#0D6B5C" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
          </svg>
          <div style={{ fontSize: 72, fontWeight: 700, color: "white", letterSpacing: "-1px" }}>
            puntahan
          </div>
          <div style={{ fontSize: 26, color: "rgba(255,255,255,0.85)", marginTop: 16 }}>
            Real tips. Real budgets. Real travelers.
          </div>
        </div>
      ),
      { width: 1200, height: 630 },
    );
  }

  try {
    const destination = await fetchQuery(api.destinations.getBySlug, { slug });

    if (!destination) {
      return new ImageResponse(
        (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              background: "#1C1917",
              color: "white",
              fontSize: 48,
              fontFamily: "sans-serif",
            }}
          >
            Destination not found
          </div>
        ),
        { width: 1200, height: 630 },
      );
    }

    const stars = "★".repeat(Math.round(destination.avgRating));
    const budgetLabel = `₱${destination.budgetMin.toLocaleString()}–₱${destination.budgetMax.toLocaleString()}`;

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            position: "relative",
            fontFamily: "sans-serif",
          }}
        >
          {/* Background */}
          {destination.heroImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={destination.heroImageUrl}
              alt=""
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #0D9488 0%, #FF6B6B 100%)",
              }}
            />
          )}

          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(to top, rgba(28,25,23,0.85) 0%, rgba(28,25,23,0.3) 50%, transparent 100%)",
            }}
          />

          {/* Content */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "48px 60px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {/* Region badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "4px 14px",
                  borderRadius: 20,
                  fontSize: 18,
                  color: "white",
                  fontWeight: 600,
                }}
              >
                {destination.region}
              </div>
              <div style={{ fontSize: 20, color: "#FCD34D" }}>{stars}</div>
              <div style={{ fontSize: 18, color: "rgba(255,255,255,0.7)" }}>
                {destination.tipsCount} tips
              </div>
            </div>

            {/* Destination name */}
            <div style={{ fontSize: 56, fontWeight: 700, color: "white", lineHeight: 1.1 }}>
              {destination.name}
            </div>

            {/* Province + budget */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: 22, color: "rgba(255,255,255,0.8)" }}>
                {destination.province}
              </div>
              <div style={{ fontSize: 22, color: "#FF6B6B", fontWeight: 600 }}>
                {budgetLabel}
              </div>
            </div>

            {/* Watermark */}
            <div
              style={{
                position: "absolute",
                bottom: 48,
                right: 60,
                fontSize: 20,
                color: "rgba(255,255,255,0.5)",
                fontWeight: 700,
              }}
            >
              puntahan
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 },
    );
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #0D9488 0%, #FF6B6B 100%)",
            color: "white",
            fontSize: 48,
            fontFamily: "sans-serif",
            fontWeight: 700,
          }}
        >
          puntahan
        </div>
      ),
      { width: 1200, height: 630 },
    );
  }
}
