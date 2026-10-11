import { MapPin } from "lucide-react";
import { site } from "@/content/site";
import { SocialLinks } from "./social-links";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="pt-10 sm:pt-14">
      <h1 id="hero-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {site.name}
      </h1>
      <p className="mt-3 text-lg font-medium text-fg/90 sm:text-xl">{site.headline}</p>
      <p className="mt-5 max-w-2xl text-muted">{site.intro}</p>
      <p className="mt-4 flex items-center gap-1.5 text-sm text-muted">
        <MapPin size={15} aria-hidden />
        {site.location.display}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href="#contact"
          className="inline-flex min-h-11 items-center rounded-lg bg-fg px-4 font-medium text-bg transition-colors hover:bg-white"
        >
          Get in touch
        </a>
        <a
          href={site.resumePath}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 transition-colors hover:border-muted"
        >
          Resume
          <span className="sr-only"> (PDF, opens in a new tab)</span>
        </a>
        <div className="ml-1">
          <SocialLinks />
        </div>
      </div>
    </section>
  );
}
