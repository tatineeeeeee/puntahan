"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * Puntahan logo mark — map pin as a "window":
 *  - Deep coral-orange pin silhouette
 *  - 8-rayed Philippine sun (golden yellow) in the upper portion
 *  - Teal ocean + island mountain + palm tree in the lower portion
 * Everything is clipped inside the pin shape.
 */
export function Logo({ size = 32, className }: LogoProps) {
  const clipId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-label="puntahan logo"
      role="img"
    >
      <defs>
        <clipPath id={clipId}>
          <path d="M16,30 C11,26 6,20 6,12 A10,10 0 0 1 26,12 C26,20 21,26 16,30Z" />
        </clipPath>
      </defs>

      {/* Pin silhouette — deep coral-orange */}
      <path
        d="M16,30 C11,26 6,20 6,12 A10,10 0 0 1 26,12 C26,20 21,26 16,30Z"
        fill="#E8501A"
      />

      {/* Everything below is clipped to the pin shape */}
      <g clipPath={`url(#${clipId})`}>

        {/* 8-rayed Philippine sun — golden yellow
            Center (16,11), outer r=7, inner r=2.8 */}
        <path
          d="M16,4 L17.07,8.41 L20.95,6.05 L18.59,9.93 L23,11
             L18.59,12.07 L20.95,15.95 L17.07,13.59 L16,18
             L14.93,13.59 L11.05,15.95 L13.41,12.07 L9,11
             L13.41,9.93 L11.05,6.05 L14.93,8.41Z"
          fill="#F5B314"
        />
        <circle cx="16" cy="11" r="2.5" fill="#F5B314" />

        {/* Ocean — teal fill for the lower portion of the pin */}
        <rect x="0" y="21" width="32" height="11" fill="#0D9488" />

        {/* Island / mountain silhouette */}
        <path d="M5,22 Q10,15 16,17.5 Q22,15 27,22Z" fill="#0A4540" />

        {/* Wave highlight across ocean surface */}
        <path
          d="M0,23 Q8,21 16,23 Q24,25 32,23"
          stroke="#22C4B8"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />

        {/* Palm trunk */}
        <path
          d="M19.5,22.5 Q20.5,20 19,18"
          stroke="#0D6B5C"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Palm fronds — three branches */}
        <path
          d="M19,18 Q22,15.5 24,16.5 Q22,17.5 19,18
             M19,18 Q22.5,17 23,19.5 Q21,18.5 19,18
             M19,18 Q16.5,15.5 14.5,16.5 Q16.5,17.5 19,18"
          stroke="#0D6B5C"
          strokeWidth="0.7"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
