"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Doc } from "../../../convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import Link from "next/link";

const regionColors: Record<string, string> = {
  NCR: "#3B82F6",
  Luzon: "#10B981",
  Visayas: "#F59E0B",
  Mindanao: "#8B5CF6",
};

function createIcon(region: string) {
  const color = regionColors[region] ?? "#78716C";
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

interface MapViewProps {
  destinations: (Doc<"destinations"> & { topTipPreview?: { content: string; authorName: string } | null })[];
}

export function MapView({ destinations }: MapViewProps) {
  useEffect(() => {
    // Fix Leaflet default icon issue with bundlers
    delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const center: [number, number] = [12.8797, 121.774]; // Philippines center
  const regionBadgeVariant: Record<string, "region-ncr" | "region-luzon" | "region-visayas" | "region-mindanao"> = {
    NCR: "region-ncr",
    Luzon: "region-luzon",
    Visayas: "region-visayas",
    Mindanao: "region-mindanao",
  };

  return (
    <div className="h-125 w-full rounded-xl overflow-hidden border border-warm-gray/20">
      <MapContainer
        center={center}
        zoom={6}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {destinations.map((dest) => (
          <Marker
            key={dest._id}
            position={[dest.latitude, dest.longitude]}
            icon={createIcon(dest.region)}
          >
            <Popup>
              <div className="min-w-45">
                <p className="font-bold text-sm">{dest.name}</p>
                <Badge variant={regionBadgeVariant[dest.region] ?? "default"}>
                  {dest.region}
                </Badge>
                <div className="mt-1">
                  <Rating value={dest.avgRating} size="sm" />
                </div>
                <Link
                  href={`/destination/${dest.slug}`}
                  className="mt-2 block text-xs font-medium text-teal hover:underline"
                >
                  View details →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
