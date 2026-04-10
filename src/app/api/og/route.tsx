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
          <div style={{ fontSize: 64, fontWeight: 700, color: "white" }}>
            puntahan
          </div>
          <div style={{ fontSize: 24, color: "rgba(255,255,255,0.9)", marginTop: 12 }}>
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
