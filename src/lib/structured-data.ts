import { site } from "@/content/site";
import { siteUrl } from "./site-url";

const knowsAbout = site.skills
  .flatMap((category) => category.skills)
  .filter((skill) =>
    [
      "Go",
      "Gin",
      "GORM",
      "Node.js",
      "NestJS",
      "REST APIs",
      "TypeScript",
      "React",
      "Next.js",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Docker",
      "WebRTC",
      "Socket.IO",
      "RabbitMQ",
    ].includes(skill),
  );

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: site.name,
  jobTitle: "Software Engineer",
  description: site.seo.description,
  url: siteUrl,
  email: `mailto:${site.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.location.locality,
    addressRegion: site.location.region,
    addressCountry: site.location.country,
  },
  sameAs: [
    site.socials.github.href,
    site.socials.leetcode.href,
    site.socials.linkedin.href,
  ],
  knowsAbout,
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Indira Gandhi National Open University (IGNOU)",
    },
    { "@type": "EducationalOrganization", name: "Brocamp" },
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: site.name,
  url: siteUrl,
  inLanguage: "en",
  author: { "@id": `${siteUrl}/#person` },
};

/** Serialize for a <script type="application/ld+json"> without breaking out of the tag. */
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\u003c");
}
