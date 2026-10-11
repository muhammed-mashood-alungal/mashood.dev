import type { Metadata, Viewport } from "next";
import { fontMono, fontSans } from "./fonts";
import { CommandPalette, type PaletteConfig } from "@/components/command-palette";
import { RevealObserver } from "@/components/reveal-observer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import { jsonLd, personSchema, websiteSchema } from "@/lib/structured-data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.seo.title,
    template: `%s · ${site.name}`,
  },
  description: site.seo.description,
  keywords: site.seo.keywords,
  authors: [{ name: site.name, url: siteUrl }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: site.name,
    title: site.seo.title,
    description: site.seo.description,
    locale: "en_US",
    firstName: "Muhammed Mashood",
    lastName: "A",
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#121212",
  colorScheme: "dark",
};

const paletteConfig: PaletteConfig = {
  email: site.email,
  whatsapp: site.socials.whatsapp.href,
  github: site.socials.github.href,
  leetcode: site.socials.leetcode.href,
  linkedin: site.socials.linkedin.href,
  resume: site.resumePath,
  sections: [
    { id: "top", label: "Home" },
    { id: "proof", label: "Proof of work" },
    ...site.nav,
    { id: "education", label: "Education" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The inline script below adds a `js` class before hydration.
    <html
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Enables fade-in styles only when JS runs; set before first paint. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd([personSchema, websiteSchema]) }}
        />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-50 rounded-lg bg-fg px-4 py-3 font-medium text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <CommandPalette config={paletteConfig} />
        <RevealObserver />
      </body>
    </html>
  );
}
