import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

// Self-hosted at build time by next/font, so there is no layout shift and no
// request to Google at runtime. Mono is only used for small labels, so it
// isn't preloaded.
export const fontSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

export const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});
