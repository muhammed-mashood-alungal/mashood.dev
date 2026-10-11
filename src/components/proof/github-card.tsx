import { Star } from "lucide-react";
import { getGithubStats } from "@/lib/github";
import { Heatmap } from "./heatmap";
import { SkeletonBar, StatCard, StatsUnavailable } from "./stat-card";

const numberFormat = new Intl.NumberFormat("en-US");

/**
 * The heatmap only shows once the year has enough public activity to say
 * something; a mostly empty grid undersells private/company work.
 */
const HEATMAP_MIN_CONTRIBUTIONS = 100;

/** Stars only add to the card once there are a few of them. */
const STARS_MIN = 10;

/** Sage steps for the language bar, strongest first. "Other" is always grey. */
const LANGUAGE_FILLS = [
  "bg-accent",
  "bg-accent/75",
  "bg-accent/55",
  "bg-accent/40",
  "bg-accent/28",
];

function languageFill(name: string, index: number) {
  return name === "Other" ? "bg-muted/35" : (LANGUAGE_FILLS[index] ?? "bg-muted/35");
}

export async function GithubCard() {
  const stats = await getGithubStats();

  return (
    <StatCard network="github">
      {stats ? (
        <>
          <dl className="flex flex-wrap gap-x-12 gap-y-3">
            <Stat label="public repos" value={numberFormat.format(stats.publicRepos)} />
            {stats.totalStars >= STARS_MIN && (
              <Stat label="stars" value={numberFormat.format(stats.totalStars)} />
            )}
            <Stat label="joined" value={String(stats.memberSince)} />
          </dl>

          {stats.languages.length > 0 && (
            <div className="mt-6">
              <h4 className="font-mono text-xs text-muted">top languages</h4>
              <div
                aria-hidden
                className="mt-2.5 flex h-2 gap-0.5 overflow-hidden rounded-full"
              >
                {stats.languages.map((lang, i) => (
                  <span
                    key={lang.name}
                    className={languageFill(lang.name, i)}
                    style={{ width: `${lang.percent}%` }}
                  />
                ))}
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
                {stats.languages.map((lang, i) => (
                  <li key={lang.name} className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className={`size-2 rounded-full ${languageFill(lang.name, i)}`}
                    />
                    {lang.name}
                    <span className="font-mono text-xs text-muted tabular-nums">
                      {lang.percent < 1 ? "<1" : Math.round(lang.percent)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stats.totalContributions >= HEATMAP_MIN_CONTRIBUTIONS && (
            <div className="mt-6">
              <p className="text-sm">
                <span className="text-fg tabular-nums">
                  {numberFormat.format(stats.totalContributions)}
                </span>{" "}
                <span className="text-muted">contributions in the last year</span>
              </p>
              <div className="mt-3">
                <Heatmap weeks={stats.weeks} total={stats.totalContributions} />
              </div>
            </div>
          )}

          {stats.pinned.length > 0 && (
            <>
              <h4 className="mt-6 font-mono text-xs text-muted">pinned</h4>
              <ul className="mt-3 grid gap-3 sm:grid-cols-3">
                {stats.pinned.map((repo) => (
                  <li
                    key={repo.url}
                    className="flex flex-col rounded-lg border border-border px-3.5 pb-3"
                  >
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center font-medium break-all text-accent transition-colors hover:text-accent-hover"
                    >
                      {repo.name}
                    </a>
                    {repo.description && (
                      <p className="line-clamp-2 text-sm text-muted">
                        {repo.description}
                      </p>
                    )}
                    <p className="mt-auto flex items-center gap-3 pt-2 font-mono text-xs text-muted">
                      {repo.language && <span>{repo.language}</span>}
                      <span className="inline-flex items-center gap-1">
                        <Star size={12} aria-hidden />
                        <span className="sr-only">Stars:</span>
                        {repo.stars}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      ) : (
        <StatsUnavailable />
      )}
    </StatCard>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-xs text-muted">{label}</dt>
      <dd className="text-2xl font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

export function GithubCardSkeleton() {
  return (
    <StatCard network="github">
      <div className="grid grid-cols-3 gap-3">
        <SkeletonBar className="h-12" />
        <SkeletonBar className="h-12" />
        <SkeletonBar className="h-12" />
      </div>
      <SkeletonBar className="mt-6 h-14 w-full" />
      <SkeletonBar className="mt-6 h-4 w-16" />
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <SkeletonBar className="h-24" />
        <SkeletonBar className="h-24" />
        <SkeletonBar className="h-24" />
      </div>
    </StatCard>
  );
}
