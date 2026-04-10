"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";

interface NearbyPin {
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  isCurrent: boolean;
}

interface NearbyMapProps {
  pins: NearbyPin[];
  center: [number, number];
}

function createPinIcon(isCurrent: boolean) {
  const color = isCurrent ? "#FF6B6B" : "#0D9488"; // coral for current, teal for nearby
  const size = isCurrent ? 14 : 10;
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function NearbyMap({ pins, center }: NearbyMapProps) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <div className="h-48 w-full overflow-hidden rounded-xl">
      <MapContainer
        center={center}
        zoom={8}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pins.map((pin) => (
          <Marker
            key={pin.slug}
            position={[pin.latitude, pin.longitude]}
            icon={createPinIcon(pin.isCurrent)}
          >
            {!pin.isCurrent && (
              <Popup>
                <Link
                  href={`/destination/${pin.slug}`}
                  className="text-sm font-medium text-teal hover:underline"
                >
                  {pin.name}
                </Link>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
