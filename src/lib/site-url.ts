function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL ?? undefined;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

/** Absolute origin of the site, without a trailing slash. */
export const siteUrl = resolveSiteUrl();
