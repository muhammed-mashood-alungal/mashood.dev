import { site, type SocialKey } from "@/content/site";
import { BrandIcon } from "./icons";

const DEFAULT_KEYS: SocialKey[] = ["github", "leetcode", "linkedin"];

/** Row of icon-only profile links. */
export function SocialLinks({ keys = DEFAULT_KEYS }: { keys?: SocialKey[] }) {
  return (
    <ul className="flex items-center gap-1">
      {keys.map((key) => {
        const link = site.socials[key];
        return (
          <li key={key}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${link.label} (opens in a new tab)`}
              className="inline-flex size-11 items-center justify-center rounded-lg text-muted transition-colors hover:text-fg"
            >
              <BrandIcon name={key} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
