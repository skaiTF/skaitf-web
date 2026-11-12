"use client";

import { motion } from "framer-motion";

interface GlyphProps {
  size?: number;
  className?: string;
}

/* Deer head with antlers, front view. Used as the header logo. */
export function DeerMark({ size = 24, className }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      <g fill="currentColor">
        <path d="M12 14 L20 14 L18.5 24 L16 28 L13.5 24 Z" />
        <path d="M12.5 15 L5.5 12.5 L10 17.5 Z" />
        <path d="M19.5 15 L26.5 12.5 L22 17.5 Z" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M13.5 13 C11.5 9 9.5 6.5 6 3" />
        <path d="M11.2 9.2 L5.5 8.2" />
        <path d="M9.4 6.8 L10 2" />
        <path d="M18.5 13 C20.5 9 22.5 6.5 26 3" />
        <path d="M20.8 9.2 L26.5 8.2" />
        <path d="M22.6 6.8 L22 2" />
      </g>
    </svg>
  );
}

/* Single antler. Used before section headings. */
export function Antler({ size = 22, className }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 22 C5 14 9 8 18 3" />
      <path d="M6.5 15 L1.5 12" />
      <path d="M9 10.5 L7.5 3.5" />
      <path d="M13 6.5 L20 8.5" />
    </svg>
  );
}

/*
 * Hero landscape: pink-tinted clouds, three mountain ridges
 * and a deer standing on the nearest one. The deer is recoloured to the
 * ground colour so it blends into the ridge it stands on.
 */
export function DeerScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 320"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <filter id="cloud-blur" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="deer-tint" colorInterpolationFilters="sRGB">
          <feFlood style={{ floodColor: "var(--ground)" }} />
          <feComposite in2="SourceAlpha" operator="in" />
        </filter>
      </defs>

      <g filter="url(#cloud-blur)" fill="#f2b8cb" opacity="0.22">
        <ellipse cx="200" cy="215" rx="260" ry="34" />
        <ellipse cx="640" cy="200" rx="320" ry="40" />
        <ellipse cx="1150" cy="210" rx="300" ry="36" />
      </g>

      <path
        fill="#27243f"
        d="M0 320 L0 220 L90 190 L170 215 L280 170 L380 210 L470 185 L600 215 L720 160 L840 205 L960 180 L1080 210 L1200 170 L1320 200 L1440 180 L1440 320 Z"
      />
      <path
        fill="#1a1930"
        d="M0 320 L0 250 C120 230 220 260 340 240 C460 220 560 250 700 236 C820 224 920 248 1040 232 C1160 216 1300 246 1440 228 L1440 320 Z"
      />
      <path
        fill="var(--ground)"
        d="M0 320 L0 302 C180 292 360 306 540 298 C700 290 820 300 900 295 C960 292 1010 292 1060 297 C1200 308 1340 296 1440 302 L1440 320 Z"
      />

      <motion.g
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
      >
        {/* Standing deer (public/deer-silh.png, 1200x1200), tinted to the ground colour; hooves sit on the near ridge */}
        <image
          href="/deer-silh.png"
          x="850"
          y="150"
          width="170"
          height="170"
          filter="url(#deer-tint)"
        />
      </motion.g>
    </svg>
  );
}
