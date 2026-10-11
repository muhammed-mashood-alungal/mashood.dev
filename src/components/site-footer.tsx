import { cacheLife } from "next/cache";
import { site } from "@/content/site";
import { SocialLinks } from "./social-links";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function SiteFooter() {
  const year = await currentYear();
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col-reverse items-start gap-2 px-5 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {year} {site.name}
        </p>
        <div className="-ml-3 sm:-mr-3 sm:ml-0">
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
