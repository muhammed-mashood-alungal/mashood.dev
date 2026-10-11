import { Mail, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { CopyEmailButton } from "./copy-email-button";
import { BrandIcon } from "./icons";
import { Section } from "./section";

type ContactLink = { label: string; detail: string; href: string; icon: ReactNode };

const links: ContactLink[] = [
  {
    label: "WhatsApp",
    detail: site.phone,
    href: site.socials.whatsapp.href,
    icon: <BrandIcon name="whatsapp" className="size-4" />,
  },
  {
    label: "Phone",
    detail: site.phone,
    href: `tel:${site.phone}`,
    icon: <Phone size={16} aria-hidden />,
  },
  {
    label: "LinkedIn",
    detail: "Profile",
    href: site.socials.linkedin.href,
    icon: <BrandIcon name="linkedin" className="size-4" />,
  },
  {
    label: "GitHub",
    detail: site.usernames.github,
    href: site.socials.github.href,
    icon: <BrandIcon name="github" className="size-4" />,
  },
  {
    label: "LeetCode",
    detail: site.usernames.leetcode,
    href: site.socials.leetcode.href,
    icon: <BrandIcon name="leetcode" className="size-4" />,
  },
];

export function Contact() {
  return (
    <Section id="contact" title={site.contact.heading}>
      <p className="max-w-2xl text-muted">{site.contact.text}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <a
          href={`mailto:${site.email}`}
          className="inline-flex min-h-11 items-center text-lg font-medium break-all transition-colors hover:text-accent sm:text-xl"
        >
          {site.email}
        </a>
        <div className="flex gap-2">
          <CopyEmailButton email={site.email} />
          <a
            href={`mailto:${site.email}`}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted transition-colors hover:border-muted hover:text-fg"
          >
            <Mail size={16} aria-hidden />
            Send email
          </a>
        </div>
      </div>

      <ul className="mt-8 divide-y divide-border border-y border-border">
        {links.map((link) => {
          const external = link.href.startsWith("http");
          return (
            <li key={link.label}>
              <a
                href={link.href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex min-h-12 items-center gap-3 py-2 transition-colors"
              >
                <span className="text-muted transition-colors group-hover:text-accent">
                  {link.icon}
                </span>
                <span className="transition-colors group-hover:text-accent">
                  {link.label}
                </span>
                <span className="ml-auto truncate font-mono text-xs text-muted">
                  {link.detail}
                </span>
                {external && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
